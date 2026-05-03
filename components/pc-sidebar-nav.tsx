'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface PcSidebarNavProps {
  onNavigate?: () => void
}

const pcGuides = [
  { href: '/typing', label: 'Tippen lernen', color: 'text-emerald-600 dark:text-emerald-400' },
  { href: '/shortcuts', label: 'Windows Shortcuts', color: 'text-violet-600 dark:text-violet-400' },
  { href: '/pc/safe', label: 'PC-Sicherheit', color: 'text-rose-600 dark:text-rose-400' },
  { href: '/pc/files', label: 'Dateien organisieren', color: 'text-amber-600 dark:text-amber-400' },
  { href: '/pc/speed', label: 'PC schneller machen', color: 'text-cyan-600 dark:text-cyan-400' },
]

const games = [
  { href: '/sort/interview-trainer', label: 'Interview-Trainer', color: 'text-blue-600 dark:text-blue-400' },
  { href: '/typing/spiel', label: 'Tipp-Spiel', color: 'text-emerald-600 dark:text-emerald-400' },
  { href: '/typing/race', label: 'Typing Race', color: 'text-emerald-600 dark:text-emerald-400' },
  { href: '/shortcuts/trainer', label: 'Shortcut-Trainer', color: 'text-violet-600 dark:text-violet-400' },
  { href: '/shortcuts/rush', label: 'Shortcut Rush', color: 'text-violet-600 dark:text-violet-400' },
  { href: '/pc/desktop-cleanup', label: 'Desktop Cleanup', color: 'text-amber-600 dark:text-amber-400' },
  { href: '/pc/bug-fixer', label: 'Bug Fixer', color: 'text-rose-600 dark:text-rose-400' },
  { href: '/cmd/trainer', label: 'CMD Trainer', color: 'text-green-600 dark:text-green-400' },
]

export function PcSidebarNav({ onNavigate }: PcSidebarNavProps) {
  const pathname = usePathname()

  function isActive(href: string) {
    return pathname === href || pathname === `${href}/`
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
          PC Guides
        </p>
        <ul className="space-y-0.5">
          {pcGuides.map((item) => {
            const active = isActive(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'block text-sm py-1.5 px-2 rounded-md transition-colors hover:text-foreground',
                    active
                      ? 'text-foreground font-medium bg-accent'
                      : `${item.color} hover:text-foreground`
                  )}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
          Spiele
        </p>
        <ul className="space-y-0.5">
          {games.map((item) => {
            const active = isActive(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'block text-sm py-1.5 px-2 rounded-md transition-colors hover:text-foreground',
                    active
                      ? 'text-foreground font-medium bg-accent'
                      : `${item.color} hover:text-foreground`
                  )}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
