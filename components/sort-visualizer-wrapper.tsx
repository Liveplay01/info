'use client'

import { SortVisualizer } from '@/components/sort-visualizer'
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
import type { GeneratorFn } from '@/lib/algorithms/types'

const generatorMap: Record<string, GeneratorFn> = {
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

export function SortVisualizerWrapper({ slug }: { slug: string }) {
  const gen = generatorMap[slug]
  if (!gen) return null
  return <SortVisualizer generatorFn={gen} />
}
