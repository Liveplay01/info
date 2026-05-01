'use client'

import * as React from 'react'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { SidebarNav } from '@/components/sidebar-nav'
import { ArraySidebarNav } from '@/components/array-sidebar-nav'
import { ScrollArea } from '@/components/ui/scroll-area'

export function SmartMobileSidebar() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const isArraySection = pathname.startsWith('/array')

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setOpen(true)} aria-label="Navigation öffnen">
        <Menu className="h-4 w-4" />
      </Button>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="text-left">
            {isArraySection ? '⟨sort/⟩ Arrays' : '⟨sort/⟩ SortDocs'}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="px-4 py-4">
            {isArraySection
              ? <ArraySidebarNav onNavigate={() => setOpen(false)} />
              : <SidebarNav onNavigate={() => setOpen(false)} />
            }
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
