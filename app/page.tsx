import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'
import { WattWiseButton } from '@/components/wattwise-button'
import { TypingLevelBadge } from '@/components/typing/typing-level-badge'

const sections = [
  {
    href: '/sort',
    label: 'Sortieralgorithmen',
    tag: '⟨sort/⟩',
    tagColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'hover:border-blue-400/60 dark:hover:border-blue-500/60',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    description:
      'Interaktive Schritt-für-Schritt-Visualisierungen von 10 klassischen Sortieralgorithmen — von Bubble Sort bis Radix Sort. Mit Live-Animator, Komplexitätstabellen, TypeScript-Code und einem Playground.',
    items: ['Bubble Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort', '+6 weitere'],
    count: '10 Algorithmen',
  },
  {
    href: '/array',
    label: 'Java Arrays',
    tag: '⟨array/⟩',
    tagColor: 'text-orange-600 dark:text-orange-400',
    borderColor: 'hover:border-orange-400/60 dark:hover:border-orange-500/60',
    badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    description:
      'Alle Java Array-Typen erklärt — primitiv, Referenz und mehrdimensional. Mit visueller Speicher-Darstellung, Deklaration, Initialisierung, typischen Operationen und Java-Code zum Kopieren.',
    items: ['int[]', 'boolean[]', 'String[]', 'char[]', '+7 weitere'],
    count: '11 Array-Typen',
  },
  {
    href: '/typing',
    label: 'Tippen lernen',
    tag: '⟨type/⟩',
    tagColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'hover:border-emerald-400/60 dark:hover:border-emerald-500/60',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    description:
      'Verbessere deine Tippgeschwindigkeit mit interaktiven Übungen auf Deutsch und Englisch. Mit Live-WPM-Zähler, Streak-System, XP-Fortschritt und persönlichen Bestleistungen.',
    items: ['Wörter', 'Sätze', 'Code-Begriffe', 'DE / EN'],
    count: '4 Modi',
  },
]

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
        <div className="max-w-3xl w-full text-center mb-16">
          <div className="inline-block font-mono text-4xl sm:text-5xl font-bold tracking-tight mb-6 select-none">
            <span className="text-muted-foreground/60">⟨</span>
            <span>info</span>
            <span className="text-muted-foreground/60">/⟩</span>
          </div>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Grundlagen der Java-Programmierung — anschaulich erklärt, interaktiv und frei zugänglich.
          </p>
          <p className="text-sm text-muted-foreground/60 mt-3">
            Kein Login. Keine Registrierung. Nur Lernen.
          </p>
        </div>

        {/* Section cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className={`group relative flex flex-col rounded-xl border-2 border-border bg-card p-7 transition-all duration-200 ${section.borderColor} hover:shadow-md`}
            >
              {/* Tag */}
              <div className="flex items-center justify-between mb-4">
                <span className={`font-mono text-sm font-semibold ${section.tagColor}`}>
                  {section.tag}
                </span>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${section.badgeColor}`}>
                  {section.count}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold mb-3 group-hover:text-foreground transition-colors">
                {section.label}
              </h2>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                {section.description}
              </p>

              {/* Preview tags */}
              <div className="flex flex-wrap gap-1.5">
                {section.items.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-xs bg-muted px-2 py-0.5 rounded border border-border/60"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* Arrow */}
              <span className="absolute bottom-7 right-7 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors text-lg leading-none">
                →
              </span>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-16 text-xs text-muted-foreground/50 text-center">
          ⟨info/⟩ ist ein Open-Source-Lernprojekt — gebaut mit Next.js, Tailwind CSS und TypeScript.
        </p>
      </main>
      <TypingLevelBadge />
    </div>
  )
}
