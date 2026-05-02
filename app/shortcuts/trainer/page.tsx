'use client'

import { useState, useEffect, useCallback, useRef, Fragment } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Flame, Trophy, RotateCcw, Zap } from 'lucide-react'
import { Header } from '@/components/header'
import { shortcuts, categoryConfig, type WindowsShortcut, type ShortcutCategory } from '@/lib/windows-shortcuts'
import { playCorrect, playWrong, playTick, playGameOver, playClick } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { addXP } from '@/lib/skill-system'

// ── Key display ─────────────────────────────────────────────────────────────

function KeyBadge({ children, large }: { children: string; large?: boolean }) {
  return (
    <kbd className={cn(
      'inline-flex items-center justify-center rounded-lg border-2 font-mono font-bold select-none',
      'bg-muted text-foreground border-border shadow-[0_3px_0_0_hsl(var(--border))]',
      large ? 'min-w-[3rem] h-12 px-3 text-base' : 'min-w-[2.5rem] h-10 px-2.5 text-sm',
    )}>
      {children}
    </kbd>
  )
}

function KeyCombo({ keys, large }: { keys: string[]; large?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-center">
      {keys.map((key, i) => (
        <Fragment key={i}>
          <KeyBadge large={large}>{key}</KeyBadge>
          {i < keys.length - 1 && (
            <span className="text-muted-foreground/60 font-mono text-sm select-none">+</span>
          )}
        </Fragment>
      ))}
    </div>
  )
}

// ── Game logic ──────────────────────────────────────────────────────────────

function weightedRandom(pool: WindowsShortcut[]): WindowsShortcut {
  const total = pool.reduce((s, x) => s + x.frequency, 0)
  let r = Math.random() * total
  for (const x of pool) {
    r -= x.frequency
    if (r <= 0) return x
  }
  return pool[pool.length - 1]
}

interface Question {
  correct: WindowsShortcut
  options: WindowsShortcut[]
}

function makeQuestion(): Question {
  const correct = weightedRandom(shortcuts)

  const used = new Set([correct.id])
  const distractors: WindowsShortcut[] = []

  // Prefer same-category distractors (harder), fill rest from other categories
  const sameCat = shortcuts.filter(s => s.category === correct.category && !used.has(s.id))
  const diffCat = shortcuts.filter(s => s.category !== correct.category && !used.has(s.id))

  const fromSame = Math.min(1 + Math.floor(Math.random() * 2), sameCat.length)
  const sameShuffle = [...sameCat].sort(() => Math.random() - 0.5)
  for (let i = 0; i < fromSame && distractors.length < 3; i++) {
    distractors.push(sameShuffle[i])
    used.add(sameShuffle[i].id)
  }

  const diffShuffle = [...diffCat].sort(() => Math.random() - 0.5)
  for (let i = 0; distractors.length < 3 && i < diffShuffle.length; i++) {
    if (!used.has(diffShuffle[i].id)) {
      distractors.push(diffShuffle[i])
      used.add(diffShuffle[i].id)
    }
  }

  const options = [correct, ...distractors].sort(() => Math.random() - 0.5)
  return { correct, options }
}

// ── CategoryBadge ───────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: ShortcutCategory }) {
  const cfg = categoryConfig[category]
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
      cfg.color, cfg.bg, cfg.border,
    )}>
      {category}
    </span>
  )
}

// ── Constants ───────────────────────────────────────────────────────────────

const GAME_DURATION = 60
const FEEDBACK_DELAY = 680

// ── Main page ───────────────────────────────────────────────────────────────

export default function TrainerPage() {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'result'>('idle')
  const [question, setQuestion] = useState<Question>(makeQuestion)
  const [selected, setSelected] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [totalAsked, setTotalAsked] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const endGame = useCallback(() => {
    setPhase('result')
    playGameOver()
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])


  function startGame() {
    playClick()
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setTotalCorrect(0)
    setTotalAsked(0)
    setTimeLeft(GAME_DURATION)
    setSelected(null)
    setIsAnswered(false)
    setQuestion(makeQuestion())
    setPhase('playing')
  }

  // Award XP when game ends
  useEffect(() => {
    if (phase !== 'result') return
    const xpEarned = Math.round(score * 0.5)
    if (xpEarned > 0) addXP('shortcuts', xpEarned)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // Countdown timer
  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { endGame(); return 0 }
        if (t <= 6) playTick()
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase, endGame])

  function handleAnswer(opt: WindowsShortcut) {
    if (isAnswered || phase !== 'playing') return
    setSelected(opt.id)
    setIsAnswered(true)
    setTotalAsked((t) => t + 1)

    if (opt.id === question.correct.id) {
      playCorrect()
      const newStreak = streak + 1
      const bonus = Math.floor(newStreak / 3) * 5
      setScore((s) => s + 10 + bonus)
      setStreak(newStreak)
      setBestStreak((b) => Math.max(b, newStreak))
      setTotalCorrect((c) => c + 1)
    } else {
      playWrong()
      setStreak(0)
    }

    setTimeout(() => {
      setSelected(null)
      setIsAnswered(false)
      setQuestion(makeQuestion())
    }, FEEDBACK_DELAY)
  }

  const accuracy = totalAsked > 0 ? Math.round((totalCorrect / totalAsked) * 100) : 0

  // ── Idle screen ─────────────────────────────────────────────────────────

  if (phase === 'idle') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full"
          >
            <div className="font-mono text-sm font-semibold text-violet-600 dark:text-violet-400 mb-3">
              ⟨trainer/⟩
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Shortcut Trainer</h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Sieh die Beschreibung — wähle die richtige Tastenkombination. {GAME_DURATION} Sekunden, so viele wie möglich.
            </p>

            {/* Preview of key combos */}
            <div className="flex flex-wrap justify-center gap-4 mb-10 opacity-60">
              {[['Ctrl','C'], ['Win','L'], ['Alt','Tab'], ['Ctrl','Shift','Esc']].map((keys, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <KeyCombo keys={keys} />
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={startGame}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg shadow-lg shadow-violet-500/20 transition-colors"
              >
                Starten
              </motion.button>
              <Link
                href="/shortcuts"
                className="px-8 py-3.5 rounded-xl border-2 border-border bg-card hover:border-violet-400/60 font-semibold transition-all text-center"
              >
                Zur Shortcut-Bibliothek
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  // ── Result screen ────────────────────────────────────────────────────────

  if (phase === 'result') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="max-w-md w-full"
          >
            <motion.div
              animate={{ rotate: [0, -12, 12, -6, 6, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl mb-6"
            >
              🏆
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">Zeit abgelaufen!</h2>
            <p className="text-muted-foreground mb-8">So lief deine Runde:</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Punkte', value: score, icon: '⭐' },
                { label: 'Genauigkeit', value: `${accuracy}%`, icon: '🎯' },
                { label: 'Fragen', value: totalAsked, icon: '❓' },
                { label: 'Beste Serie', value: bestStreak, icon: '🔥' },
                { label: 'XP erhalten', value: `+${Math.round(score * 0.5)}`, icon: '✨' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3, type: 'spring', stiffness: 220, damping: 22 }}
                  className="rounded-xl border-2 border-border bg-card p-5"
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={startGame}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg shadow-lg shadow-violet-500/20 transition-colors"
              >
                <RotateCcw className="h-5 w-5" /> Nochmal
              </motion.button>
              <Link
                href="/shortcuts"
                className="px-8 py-3.5 rounded-xl border-2 border-border bg-card hover:border-violet-400/60 font-semibold transition-all text-center"
              >
                Zur Bibliothek
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  // ── Game screen ──────────────────────────────────────────────────────────

  const timerPercent = (timeLeft / GAME_DURATION) * 100
  const timerColor = timeLeft > 10 ? 'bg-violet-500' : timeLeft > 5 ? 'bg-amber-500' : 'bg-rose-500'

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 py-6 sm:py-10 max-w-2xl mx-auto w-full">

        {/* HUD */}
        <div className="w-full mb-6">
          <div className="flex items-center justify-between mb-2">
            {/* Score */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={score}
                initial={{ scale: 1.3, color: 'hsl(142 71% 45%)' }}
                animate={{ scale: 1, color: 'hsl(var(--foreground))' }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1.5 font-bold text-xl tabular-nums"
              >
                <Zap className="h-5 w-5 text-violet-500" />
                {score}
              </motion.div>
            </AnimatePresence>

            {/* Timer */}
            <div className="flex items-center gap-2">
              <span className={cn(
                'font-mono font-bold text-2xl tabular-nums transition-colors',
                timeLeft <= 5 ? 'text-rose-500' : timeLeft <= 10 ? 'text-amber-500' : 'text-foreground',
              )}>
                {timeLeft}s
              </span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5 font-bold text-xl tabular-nums">
              <Flame className={cn('h-5 w-5', streak > 0 ? 'text-orange-500' : 'text-muted-foreground')} />
              <span>{streak}</span>
            </div>
          </div>

          {/* Timer bar */}
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-colors ${timerColor}`}
              animate={{ width: `${timerPercent}%` }}
              transition={{ duration: 0.9, ease: 'linear' }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.correct.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {/* Question card */}
            <div className="rounded-2xl border-2 border-border bg-card px-6 py-8 mb-6 text-center">
              <div className="flex justify-center mb-4">
                <CategoryBadge category={question.correct.category} />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
                Welche Tastenkombination?
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">
                {question.correct.name}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                {question.correct.shortDesc}
              </p>
            </div>

            {/* Answer options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options.map((opt) => {
                const isSelected = selected === opt.id
                const isCorrect = opt.id === question.correct.id
                const showCorrect = isAnswered && isCorrect
                const showWrong = isAnswered && isSelected && !isCorrect

                return (
                  <motion.button
                    key={opt.id}
                    onClick={() => handleAnswer(opt)}
                    disabled={isAnswered}
                    whileHover={isAnswered ? {} : { scale: 1.02 }}
                    whileTap={isAnswered ? {} : { scale: 0.97 }}
                    animate={
                      showCorrect
                        ? { backgroundColor: 'hsl(142 71% 45% / 0.15)', borderColor: 'hsl(142 71% 45%)' }
                        : showWrong
                        ? { backgroundColor: 'hsl(0 72% 51% / 0.12)', borderColor: 'hsl(0 72% 51%)' }
                        : {}
                    }
                    transition={{ duration: 0.15 }}
                    className={cn(
                      'relative flex flex-col items-center justify-center gap-3 p-5 rounded-xl border-2 transition-colors',
                      !isAnswered && 'hover:border-violet-400/60 hover:shadow-md cursor-pointer',
                      !showCorrect && !showWrong && 'border-border bg-card',
                      isAnswered && 'cursor-not-allowed',
                    )}
                  >
                    <KeyCombo keys={opt.keys} large />

                    {/* Feedback icon */}
                    <AnimatePresence>
                      {showCorrect && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 text-emerald-500 font-bold text-sm"
                        >
                          ✓
                        </motion.span>
                      )}
                      {showWrong && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 text-rose-500 font-bold text-sm"
                        >
                          ✗
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )
              })}
            </div>

            {/* Stats row */}
            <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
              <span>{totalAsked} Fragen</span>
              <span>{totalCorrect} Richtig</span>
              <span>{accuracy}% Genauigkeit</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
