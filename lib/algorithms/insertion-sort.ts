import type { SortStep, BarState } from './types'

export function* insertionSortSteps(input: number[]): Generator<SortStep> {
  const arr = [...input]
  const n = arr.length
  let comparisons = 0
  let swaps = 0

  for (let i = 1; i < n; i++) {
    const key = arr[i]
    let j = i - 1

    yield {
      bars: [...arr],
      states: arr.map((_, idx) => (idx === i ? 'comparing' : idx < i ? 'sorted' : 'default')),
      description: `Füge Element ${key} von Index ${i} ein`,
      comparisons,
      swaps,
    }

    while (j >= 0 && arr[j] > key) {
      comparisons++
      arr[j + 1] = arr[j]
      swaps++
      yield {
        bars: [...arr],
        states: arr.map((_, idx) => {
          if (idx === j || idx === j + 1) return 'swapping'
          if (idx < i) return 'sorted'
          return 'default'
        }),
        description: `Verschiebe ${arr[j]} nach rechts`,
        comparisons,
        swaps,
      }
      j--
    }

    arr[j + 1] = key
    yield {
      bars: [...arr],
      states: arr.map((_, idx) => (idx <= i ? 'sorted' : 'default')),
      description: `${key} an Position ${j + 1} eingesetzt`,
      comparisons,
      swaps,
    }
  }

  yield { bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array ist sortiert!', comparisons, swaps }
}
