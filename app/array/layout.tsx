import { Header } from '@/components/header'
import { ArraySidebarNav } from '@/components/array-sidebar-nav'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function ArrayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block fixed top-14 left-0 w-60 h-[calc(100vh-3.5rem)] border-r">
          <ScrollArea className="h-full">
            <div className="px-4 py-6">
              <ArraySidebarNav />
            </div>
          </ScrollArea>
        </aside>

        {/* Main content */}
        <main className="flex-1 md:ml-60 min-w-0">
          <div className="max-w-4xl mx-auto px-6 py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
