import type { AlgorithmMeta } from '@/lib/algorithm-registry'

export function ComplexityTable({ algo }: { algo: AlgorithmMeta }) {
  const rows = [
    { label: 'Bester Fall', value: algo.complexity.best, mono: true },
    { label: 'Durchschnitt', value: algo.complexity.average, mono: true },
    { label: 'Schlechtester Fall', value: algo.complexity.worst, mono: true },
    { label: 'Speicherkomplexität', value: algo.complexity.space, mono: true },
    { label: 'Stabiles Sortieren', value: algo.stable ? 'Ja' : 'Nein', mono: false },
    { label: 'In-Place', value: algo.inPlace ? 'Ja' : 'Nein', mono: false },
  ]

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={i < rows.length - 1 ? 'border-b' : ''}>
              <td className="p-3 font-medium bg-muted/40 w-1/2 text-muted-foreground">{row.label}</td>
              <td className={`p-3 ${row.mono ? 'font-mono' : ''} ${
                row.label === 'Stabiles Sortieren' || row.label === 'In-Place'
                  ? row.value === 'Ja'
                    ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                    : 'text-muted-foreground'
                  : ''
              }`}>
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
