import { bubbleSortSteps } from '@/lib/algorithms/bubble-sort'
import { selectionSortSteps } from '@/lib/algorithms/selection-sort'
import { insertionSortSteps } from '@/lib/algorithms/insertion-sort'
import { mergeSortSteps } from '@/lib/algorithms/merge-sort'
import { quickSortSteps } from '@/lib/algorithms/quick-sort'
import { heapSortSteps } from '@/lib/algorithms/heap-sort'
import { shellSortSteps } from '@/lib/algorithms/shell-sort'
import { countingSortSteps } from '@/lib/algorithms/counting-sort'
import { radixSortSteps } from '@/lib/algorithms/radix-sort'
import { timSortSteps } from '@/lib/algorithms/tim-sort'
import type { GeneratorFn, SortStep } from '@/lib/algorithms/types'

export type InputType = 'random' | 'sorted' | 'reversed' | 'nearly-sorted'
export type ChartType = 'bar' | 'scatter' | 'line' | 'radial'
export type ColorScheme = 'default' | 'monochrome' | 'rainbow'

export const generatorMap: Record<string, GeneratorFn> = {
  'bubble-sort': bubbleSortSteps,
  'selection-sort': selectionSortSteps,
  'insertion-sort': insertionSortSteps,
  'merge-sort': mergeSortSteps,
  'quick-sort': quickSortSteps,
  'heap-sort': heapSortSteps,
  'shell-sort': shellSortSteps,
  'counting-sort': countingSortSteps,
  'radix-sort': radixSortSteps,
  'tim-sort': timSortSteps,
}

export function generateInput(type: InputType, size: number): number[] {
  const arr = Array.from({ length: size }, (_, i) => i + 1)
  switch (type) {
    case 'random':
      return arr.sort(() => Math.random() - 0.5)
    case 'sorted':
      return arr
    case 'reversed':
      return [...arr].reverse()
    case 'nearly-sorted': {
      const swapCount = Math.max(1, Math.floor(size * 0.08))
      for (let i = 0; i < swapCount; i++) {
        const a = Math.floor(Math.random() * size)
        const b = Math.floor(Math.random() * size)
        ;[arr[a], arr[b]] = [arr[b], arr[a]]
      }
      return arr
    }
  }
}

export function computeAllSteps(generatorFn: GeneratorFn, input: number[]): SortStep[] {
  const steps: SortStep[] = []
  const gen = generatorFn(input)
  let result = gen.next()
  while (!result.done) {
    steps.push(result.value)
    result = gen.next()
  }
  return steps
}
