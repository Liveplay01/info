'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FlaskConical, MessageSquareQuote, GitCompare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { algorithms } from '@/lib/algorithm-registry'

const categoryOrder = ['Comparison', 'Non-Comparison', 'Hybrid'] as const

const categoryLabels: Record<string, string> = {
  'Comparison': 'Vergleichsbasiert',
  'Non-Comparison': 'Nicht-Vergleichsbasiert',
  'Hybrid': 'Hybrid',
}

function groupAlgorithms() {
  return categoryOrder.map((cat) => ({
    label: categoryLabels[cat],
    items: algorithms.filter((a) => a.category === cat),
  }))
}

interface SidebarNavProps {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname()
  const groups = groupAlgorithms()

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/sort"
          onClick={onNavigate}
          className={cn(
            'block text-sm py-1.5 px-2 rounded-md transition-colors hover:text-foreground',
            pathname === '/sort' || pathname === '/sort/'
              ? 'text-foreground font-medium bg-accent'
              : 'text-muted-foreground'
          )}
        >
          Übersicht
        </Link>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
          Werkzeuge
        </p>
        <Link
          href="/sort/playground"
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-2 text-sm py-1.5 px-2 rounded-md transition-colors hover:text-foreground',
            pathname === '/sort/playground' || pathname === '/sort/playground/'
              ? 'text-foreground font-medium bg-accent'
              : 'text-muted-foreground'
          )}
        >
          <FlaskConical className="h-3.5 w-3.5" />
          Playground
        </Link>
        <Link
          href="/sort/interview-trainer"
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-2 text-sm py-1.5 px-2 rounded-md transition-colors hover:text-foreground',
            pathname === '/sort/interview-trainer' || pathname === '/sort/interview-trainer/'
              ? 'text-foreground font-medium bg-accent'
              : 'text-muted-foreground'
          )}
        >
          <MessageSquareQuote className="h-3.5 w-3.5" />
          Interview Trainer
        </Link>
        <Link
          href="/sort/code-diff"
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-2 text-sm py-1.5 px-2 rounded-md transition-colors hover:text-foreground',
            pathname === '/sort/code-diff' || pathname === '/sort/code-diff/'
              ? 'text-foreground font-medium bg-accent'
              : 'text-muted-foreground'
          )}
        >
          <GitCompare className="h-3.5 w-3.5" />
          Code-Diff Viewer
        </Link>
      </div>

      {groups.map((group) => (
        <div key={group.label}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((algo) => {
              const href = `/sort/${algo.slug}`
              const isActive = pathname === href || pathname === `${href}/`
              return (
                <li key={algo.slug}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    className={cn(
                      'block text-sm py-1.5 px-2 rounded-md transition-colors hover:text-foreground',
                      isActive
                        ? 'text-foreground font-medium bg-accent'
                        : 'text-muted-foreground'
                    )}
                  >
                    {algo.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
