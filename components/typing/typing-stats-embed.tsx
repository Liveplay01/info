'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Keyboard, Trophy, Zap, BarChart2 } from 'lucide-react'

interface TypingProgress {
  totalXP: number
  personalBests: Record<string, number>
  totalRounds: number
  lastPlayed?: string
}

function totalXpForLevel(n: number): number {
  return ((n * (n + 1)) / 2) * 100
}

function getLevelInfo(totalXP: number) {
  let level = 1
  while (totalXpForLevel(level + 1) <= totalXP) level++
  const progressXP = totalXP - totalXpForLevel(level)
  const neededXP = (level + 1) * 100
  const names = [
    '',
    'Anfänger',
    'Lernender',
    'Geübter',
    'Fortgeschrittener',
    'Experte',
    'Meister',
    'Virtuose',
    'Legende',
    'Champion',
    'Grandmaster',
  ]
  return {
    level,
    progressXP,
    neededXP,
    name: names[Math.min(level, names.length - 1)],
  }
}

function getBestWPM(personalBests: Record<string, number>): number {
  const values = Object.values(personalBests)
  return values.length > 0 ? Math.max(...values) : 0
}

export function TypingStatsEmbed() {
  const [data, setData] = useState<{
    info: ReturnType<typeof getLevelInfo>
    bestWPM: number
    totalRounds: number
  } | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('typing-progress')
      if (raw) {
        const p: TypingProgress = JSON.parse(raw)
        if (p.totalRounds > 0) {
          setData({
            info: getLevelInfo(p.totalXP),
            bestWPM: getBestWPM(p.personalBests),
            totalRounds: p.totalRounds,
          })
        }
      }
    } catch {}
    setLoaded(true)
  }, [])

  if (!loaded) return null

  if (!data) {
    return (
      <div className="rounded-xl border-2 border-dashed border-border bg-card p-6 text-center">
        <Keyboard className="h-8 w-8 mx-auto text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium mb-1">Noch kein Spiel gespielt</p>
        <p className="text-xs text-muted-foreground mb-4">
          Starte deinen ersten Durchgang und sieh hier deinen Fortschritt.
        </p>
        <Link
          href="/typing/spiel"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 transition-colors"
        >
          Erstes Spiel starten →
        </Link>
      </div>
    )
  }

  const { info, bestWPM, totalRounds } = data
  const pct = Math.min(100, (info.progressXP / info.neededXP) * 100)

  return (
    <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 shrink-0">
          <Keyboard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground leading-none mb-0.5">Dein aktueller Stand</p>
          <p className="text-sm font-semibold leading-none">
            Level {info.level} · {info.name}
          </p>
        </div>
      </div>

      {/* XP bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>XP-Fortschritt</span>
          <span>
            {info.progressXP} / {info.neededXP} XP
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
          <Trophy className="h-4 w-4 text-yellow-500 mb-1" />
          <span className="text-lg font-bold tabular-nums">{bestWPM}</span>
          <span className="text-xs text-muted-foreground">Best WPM</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
          <BarChart2 className="h-4 w-4 text-blue-500 mb-1" />
          <span className="text-lg font-bold tabular-nums">{totalRounds}</span>
          <span className="text-xs text-muted-foreground">Runden</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
          <Zap className="h-4 w-4 text-emerald-500 mb-1" />
          <span className="text-lg font-bold tabular-nums">{info.level}</span>
          <span className="text-xs text-muted-foreground">Level</span>
        </div>
      </div>

      <Link
        href="/typing/spiel"
        className="flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 transition-colors"
      >
        Weiter üben →
      </Link>
    </div>
  )
}
