'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { playClick } from '@/lib/sounds'

type Tab = 'java' | 'pc'

const javaSections = [
  {
    href: '/sort',
    label: 'Sortieralgorithmen',
    tag: '⟨sort/⟩',
    tagColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'hover:border-blue-400/60 dark:hover:border-blue-500/60',
    badgeColor:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
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
    badgeColor:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    description:
      'Alle Java Array-Typen erklärt — primitiv, Referenz und mehrdimensional. Mit visueller Speicher-Darstellung, Deklaration, Initialisierung, typischen Operationen und Java-Code zum Kopieren.',
    items: ['int[]', 'boolean[]', 'String[]', 'char[]', '+7 weitere'],
    count: '11 Array-Typen',
  },
]

const pcSections = [
  {
    href: '/typing',
    label: 'Tippen lernen',
    tag: '⟨type/⟩',
    tagColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'hover:border-emerald-400/60 dark:hover:border-emerald-500/60',
    badgeColor:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    description:
      'Verbessere deine Tippgeschwindigkeit mit interaktiven Übungen auf Deutsch und Englisch. Mit Live-WPM-Zähler, Streak-System, XP-Fortschritt und persönlichen Bestleistungen.',
    items: ['Wörter', 'Sätze', 'Code-Begriffe', 'DE / EN'],
    count: '4 Modi',
  },
  {
    href: '/shortcuts',
    label: 'Windows Shortcuts',
    tag: '⟨keys/⟩',
    tagColor: 'text-violet-600 dark:text-violet-400',
    borderColor: 'hover:border-violet-400/60 dark:hover:border-violet-500/60',
    badgeColor:
      'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    description:
      'Alle wichtigen Windows-Tastaturkürzel auf einen Blick — nach Häufigkeit sortiert. Mit Suchleiste, Kategorie-Filter und detaillierten Erklärungen zu jedem Shortcut.',
    items: ['Bearbeiten', 'System', 'Fenster', 'Browser', '+3 weitere'],
    count: '56 Shortcuts',
  },
  {
    href: '/pc/safe',
    label: 'PC-Sicherheit',
    tag: '⟨safe/⟩',
    tagColor: 'text-rose-600 dark:text-rose-400',
    borderColor: 'hover:border-rose-400/60 dark:hover:border-rose-500/60',
    badgeColor:
      'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    description:
      'Passwörter, Zwei-Faktor-Authentifizierung, Phishing erkennen und sicheres WLAN — einfach erklärt mit interaktiven Demos.',
    items: ['Passwörter', '2FA', 'Phishing', 'Updates', 'WLAN'],
    count: '5 Themen',
  },
  {
    href: '/pc/files',
    label: 'Dateien organisieren',
    tag: '⟨files/⟩',
    tagColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'hover:border-amber-400/60 dark:hover:border-amber-500/60',
    badgeColor:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    description:
      'Ordnerstruktur, Benennungsregeln, Windows-Suche und Versionsverlauf — so behältst du immer den Überblick über deine Dateien.',
    items: ['Struktur', 'Benennung', 'Suche', 'Backup', 'Verlauf'],
    count: '5 Themen',
  },
  {
    href: '/pc/speed',
    label: 'PC schneller machen',
    tag: '⟨speed/⟩',
    tagColor: 'text-cyan-600 dark:text-cyan-400',
    borderColor: 'hover:border-cyan-400/60 dark:hover:border-cyan-500/60',
    badgeColor:
      'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    description:
      'Autostart bereinigen, Speicher freigeben, RAM verstehen und Mythen entlarven — konkrete Tipps die wirklich helfen.',
    items: ['Autostart', 'Speicher', 'RAM', 'Mythen', 'Wartung'],
    count: '5 Themen',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, type: 'spring', stiffness: 260, damping: 24 },
  }),
}

function SectionCard({
  section,
  index,
}: {
  section: (typeof javaSections)[0]
  index: number
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={index === 4 ? 'md:col-span-2' : ''}
    >
      <Link
        href={section.href}
        className={`group relative flex flex-col h-full rounded-xl border-2 border-border bg-card p-7 transition-all duration-200 ${section.borderColor} hover:shadow-md`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className={`font-mono text-sm font-semibold ${section.tagColor}`}>
            {section.tag}
          </span>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${section.badgeColor}`}
          >
            {section.count}
          </span>
        </div>

        <h2 className="text-xl font-bold mb-3 group-hover:text-foreground transition-colors">
          {section.label}
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
          {section.description}
        </p>

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

        <span className="absolute bottom-7 right-7 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors text-lg leading-none">
          →
        </span>
      </Link>
    </motion.div>
  )
}

export function HomeTabs() {
  const [active, setActive] = useState<Tab>('java')

  const sections = active === 'java' ? javaSections : pcSections

  return (
    <div className="w-full max-w-3xl">
      {/* Tab bar */}
      <div className="flex gap-1 mb-8 border-b border-border">
        {(['java', 'pc'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { playClick(); setActive(tab) }}
            className="relative px-4 py-2.5 font-mono text-sm font-semibold transition-colors"
            style={{
              color: active === tab ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
            }}
          >
            {tab === 'java' ? '⟨java/⟩' : '⟨pc/⟩'}
            {active === tab && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {sections.map((section, i) => (
            <SectionCard key={section.href} section={section} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
