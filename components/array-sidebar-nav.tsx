'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { arrayTypes } from '@/lib/array-registry'

const categoryOrder = ['Primitiv', 'Referenz', 'Mehrdimensional'] as const

const categoryLabels: Record<string, string> = {
  Primitiv: 'Primitive Arrays',
  Referenz: 'Referenz-Arrays',
  Mehrdimensional: 'Mehrdimensional',
}

function groupTypes() {
  return categoryOrder.map((cat) => ({
    label: categoryLabels[cat],
    items: arrayTypes.filter((t) => t.category === cat),
  }))
}

interface ArraySidebarNavProps {
  onNavigate?: () => void
}

export function ArraySidebarNav({ onNavigate }: ArraySidebarNavProps) {
  const pathname = usePathname()
  const groups = groupTypes()

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/array"
          onClick={onNavigate}
          className={cn(
            'block text-sm py-1.5 px-2 rounded-md transition-colors hover:text-foreground',
            pathname === '/array' || pathname === '/array/'
              ? 'text-foreground font-medium bg-accent'
              : 'text-muted-foreground'
          )}
        >
          Übersicht
        </Link>
      </div>

      {groups.map((group) => (
        <div key={group.label}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((type) => {
              const href = `/array/${type.slug}`
              const isActive = pathname === href || pathname === `${href}/`
              return (
                <li key={type.slug}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    className={cn(
                      'flex items-center justify-between text-sm py-1.5 px-2 rounded-md transition-colors hover:text-foreground',
                      isActive
                        ? 'text-foreground font-medium bg-accent'
                        : 'text-muted-foreground'
                    )}
                  >
                    <span>{type.name.replace('-Array', '').replace('2D-Array', '2D-Array')}</span>
                    <code className="text-xs opacity-60 font-mono">{type.javaType}</code>
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
