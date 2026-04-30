import type { SortStep, BarState } from './types'

export function* quickSortSteps(input: number[]): Generator<SortStep> {
  const arr = [...input]
  const n = arr.length
  let comparisons = 0
  let swaps = 0
  const steps: SortStep[] = []
  const sorted = new Set<number>()

  function makeStates(pivotIdx: number, comparing: number[], swapping: number[]): BarState[] {
    return arr.map((_, idx) => {
      if (sorted.has(idx)) return 'sorted'
      if (idx === pivotIdx) return 'pivot'
      if (swapping.includes(idx)) return 'swapping'
      if (comparing.includes(idx)) return 'comparing'
      return 'default'
    })
  }

  function partition(low: number, high: number): number {
    const pivotIdx = high
    const pivot = arr[high]
    let i = low - 1

    for (let j = low; j < high; j++) {
      comparisons++
      steps.push({ bars: [...arr], states: makeStates(pivotIdx, [j], []), description: `Comparing ${arr[j]} with pivot ${pivot}`, comparisons, swaps })

      if (arr[j] <= pivot) {
        i++
        if (i !== j) {
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          swaps++
          steps.push({ bars: [...arr], states: makeStates(pivotIdx, [], [i, j]), description: `Swapped ${arr[j]} and ${arr[i]}`, comparisons, swaps })
        }
      }
    }

    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    swaps++
    sorted.add(i + 1)
    steps.push({ bars: [...arr], states: makeStates(-1, [], [i + 1, high]), description: `Pivot ${pivot} placed at index ${i + 1}`, comparisons, swaps })

    return i + 1
  }

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high)
      quickSort(low, pi - 1)
      quickSort(pi + 1, high)
    } else if (low === high) {
      sorted.add(low)
    }
  }

  quickSort(0, n - 1)
  steps.push({ bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array is sorted!', comparisons, swaps })

  for (const step of steps) yield step
}
