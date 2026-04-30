'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { algorithms } from '@/lib/algorithm-registry'

const categoryOrder = ['Comparison', 'Non-Comparison', 'Hybrid'] as const

function groupAlgorithms() {
  return categoryOrder.map((cat) => ({
    label: cat,
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
          href="/docs"
          onClick={onNavigate}
          className={cn(
            'block text-sm py-1.5 px-2 rounded-md transition-colors hover:text-foreground',
            pathname === '/docs' || pathname === '/docs/'
              ? 'text-foreground font-medium bg-accent'
              : 'text-muted-foreground'
          )}
        >
          Overview
        </Link>
      </div>

      {groups.map((group) => (
        <div key={group.label}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((algo) => {
              const href = `/docs/${algo.slug}`
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
