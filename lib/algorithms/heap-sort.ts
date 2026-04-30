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
      steps.push({ bars: [...arr], states: makeStates([i, left], 'comparing'), description: `Comparing parent ${arr[i]} with left child ${arr[left]}`, comparisons, swaps })
      if (arr[left] > arr[largest]) largest = left
    }

    if (right < size) {
      comparisons++
      steps.push({ bars: [...arr], states: makeStates([largest, right], 'comparing'), description: `Comparing ${arr[largest]} with right child ${arr[right]}`, comparisons, swaps })
      if (arr[right] > arr[largest]) largest = right
    }

    if (largest !== i) {
      ;[arr[i], arr[largest]] = [arr[largest], arr[i]]
      swaps++
      steps.push({ bars: [...arr], states: makeStates([i, largest], 'swapping'), description: `Swapped ${arr[largest]} up to position ${i}`, comparisons, swaps })
      heapify(size, largest)
    }
  }

  // Build max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i)

  steps.push({ bars: [...arr], states: arr.map((_, idx) => (idx < n ? 'pivot' : 'sorted')), description: 'Max-heap built — root is the largest element', comparisons, swaps })

  for (let i = n - 1; i > 0; i--) {
    ;[arr[0], arr[i]] = [arr[i], arr[0]]
    swaps++
    sortedFrom = i
    steps.push({ bars: [...arr], states: makeStates([0, i], 'swapping'), description: `Moved max ${arr[i]} to sorted position ${i}`, comparisons, swaps })
    heapify(i, 0)
  }

  steps.push({ bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array is sorted!', comparisons, swaps })

  for (const step of steps) yield step
}
