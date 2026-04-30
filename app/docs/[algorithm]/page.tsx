import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, GitCompare } from 'lucide-react'
import { algorithms } from '@/lib/algorithm-registry'
import { SortVisualizerWrapper } from '@/components/sort-visualizer-wrapper'
import { CodeBlock } from '@/components/code-block'
import { ComplexityTable } from '@/components/complexity-table'
import { GlossaryLegend } from '@/components/glossary-legend'
import { Button } from '@/components/ui/button'

export async function generateStaticParams() {
  return algorithms.map((a) => ({ algorithm: a.slug }))
}

export async function generateMetadata({ params }: { params: { algorithm: string } }) {
  const algo = algorithms.find((a) => a.slug === params.algorithm)
  if (!algo) return {}
  return {
    title: `${algo.name} – SortDocs`,
    description: algo.shortDescription,
  }
}

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

function renderExplanation(text: string) {
  return text.split('\n\n').map((paragraph, i) => {
    const parts = paragraph.split(/(\*\*[^*]+\*\*)/g)
    return (
      <p key={i} className="text-muted-foreground leading-relaxed">
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>
          }
          return part
        })}
      </p>
    )
  })
}

export default function AlgorithmPage({ params }: { params: { algorithm: string } }) {
  const algo = algorithms.find((a) => a.slug === params.algorithm)
  if (!algo) notFound()

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{algo.name}</span>
      </nav>

      {/* Title */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold tracking-tight">{algo.name}</h1>
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryColors[algo.category]}`}>
          {categoryLabels[algo.category]}
        </span>
      </div>

      <p className="text-lg text-muted-foreground mb-10 max-w-2xl leading-relaxed">
        {algo.shortDescription}
      </p>

      {/* Visualizer */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Live-Visualisierung</h2>
        <SortVisualizerWrapper slug={algo.slug} />
      </section>

      {/* Complexity */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Komplexität</h2>
        <ComplexityTable algo={algo} />
      </section>

      {/* Glossary */}
      <GlossaryLegend />

      {/* Code */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Implementierung</h2>
        <p className="text-sm text-muted-foreground mb-4">TypeScript-Implementierung — direkt kopierbereit.</p>
        <CodeBlock code={algo.codeTS} lang="typescript" />
      </section>

      {/* Explanation */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Wie es funktioniert</h2>
        <div className="space-y-4 max-w-2xl">
          {renderExplanation(algo.explanation)}
        </div>
      </section>

      {/* Code-Diff banner */}
      <div className="rounded-lg border border-dashed p-4 flex flex-wrap items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GitCompare className="h-4 w-4 shrink-0" />
          <span>Vergleiche <strong className="text-foreground">{algo.name}</strong> direkt mit einem anderen Algorithmus</span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/docs/code-diff?a=${algo.slug}`}>Code vergleichen →</Link>
        </Button>
      </div>

      {/* Navigation footer */}
      <div className="border-t pt-8 flex justify-between items-center text-sm">
        {(() => {
          const idx = algorithms.findIndex((a) => a.slug === algo.slug)
          const prev = algorithms[idx - 1]
          const next = algorithms[idx + 1]
          return (
            <>
              {prev ? (
                <Link href={`/docs/${prev.slug}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  {prev.name}
                </Link>
              ) : <span />}
              {next ? (
                <Link href={`/docs/${next.slug}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  {next.name}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : <span />}
            </>
          )
        })()}
      </div>
    </div>
  )
}
