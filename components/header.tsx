'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ModeToggle } from '@/components/mode-toggle'
import { SmartMobileSidebar } from '@/components/smart-mobile-sidebar'
import { WattWiseButton } from '@/components/wattwise-button'
import { SoundToggle } from '@/components/sound-toggle'
import { ChevronDown, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { playClick, playDrawerOpen, playDrawerClose } from '@/lib/sounds'

const NAV_GROUPS = [
  {
    id: 'java',
    label: '⟨java/⟩',
    color: 'text-blue-600 dark:text-blue-400',
    items: [
      { href: '/sort',            label: 'Sortieralgorithmen', tag: '⟨sort/⟩',  tagColor: 'text-blue-500 dark:text-blue-400',     desc: '10 Algorithmen interaktiv' },
      { href: '/sort/playground', label: 'Playground',         tag: '⟨sort/⟩',  tagColor: 'text-blue-500 dark:text-blue-400',     desc: 'Algorithmen vergleichen' },
      { href: '/array',           label: 'Java Arrays',         tag: '⟨array/⟩', tagColor: 'text-orange-500 dark:text-orange-400', desc: '11 Array-Typen erklärt' },
    ],
  },
  {
    id: 'pc',
    label: '⟨pc/⟩',
    color: 'text-emerald-600 dark:text-emerald-400',
    items: [
      { href: '/typing',       label: 'Tippen lernen',        tag: '⟨type/⟩',  tagColor: 'text-emerald-500 dark:text-emerald-400', desc: 'Guide & Übungen' },
      { href: '/shortcuts',    label: 'Windows Shortcuts',    tag: '⟨keys/⟩',  tagColor: 'text-violet-500 dark:text-violet-400',   desc: '56 Shortcuts' },
      { href: '/pc/safe',      label: 'PC-Sicherheit',        tag: '⟨safe/⟩',  tagColor: 'text-rose-500 dark:text-rose-400',       desc: 'Passwörter, 2FA, Phishing' },
      { href: '/pc/files',     label: 'Dateien organisieren', tag: '⟨files/⟩', tagColor: 'text-amber-500 dark:text-amber-400',     desc: 'Struktur & Suche' },
      { href: '/pc/speed',     label: 'PC schneller machen',  tag: '⟨speed/⟩', tagColor: 'text-cyan-500 dark:text-cyan-400',       desc: 'Autostart, RAM, Mythen' },
    ],
  },
  {
    id: 'games',
    label: '⟨games/⟩',
    color: 'text-violet-600 dark:text-violet-400',
    items: [
      { href: '/games',                  label: 'Spielhalle',          tag: '⟨games/⟩', tagColor: 'text-violet-500 dark:text-violet-400',   desc: 'Alle 8 Minigames & Skill-Übersicht' },
      { href: '/typing/spiel',           label: 'Tipp-Spiel',          tag: '⟨type/⟩',  tagColor: 'text-emerald-500 dark:text-emerald-400', desc: 'WPM-Trainer', isGame: true },
      { href: '/typing/race',            label: 'Typing Race',         tag: '⟨type/⟩',  tagColor: 'text-emerald-500 dark:text-emerald-400', desc: 'Asteroiden abschießen', isGame: true },
      { href: '/shortcuts/trainer',      label: 'Shortcut-Trainer',    tag: '⟨keys/⟩',  tagColor: 'text-violet-500 dark:text-violet-400',   desc: 'Shortcuts erraten', isGame: true },
      { href: '/shortcuts/rush',         label: 'Shortcut Rush',       tag: '⟨keys/⟩',  tagColor: 'text-violet-500 dark:text-violet-400',   desc: 'Workflow-Combo', isGame: true },
      { href: '/pc/desktop-cleanup',     label: 'Desktop Cleanup',     tag: '⟨pc/⟩',    tagColor: 'text-amber-500 dark:text-amber-400',     desc: 'Dateien sortieren', isGame: true },
      { href: '/pc/bug-fixer',           label: 'Bug Fixer',           tag: '⟨pc/⟩',    tagColor: 'text-rose-500 dark:text-rose-400',       desc: 'PC-Probleme lösen', isGame: true },
      { href: '/sort/interview-trainer', label: 'Interview-Trainer',   tag: '⟨sort/⟩',  tagColor: 'text-blue-500 dark:text-blue-400',       desc: 'Algorithmus-Quiz', isGame: true },
      { href: '/cmd/trainer',            label: 'CMD Trainer',         tag: '⟨cmd/⟩',   tagColor: 'text-green-500 dark:text-green-400',     desc: 'Windows-Befehle lernen', isGame: true },
    ],
  },
]

export function Header() {
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenGroup(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    setOpenGroup(null)
    setMobileOpen(false)
  }, [pathname])

  function toggleGroup(id: string) {
    playClick()
    setOpenGroup((prev) => (prev === id ? null : id))
  }

  function openMobile() {
    playDrawerOpen()
    setMobileOpen(true)
  }

  function closeMobile() {
    playDrawerClose()
    setMobileOpen(false)
  }

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex h-14 items-center px-4 gap-3">
        {/* Section sidebar (sort/array pages only, mobile) */}
        <div className="flex items-center md:hidden">
          <SmartMobileSidebar />
        </div>

        <Link href="/" className="font-mono text-base font-bold">
          ⟨info/⟩
        </Link>

        <div className="flex-1" />

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_GROUPS.map((group) => {
            const isOpen = openGroup === group.id
            return (
              <div key={group.id} className="relative">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={cn(
                    'inline-flex items-center gap-1 px-3 py-1.5 rounded-md font-mono text-sm font-semibold transition-colors hover:bg-accent',
                    group.color,
                    isOpen && 'bg-accent'
                  )}
                >
                  {group.label}
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 440, damping: 32 }}
                      className="absolute top-full right-0 mt-2 min-w-[268px] rounded-xl border border-border bg-background shadow-xl z-50 overflow-hidden"
                    >
                      {group.items.map((item, i) => {
                        const active =
                          pathname === item.href ||
                          (item.href !== '/' && pathname.startsWith(item.href + '/'))
                        return (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.035 }}
                          >
                            <Link
                              href={item.href}
                              className={cn(
                                'flex items-start gap-3 px-4 py-3 hover:bg-accent transition-colors',
                                active && 'bg-accent/60'
                              )}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className={`font-mono text-[11px] font-semibold ${item.tagColor}`}>
                                    {item.tag}
                                  </span>
                                  {item.isGame && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-semibold leading-none">
                                      Game
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm font-medium leading-snug">{item.label}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                              </div>
                            </Link>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}

          <WattWiseButton />
          <SoundToggle />
          <ModeToggle />
        </nav>

        {/* ── Mobile right ── */}
        <div className="flex items-center gap-1 md:hidden">
          <SoundToggle />
          <ModeToggle />
          <button
            onClick={openMobile}
            className="inline-flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Menü öffnen"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 md:hidden"
              onClick={closeMobile}
            />
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-background border-l border-border flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-5 h-14 border-b border-border shrink-0">
                <span className="font-mono font-bold">⟨info/⟩</span>
                <button
                  onClick={closeMobile}
                  className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  aria-label="Menü schließen"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 py-3">
                {NAV_GROUPS.map((group, gi) => (
                  <div
                    key={group.id}
                    className={cn('pb-3', gi < NAV_GROUPS.length - 1 && 'border-b border-border mb-3')}
                  >
                    <div className={`px-5 py-2 text-xs font-mono font-semibold ${group.color}`}>
                      {group.label}
                    </div>
                    {group.items.map((item) => {
                      const active =
                        pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href + '/'))
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-5 py-2.5 hover:bg-accent transition-colors',
                            active && 'bg-accent/60'
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium truncate">{item.label}</span>
                              {item.isGame && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-semibold leading-none shrink-0">
                                  Game
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ))}
              </div>

              <div className="px-5 py-3 border-t border-border shrink-0 flex items-center gap-1">
                <WattWiseButton />
                <SoundToggle />
                <ModeToggle />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
