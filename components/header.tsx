import Link from 'next/link'
import { Github } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'
import { MobileSidebar } from '@/components/mobile-sidebar'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        <div className="flex items-center gap-2 md:hidden">
          <MobileSidebar />
        </div>
        <Link href="/docs" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">⟨sort/⟩</span>
          <span className="hidden sm:inline text-muted-foreground font-normal text-sm">SortDocs</span>
        </Link>

        <div className="flex-1" />

        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs">Docs</Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
            <a href="https://github.com/Liveplay01/sort" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}
