"use client";

import { Card, CardBody, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleStartLesson = () => {
    router.push("/lessons/ai/lesson1");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-black text-white">
      <h1 className="text-3xl font-bold text-center">
        🎓 Bienvenido a{" "}
        <span className="text-indigo-400">Next Inglés Online</span>
      </h1>

      <Card className="max-w-md w-full">
        <CardBody className="flex flex-col gap-4 items-center">
          <h2 className="text-xl font-semibold">Selecciona tu nivel</h2>

          <div className="w-full flex flex-col gap-2">
            <h3 className="text-lg font-medium">Nivel A1 - Principiante</h3>

            <Button
              onClick={() => router.push("/lessons/ai/lesson1")}
              className="bg-indigo-500 text-white w-full"
            >
              Iniciar Lección 1: Saludos 👋
            </Button>

            <Button
              onClick={() => router.push("/lessons/ai/lesson2")}
              className="bg-indigo-500 text-white w-full"
            >
              Iniciar Lección 2: Presentaciones 🤝
            </Button>
          </div>

          {/* Aquí puedes seguir agregando más niveles o temas en el futuro */}
        </CardBody>
      </Card>
    </div>
  );
}
