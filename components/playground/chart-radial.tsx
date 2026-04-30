import type { BarState } from '@/lib/algorithms/types'
import type { ColorScheme } from '@/lib/playground-utils'
import { getColor } from './color-schemes'

interface ChartRadialProps {
  bars: number[]
  states: BarState[]
  maxVal: number
  colorScheme: ColorScheme
}

export function ChartRadial({ bars, states, maxVal, colorScheme }: ChartRadialProps) {
  const n = bars.length
  const cx = 400
  const cy = 210
  const rInner = 20
  const rOuter = 190
  const rawStrokeW = (2 * Math.PI * rOuter / n) * 0.7
  const strokeW = Math.min(40, Math.max(1, rawStrokeW))

  return (
    <svg
      viewBox="0 0 800 420"
      width="100%"
      className="rounded-lg bg-muted/30"
      style={{ display: 'block' }}
    >
      {bars.map((val, idx) => {
        const theta = (idx / n) * 2 * Math.PI - Math.PI / 2
        const len = rInner + (val / maxVal) * (rOuter - rInner)
        const x1 = cx + rInner * Math.cos(theta)
        const y1 = cy + rInner * Math.sin(theta)
        const x2 = cx + len * Math.cos(theta)
        const y2 = cy + len * Math.sin(theta)
        return (
          <line
            key={idx}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={getColor(states[idx], idx, n, colorScheme)}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
        )
      })}
    </svg>
  )
}
