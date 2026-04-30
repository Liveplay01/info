import type { SortStep, BarState } from './types'

export function* shellSortSteps(input: number[]): Generator<SortStep> {
  const arr = [...input]
  const n = arr.length
  let comparisons = 0
  let swaps = 0

  let gap = 1
  while (gap < n / 3) gap = gap * 3 + 1

  while (gap >= 1) {
    yield {
      bars: [...arr],
      states: arr.map(() => 'default'),
      description: `Starting pass with gap = ${gap}`,
      comparisons,
      swaps,
    }

    for (let i = gap; i < n; i++) {
      const temp = arr[i]
      let j = i

      yield {
        bars: [...arr],
        states: arr.map((_, idx) => (idx === i ? 'comparing' : 'default')),
        description: `Inserting ${temp} at index ${i} (gap=${gap})`,
        comparisons,
        swaps,
      }

      while (j >= gap && arr[j - gap] > temp) {
        comparisons++
        arr[j] = arr[j - gap]
        swaps++
        yield {
          bars: [...arr],
          states: arr.map((_, idx) => (idx === j || idx === j - gap ? 'swapping' : 'default')),
          description: `Shifting ${arr[j - gap]} right by gap ${gap}`,
          comparisons,
          swaps,
        }
        j -= gap
      }

      arr[j] = temp
    }

    gap = Math.floor(gap / 3)
  }

  yield { bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array is sorted!', comparisons, swaps }
}
