import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '⟨info/⟩ – Tippen',
  description: 'Lerne das Zehnfingersystem oder übe direkt deine Tippgeschwindigkeit.',
}

const cards = [
  {
    href: '/typing/spiel',
    tag: '⟨spiel/⟩',
    tagColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'hover:border-emerald-400/60 dark:hover:border-emerald-500/60',
    badgeColor:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    label: 'Tipp-Trainer',
    badge: 'Interaktiv',
    description:
      'Starte eine Tipper-Runde, miss deine WPM-Geschwindigkeit und sammle XP. Mit Streak-System, Level-Fortschritt und persönlichen Bestleistungen.',
    items: ['15s / 30s / 60s / 120s', 'Wörter & Sätze', 'DE / EN', 'XP & Level'],
  },
  {
    href: '/typing/guide',
    tag: '⟨guide/⟩',
    tagColor: 'text-violet-600 dark:text-violet-400',
    borderColor: 'hover:border-violet-400/60 dark:hover:border-violet-500/60',
    badgeColor:
      'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    label: 'Zehnfingersystem',
    badge: 'Artikel',
    description:
      'Lerne die Grundlagen des Touch-Typings: Grundposition, Fingerzuordnung, Haltung und einen praktischen Übungsplan — mit interaktiver Tastatur-Grafik.',
    items: ['Grundposition', 'Fingerzuordnung', 'Haltung & Technik', 'Übungsplan'],
  },
]

export default function TypingHubPage() {
  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="mb-10">
          <div className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
            ⟨type/⟩
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">Tippen lernen</h1>
          <p className="text-lg text-muted-foreground">
            Übe direkt im Trainer oder lies zuerst, wie das Zehnfingersystem funktioniert.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`group relative flex flex-col rounded-xl border-2 border-border bg-card p-7 transition-all duration-200 ${card.borderColor} hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`font-mono text-sm font-semibold ${card.tagColor}`}>
                  {card.tag}
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              </div>

              <h2 className="text-xl font-bold mb-3 group-hover:text-foreground transition-colors">
                {card.label}
              </h2>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                {card.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {card.items.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-xs bg-muted px-2 py-0.5 rounded border border-border/60"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <span className="absolute bottom-7 right-7 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors text-lg leading-none">
                →
              </span>
            </Link>
          ))}
        </div>
    </div>
  )
}
