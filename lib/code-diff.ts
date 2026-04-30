export type DiffLineType = 'same' | 'add' | 'remove' | 'empty'

export interface DiffLine {
  type: DiffLineType
  text: string
  lineNum: number | null
}

export interface DiffResult {
  left: DiffLine[]
  right: DiffLine[]
}

function computeLCS(a: string[], b: string[]): number[][] {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }
  return dp
}

type RawEdit = { type: 'same' | 'add' | 'remove'; text: string }

function buildEdits(dp: number[][], a: string[], b: string[]): RawEdit[] {
  const edits: RawEdit[] = []
  let i = a.length
  let j = b.length
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      edits.push({ type: 'same', text: a[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      edits.push({ type: 'add', text: b[j - 1] })
      j--
    } else {
      edits.push({ type: 'remove', text: a[i - 1] })
      i--
    }
  }
  return edits.reverse()
}

export function computeDiff(codeA: string, codeB: string): DiffResult {
  const linesA = codeA.split('\n')
  const linesB = codeB.split('\n')
  const dp = computeLCS(linesA, linesB)
  const edits = buildEdits(dp, linesA, linesB)

  const left: DiffLine[] = []
  const right: DiffLine[] = []
  let leftNum = 1
  let rightNum = 1

  for (const edit of edits) {
    if (edit.type === 'same') {
      left.push({ type: 'same', text: edit.text, lineNum: leftNum++ })
      right.push({ type: 'same', text: edit.text, lineNum: rightNum++ })
    } else if (edit.type === 'remove') {
      left.push({ type: 'remove', text: edit.text, lineNum: leftNum++ })
      right.push({ type: 'empty', text: '', lineNum: null })
    } else {
      left.push({ type: 'empty', text: '', lineNum: null })
      right.push({ type: 'add', text: edit.text, lineNum: rightNum++ })
    }
  }

  return { left, right }
}
