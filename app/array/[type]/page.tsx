import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { arrayTypes } from '@/lib/array-registry'
import { ArrayVisualizer } from '@/components/array-visualizer'
import { CodeBlock } from '@/components/code-block'

export async function generateStaticParams() {
  return arrayTypes.map((t) => ({ type: t.slug }))
}

export async function generateMetadata({ params }: { params: { type: string } }) {
  const type = arrayTypes.find((t) => t.slug === params.type)
  if (!type) return {}
  return {
    title: `${type.javaType} – Java Arrays`,
    description: type.shortDescription,
  }
}

const categoryColors: Record<string, string> = {
  Primitiv: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  Referenz: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  Mehrdimensional: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
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

export default function ArrayTypePage({ params }: { params: { type: string } }) {
  const type = arrayTypes.find((t) => t.slug === params.type)
  if (!type) notFound()

  const idx = arrayTypes.findIndex((t) => t.slug === type.slug)
  const prev = arrayTypes[idx - 1]
  const next = arrayTypes[idx + 1]

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/array" className="hover:text-foreground transition-colors">Arrays</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-mono">{type.javaType}</span>
      </nav>

      {/* Title */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold tracking-tight font-mono">{type.javaType}</h1>
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryColors[type.category]}`}>
          {type.category}
        </span>
      </div>

      <p className="text-lg text-muted-foreground mb-6 max-w-2xl leading-relaxed">
        {type.shortDescription}
      </p>

      {/* Meta info badges */}
      <div className="flex flex-wrap gap-3 mb-10">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">Standardwert:</span>
          <code className="font-mono bg-muted px-2 py-0.5 rounded text-sm">{type.defaultValue}</code>
        </div>
        {type.bits && (
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-muted-foreground">Größe:</span>
            <code className="font-mono bg-muted px-2 py-0.5 rounded text-sm">{type.bits} Bit</code>
          </div>
        )}
        {type.minValue && (
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-muted-foreground">Minimum:</span>
            <code className="font-mono bg-muted px-2 py-0.5 rounded text-sm">{type.minValue}</code>
          </div>
        )}
        {type.maxValue && (
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-muted-foreground">Maximum:</span>
            <code className="font-mono bg-muted px-2 py-0.5 rounded text-sm">{type.maxValue}</code>
          </div>
        )}
      </div>

      {/* Visualizer */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Visualisierung</h2>
        <ArrayVisualizer arrayType={type} />
      </section>

      {/* Declaration */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Deklaration</h2>
        <p className="text-sm text-muted-foreground mb-4">So reservierst du Speicher für einen {type.javaType}.</p>
        <CodeBlock code={type.declaration} lang="java" />
      </section>

      {/* Initialization */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Initialisierung</h2>
        <p className="text-sm text-muted-foreground mb-4">Verschiedene Wege, ein {type.javaType} mit Werten zu befüllen.</p>
        <CodeBlock code={type.initialization} lang="java" />
      </section>

      {/* Operations */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Typische Operationen</h2>
        <p className="text-sm text-muted-foreground mb-4">Zugriff, Änderung, Iteration und häufige Patterns mit {type.javaType}.</p>
        <CodeBlock code={type.operations} lang="java" />
      </section>

      {/* Explanation */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Hintergründe & Details</h2>
        <div className="space-y-4 max-w-2xl">
          {renderExplanation(type.explanation)}
        </div>
      </section>

      {/* Navigation footer */}
      <div className="border-t pt-8 flex justify-between items-center text-sm">
        {prev ? (
          <Link href={`/array/${prev.slug}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="h-4 w-4 rotate-180" />
            <span className="font-mono">{prev.javaType}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/array/${next.slug}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <span className="font-mono">{next.javaType}</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : <span />}
      </div>
    </div>
  )
}
