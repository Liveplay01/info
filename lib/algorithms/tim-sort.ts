import type { SortStep, BarState } from './types'

const MIN_MERGE = 16

export function* timSortSteps(input: number[]): Generator<SortStep> {
  const arr = [...input]
  const n = arr.length
  let comparisons = 0
  let swaps = 0
  const steps: SortStep[] = []

  function makeStates(activeRange: [number, number], highlights: number[], state: BarState): BarState[] {
    return arr.map((_, idx) => {
      if (highlights.includes(idx)) return state
      if (idx >= activeRange[0] && idx <= activeRange[1]) return 'comparing'
      return 'default'
    })
  }

  function insertionSortRange(left: number, right: number) {
    for (let i = left + 1; i <= right; i++) {
      const key = arr[i]
      let j = i - 1
      steps.push({ bars: [...arr], states: makeStates([left, right], [i], 'comparing'), description: `Insertion Sort: füge ${key} in Run [${left}..${right}] ein`, comparisons, swaps })
      while (j >= left && arr[j] > key) {
        arr[j + 1] = arr[j]
        swaps++
        comparisons++
        steps.push({ bars: [...arr], states: makeStates([left, right], [j, j + 1], 'swapping'), description: `Verschiebe ${arr[j]} nach rechts`, comparisons, swaps })
        j--
      }
      arr[j + 1] = key
    }
  }

  function mergeRanges(l: number, m: number, r: number) {
    const leftArr = arr.slice(l, m + 1)
    const rightArr = arr.slice(m + 1, r + 1)
    let i = 0, j = 0, k = l

    steps.push({ bars: [...arr], states: arr.map((_, idx) => (idx >= l && idx <= r ? 'pivot' : 'default')), description: `Führe Runs [${l}..${m}] und [${m + 1}..${r}] zusammen`, comparisons, swaps })

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++
      if (leftArr[i] <= rightArr[j]) {
        arr[k++] = leftArr[i++]
      } else {
        arr[k++] = rightArr[j++]
        swaps++
      }
    }
    while (i < leftArr.length) { arr[k++] = leftArr[i++]; swaps++ }
    while (j < rightArr.length) { arr[k++] = rightArr[j++]; swaps++ }

    steps.push({ bars: [...arr], states: arr.map((_, idx) => (idx >= l && idx <= r ? 'sorted' : 'default')), description: `Run [${l}..${r}] zusammengeführt`, comparisons, swaps })
  }

  // Runs sortieren
  for (let i = 0; i < n; i += MIN_MERGE) {
    const right = Math.min(i + MIN_MERGE - 1, n - 1)
    steps.push({ bars: [...arr], states: arr.map((_, idx) => (idx >= i && idx <= right ? 'pivot' : 'default')), description: `Sortiere Run [${i}..${right}] mit Insertion Sort`, comparisons, swaps })
    insertionSortRange(i, right)
  }

  // Runs zusammenführen
  for (let size = MIN_MERGE; size < n; size *= 2) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = Math.min(left + size - 1, n - 1)
      const right = Math.min(left + 2 * size - 1, n - 1)
      if (mid < right) mergeRanges(left, mid, right)
    }
  }

  steps.push({ bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array ist sortiert!', comparisons, swaps })

  for (const step of steps) yield step
}
