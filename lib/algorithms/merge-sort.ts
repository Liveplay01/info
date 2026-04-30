import type { SortStep, BarState } from './types'

export function* mergeSortSteps(input: number[]): Generator<SortStep> {
  const arr = [...input]
  const n = arr.length
  let comparisons = 0
  let swaps = 0
  const steps: SortStep[] = []

  function merge(arr: number[], left: number, mid: number, right: number) {
    const leftArr = arr.slice(left, mid + 1)
    const rightArr = arr.slice(mid + 1, right + 1)
    let i = 0, j = 0, k = left

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++
      const states: BarState[] = arr.map((_, idx) => {
        if (idx === left + i || idx === mid + 1 + j) return 'comparing'
        if (idx >= left && idx <= right) return 'swapping'
        return 'default'
      })
      steps.push({ bars: [...arr], states, description: `Merging: comparing ${leftArr[i]} and ${rightArr[j]}`, comparisons, swaps })

      if (leftArr[i] <= rightArr[j]) {
        arr[k++] = leftArr[i++]
      } else {
        arr[k++] = rightArr[j++]
        swaps++
      }
    }

    while (i < leftArr.length) { arr[k++] = leftArr[i++]; swaps++ }
    while (j < rightArr.length) { arr[k++] = rightArr[j++]; swaps++ }

    const states: BarState[] = arr.map((_, idx) => {
      if (idx >= left && idx <= right) return 'sorted'
      return 'default'
    })
    steps.push({ bars: [...arr], states, description: `Merged section [${left}..${right}]`, comparisons, swaps })
  }

  function mergeSort(arr: number[], left: number, right: number) {
    if (left >= right) return
    const mid = Math.floor((left + right) / 2)
    mergeSort(arr, left, mid)
    mergeSort(arr, mid + 1, right)
    merge(arr, left, mid, right)
  }

  mergeSort(arr, 0, n - 1)
  steps.push({ bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array is sorted!', comparisons, swaps })

  for (const step of steps) yield step
}
