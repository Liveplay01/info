import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { algorithms } from '@/lib/algorithm-registry'

const categoryColors: Record<string, string> = {
  Comparison: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'Non-Comparison': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  Hybrid: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
}

const categoryLabels: Record<string, string> = {
  Comparison: 'Vergleichsbasiert',
  'Non-Comparison': 'Nicht-Vergleichsbasiert',
  Hybrid: 'Hybrid',
}

export default function DocsPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">Sortieralgorithmen</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Interaktive Schritt-für-Schritt-Visualisierungen und saubere TypeScript-Implementierungen von 10 klassischen Sortieralgorithmen —
          von O(n²)-Grundlagen bis hin zu linearen Nicht-Vergleichssortiervarianten.
        </p>
      </div>

      <div className="flex gap-3 mb-8 flex-wrap">
        {(['Comparison', 'Non-Comparison', 'Hybrid'] as const).map((cat) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryColors[cat]}`}>
              {categoryLabels[cat]}
            </span>
            <span className="text-xs text-muted-foreground">
              ({algorithms.filter((a) => a.category === cat).length})
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {algorithms.map((algo) => (
          <Link key={algo.slug} href={`/docs/${algo.slug}`} className="group block">
            <Card className="h-full hover:border-primary/40 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base group-hover:text-primary transition-colors">
                    {algo.name}
                  </CardTitle>
                  <span className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${categoryColors[algo.category]}`}>
                    {categoryLabels[algo.category]}
                  </span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <Badge variant="outline" className="font-mono text-xs h-5">
                    Ø: {algo.complexity.average}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs h-5">
                    Speicher: {algo.complexity.space}
                  </Badge>
                  {algo.stable && (
                    <Badge variant="outline" className="text-xs h-5 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700">
                      Stabil
                    </Badge>
                  )}
                  {algo.inPlace && (
                    <Badge variant="outline" className="text-xs h-5">
                      In-Place
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {algo.shortDescription}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
