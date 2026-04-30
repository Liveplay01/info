import type { BarState } from '@/lib/algorithms/types'
import type { ColorScheme } from '@/lib/playground-utils'
import { getColor } from './color-schemes'

interface ChartLineProps {
  bars: number[]
  states: BarState[]
  maxVal: number
  colorScheme: ColorScheme
}

export function ChartLine({ bars, states, maxVal, colorScheme }: ChartLineProps) {
  const n = bars.length
  const slotW = 800 / n
  const r = Math.min(5, Math.max(1.5, slotW * 0.25))

  const points = bars
    .map((val, idx) => `${(idx + 0.5) * slotW},${240 - (val / maxVal) * 220}`)
    .join(' ')

  return (
    <svg
      viewBox="0 0 800 240"
      width="100%"
      className="rounded-lg bg-muted/30"
      style={{ display: 'block' }}
    >
      <polyline
        points={points}
        fill="none"
        stroke="hsl(240 5% 55%)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
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
