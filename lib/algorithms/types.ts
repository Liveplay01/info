export type BarState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot'

export interface SortStep {
  bars: number[]
  states: BarState[]
  description: string
  comparisons: number
  swaps: number
}

export type GeneratorFn = (input: number[]) => Generator<SortStep>
