import { Header } from '@/components/header'
import { TypingTrainer } from '@/components/typing/typing-trainer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '⟨info/⟩ – Tippen lernen',
  description:
    'Verbessere deine Tippgeschwindigkeit mit interaktiven Übungen auf Deutsch und Englisch. Mit Live-WPM, Streak-System und XP-Fortschritt.',
}

export default function TypingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Tippen</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Verbessere deine Tippgeschwindigkeit — auf Deutsch und Englisch.
        </p>
        <TypingTrainer />
      </main>
    </div>
  )
}
