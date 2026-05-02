'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, Lightbulb } from 'lucide-react'
import { Header } from '@/components/header'
import { cn } from '@/lib/utils'
import {
  shortcuts,
  categoryConfig,
  CATEGORIES,
  type WindowsShortcut,
  type ShortcutCategory,
} from '@/lib/windows-shortcuts'

// ── Key display helpers ────────────────────────────────────────────────────

function KeyBadge({ children, large }: { children: string; large?: boolean }) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center rounded border font-mono font-semibold select-none',
        'bg-muted text-foreground border-border',
        'shadow-[0_2px_0_0_hsl(var(--border))]',
        large
          ? 'min-w-[2.75rem] h-11 px-3 text-base rounded-lg border-2 shadow-[0_3px_0_0_hsl(var(--border))]'
          : 'min-w-[1.6rem] h-6 px-1.5 text-[11px]'
      )}
    >
      {children}
    </kbd>
  )
}

function KeyCombo({ keys, large }: { keys: string[]; large?: boolean }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {keys.map((key, i) => (
        <React.Fragment key={i}>
          <KeyBadge large={large}>{key}</KeyBadge>
          {i < keys.length - 1 && (
            <span
              className={cn(
                'font-mono text-muted-foreground/60 select-none',
                large ? 'text-base' : 'text-[10px]'
              )}
            >
              +
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ── Category badge ─────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: ShortcutCategory }) {
  const cfg = categoryConfig[category]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold',
        cfg.color,
        cfg.bg,
        cfg.border
      )}
    >
      {category}
    </span>
  )
}

// ── Shortcut card ──────────────────────────────────────────────────────────

function ShortcutCard({
  shortcut,
  onClick,
}: {
  shortcut: WindowsShortcut
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group text-left w-full rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="mb-3">
        <KeyCombo keys={shortcut.keys} />
      </div>

      <div className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
        {shortcut.name}
      </div>

      <div className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
        {shortcut.shortDesc}
      </div>

      <CategoryBadge category={shortcut.category} />
    </button>
  )
}

// ── Bottom-sheet drawer ────────────────────────────────────────────────────

function ShortcutDrawer({
  shortcut,
  open,
  onClose,
}: {
  shortcut: WindowsShortcut | null
  open: boolean
  onClose: () => void
}) {
  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && shortcut && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-2xl bg-background rounded-t-2xl border-t border-x border-border shadow-2xl flex flex-col max-h-[85dvh]"
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Schließen"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="px-6 pt-3 pb-5 border-b border-border shrink-0">
              <div className="flex items-start gap-3 mb-3">
                <KeyCombo keys={shortcut.keys} large />
              </div>
              <h2 className="text-xl font-semibold mb-2">{shortcut.name}</h2>
              <CategoryBadge category={shortcut.category} />
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto px-6 py-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Was es macht
                </h3>
                <p className="text-sm leading-relaxed">{shortcut.fullDescription}</p>
              </div>

              {/* Tips */}
              {shortcut.tips.length > 0 && (
                <div className="pb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5" />
                    Tipps & Tricks
                  </h3>
                  <ul className="space-y-2.5">
                    {shortcut.tips.map((tip, i) => (
                      <li key={i} className="flex gap-2.5 text-sm">
                        <span className="text-primary mt-0.5 shrink-0 font-mono">›</span>
                        <span className="leading-relaxed text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export function ShortcutsClient() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<ShortcutCategory | null>(null)
  const [selected, setSelected] = useState<WindowsShortcut | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return shortcuts.filter((s) => {
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.shortDesc.toLowerCase().includes(q) ||
        s.keys.join(' ').toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      const matchesCat = !activeCategory || s.category === activeCategory
      return matchesSearch && matchesCat
    })
  }, [search, activeCategory])

  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        CATEGORIES.map((cat) => [
          cat,
          shortcuts.filter((s) => s.category === cat).length,
        ])
      ),
    []
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Hero */}
        <div className="mb-8">
          <div className="font-mono text-sm font-semibold text-violet-600 dark:text-violet-400 mb-2">
            ⟨keys/⟩
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Windows Shortcuts
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {shortcuts.length} Tastaturkürzel nach Häufigkeit sortiert — mit
            Suchleiste, Kategorie-Filter und Erklärungen zu jedem Shortcut.
          </p>
        </div>

        {/* Search + filter — sticky below header */}
        <div className="sticky top-14 z-10 -mx-4 px-4 sm:-mx-6 sm:px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-4 pt-2 mb-2">
          {/* Search input */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Shortcut suchen… z.B. &quot;Kopieren&quot; oder &quot;Ctrl&quot;"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/50"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Suche leeren"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold border transition-colors',
                !activeCategory
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-transparent text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground'
              )}
            >
              Alle ({shortcuts.length})
            </button>
            {CATEGORIES.map((cat) => {
              const cfg = categoryConfig[cat]
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(isActive ? null : cat)}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold border transition-colors',
                    isActive
                      ? cn(cfg.color, cfg.bg, cfg.border)
                      : 'bg-transparent text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground'
                  )}
                >
                  {cat} ({categoryCounts[cat]})
                </button>
              )
            })}
          </div>
        </div>

        {/* Result count */}
        <p className="text-xs text-muted-foreground mb-5">
          {filtered.length} {filtered.length === 1 ? 'Shortcut' : 'Shortcuts'}{' '}
          {search || activeCategory ? 'gefunden' : 'insgesamt'}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((s) => (
              <ShortcutCard key={s.id} shortcut={s} onClick={() => setSelected(s)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <span className="font-mono text-6xl mb-4 opacity-20 select-none">?</span>
            <p className="text-base font-medium mb-1 text-foreground">
              Kein Shortcut gefunden
            </p>
            <p className="text-sm">
              Versuche einen anderen Suchbegriff oder entferne den Kategorie-Filter
            </p>
          </div>
        )}
      </main>

      <ShortcutDrawer
        shortcut={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
