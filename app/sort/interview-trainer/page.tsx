'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { interviewQuestions, InterviewQuestion } from '@/lib/interview-questions'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy } from 'lucide-react'
import { addXP } from '@/lib/skill-system'

const typeLabels: Record<string, string> = {
  explain: 'Erklären',
  complexity: 'Komplexität',
  compare: 'Vergleich',
  tradeoff: 'Abwägung',
}

const typeColors: Record<string, string> = {
  explain: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  complexity: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  compare: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  tradeoff: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
}

const filterOptions = [
  { label: 'Alle', value: 'all' },
  { label: 'Erklären', value: 'explain' },
  { label: 'Komplexität', value: 'complexity' },
  { label: 'Vergleich', value: 'compare' },
  { label: 'Abwägung', value: 'tradeoff' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function InterviewTrainerPage() {
  const [filter, setFilter] = useState('all')
  const [queue, setQueue] = useState<InterviewQuestion[]>(() =>
    shuffle(interviewQuestions)
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [finished, setFinished] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)

  const filteredQueue = filter === 'all' ? queue : queue.filter((q) => q.type === filter)
  const current = filteredQueue[currentIndex]
  const isAnswered = selected !== null

  const handleFilter = useCallback(
    (f: string) => {
      setFilter(f)
      setCurrentIndex(0)
      setSelected(null)
      setFinished(false)
    },
    []
  )

  const handleSelect = useCallback(
    (idx: number) => {
      if (isAnswered) return
      setSelected(idx)
      setScore((s) => ({
        correct: s.correct + (idx === current.correctIndex ? 1 : 0),
        total: s.total + 1,
      }))
    },
    [isAnswered, current]
  )

  useEffect(() => {
    if (!finished || score.total === 0) return
    const earned = Math.round((score.correct / score.total) * 100 * 0.8)
    setXpEarned(earned)
    if (earned > 0) addXP('algorithmen', earned)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= filteredQueue.length) {
      setFinished(true)
    } else {
      setCurrentIndex((i) => i + 1)
      setSelected(null)
    }
  }, [currentIndex, filteredQueue.length])

  const handleRestart = useCallback(() => {
    setQueue(shuffle(interviewQuestions))
    setCurrentIndex(0)
    setSelected(null)
    setScore({ correct: 0, total: 0 })
    setFinished(false)
  }, [])

  if (filteredQueue.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Interview Trainer</h1>
        <p className="text-muted-foreground mb-8">Keine Fragen für diesen Filter.</p>
        <Button variant="outline" onClick={() => handleFilter('all')}>Alle anzeigen</Button>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((score.correct / score.total) * 100)
    return (
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Interview Trainer</h1>
        <div className="mt-12 flex flex-col items-center gap-6 text-center max-w-md mx-auto">
          <Trophy className="h-16 w-16 text-yellow-500" />
          <div>
            <p className="text-2xl font-bold">{score.correct} / {score.total} richtig</p>
            <p className="text-4xl font-bold mt-1 text-primary">{pct}%</p>
          </div>
          <p className="text-muted-foreground">
            {pct >= 80
              ? 'Ausgezeichnet! Du beherrschst die Sortieralgorithmen.'
              : pct >= 60
              ? 'Gut gemacht! Ein paar Themen könnten noch vertieft werden.'
              : 'Weiter üben! Schau dir die Erklärungen auf den Algorithmus-Seiten an.'}
          </p>
          {xpEarned > 0 && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">+{xpEarned} XP Algorithmen</p>
          )}
          <Button onClick={handleRestart} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Neu starten
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Interview Trainer</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
        Teste dein Wissen über Sortieralgorithmen mit typischen Prüfungs- und Bewerbungsfragen.
      </p>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleFilter(opt.value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
              filter === opt.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-input bg-background hover:bg-accent'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
        <span>Frage {currentIndex + 1} von {filteredQueue.length}</span>
        <span>{score.correct} richtig von {score.total} beantwortet</span>
      </div>
      <div className="w-full h-1.5 bg-accent rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${((currentIndex) / filteredQueue.length) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <div className="rounded-xl border bg-card p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', typeColors[current.type])}>
            {typeLabels[current.type]}
          </span>
        </div>
        <p className="text-lg font-semibold leading-snug">{current.question}</p>
      </div>

      {/* Options */}
      <div className="grid gap-3 mb-6">
        {current.options.map((option, idx) => {
          const isCorrect = idx === current.correctIndex
          const isSelected = idx === selected

          let classes = 'rounded-lg border p-4 text-sm text-left w-full transition-colors cursor-pointer'

          if (!isAnswered) {
            classes += ' hover:bg-accent hover:border-accent-foreground/20'
          } else if (isCorrect) {
            classes += ' border-green-500 bg-green-500/10 text-green-700 dark:text-green-300'
          } else if (isSelected) {
            classes += ' border-red-500 bg-red-500/10 text-red-700 dark:text-red-300'
          } else {
            classes += ' opacity-50'
          }

          return (
            <button key={idx} className={classes} onClick={() => handleSelect(idx)} disabled={isAnswered}>
              <div className="flex items-start gap-3">
                <span className="font-bold shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="flex-1">{option}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {isAnswered && (
        <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4 mb-6 text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
          <span className="font-semibold">Erklärung: </span>
          {current.explanation}
        </div>
      )}

      {/* Next button */}
      {isAnswered && (
        <Button onClick={handleNext} className="gap-2">
          {currentIndex + 1 >= filteredQueue.length ? 'Ergebnis anzeigen' : 'Nächste Frage'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
