import { Header } from '@/components/header'
import { PcSidebarNav } from '@/components/pc-sidebar-nav'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function PcLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <aside className="hidden md:block fixed top-14 left-0 w-60 h-[calc(100vh-3.5rem)] border-r">
          <ScrollArea className="h-full">
            <div className="px-4 py-6">
              <PcSidebarNav />
            </div>
          </ScrollArea>
        </aside>
        <main className="flex-1 md:ml-60 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
