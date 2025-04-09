'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const modules = [
  {
    title: 'Módulo 1: Fundamentos del Inglés',
    description: 'Saludos, presentaciones y frases básicas para iniciar.',
    href: '/modules/module1',
    emoji: '📘',
    color: 'bg-sky-600',
  },
  {
    title: 'Módulo 2: El Presente Simple',
    description: 'Verbo to be, rutinas y estructuras del presente.',
    href: '/modules/module2',
    emoji: '🎓',
    color: 'bg-green-600',
  },
  {
    title: 'Módulo 3: Interacción Cotidiana',
    description: 'Conversaciones comunes y preguntas frecuentes.',
    href: '/modules/module3',
    emoji: '💡',
    color: 'bg-yellow-500',
  },
  {
    title: 'Módulo 4: Comunicación Activa',
    description: 'Vocabulario avanzado y diálogos extendidos.',
    href: '/modules/module4',
    emoji: '🚀',
    color: 'bg-purple-600',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6 text-white">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a NextInglés</h1>
        <p className="text-white/80 mb-10 text-lg">
          Aprende inglés básico desde cero con lecciones interactivas guiadas por avatares. Selecciona un módulo para comenzar.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
        {modules.map(({ title, description, href, emoji, color }) => (
          <Link key={href} href={href}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white/10 rounded-xl p-6 backdrop-blur shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`p-3 text-2xl rounded-full ${color}`}>
                  {emoji}
                </div>
                <h2 className="text-xl font-semibold">{title}</h2>
              </div>
              <p className="text-white/80 text-sm">{description}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </main>
  );
}
