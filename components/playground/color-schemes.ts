import type { BarState } from '@/lib/algorithms/types'
import type { ColorScheme } from '@/lib/playground-utils'

const DEFAULT_COLORS: Record<BarState, string> = {
  default: 'hsl(215 16% 47%)',
  comparing: 'hsl(43 96% 56%)',
  swapping: 'hsl(0 84% 60%)',
  sorted: 'hsl(152 69% 50%)',
  pivot: 'hsl(263 70% 63%)',
}

const MONO_LIGHTNESS: Record<BarState, number> = {
  default: 45,
  comparing: 75,
  swapping: 85,
  sorted: 65,
  pivot: 55,
}

export function getColor(
  state: BarState,
  idx: number,
  total: number,
  scheme: ColorScheme,
  isDark = true,
): string {
  if (scheme === 'default') {
    return DEFAULT_COLORS[state]
  }

  if (scheme === 'monochrome') {
    const l = isDark
      ? MONO_LIGHTNESS[state]
      : 100 - MONO_LIGHTNESS[state]
    return `hsl(240 5% ${l}%)`
  }

  // rainbow
  const hue = (idx / total) * 360
  if (state === 'default') return `hsl(${hue} 70% 55%)`
  if (state === 'comparing') return `hsl(${hue} 100% 70%)`
  if (state === 'swapping') return `hsl(0 90% 65%)`
  if (state === 'sorted') return `hsl(${hue} 80% 60%)`
  if (state === 'pivot') return `hsl(280 90% 70%)`
  return `hsl(${hue} 70% 55%)`
}

export const COLOR_SCHEME_LABELS: Record<ColorScheme, string> = {
  default: 'Standard',
  monochrome: 'Monochrom',
  rainbow: 'Regenbogen',
}
