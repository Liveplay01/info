import type { SortStep, BarState } from './types'

export function* countingSortSteps(input: number[]): Generator<SortStep> {
  const arr = [...input]
  const n = arr.length
  let comparisons = 0
  let swaps = 0

  const max = Math.max(...arr)
  const min = Math.min(...arr)
  const range = max - min + 1
  const count = new Array(range).fill(0)
  const output = new Array(n)

  // Zählphase
  for (let i = 0; i < n; i++) {
    count[arr[i] - min]++
    yield {
      bars: [...arr],
      states: arr.map((_, idx) => (idx === i ? 'comparing' : 'default')),
      description: `Zähle Wert ${arr[i]}: count[${arr[i]}] = ${count[arr[i] - min]}`,
      comparisons: ++comparisons,
      swaps,
    }
  }

  // Kumulative Zählung
  for (let i = 1; i < range; i++) count[i] += count[i - 1]

  yield {
    bars: [...arr],
    states: arr.map(() => 'pivot'),
    description: 'Kumulative Zählungen berechnet — platziere Elemente in Ausgabe',
    comparisons,
    swaps,
  }

  // Ausgabe rückwärts aufbauen (für Stabilität)
  for (let i = n - 1; i >= 0; i--) {
    const pos = --count[arr[i] - min]
    output[pos] = arr[i]
    swaps++
    yield {
      bars: output.map((v) => v ?? 0),
      states: output.map((v, idx) => {
        if (v === undefined) return 'default'
        if (idx === pos) return 'swapping'
        return 'sorted'
      }),
      description: `${arr[i]} an Ausgabeposition ${pos} gesetzt`,
      comparisons,
      swaps,
    }
  }

  for (let i = 0; i < n; i++) arr[i] = output[i]
  yield { bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array ist sortiert!', comparisons, swaps }
}
