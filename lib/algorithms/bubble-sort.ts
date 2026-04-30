import type { SortStep, BarState } from './types'

export function* bubbleSortSteps(input: number[]): Generator<SortStep> {
  const arr = [...input]
  const n = arr.length
  let comparisons = 0
  let swaps = 0

  const makeStates = (j: number, state: BarState, sortedFrom: number): BarState[] =>
    arr.map((_, idx) => {
      if (idx >= sortedFrom) return 'sorted'
      if (idx === j || idx === j + 1) return state
      return 'default'
    })

  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++
      yield { bars: [...arr], states: makeStates(j, 'comparing', n - i), description: `Vergleiche Index ${j} (${arr[j]}) und ${j + 1} (${arr[j + 1]})`, comparisons, swaps }

      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swapped = true
        swaps++
        yield { bars: [...arr], states: makeStates(j, 'swapping', n - i), description: `Getauscht: ${arr[j + 1]} und ${arr[j]}`, comparisons, swaps }
      }
    }
    if (!swapped) break
  }

  yield { bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array ist sortiert!', comparisons, swaps }
}
