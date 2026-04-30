'use client'

import { SortVisualizer } from '@/components/sort-visualizer'
import { generatorMap } from '@/lib/playground-utils'

export function SortVisualizerWrapper({ slug }: { slug: string }) {
  const gen = generatorMap[slug]
  if (!gen) return null
  return <SortVisualizer generatorFn={gen} />
}
