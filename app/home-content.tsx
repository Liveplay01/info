'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Header } from '@/components/header'
import { TypingLevelBadge } from '@/components/typing/typing-level-badge'
import { Gamepad2 } from 'lucide-react'

// ── Site data ────────────────────────────────────────────────────────────────

const JAVA_CARDS = [
  {
    href: '/sort',
    tag: '⟨sort/⟩', tagColor: 'text-blue-500 dark:text-blue-400',
    label: 'Sortieralgorithmen',
    desc: '10 klassische Algorithmen von Bubble Sort bis Radix Sort — mit interaktiver Visualisierung, Komplexitätstabellen und TypeScript-Code.',
    chips: ['Bubble Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort', '+6'],
    badge: '10 Algorithmen',
    badgeCls: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    hoverCls: 'hover:border-blue-400/60 dark:hover:border-blue-500/60',
  },
  {
    href: '/sort/playground',
    tag: '⟨sort/⟩', tagColor: 'text-blue-500 dark:text-blue-400',
    label: 'Playground',
    desc: 'Mehrere Algorithmen auf demselben Datensatz vergleichen — mit Laufzeit-Charts und Export-Funktion.',
    chips: ['Vergleich', 'Laufzeit', 'Charts'],
    badge: 'Tool',
    badgeCls: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    hoverCls: 'hover:border-blue-400/60 dark:hover:border-blue-500/60',
  },
  {
    href: '/array',
    tag: '⟨array/⟩', tagColor: 'text-orange-500 dark:text-orange-400',
    label: 'Java Arrays',
    desc: 'Alle 11 Array-Typen erklärt — primitiv, Referenz und mehrdimensional. Mit Speicher-Darstellungen und Java-Code.',
    chips: ['int[]', 'String[]', 'boolean[]', '2D-Arrays'],
    badge: '11 Typen',
    badgeCls: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    hoverCls: 'hover:border-orange-400/60 dark:hover:border-orange-500/60',
  },
]

const PC_CARDS = [
  {
    href: '/typing',
    tag: '⟨type/⟩', tagColor: 'text-emerald-500 dark:text-emerald-400',
    label: 'Tippen lernen',
    desc: 'WPM-Trainer auf Deutsch und Englisch — mit Live-Zähler, Streak-System, Level-Fortschritt und Bestleistungen.',
    chips: ['Wörter', 'Sätze', 'Code', 'DE / EN'],
    badge: '4 Modi',
    badgeCls: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    hoverCls: 'hover:border-emerald-400/60 dark:hover:border-emerald-500/60',
  },
  {
    href: '/shortcuts',
    tag: '⟨keys/⟩', tagColor: 'text-violet-500 dark:text-violet-400',
    label: 'Windows Shortcuts',
    desc: '56 Tastaturkürzel nach Häufigkeit sortiert — mit Suchleiste, Kategorie-Filter und Erklärungen per Drawer.',
    chips: ['Bearbeiten', 'System', 'Fenster', 'Browser'],
    badge: '56 Shortcuts',
    badgeCls: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    hoverCls: 'hover:border-violet-400/60 dark:hover:border-violet-500/60',
  },
  {
    href: '/pc/safe',
    tag: '⟨safe/⟩', tagColor: 'text-rose-500 dark:text-rose-400',
    label: 'PC-Sicherheit',
    desc: 'Passwörter, Zwei-Faktor-Auth, Phishing erkennen und sicheres WLAN — mit interaktiven Demos.',
    chips: ['Passwörter', '2FA', 'Phishing', 'WLAN'],
    badge: '5 Themen',
    badgeCls: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    hoverCls: 'hover:border-rose-400/60 dark:hover:border-rose-500/60',
  },
  {
    href: '/pc/files',
    tag: '⟨files/⟩', tagColor: 'text-amber-500 dark:text-amber-400',
    label: 'Dateien organisieren',
    desc: 'Ordnerstruktur, Benennungsregeln, Windows-Suche und Versionsverlauf — so behältst du den Überblick.',
    chips: ['Struktur', 'Benennung', 'Suche', 'Backup'],
    badge: '5 Themen',
    badgeCls: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    hoverCls: 'hover:border-amber-400/60 dark:hover:border-amber-500/60',
  },
  {
    href: '/pc/speed',
    tag: '⟨speed/⟩', tagColor: 'text-cyan-500 dark:text-cyan-400',
    label: 'PC schneller machen',
    desc: 'Autostart bereinigen, Speicher freigeben, RAM verstehen und PC-Mythen aufdecken.',
    chips: ['Autostart', 'Speicher', 'RAM', 'Mythen'],
    badge: '5 Themen',
    badgeCls: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    hoverCls: 'hover:border-cyan-400/60 dark:hover:border-cyan-500/60',
  },
]

const GAMES = [
  {
    href: '/sort/interview-trainer',
    tag: '⟨sort/⟩', tagColor: 'text-blue-400',
    label: 'Interview-Trainer',
    flavor: 'Java · Algorithmen',
    desc: 'Algorithmus-Fragen unter Zeitdruck beantworten — zur Prüfungsvorbereitung.',
  },
  {
    href: '/typing/spiel',
    tag: '⟨type/⟩', tagColor: 'text-emerald-400',
    label: 'Tipp-Spiel',
    flavor: 'PC · Tippen',
    desc: 'Wörter so schnell wie möglich tippen — Streak-Bonus, Level und Highscore.',
  },
  {
    href: '/shortcuts/trainer',
    tag: '⟨keys/⟩', tagColor: 'text-violet-400',
    label: 'Shortcut-Trainer',
    flavor: 'PC · Shortcuts',
    desc: '60 Sekunden, 4 Antworten — erkenne den richtigen Shortcut. Streak-Multiplikator.',
  },
]

const STATS = [
  { value: '10', label: 'Algorithmen' },
  { value: '11', label: 'Array-Typen' },
  { value: '56', label: 'Shortcuts' },
  { value: '3', label: 'Minigames' },
]

const HERO_CHARS = ['⟨', 'i', 'n', 'f', 'o', '/', '⟩']

// ── Sub-components ───────────────────────────────────────────────────────────

function ContentCard({ card, index }: { card: typeof JAVA_CARDS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 220, damping: 24 }}
      className="h-full"
    >
      <Link
        href={card.href}
        className={`group flex flex-col h-full rounded-xl border-2 border-border bg-card p-6 transition-all duration-200 ${card.hoverCls} hover:shadow-lg`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className={`font-mono text-xs font-semibold ${card.tagColor}`}>{card.tag}</span>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${card.badgeCls}`}>
            {card.badge}
          </span>
        </div>
        <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors leading-snug">
          {card.label}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{card.desc}</p>
        <div className="flex flex-wrap gap-1.5">
          {card.chips.map((c) => (
            <span key={c} className="font-mono text-[11px] bg-muted px-2 py-0.5 rounded border border-border/50">
              {c}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  )
}

function GameCard({ game, index }: { game: typeof GAMES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 220, damping: 24 }}
    >
      <Link
        href={game.href}
        className="group flex flex-col h-full rounded-xl border border-border bg-card p-6 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-center justify-between mb-3">
          <span className={`font-mono text-xs font-semibold ${game.tagColor}`}>{game.tag}</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
            Game
          </span>
        </div>
        <p className="text-xs text-muted-foreground font-medium mb-2">{game.flavor}</p>
        <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors">{game.label}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{game.desc}</p>
        <motion.div
          initial={false}
          className="mt-4 text-xs font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Jetzt spielen →
        </motion.div>
      </Link>
    </motion.div>
  )
}

function SectionHeading({
  tag, tagColor, title, subtitle,
}: {
  tag: string; tagColor: string; title: string; subtitle?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="mb-8"
    >
      <div className={`font-mono text-sm font-semibold ${tagColor} mb-1`}>{tag}</div>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-1.5 max-w-lg">{subtitle}</p>}
    </motion.div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function HomeContent() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ── Hero ── */}
      <section className="relative w-full flex flex-col items-center text-center px-6 pt-20 pb-24 border-b border-border overflow-hidden">
        {/* Dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Title */}
        <div className="font-mono text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight select-none mb-6 leading-none">
          {HERO_CHARS.map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 + 0.1, type: 'spring', stiffness: 280, damping: 22 }}
              className={i === 0 || i === 6 ? 'text-muted-foreground/40' : ''}
            >
              {char}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="text-xl text-muted-foreground max-w-lg leading-relaxed mb-2"
        >
          Interaktive Guides zu Java, PC-Nutzung und mehr — visuell, animiert und kostenlos.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.45 }}
          className="text-sm text-muted-foreground/50 mb-10"
        >
          Kein Login · Keine Registrierung · Direkt loslegen
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2.5"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.95 + i * 0.07, type: 'spring', stiffness: 300, damping: 22 }}
              className="flex items-baseline gap-1.5 rounded-full border border-border bg-card px-4 py-2 shadow-sm"
            >
              <span className="font-mono text-base font-bold">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Content ── */}
      <div className="flex-1">

        {/* Java section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16">
          <SectionHeading
            tag="⟨java/⟩"
            tagColor="text-blue-600 dark:text-blue-400"
            title="Java & Algorithmen"
            subtitle="Sortieralgorithmen visuell verstehen, Laufzeiten vergleichen und Java Arrays meistern."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {JAVA_CARDS.map((card, i) => (
              <ContentCard key={card.href} card={card} index={i} />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="border-t border-border" />
        </div>

        {/* PC section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-16">
          <SectionHeading
            tag="⟨pc/⟩"
            tagColor="text-emerald-600 dark:text-emerald-400"
            title="PC-Nutzung & Tipps"
            subtitle="Schneller tippen, Windows-Shortcuts kennen und den PC sicher & schnell halten."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PC_CARDS.map((card, i) => (
              <ContentCard key={card.href} card={card} index={i} />
            ))}
          </div>
        </section>

        {/* Games band */}
        <section className="border-t border-border bg-muted/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <SectionHeading
              tag="⟨games/⟩"
              tagColor="text-violet-600 dark:text-violet-400"
              title="Minigames"
              subtitle="Lernstoff spielerisch festigen — drei Minigames direkt im Browser, kostenlos."
            />
            <div className="flex items-center gap-2 mb-6 -mt-4">
              <Gamepad2 className="h-4 w-4 text-violet-500" />
              <span className="text-sm text-muted-foreground">Kein Download, kein Login — einfach spielen.</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {GAMES.map((game, i) => (
                <GameCard key={game.href} game={game} index={i} />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground/50">
          <span className="font-mono font-semibold text-muted-foreground/70">⟨info/⟩</span>
          <span>Open-Source Lernprojekt · gebaut mit Next.js, Tailwind CSS & TypeScript</span>
        </div>
      </footer>

      <TypingLevelBadge />
    </div>
  )
}
