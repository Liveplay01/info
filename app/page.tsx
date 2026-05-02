import type { Metadata } from 'next'
import { HomeContent } from './home-content'

export const metadata: Metadata = {
  title: '⟨info/⟩ — Interaktive Lernplattform',
  description:
    'Interaktive Guides zu Java, Algorithmen, PC-Nutzung und mehr — visuell, animiert und kostenlos. Sortieralgorithmen, Arrays, Tippen, Shortcuts und Minigames.',
}

export default function HomePage() {
  return <HomeContent />
}
