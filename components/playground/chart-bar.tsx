import type { BarState } from '@/lib/algorithms/types'
import type { ColorScheme } from '@/lib/playground-utils'
import { getColor } from './color-schemes'

interface ChartBarProps {
  bars: number[]
  states: BarState[]
  maxVal: number
  colorScheme: ColorScheme
}

export function ChartBar({ bars, states, maxVal, colorScheme }: ChartBarProps) {
  const n = bars.length
  const barWidth = 800 / n
  const gap = Math.max(1, barWidth * 0.15)

  return (
    <svg
      viewBox="0 0 800 240"
      width="100%"
      className="rounded-lg bg-muted/30"
      style={{ display: 'block' }}
    >
      {bars.map((val, idx) => {
        const normH = Math.max(2, (val / maxVal) * 220)
        return (
          <rect
            key={idx}
            x={idx * barWidth + gap / 2}
            y={240 - normH}
            width={Math.max(1, barWidth - gap)}
            height={normH}
            fill={getColor(states[idx], idx, n, colorScheme)}
            rx={1}
          />
        )
      })}
    </svg>
  )
}
