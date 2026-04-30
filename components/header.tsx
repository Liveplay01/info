import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'
import { MobileSidebar } from '@/components/mobile-sidebar'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-3">
        <div className="flex items-center gap-2 md:hidden">
          <MobileSidebar />
        </div>

        {/* WattWise link – top left */}
        <a
          href="https://liveplay01.github.io/wattwise/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          WattWise
          <ExternalLink className="h-3 w-3" />
        </a>

        <span className="text-border">|</span>

        <Link href="/docs" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">⟨sort/⟩</span>
          <span className="hidden sm:inline text-muted-foreground font-normal text-sm">SortDocs</span>
        </Link>

        <div className="flex-1" />

        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs">Dokumentation</Link>
          </Button>
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}
