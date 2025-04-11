'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const lessons = [
    {
      title: 'Lesson 1: Formar oraciones con el verbo to be',
      description: 'Aprende a usar "I am", "You are", "He is", etc.. en contextos reales.',
      href: '/modules/module3/lesson1',
      emoji: '👋',
    },
    {
      title: 'Lesson 2: Hacer preguntas simples',
      description: 'Uso de "What", "Where", "Who" y cómo responder preguntas básicas.',
      href: '/modules/module3/lesson2',
      emoji: '🧑‍🤝‍🧑',
    },
    {
      title: 'Lesson 3: Describir personas y cosas',
      description: 'Usar adjetivos para describir apariencia, ropa y objetos.',
      href: '/modules/module3/lesson3',
      emoji: '🔤',
    },
    {
      title: 'Lesson 4: Hacer una presentación personal completa',
      description: 'Integra lo aprendido para presentarte con fluidez.',
      href: '/modules/module3/lesson4',
      emoji: '👋🏻',
    },
  ];
export default function Module1Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6 text-white">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Módulo 1: Fundamentos del Inglés</h1>
        <p className="text-white/80">
          Inicia tu viaje aprendiendo a saludar, presentarte y entablar conversaciones básicas.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
        {lessons.map(({ title, description, href, emoji }) => (
          <Link key={href} href={href}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white/10 rounded-xl p-6 shadow-lg hover:shadow-xl cursor-pointer transition-all"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="text-2xl">{emoji}</div>
                <h2 className="text-lg font-semibold">{title}</h2>
              </div>
              <p className="text-white/80 text-sm">{description}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </main>
  );
}
