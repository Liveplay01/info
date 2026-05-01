import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { arrayTypes } from '@/lib/array-registry'

const categoryColors: Record<string, string> = {
  Primitiv: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  Referenz: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  Mehrdimensional: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
}

export default function ArrayPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">Java Arrays</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Interaktive Erklärungen und Code-Beispiele für alle Java-Array-Typen —
          von primitiven <code className="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">int[]</code> und{' '}
          <code className="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">boolean[]</code> bis hin zu Referenz-Arrays
          und mehrdimensionalen Strukturen.
        </p>
      </div>

      <div className="flex gap-3 mb-8 flex-wrap">
        {(['Primitiv', 'Referenz', 'Mehrdimensional'] as const).map((cat) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryColors[cat]}`}>
              {cat}
            </span>
            <span className="text-xs text-muted-foreground">
              ({arrayTypes.filter((t) => t.category === cat).length})
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {arrayTypes.map((type) => (
          <Link key={type.slug} href={`/array/${type.slug}`} className="group block">
            <Card className="h-full hover:border-primary/40 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base group-hover:text-primary transition-colors font-mono">
                    {type.javaType}
                  </CardTitle>
                  <span className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${categoryColors[type.category]}`}>
                    {type.category}
                  </span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <Badge variant="outline" className="font-mono text-xs h-5">
                    Standard: {type.defaultValue}
                  </Badge>
                  {type.bits && (
                    <Badge variant="outline" className="font-mono text-xs h-5">
                      {type.bits} Bit
                    </Badge>
                  )}
                  {type.minValue && (
                    <Badge variant="outline" className="text-xs h-5 text-muted-foreground">
                      {type.minValue} … {type.maxValue}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {type.shortDescription}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-dashed p-6">
        <h2 className="text-sm font-semibold mb-2">Was sind Java Arrays?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Ein Array in Java ist eine geordnete, <strong className="text-foreground">festlänge Datenstruktur</strong>,
          die Elemente des gleichen Typs speichert. Die Größe wird bei der Erstellung festgelegt und kann nicht mehr
          geändert werden. Arrays sind die Grundlage vieler Algorithmen und Datenstrukturen — und das Verständnis ihrer
          Typen ist entscheidend für effiziente Java-Programme.
        </p>
      </div>
    </div>
  )
}
