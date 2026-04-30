import type { AlgorithmMeta } from '@/lib/algorithm-registry'

export function ComplexityTable({ algo }: { algo: AlgorithmMeta }) {
  const rows = [
    { label: 'Best Case', value: algo.complexity.best, mono: true },
    { label: 'Average Case', value: algo.complexity.average, mono: true },
    { label: 'Worst Case', value: algo.complexity.worst, mono: true },
    { label: 'Space Complexity', value: algo.complexity.space, mono: true },
    { label: 'Stable Sort', value: algo.stable ? 'Yes' : 'No', mono: false },
    { label: 'In-Place', value: algo.inPlace ? 'Yes' : 'No', mono: false },
  ]

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={i < rows.length - 1 ? 'border-b' : ''}>
              <td className="p-3 font-medium bg-muted/40 w-1/2 text-muted-foreground">{row.label}</td>
              <td className={`p-3 ${row.mono ? 'font-mono' : ''} ${
                row.label.includes('Stable') || row.label.includes('In-Place')
                  ? row.value === 'Yes'
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
