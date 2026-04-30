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
      description: `Inserting element ${key} from index ${i}`,
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
        description: `Shifting ${arr[j]} right to make room`,
        comparisons,
        swaps,
      }
      j--
    }

    arr[j + 1] = key
    yield {
      bars: [...arr],
      states: arr.map((_, idx) => (idx <= i ? 'sorted' : 'default')),
      description: `Placed ${key} at index ${j + 1}`,
      comparisons,
      swaps,
    }
  }

  yield { bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array is sorted!', comparisons, swaps }
}
