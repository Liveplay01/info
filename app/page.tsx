import { ModeToggle } from '@/components/mode-toggle'
import { WattWiseButton } from '@/components/wattwise-button'
import { TypingLevelBadge } from '@/components/typing/typing-level-badge'
import { HomeTabs } from './home-tabs'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-6 gap-3">
          <span className="font-mono text-base font-bold">⟨info/⟩</span>
          <div className="flex-1" />
          <nav className="flex items-center gap-1">
            <WattWiseButton />
            <ModeToggle />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-3xl w-full text-center mb-12">
          <div className="inline-block font-mono text-4xl sm:text-5xl font-bold tracking-tight mb-6 select-none">
            <span className="text-muted-foreground/60">⟨</span>
            <span>info</span>
            <span className="text-muted-foreground/60">/⟩</span>
          </div>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Interaktive Guides zu Java, PC-Nutzung und mehr — anschaulich erklärt und frei zugänglich.
          </p>
          <p className="text-sm text-muted-foreground/60 mt-3">
            Kein Login. Keine Registrierung. Nur Lernen.
          </p>
        </div>

        <HomeTabs />

        {/* Footer note */}
        <p className="mt-16 text-xs text-muted-foreground/50 text-center">
          ⟨info/⟩ ist ein Open-Source-Lernprojekt — gebaut mit Next.js, Tailwind CSS und TypeScript.
        </p>
      </main>
      <TypingLevelBadge />
    </div>
  )
}
