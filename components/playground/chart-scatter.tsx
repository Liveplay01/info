import type { BarState } from '@/lib/algorithms/types'
import type { ColorScheme } from '@/lib/playground-utils'
import { getColor } from './color-schemes'

interface ChartScatterProps {
  bars: number[]
  states: BarState[]
  maxVal: number
  colorScheme: ColorScheme
}

export function ChartScatter({ bars, states, maxVal, colorScheme }: ChartScatterProps) {
  const n = bars.length
  const slotW = 800 / n
  const r = Math.min(8, Math.max(2, slotW * 0.35))

  return (
    <svg
      viewBox="0 0 800 240"
      width="100%"
      className="rounded-lg bg-muted/30"
      style={{ display: 'block' }}
    >
      {bars.map((val, idx) => (
        <circle
          key={idx}
          cx={(idx + 0.5) * slotW}
          cy={240 - (val / maxVal) * 220}
          r={r}
          fill={getColor(states[idx], idx, n, colorScheme)}
        />
      ))}
    </svg>
  )
}
