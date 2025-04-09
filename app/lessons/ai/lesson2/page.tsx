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
  expectedResponse: string;
}

interface LessonData {
  title: string;
  avatarScript: string;
  dialog: LessonStep[];
}

export default function Lesson2VoiceOnly() {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);

  async function fetchAccessToken() {
    const res = await fetch("/api/get-access-token", { method: "POST" });
    return await res.text();
  }

  async function startLesson() {
    setIsSessionLoading(true);
    setSessionEnded(false);
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
        setCurrentStep((prev) => prev + 1);
        setAwaitingResponse(false);
        speakNextStep();
      }
    });

    await avatar.current.createStartAvatar({
      quality: AvatarQuality.Medium,
      avatarName: "June_HR_public",
      language: "en",
      disableIdleTimeout: true,
      voice: { rate: 1.1, emotion: VoiceEmotion.FRIENDLY },
    });

    await avatar.current.startVoiceChat();

    await avatar.current.speak({
      text: lesson?.avatarScript || "Welcome!",
      taskType: TaskType.TALK,
      taskMode: TaskMode.ASYNC,
    });

    speakNextStep();
    setIsSessionLoading(false);
  }

  async function speakNextStep() {
    const step = lesson?.dialog[currentStep];
    if (!step || !avatar.current) return;

    setCurrentText(step.text);
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

  useEffect(() => {
    async function loadLesson() {
      const res = await fetch("/lessons/ai/lesson2.json");
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
            {isUserTalking ? (
              <>
                <span role="img" aria-label="hablando">🎤</span> You are speaking...
              </>
            ) : awaitingResponse ? (
              <>
                <span role="img" aria-label="espera">🕐</span> Repeat after the avatar, please...
              </>
            ) : (
              <>
                <span role="img" aria-label="esperando">🧠</span> Waiting for the next instruction...
              </>
            )}
          </p>

          {currentStep >= lesson.dialog.length && (
            <p className="text-green-500 text-xl mt-4">
              <span role="img" aria-label="fiesta">🎉</span> Lesson completed! Great job!
            </p>
          )}

          <div className="flex gap-4 flex-wrap justify-center mt-4">
            <Button
              color="secondary"
              onClick={handlePause}
              isDisabled={isPaused}
            >
              <span role="img" aria-label="pausa">⏸️</span> Pause
            </Button>
            <Button
              color="success"
              onClick={handleResume}
              isDisabled={!isPaused}
            >
              <span role="img" aria-label="reanudar">▶️</span> Resume
            </Button>
            <Button color="default" onClick={speakNextStep}>
              <span role="img" aria-label="repetir">🔁</span> Repeat instruction
            </Button>
            <Button
              color="primary"
              onClick={async () => {
                const userInput = prompt("Type your message for the avatar:");
                if (userInput && avatar.current) {
                  await avatar.current.speak({
                    text: userInput,
                    taskType: TaskType.TALK,
                    taskMode: TaskMode.ASYNC,
                  });
                }
              }}
            >
              <span role="img" aria-label="chat">💬</span> Send message
            </Button>
            <Button color="danger" onClick={endLesson}>
              <span role="img" aria-label="fin">🔚</span> End lesson
            </Button>
          </div>
        </>
      ) : sessionEnded ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg text-gray-500 mt-4">
            <span role="img" aria-label="fin clase">🔚</span> The lesson has ended.
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
            <span role="img" aria-label="reiniciar">🔁</span> Restart lesson
          </Button>
        </div>
      ) : (
        <Button
          isLoading={isSessionLoading}
          onClick={startLesson}
          color="primary"
        >
          Start lesson
        </Button>
      )}
    </div>
  );
}
