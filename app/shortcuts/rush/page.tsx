'use client'

import { useState, useEffect, useCallback, useRef, Fragment } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Trophy, RotateCcw, Zap } from 'lucide-react'
import { Header } from '@/components/header'
import { shortcuts, categoryConfig, type WindowsShortcut } from '@/lib/windows-shortcuts'
import { WORKFLOWS, type Workflow } from '@/lib/shortcut-rush-workflows'
import { playCorrect, playWrong, playTick, playGameOver, playClick } from '@/lib/sounds'
import { addXP } from '@/lib/skill-system'
import { cn } from '@/lib/utils'

// ── Key display ──────────────────────────────────────────────────────────────

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

// ── Game logic ───────────────────────────────────────────────────────────────

const GAME_DURATION = 90
const FEEDBACK_DELAY = 600

function getShortcutById(id: string): WindowsShortcut | undefined {
  return shortcuts.find(s => s.id === id)
}

function makeDistractors(correct: WindowsShortcut, count = 3): WindowsShortcut[] {
  const used = new Set([correct.id])
  const result: WindowsShortcut[] = []
  const sameCat = shortcuts.filter(s => s.category === correct.category && !used.has(s.id))
  const diffCat = shortcuts.filter(s => s.category !== correct.category && !used.has(s.id))

  const fromSame = Math.min(1 + Math.floor(Math.random() * 2), sameCat.length)
  const sameShuffle = [...sameCat].sort(() => Math.random() - 0.5)
  for (let i = 0; i < fromSame && result.length < count; i++) {
    result.push(sameShuffle[i])
    used.add(sameShuffle[i].id)
  }
  const diffShuffle = [...diffCat].sort(() => Math.random() - 0.5)
  for (let i = 0; result.length < count && i < diffShuffle.length; i++) {
    if (!used.has(diffShuffle[i].id)) {
      result.push(diffShuffle[i])
      used.add(diffShuffle[i].id)
    }
  }
  return result
}

function getWorkflowsByDifficulty(diff: 1 | 2 | 3): Workflow[] {
  return WORKFLOWS.filter(w => w.difficulty <= diff)
}

function pickWorkflow(pool: Workflow[]): Workflow {
  return pool[Math.floor(Math.random() * pool.length)]
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ShortcutRushPage() {
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(2)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'result'>('idle')

  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null)
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [options, setOptions] = useState<WindowsShortcut[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const [score, setScore] = useState(0)
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
  const [comboMultiplier, setComboMultiplier] = useState(1)
  const [completedWorkflows, setCompletedWorkflows] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [xpEarned, setXpEarned] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const scoreRef = useRef(0)
  const completedRef = useRef(0)

  useEffect(() => { scoreRef.current = score }, [score])
  useEffect(() => { completedRef.current = completedWorkflows }, [completedWorkflows])

  const endGame = useCallback(() => {
    setPhase('result')
    playGameOver()
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    if (phase !== 'result') return
    const earned = Math.round(scoreRef.current * 0.8) + completedRef.current * 15
    setXpEarned(earned)
    if (earned > 0) addXP('effizienz', earned)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { endGame(); return 0 }
        if (t <= 6) playTick()
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase, endGame])

  function loadStep(workflow: Workflow, stepIdx: number) {
    const step = workflow.steps[stepIdx]
    if (!step) return
    const correct = getShortcutById(step.shortcutId)
    if (!correct) return
    const distractors = makeDistractors(correct)
    setOptions([correct, ...distractors].sort(() => Math.random() - 0.5))
    setSelected(null)
    setIsAnswered(false)
  }

  function startNewWorkflow(pool: Workflow[]) {
    const wf = pickWorkflow(pool)
    setCurrentWorkflow(wf)
    setCurrentStepIdx(0)
    loadStep(wf, 0)
  }

  function startGame() {
    playClick()
    const pool = getWorkflowsByDifficulty(difficulty)
    setScore(0)
    setConsecutiveCorrect(0)
    setComboMultiplier(1)
    setCompletedWorkflows(0)
    setTimeLeft(GAME_DURATION)
    setXpEarned(0)
    setPhase('playing')
    const wf = pickWorkflow(pool)
    setCurrentWorkflow(wf)
    setCurrentStepIdx(0)
    const step = wf.steps[0]
    const correct = getShortcutById(step.shortcutId)
    if (!correct) return
    const distractors = makeDistractors(correct)
    setOptions([correct, ...distractors].sort(() => Math.random() - 0.5))
    setSelected(null)
    setIsAnswered(false)
  }

  function handleAnswer(opt: WindowsShortcut) {
    if (isAnswered || !currentWorkflow || phase !== 'playing') return
    setSelected(opt.id)
    setIsAnswered(true)

    const step = currentWorkflow.steps[currentStepIdx]
    const isCorrect = opt.id === step.shortcutId

    if (isCorrect) {
      playCorrect()
      const newConsecutive = consecutiveCorrect + 1
      const newMultiplier = 1 + Math.floor(newConsecutive / 3)
      setConsecutiveCorrect(newConsecutive)
      setComboMultiplier(newMultiplier)
      setScore(s => s + 10 * newMultiplier)
    } else {
      playWrong()
      setConsecutiveCorrect(0)
      setComboMultiplier(1)
    }

    setTimeout(() => {
      const nextStepIdx = currentStepIdx + 1
      const pool = getWorkflowsByDifficulty(difficulty)

      if (nextStepIdx >= currentWorkflow.steps.length) {
        // Workflow complete
        if (isCorrect) setCompletedWorkflows(c => c + 1)
        startNewWorkflow(pool)
      } else {
        setCurrentStepIdx(nextStepIdx)
        loadStep(currentWorkflow, nextStepIdx)
      }
    }, FEEDBACK_DELAY)
  }

  const timerPct = (timeLeft / GAME_DURATION) * 100
  const timerColor = timeLeft > 10 ? 'bg-violet-500' : timeLeft > 5 ? 'bg-amber-500' : 'bg-rose-500'

  // ── Idle ─────────────────────────────────────────────────────────────────

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
            <div className="font-mono text-sm font-semibold text-violet-600 dark:text-violet-400 mb-3">⟨keys/⟩</div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Shortcut Rush</h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Kein isoliertes Ratespiel — echte Workflows! Mehrere Shortcuts hintereinander korrekt = Combo-Multiplikator.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-4 text-xs text-muted-foreground">
              <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-medium">Combo 3× = 2x Punkte</span>
              <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-medium">Combo 6× = 3x Punkte</span>
            </div>

            <div className="flex justify-center gap-2 mb-8">
              {([1, 2, 3] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  className={cn(
                    'px-5 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all',
                    difficulty === lvl
                      ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-500/20'
                      : 'border-border bg-card hover:border-violet-400/60'
                  )}
                >
                  {lvl === 1 ? '🟢 Leicht' : lvl === 2 ? '🟡 Mittel' : '🔴 Schwer'}
                  <span className="block text-xs font-normal opacity-70 mt-0.5">
                    {lvl === 1 ? '2-Schritt' : lvl === 2 ? '2-3 Schritte' : '2-5 Schritte'}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={startGame}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg shadow-lg shadow-violet-500/20 transition-colors"
              >
                Rush starten
              </motion.button>
              <Link
                href="/shortcuts"
                className="px-8 py-3.5 rounded-xl border-2 border-border bg-card hover:border-violet-400/60 font-semibold transition-all text-center"
              >
                Shortcut-Bibliothek
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  // ── Result ────────────────────────────────────────────────────────────────

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
            <h2 className="text-3xl font-bold mb-2">Rush beendet!</h2>
            <p className="text-muted-foreground mb-8">Deine Workflow-Bilanz:</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Punkte', value: score, icon: '⭐' },
                { label: 'Workflows', value: completedWorkflows, icon: '⚡' },
                { label: 'Max Combo', value: `${comboMultiplier}x`, icon: '🔥' },
                { label: 'XP erhalten', value: `+${xpEarned}`, icon: '✨' },
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

  // ── Game screen ────────────────────────────────────────────────────────────

  if (!currentWorkflow) return null
  const currentStep = currentWorkflow.steps[currentStepIdx]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 py-6 sm:py-10 max-w-2xl mx-auto w-full">

        {/* HUD */}
        <div className="w-full mb-4">
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
            <span className={cn('font-mono font-bold text-2xl tabular-nums transition-colors', timeLeft <= 5 ? 'text-rose-500' : timeLeft <= 10 ? 'text-amber-500' : 'text-foreground')}>
              {timeLeft}s
            </span>

            {/* Combo */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={comboMultiplier}
                initial={comboMultiplier > 1 ? { scale: 1.4, color: 'hsl(271 81% 56%)' } : {}}
                animate={{ scale: 1, color: comboMultiplier > 1 ? 'hsl(271 81% 56%)' : 'hsl(var(--foreground))' }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1.5 font-bold text-xl tabular-nums"
              >
                <Flame className={cn('h-5 w-5', comboMultiplier > 1 ? 'text-violet-500' : 'text-muted-foreground')} />
                <span>{comboMultiplier}x</span>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-colors ${timerColor}`}
              animate={{ width: `${timerPct}%` }}
              transition={{ duration: 0.9, ease: 'linear' }}
            />
          </div>
        </div>

        {/* Workflow card */}
        <div className="w-full rounded-xl border bg-muted/30 px-5 py-3 mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Workflow</p>
            <p className="text-sm font-bold">{currentWorkflow.title}</p>
          </div>
          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {currentWorkflow.steps.map((_, i) => (
              <div key={i} className={cn('h-2 w-2 rounded-full transition-colors', i < currentStepIdx ? 'bg-emerald-500' : i === currentStepIdx ? 'bg-violet-500' : 'bg-muted-foreground/30')} />
            ))}
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentWorkflow.id}-${currentStepIdx}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <div className="rounded-2xl border-2 border-border bg-card px-6 py-8 mb-6 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
                Schritt {currentStepIdx + 1} von {currentWorkflow.steps.length}
              </p>
              <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                {currentStep.contextPrompt}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((opt) => {
                const isSelected = selected === opt.id
                const isCorrect = opt.id === currentStep.shortcutId
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
                      showCorrect ? { backgroundColor: 'hsl(142 71% 45% / 0.15)', borderColor: 'hsl(142 71% 45%)' }
                      : showWrong  ? { backgroundColor: 'hsl(0 72% 51% / 0.12)', borderColor: 'hsl(0 72% 51%)' }
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
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
