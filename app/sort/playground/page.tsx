import Link from 'next/link'
import { PlaygroundVisualizer } from '@/components/playground/playground-visualizer'

export const metadata = {
  title: 'Playground – SortDocs',
  description: 'Erstelle eigene Sortier-Visualisierungen: Algorithmus, Diagrammtyp und Farbschema frei wählbar – inkl. HTML-Export.',
}

export default function PlaygroundPage() {
  return (
    <div className="max-w-4xl">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link href="/sort" className="hover:text-foreground transition-colors">Sortierung</Link>
        <span>/</span>
        <span className="text-foreground">Playground</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight mb-2">Playground</h1>
      <p className="text-muted-foreground mb-8">
        Wähle Algorithmus, Diagrammtyp und Farbschema frei – und exportiere deine Visualisierung als eigenständige HTML-Datei.
      </p>

      <PlaygroundVisualizer />
    </div>
  )
}
