const terms = [
  {
    term: 'O(1)',
    label: 'Konstant',
    desc: 'Egal wie viele Elemente — der Aufwand bleibt gleich.',
  },
  {
    term: 'O(n)',
    label: 'Linear',
    desc: 'Doppelt so viele Elemente → doppelt so viel Aufwand.',
  },
  {
    term: 'O(n log n)',
    label: 'Quasi-Linear',
    desc: 'Wenig schlechter als linear — der Goldstandard für Sortieren.',
  },
  {
    term: 'O(n²)',
    label: 'Quadratisch',
    desc: '10× mehr Elemente → 100× mehr Aufwand. Langsam bei großen Listen.',
  },
  {
    term: 'Stabil',
    label: 'Stabile Sortierung',
    desc: 'Gleiche Werte behalten ihre ursprüngliche Reihenfolge zueinander.',
  },
  {
    term: 'In-Place',
    label: 'In-Place',
    desc: 'Sortiert direkt im vorhandenen Speicher, ohne eine Kopie der Liste anzulegen.',
  },
  {
    term: 'Vergleichsbasiert',
    label: 'Vergleichsbasiert',
    desc: 'Der Algorithmus entscheidet nur durch „ist A kleiner als B?" — funktioniert mit beliebigen Werten.',
  },
  {
    term: 'Nicht-Vergleichsbasiert',
    label: 'Nicht-Vergleichsbasiert',
    desc: 'Nutzt die Struktur der Zahlen selbst (z. B. Ziffern) — kann dadurch schneller als O(n log n) sein.',
  },
]

export function GlossaryLegend() {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-4">Legende</h2>
      <div className="rounded-lg border bg-muted/30 p-4">
        <dl className="grid gap-3 sm:grid-cols-2">
          {terms.map(({ term, label, desc }) => (
            <div key={term} className="flex gap-3">
              <dt className="shrink-0">
                <code className="rounded bg-background border px-1.5 py-0.5 text-xs font-mono font-semibold text-foreground">
                  {term}
                </code>
              </dt>
              <dd className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{label}:</span>{' '}
                {desc}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
