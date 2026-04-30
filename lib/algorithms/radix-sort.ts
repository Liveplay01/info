import type { SortStep, BarState } from './types'

export function* radixSortSteps(input: number[]): Generator<SortStep> {
  const arr = [...input]
  const n = arr.length
  let comparisons = 0
  let swaps = 0
  const steps: SortStep[] = []

  function countingSortByDigit(exp: number) {
    const output = new Array(n)
    const count = new Array(10).fill(0)

    for (let i = 0; i < n; i++) {
      count[Math.floor(arr[i] / exp) % 10]++
    }

    for (let i = 1; i < 10; i++) count[i] += count[i - 1]

    steps.push({
      bars: [...arr],
      states: arr.map(() => 'pivot'),
      description: `Verarbeite Stelle 10^${Math.log10(exp).toFixed(0)} (exp=${exp})`,
      comparisons,
      swaps,
    })

    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10
      const pos = --count[digit]
      output[pos] = arr[i]
      swaps++
      steps.push({
        bars: output.map((v) => v ?? 0),
        states: output.map((v, idx) => {
          if (v === undefined) return 'default'
          if (idx === pos) return 'swapping'
          return 'sorted'
        }),
        description: `${arr[i]} (Ziffer=${digit}) an Position ${pos} gesetzt`,
        comparisons,
        swaps,
      })
    }

    for (let i = 0; i < n; i++) arr[i] = output[i]

    steps.push({
      bars: [...arr],
      states: arr.map(() => 'comparing'),
      description: `Durchgang abgeschlossen — nach Stelle 10^${Math.log10(exp).toFixed(0)} sortiert`,
      comparisons,
      swaps,
    })
  }

  const max = Math.max(...arr)
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(exp)
  }

  steps.push({ bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array ist sortiert!', comparisons, swaps })

  for (const step of steps) yield step
}
