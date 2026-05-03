'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, RotateCcw, Zap, Terminal } from 'lucide-react'
import { Header } from '@/components/header'
import { cmdCommands, categoryConfig, type CmdCommand, type CmdCategory } from '@/lib/cmd-commands'
import { playCorrect, playWrong, playTick, playGameOver, playClick } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { addXP } from '@/lib/skill-system'

// ── Game logic ──────────────────────────────────────────────────────────────

function weightedRandom(pool: CmdCommand[]): CmdCommand {
  const total = pool.reduce((s, x) => s + x.frequency, 0)
  let r = Math.random() * total
  for (const x of pool) {
    r -= x.frequency
    if (r <= 0) return x
  }
  return pool[pool.length - 1]
}

interface Question {
  correct: CmdCommand
  options: CmdCommand[]
}

function buildQuestion(askedIds: Set<string>): Question {
  const remaining = cmdCommands.filter(c => !askedIds.has(c.id))
  const pool = remaining.length > 0 ? remaining : cmdCommands

  const correct = weightedRandom(pool)
  askedIds.add(correct.id)

  const used = new Set([correct.id])
  const distractors: CmdCommand[] = []

  const sameCat = cmdCommands.filter(c => c.category === correct.category && !used.has(c.id))
  const diffCat = cmdCommands.filter(c => c.category !== correct.category && !used.has(c.id))

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

// ── Category badge ──────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: CmdCategory }) {
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

// ── Command display ──────────────────────────────────────────────────────────

function CmdBadge({ syntax, large }: { syntax: string; large?: boolean }) {
  return (
    <code className={cn(
      'font-mono font-bold rounded-lg border-2 border-border bg-muted px-3 py-1.5 text-foreground break-all',
      large ? 'text-base' : 'text-sm',
    )}>
      {syntax}
    </code>
  )
}

// ── Constants ───────────────────────────────────────────────────────────────

const GAME_DURATION = 60
const FEEDBACK_DELAY = 680

// ── Main page ───────────────────────────────────────────────────────────────

export default function CmdTrainerPage() {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'result'>('idle')
  const askedIdsRef = useRef<Set<string>>(new Set())
  const [question, setQuestion] = useState<Question>(() => buildQuestion(new Set()))
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
    askedIdsRef.current = new Set()
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setTotalCorrect(0)
    setTotalAsked(0)
    setTimeLeft(GAME_DURATION)
    setSelected(null)
    setIsAnswered(false)
    setQuestion(buildQuestion(askedIdsRef.current))
    setPhase('playing')
  }

  useEffect(() => {
    if (phase !== 'result') return
    const xpEarned = Math.round(score * 0.5)
    if (xpEarned > 0) addXP('cmd', xpEarned)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

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

  function handleAnswer(opt: CmdCommand) {
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
      setQuestion(buildQuestion(askedIdsRef.current))
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
            <div className="font-mono text-sm font-semibold text-green-600 dark:text-green-400 mb-3">
              C:\&gt;_
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">CMD Trainer</h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Sieh die Beschreibung — wähle den richtigen Befehl. {GAME_DURATION} Sekunden, so viele wie möglich.
            </p>

            {/* Preview of commands */}
            <div className="flex flex-wrap justify-center gap-3 mb-10 opacity-60">
              {['cd [Pfad]', 'dir', 'mkdir [Name]', 'ipconfig /all'].map((cmd, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <code className="font-mono text-sm bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground">
                    {cmd}
                  </code>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={startGame}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-lg shadow-green-500/20 transition-colors"
              >
                Training starten
              </motion.button>
              <Link
                href="/games"
                className="px-8 py-3.5 rounded-xl border-2 border-border bg-card hover:border-green-400/60 font-semibold transition-all text-center"
              >
                Zur Spielhalle
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
              🖥️
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">Zeit abgelaufen!</h2>
            <p className="text-muted-foreground mb-8">Deine CMD-Bilanz:</p>

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
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-lg shadow-green-500/20 transition-colors"
              >
                <RotateCcw className="h-5 w-5" /> Nochmal
              </motion.button>
              <Link
                href="/games"
                className="px-8 py-3.5 rounded-xl border-2 border-border bg-card hover:border-green-400/60 font-semibold transition-all text-center"
              >
                Zur Spielhalle
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  // ── Game screen ──────────────────────────────────────────────────────────

  const timerPercent = (timeLeft / GAME_DURATION) * 100
  const timerColor = timeLeft > 10 ? 'bg-green-500' : timeLeft > 5 ? 'bg-amber-500' : 'bg-rose-500'

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 py-6 sm:py-10 max-w-2xl mx-auto w-full">

        {/* HUD */}
        <div className="w-full mb-6">
          <div className="flex items-center justify-between mb-2">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={score}
                initial={{ scale: 1.3, color: 'hsl(142 71% 45%)' }}
                animate={{ scale: 1, color: 'hsl(var(--foreground))' }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1.5 font-bold text-xl tabular-nums"
              >
                <Zap className="h-5 w-5 text-green-500" />
                {score}
              </motion.div>
            </AnimatePresence>

            <span className={cn(
              'font-mono font-bold text-2xl tabular-nums transition-colors',
              timeLeft <= 5 ? 'text-rose-500' : timeLeft <= 10 ? 'text-amber-500' : 'text-foreground',
            )}>
              {timeLeft}s
            </span>

            <div className="flex items-center gap-1.5 font-bold text-xl tabular-nums">
              <Flame className={cn('h-5 w-5', streak > 0 ? 'text-orange-500' : 'text-muted-foreground')} />
              <span>{streak}</span>
            </div>
          </div>

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
                Welcher Befehl?
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">
                {question.correct.description}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto font-mono">
                Beispiel: {question.correct.example}
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
                      'relative flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 transition-colors',
                      !isAnswered && 'hover:border-green-400/60 hover:shadow-md cursor-pointer',
                      !showCorrect && !showWrong && 'border-border bg-card',
                      isAnswered && 'cursor-not-allowed',
                    )}
                  >
                    <CmdBadge syntax={opt.syntax} large />
                    <span className="text-xs text-muted-foreground">{opt.command}</span>

                    <AnimatePresence>
                      {showCorrect && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 text-emerald-500 font-bold text-sm">✓</motion.span>
                      )}
                      {showWrong && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 text-rose-500 font-bold text-sm">✗</motion.span>
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
