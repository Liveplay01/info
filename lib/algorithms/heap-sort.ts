import type { SortStep, BarState } from './types'

export function* heapSortSteps(input: number[]): Generator<SortStep> {
  const arr = [...input]
  const n = arr.length
  let comparisons = 0
  let swaps = 0
  const steps: SortStep[] = []
  let sortedFrom = n

  function makeStates(highlights: number[], state: BarState): BarState[] {
    return arr.map((_, idx) => {
      if (idx >= sortedFrom) return 'sorted'
      if (highlights.includes(idx)) return state
      return 'default'
    })
  }

  function heapify(size: number, i: number) {
    let largest = i
    const left = 2 * i + 1
    const right = 2 * i + 2

    if (left < size) {
      comparisons++
      steps.push({ bars: [...arr], states: makeStates([i, left], 'comparing'), description: `Vergleiche Elternelement ${arr[i]} mit linkem Kind ${arr[left]}`, comparisons, swaps })
      if (arr[left] > arr[largest]) largest = left
    }

    if (right < size) {
      comparisons++
      steps.push({ bars: [...arr], states: makeStates([largest, right], 'comparing'), description: `Vergleiche ${arr[largest]} mit rechtem Kind ${arr[right]}`, comparisons, swaps })
      if (arr[right] > arr[largest]) largest = right
    }

    if (largest !== i) {
      ;[arr[i], arr[largest]] = [arr[largest], arr[i]]
      swaps++
      steps.push({ bars: [...arr], states: makeStates([i, largest], 'swapping'), description: `${arr[largest]} nach oben getauscht an Position ${i}`, comparisons, swaps })
      heapify(size, largest)
    }
  }

  // Max-Heap aufbauen
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i)

  steps.push({ bars: [...arr], states: arr.map((_, idx) => (idx < n ? 'pivot' : 'sorted')), description: 'Max-Heap aufgebaut — Wurzel ist das größte Element', comparisons, swaps })

  for (let i = n - 1; i > 0; i--) {
    ;[arr[0], arr[i]] = [arr[i], arr[0]]
    swaps++
    sortedFrom = i
    steps.push({ bars: [...arr], states: makeStates([0, i], 'swapping'), description: `Maximum ${arr[i]} an sortierte Position ${i} verschoben`, comparisons, swaps })
    heapify(i, 0)
  }

  steps.push({ bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array ist sortiert!', comparisons, swaps })

  for (const step of steps) yield step
}
