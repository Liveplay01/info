'use client'

import React, { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { algorithms } from '@/lib/algorithm-registry'
import { computeDiff, DiffLine } from '@/lib/code-diff'
import { cn } from '@/lib/utils'
import { GitCompare, ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

function DiffPanel({ lines, title }: { lines: DiffLine[]; title: string }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <div className="text-sm font-medium px-4 py-2 border-b bg-muted/50 rounded-t-lg">
        {title}
      </div>
      <div className="overflow-auto rounded-b-lg border border-t-0 bg-[#0d1117] text-[#e6edf3]">
        <pre className="text-xs leading-5 font-mono p-0 m-0">
          {lines.map((line, i) => {
            const bg =
              line.type === 'add'
                ? 'bg-green-950/60'
                : line.type === 'remove'
                ? 'bg-red-950/60'
                : line.type === 'empty'
                ? 'bg-transparent'
                : ''

            const textColor =
              line.type === 'add'
                ? 'text-green-300'
                : line.type === 'remove'
                ? 'text-red-300'
                : 'text-[#e6edf3]'

            const prefix =
              line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '

            return (
              <div key={i} className={cn('flex items-start px-0', bg)}>
                <span className="select-none w-10 shrink-0 text-right pr-3 text-[#6e7681] border-r border-[#30363d] py-0.5 pl-2 text-[11px]">
                  {line.lineNum ?? ''}
                </span>
                <span className={cn('select-none w-5 shrink-0 text-center py-0.5', textColor)}>
                  {line.type !== 'empty' ? prefix : ''}
                </span>
                <span className={cn('py-0.5 pr-4 whitespace-pre flex-1', textColor)}>
                  {line.text}
                </span>
              </div>
            )
          })}
        </pre>
      </div>
    </div>
  )
}

function CodeDiffContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const defaultA = searchParams.get('a') ?? algorithms[4].slug  // quick-sort
  const defaultB = searchParams.get('b') ?? algorithms[3].slug  // merge-sort

  const [algoA, setAlgoA] = useState(defaultA)
  const [algoB, setAlgoB] = useState(defaultB)

  useEffect(() => {
    const a = searchParams.get('a')
    const b = searchParams.get('b')
    if (a) setAlgoA(a)
    if (b) setAlgoB(b)
  }, [searchParams])

  const updateParam = (key: 'a' | 'b', value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.replace(`?${params.toString()}`, { scroll: false })
    if (key === 'a') setAlgoA(value)
    else setAlgoB(value)
  }

  const swap = () => {
    const params = new URLSearchParams()
    params.set('a', algoB)
    params.set('b', algoA)
    router.replace(`?${params.toString()}`, { scroll: false })
    setAlgoA(algoB)
    setAlgoB(algoA)
  }

  const metaA = algorithms.find((a) => a.slug === algoA) ?? algorithms[4]
  const metaB = algorithms.find((a) => a.slug === algoB) ?? algorithms[3]

  const { left, right } = useMemo(
    () => computeDiff(metaA.codeTS, metaB.codeTS),
    [metaA.codeTS, metaB.codeTS]
  )

  const addCount = right.filter((l) => l.type === 'add').length
  const removeCount = left.filter((l) => l.type === 'remove').length
  const sameCount = left.filter((l) => l.type === 'same').length

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold tracking-tight">Code-Diff Viewer</h1>
      </div>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
        Vergleiche zwei Sortieralgorithmen nebeneinander und sieh auf einen Blick, wo sich die Logik unterscheidet.
      </p>

      {/* Selectors */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={algoA}
          onChange={(e) => updateParam('a', e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {algorithms.map((a) => (
            <option key={a.slug} value={a.slug}>{a.name}</option>
          ))}
        </select>

        <Button variant="ghost" size="icon" onClick={swap} title="Tauschen" className="h-9 w-9">
          <ArrowLeftRight className="h-4 w-4" />
        </Button>

        <select
          value={algoB}
          onChange={(e) => updateParam('b', e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {algorithms.map((a) => (
            <option key={a.slug} value={a.slug}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-xs mb-4 text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-500/70" />
          {addCount} Zeilen hinzugefügt
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-500/70" />
          {removeCount} Zeilen entfernt
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-muted border" />
          {sameCount} gleiche Zeilen
        </span>
      </div>

      {/* Same algorithm notice */}
      {algoA === algoB && (
        <div className="rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30 p-4 mb-6 text-sm text-yellow-900 dark:text-yellow-200">
          Beide Seiten zeigen denselben Algorithmus. Wähle zwei verschiedene Algorithmen für einen aussagekräftigen Vergleich.
        </div>
      )}

      {/* Diff panels */}
      <div className="flex flex-col lg:flex-row gap-4">
        <DiffPanel lines={left} title={metaA.name} />
        <DiffPanel lines={right} title={metaB.name} />
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-6 text-xs text-muted-foreground">
        <span><strong className="text-red-400">−</strong> Nur in {metaA.name}</span>
        <span><strong className="text-green-400">+</strong> Nur in {metaB.name}</span>
        <span><strong>·</strong> Identisch in beiden</span>
      </div>
    </div>
  )
}

export default function CodeDiffPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center gap-2 text-muted-foreground">
        <GitCompare className="h-5 w-5" />
        <span>Lade Diff Viewer…</span>
      </div>
    }>
      <CodeDiffContent />
    </Suspense>
  )
}
