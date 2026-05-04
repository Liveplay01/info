'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ToolsSidebarNavProps {
  onNavigate?: () => void
}

const tools = [
  { href: '/tools',                 label: 'Alle Tools',             color: 'text-sky-600 dark:text-sky-400' },
  { href: '/tools/qr-code',         label: 'QR-Code Generator',      color: 'text-sky-600 dark:text-sky-400' },
  { href: '/tools/color-converter', label: 'Color Converter',        color: 'text-sky-600 dark:text-sky-400' },
  { href: '/tools/palette',         label: 'Farbpaletten-Generator', color: 'text-sky-600 dark:text-sky-400' },
  { href: '/tools/password',        label: 'Passwort-Generator',     color: 'text-sky-600 dark:text-sky-400' },
  { href: '/tools/json-formatter',  label: 'JSON Formatter',         color: 'text-sky-600 dark:text-sky-400' },
  { href: '/tools/base64',          label: 'Base64 Coder',           color: 'text-sky-600 dark:text-sky-400' },
]

export function ToolsSidebarNav({ onNavigate }: ToolsSidebarNavProps) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/tools') return pathname === '/tools'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
        Tools
      </p>
      <ul className="space-y-0.5">
        {tools.map((item) => {
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
  )
}
