import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'
import { SmartMobileSidebar } from '@/components/smart-mobile-sidebar'
import { WattWiseButton } from '@/components/wattwise-button'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-3">
        <div className="flex items-center gap-2 md:hidden">
          <SmartMobileSidebar />
        </div>

        <Link href="/docs" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">⟨sort/⟩</span>
          <span className="hidden sm:inline text-muted-foreground font-normal text-sm">SortDocs</span>
        </Link>

        <div className="flex-1" />

        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs">Dokumentation</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/array">Arrays</Link>
          </Button>
          <WattWiseButton />
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}
