import type { SortStep, BarState } from './types'

export function* selectionSortSteps(input: number[]): Generator<SortStep> {
  const arr = [...input]
  const n = arr.length
  let comparisons = 0
  let swaps = 0

  const makeStates = (i: number, j: number, minIdx: number): BarState[] =>
    arr.map((_, idx) => {
      if (idx < i) return 'sorted'
      if (idx === j) return 'comparing'
      if (idx === minIdx) return 'pivot'
      return 'default'
    })

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    for (let j = i + 1; j < n; j++) {
      comparisons++
      yield { bars: [...arr], states: makeStates(i, j, minIdx), description: `Scanning: current min is index ${minIdx} (${arr[minIdx]}), comparing with index ${j} (${arr[j]})`, comparisons, swaps }

      if (arr[j] < arr[minIdx]) {
        minIdx = j
      }
    }

    if (minIdx !== i) {
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
      swaps++
      const states: BarState[] = arr.map((_, idx) => {
        if (idx < i) return 'sorted'
        if (idx === i || idx === minIdx) return 'swapping'
        return 'default'
      })
      yield { bars: [...arr], states, description: `Placed minimum ${arr[i]} at index ${i}`, comparisons, swaps }
    }
  }

  yield { bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array is sorted!', comparisons, swaps }
}
