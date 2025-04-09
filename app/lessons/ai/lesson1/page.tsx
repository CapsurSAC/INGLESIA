"use client";

import { useEffect, useRef, useState } from "react";
import { Spinner, Button } from "@nextui-org/react";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  VoiceEmotion,
  TaskType,
  TaskMode,
} from "@heygen/streaming-avatar";

interface LessonStep {
  text: string;
  expectedResponse?: string; // ← ahora es opcional, para evitar errores
}

interface LessonData {
  title: string;
  avatarScript: string;
  dialog: LessonStep[];
}
// ... tus imports siguen igual

export default function Lesson1VoiceOnly() {
  // Estados
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false); // Nuevo
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<
    { from: "avatar" | "user"; message: string }[]
  >([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);

  async function fetchAccessToken() {
    const res = await fetch("/api/get-access-token", { method: "POST" });
    return await res.text();
  }

  async function startLesson() {
    setIsSessionLoading(true);
    setSessionEnded(false); // Reiniciar flag
    const token = await fetchAccessToken();

    avatar.current = new StreamingAvatar({
      token,
      basePath: process.env.NEXT_PUBLIC_BASE_API_URL,
    });

    avatar.current.on(StreamingEvents.STREAM_READY, (e) => setStream(e.detail));
    avatar.current.on(StreamingEvents.USER_START, () => setIsUserTalking(true));
    avatar.current.on(StreamingEvents.USER_STOP, () => {
      setIsUserTalking(false);
      if (awaitingResponse && !isPaused) {
        const userMessage = lesson?.dialog[currentStep]?.expectedResponse;

        if (userMessage) {
          setChatHistory((prev) => [
            ...prev,
            { from: "user", message: userMessage },
          ]);
        }

        setCurrentStep((prev) => prev + 1);
        setAwaitingResponse(false);
        speakNextStep();
      }
    });

    await avatar.current.createStartAvatar({
      quality: AvatarQuality.Medium,
      avatarName: "June_HR_public",
      language: "es",
      disableIdleTimeout: true,
      voice: { rate: 1.1, emotion: VoiceEmotion.FRIENDLY },
    });

    await avatar.current.startVoiceChat();
    if (lesson?.avatarScript && avatar.current) {
      console.log("SCRIPT INICIAL DEL AVATAR:", lesson.avatarScript);
      await avatar.current.speak({
        text: lesson.avatarScript,
        taskType: TaskType.TALK,
        taskMode: TaskMode.ASYNC,
      });
    } else {
      console.warn("❌ avatarScript no está cargado correctamente.");
    }

    speakNextStep();
    setIsSessionLoading(false);
  }
  async function speakNextStep() {
    const step = lesson?.dialog[currentStep];
    if (!step || !avatar.current) return;

    setCurrentText(step.text);

    // Guardar lo que dice el avatar
    setChatHistory((prev) => [...prev, { from: "avatar", message: step.text }]);

    await avatar.current.speak({
      text: step.text,
      taskType: TaskType.TALK,
      taskMode: TaskMode.ASYNC,
    });

    setAwaitingResponse(true);
    avatar.current.startListening();
  }

  async function endLesson() {
    await avatar.current?.stopAvatar();
    setStream(undefined);
    setSessionEnded(true);
  }

  useEffect(() => {
    async function loadLesson() {
      const res = await fetch("/lessons/ai/lesson1.json");
      const data = await res.json();
      setLesson(data);
    }
    loadLesson();
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => videoRef.current!.play();
    }
  }, [stream]);

  async function handlePause() {
    if (!avatar.current) return;
    await avatar.current.interrupt();
    avatar.current.stopListening();
    setIsPaused(true);
    setAwaitingResponse(false);
  }

  async function handleResume() {
    if (!avatar.current || !lesson) return;

    setIsPaused(false);
    const step = lesson.dialog[currentStep];
    if (!step) return;

    await avatar.current.speak({
      text: step.text,
      taskType: TaskType.TALK,
      taskMode: TaskMode.ASYNC,
    });

    setAwaitingResponse(true);
    avatar.current.startListening();
  }

  if (!lesson) return <Spinner label="Iniciando..." />;

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">{lesson.title} (Modo Voz)</h1>

      {stream ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-[600px] h-[400px] rounded-lg shadow"
          />
          <p className="text-center text-lg">
            {isUserTalking
              ? "🎤 Estás hablando..."
              : awaitingResponse
                ? "🕐 Repite después del avatar, por favor..."
                : "🧠 Esperando la siguiente instrucción..."}
          </p>
          {currentText && (
            <div className="text-center mt-2 p-4 bg-white/10 rounded-lg text-base max-w-lg">
              <p className="font-medium">📢 Instrucción actual:</p>
              <p className="italic text-indigo-300">{currentText}</p>
            </div>
          )}

          {currentStep >= lesson.dialog.length && (
            <p className="text-green-500 text-xl mt-4">
              🎉 ¡Clase completada! ¡Excelente trabajo!
            </p>
          )}

          <div className="flex gap-4 flex-wrap justify-center mt-4">
            <Button
              color="secondary"
              onClick={handlePause}
              isDisabled={isPaused}
            >
              ⏸️ Pausar voz
            </Button>

            <Button
              color="success"
              onClick={handleResume}
              isDisabled={!isPaused}
            >
              ▶️ Reanudar
            </Button>

            <Button color="default" onClick={speakNextStep}>
              🔁 Repetir instrucción
            </Button>

            <Button
              color="primary"
              onClick={async () => {
                const userInput = prompt("Escribe tu mensaje para el avatar:");
                if (userInput && avatar.current) {
                  await avatar.current.speak({
                    text: userInput,
                    taskType: TaskType.TALK,
                    taskMode: TaskMode.ASYNC,
                  });
                }
              }}
            >
              💬 Escribir por chat
            </Button>

            <Button color="danger" onClick={endLesson}>
              🔚 Finalizar clase
            </Button>
          </div>
          <div className="mt-6 w-full max-w-[600px]">
            <h2 className="text-xl font-semibold mb-2 text-center">
              🗨️ Historial del Chat
            </h2>
            <div className="bg-white shadow-md rounded-lg p-4 space-y-2">
              {chatHistory.map((entry, index) => (
                <div
                  key={index}
                  className={`text-sm px-4 py-2 rounded-md ${
                    entry.from === "user"
                      ? "bg-blue-100 text-blue-800 self-end text-right"
                      : "bg-gray-100 text-gray-700 self-start"
                  }`}
                >
                  <span className="font-semibold">
                    {entry.from === "user" ? "Tú" : "Avatar"}:
                  </span>{" "}
                  {entry.message}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : sessionEnded ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg text-gray-500 mt-4">
            🔚 La clase ha finalizado.
          </p>
          <Button
            color="primary"
            onClick={() => {
              setCurrentStep(0);
              setSessionEnded(false);
              setIsUserTalking(false);
              setAwaitingResponse(false);
              setStream(undefined);
              if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.srcObject = null;
              }
              startLesson();
            }}
          >
            🔁 Volver a empezar
          </Button>
        </div>
      ) : (
        <Button
          isLoading={isSessionLoading}
          onClick={startLesson}
          color="primary"
        >
          Iniciar clase
        </Button>
      )}
    </div>
  );
}
