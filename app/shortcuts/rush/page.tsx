'use client'

import { useState, useEffect, useCallback, useRef, Fragment } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, RotateCcw, Zap, Keyboard } from 'lucide-react'
import { Header } from '@/components/header'
import { shortcuts, type WindowsShortcut } from '@/lib/windows-shortcuts'
import { WORKFLOWS, type Workflow } from '@/lib/shortcut-rush-workflows'
import { playCorrect, playWrong, playTick, playGameOver, playClick } from '@/lib/sounds'
import { addXP } from '@/lib/skill-system'
import { cn } from '@/lib/utils'

// ── Key display ──────────────────────────────────────────────────────────────

function KeyBadge({ children, large, pressed }: { children: string; large?: boolean; pressed?: boolean }) {
  return (
    <kbd className={cn(
      'inline-flex items-center justify-center rounded-lg border-2 font-mono font-bold select-none transition-all duration-75',
      large ? 'min-w-[3rem] h-12 px-3 text-base' : 'min-w-[2.5rem] h-10 px-2.5 text-sm',
      pressed
        ? 'bg-violet-500 text-white border-violet-600 shadow-[0_1px_0_0_hsl(271_81%_40%)] translate-y-[2px]'
        : 'bg-muted text-foreground border-border shadow-[0_3px_0_0_hsl(var(--border))]',
    )}>
      {children}
    </kbd>
  )
}

function KeyCombo({ keys, large, pressedKeys }: { keys: string[]; large?: boolean; pressedKeys?: Set<string> }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-center">
      {keys.map((key, i) => (
        <Fragment key={i}>
          <KeyBadge large={large} pressed={pressedKeys?.has(key)}>{key}</KeyBadge>
          {i < keys.length - 1 && (
            <span className="text-muted-foreground/60 font-mono text-sm select-none">+</span>
          )}
        </Fragment>
      ))}
    </div>
  )
}

// ── Key normalization ─────────────────────────────────────────────────────────

const KEY_MAP: Record<string, string> = {
  Control: 'Ctrl',
  Shift: 'Shift',
  Alt: 'Alt',
  Meta: 'Win',
  Escape: 'Esc',
  Delete: 'Entf',
  ArrowLeft: '←',
  ArrowRight: '→',
  ArrowUp: '↑',
  ArrowDown: '↓',
  Enter: 'Enter',
  Tab: 'Tab',
  Backspace: 'Backspace',
  ' ': 'Space',
  PrintScreen: 'Druck',
  Pause: 'Pause',
}

function normalizeKey(key: string): string {
  if (KEY_MAP[key]) return KEY_MAP[key]
  if (key.length === 1) return key.toUpperCase()
  return key
}

function combosMatch(pressed: string[], expected: string[]): boolean {
  if (pressed.length !== expected.length) return false
  const ps = new Set(pressed.map(k => k.toLowerCase()))
  return expected.every(k => ps.has(k.toLowerCase()))
}

// ── OS-trapped shortcuts (skip from Rush pool) ────────────────────────────────

const BROWSER_TRAPPED = new Set(['win-l', 'alt-f4', 'ctrl-w', 'ctrl-t', 'ctrl-n', 'ctrl-alt-del', 'ctrl-shift-delete'])

// ── Game constants ────────────────────────────────────────────────────────────

const GAME_DURATION = 90
const FEEDBACK_DELAY = 800
const STEP_TIMEOUT = 5000

function getShortcutById(id: string): WindowsShortcut | undefined {
  return shortcuts.find(s => s.id === id)
}

function getWorkflowsByDifficulty(diff: 1 | 2 | 3): Workflow[] {
  return WORKFLOWS.filter(w =>
    w.difficulty <= diff &&
    w.steps.every(step => !BROWSER_TRAPPED.has(step.shortcutId))
  )
}

function pickWorkflow(pool: Workflow[]): Workflow {
  return pool[Math.floor(Math.random() * pool.length)]
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ShortcutRushPage() {
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(2)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'result'>('idle')
  const [isTouchOnly, setIsTouchOnly] = useState(false)

  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null)
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [isAnswered, setIsAnswered] = useState(false)
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null)
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())

  const [score, setScore] = useState(0)
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
  const [comboMultiplier, setComboMultiplier] = useState(1)
  const [completedWorkflows, setCompletedWorkflows] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [stepTimeLeft, setStepTimeLeft] = useState(STEP_TIMEOUT / 1000)
  const [xpEarned, setXpEarned] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const modifiersRef = useRef<Set<string>>(new Set())
  const scoreRef = useRef(0)
  const completedRef = useRef(0)
  const consecutiveRef = useRef(0)
  const comboRef = useRef(1)
  const difficultyRef = useRef(difficulty)
  const currentWorkflowRef = useRef<Workflow | null>(null)
  const currentStepIdxRef = useRef(0)
  const isAnsweredRef = useRef(false)

  useEffect(() => { scoreRef.current = score }, [score])
  useEffect(() => { completedRef.current = completedWorkflows }, [completedWorkflows])
  useEffect(() => { consecutiveRef.current = consecutiveCorrect }, [consecutiveCorrect])
  useEffect(() => { comboRef.current = comboMultiplier }, [comboMultiplier])
  useEffect(() => { difficultyRef.current = difficulty }, [difficulty])
  useEffect(() => { currentWorkflowRef.current = currentWorkflow }, [currentWorkflow])
  useEffect(() => { currentStepIdxRef.current = currentStepIdx }, [currentStepIdx])
  useEffect(() => { isAnsweredRef.current = isAnswered }, [isAnswered])

  useEffect(() => {
    setIsTouchOnly('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches)
  }, [])

  const endGame = useCallback(() => {
    setPhase('result')
    playGameOver()
    if (timerRef.current) clearInterval(timerRef.current)
    if (stepTimerRef.current) clearInterval(stepTimerRef.current)
  }, [])

  useEffect(() => {
    if (phase !== 'result') return
    const earned = Math.round(scoreRef.current * 0.8) + completedRef.current * 15
    setXpEarned(earned)
    if (earned > 0) addXP('effizienz', earned)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // Global timer
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

  function startStepTimer() {
    if (stepTimerRef.current) clearInterval(stepTimerRef.current)
    setStepTimeLeft(STEP_TIMEOUT / 1000)
    let remaining = STEP_TIMEOUT / 1000
    stepTimerRef.current = setInterval(() => {
      remaining -= 1
      setStepTimeLeft(remaining)
      if (remaining <= 0) {
        clearInterval(stepTimerRef.current!)
        if (!isAnsweredRef.current) handleWrong()
      }
    }, 1000)
  }

  function handleCorrect(workflow: Workflow, stepIdx: number) {
    if (isAnsweredRef.current) return
    isAnsweredRef.current = true
    setIsAnswered(true)
    setLastCorrect(true)
    if (stepTimerRef.current) clearInterval(stepTimerRef.current)
    playCorrect()

    const newConsecutive = consecutiveRef.current + 1
    const newMultiplier = 1 + Math.floor(newConsecutive / 3)
    setConsecutiveCorrect(newConsecutive)
    setComboMultiplier(newMultiplier)
    setScore(s => s + 10 * newMultiplier)

    setTimeout(() => {
      const nextStepIdx = stepIdx + 1
      const pool = getWorkflowsByDifficulty(difficultyRef.current)

      if (nextStepIdx >= workflow.steps.length) {
        setCompletedWorkflows(c => c + 1)
        const wf = pickWorkflow(pool)
        setCurrentWorkflow(wf)
        setCurrentStepIdx(0)
        setIsAnswered(false)
        setLastCorrect(null)
        isAnsweredRef.current = false
        startStepTimer()
      } else {
        setCurrentStepIdx(nextStepIdx)
        setIsAnswered(false)
        setLastCorrect(null)
        isAnsweredRef.current = false
        startStepTimer()
      }
    }, FEEDBACK_DELAY)
  }

  function handleWrong() {
    if (isAnsweredRef.current) return
    isAnsweredRef.current = true
    setIsAnswered(true)
    setLastCorrect(false)
    if (stepTimerRef.current) clearInterval(stepTimerRef.current)
    playWrong()
    setConsecutiveCorrect(0)
    setComboMultiplier(1)

    setTimeout(() => {
      const pool = getWorkflowsByDifficulty(difficultyRef.current)
      const wf = pickWorkflow(pool)
      setCurrentWorkflow(wf)
      setCurrentStepIdx(0)
      setIsAnswered(false)
      setLastCorrect(null)
      isAnsweredRef.current = false
      startStepTimer()
    }, FEEDBACK_DELAY)
  }

  // Keyboard detection — derive modifiers from event properties (avoids stuck-key bugs)
  useEffect(() => {
    if (phase !== 'playing') return

    const MODIFIER_KEYS = new Set(['Control', 'Shift', 'Alt', 'Meta', 'OS'])

    function modifiersFromEvent(e: KeyboardEvent): string[] {
      const mods: string[] = []
      if (e.ctrlKey)  mods.push('Ctrl')
      if (e.shiftKey) mods.push('Shift')
      if (e.altKey)   mods.push('Alt')
      if (e.metaKey)  mods.push('Win')
      return mods
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Update visual pressed-keys display
      const visualMods = modifiersFromEvent(e)
      const isModifierPress = MODIFIER_KEYS.has(e.key)
      const displayKeys = isModifierPress
        ? visualMods
        : [...visualMods, normalizeKey(e.key)]
      setPressedKeys(new Set(displayKeys))

      if (isModifierPress) return

      e.preventDefault()

      const wf = currentWorkflowRef.current
      const stepIdx = currentStepIdxRef.current
      if (!wf || isAnsweredRef.current) return

      const normalizedKey = normalizeKey(e.key)
      const pressed = [...modifiersFromEvent(e), normalizedKey]

      const step = wf.steps[stepIdx]
      const correct = getShortcutById(step.shortcutId)
      if (!correct) return

      if (combosMatch(pressed, correct.keys)) {
        handleCorrect(wf, stepIdx)
      } else {
        handleWrong()
      }
    }

    const handleKeyUp = () => {
      // Clear pressed display when all keys released
      // Can't reliably track individual keys — just clear on any keyup
      setPressedKeys(new Set())
    }

    // Clear modifiers when window loses focus (e.g. Win key captured by OS)
    const handleBlur = () => {
      setPressedKeys(new Set())
      modifiersRef.current.clear()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
      modifiersRef.current.clear()
      setPressedKeys(new Set())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  function startGame() {
    playClick()
    const pool = getWorkflowsByDifficulty(difficulty)
    const wf = pickWorkflow(pool)
    modifiersRef.current.clear()
    scoreRef.current = 0
    completedRef.current = 0
    consecutiveRef.current = 0
    comboRef.current = 1
    isAnsweredRef.current = false
    setScore(0)
    setConsecutiveCorrect(0)
    setComboMultiplier(1)
    setCompletedWorkflows(0)
    setTimeLeft(GAME_DURATION)
    setXpEarned(0)
    setCurrentWorkflow(wf)
    setCurrentStepIdx(0)
    setIsAnswered(false)
    setLastCorrect(null)
    setPressedKeys(new Set())
    setPhase('playing')
    setTimeout(() => startStepTimer(), 50)
  }

  const timerPct = (timeLeft / GAME_DURATION) * 100
  const timerColor = timeLeft > 10 ? 'bg-violet-500' : timeLeft > 5 ? 'bg-amber-500' : 'bg-rose-500'
  const stepPct = (stepTimeLeft / (STEP_TIMEOUT / 1000)) * 100
  const stepColor = stepTimeLeft > 3 ? 'bg-violet-400' : stepTimeLeft > 1 ? 'bg-amber-400' : 'bg-rose-500'

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
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Echte Workflows — drücke die geforderte Tastenkombination direkt auf deiner Tastatur!
            </p>
            <div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground">
              <Keyboard className="h-4 w-4" />
              <span>Physische Tastatur erforderlich</span>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-4 text-xs text-muted-foreground">
              <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-medium">Combo 3× = 2x Punkte</span>
              <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-medium">Combo 6× = 3x Punkte</span>
              <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-medium">5s pro Schritt</span>
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
  const correctShortcut = getShortcutById(currentStep.shortcutId)

  if (isTouchOnly) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
          <div className="max-w-sm">
            <div className="text-5xl mb-6">⌨️</div>
            <h2 className="text-2xl font-bold mb-3">Physische Tastatur benötigt</h2>
            <p className="text-muted-foreground mb-6">
              Shortcut Rush erfordert eine physische Tastatur — auf Touch-Geräten ist das Drücken echter Tastenkombinationen nicht möglich.
            </p>
            <button
              onClick={() => setPhase('idle')}
              className="px-6 py-3 rounded-xl bg-violet-600 text-white font-bold"
            >
              Zurück
            </button>
          </div>
        </main>
      </div>
    )
  }

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

          {/* Global timer bar */}
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

        {/* Question + keyboard prompt */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentWorkflow.id}-${currentStepIdx}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {/* Context prompt */}
            <div className={cn(
              'rounded-2xl border-2 bg-card px-6 py-8 mb-4 text-center transition-colors duration-200',
              lastCorrect === true ? 'border-emerald-500 bg-emerald-500/5' : lastCorrect === false ? 'border-rose-500 bg-rose-500/5' : 'border-border',
            )}>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
                Schritt {currentStepIdx + 1} von {currentWorkflow.steps.length}
              </p>
              <h2 className="text-xl sm:text-2xl font-bold leading-tight mb-6">
                {currentStep.contextPrompt}
              </h2>

              {/* Key combination to press */}
              <div className="flex flex-col items-center gap-3">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                  {isAnswered
                    ? lastCorrect ? '✓ Richtig!' : '✗ Falsch — nächster Workflow'
                    : 'Drücke diese Tasten:'}
                </p>
                {correctShortcut && (
                  <KeyCombo keys={correctShortcut.keys} large pressedKeys={pressedKeys} />
                )}
              </div>
            </div>

            {/* Step countdown bar */}
            {!isAnswered && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Zeit für diesen Schritt</span>
                  <span className={cn('font-mono font-bold', stepTimeLeft <= 1 ? 'text-rose-500' : stepTimeLeft <= 3 ? 'text-amber-500' : '')}>{stepTimeLeft}s</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full transition-colors ${stepColor}`}
                    animate={{ width: `${stepPct}%` }}
                    transition={{ duration: 0.9, ease: 'linear' }}
                  />
                </div>
              </div>
            )}

            {/* Live pressed keys indicator */}
            {pressedKeys.size > 0 && !isAnswered && (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span>Gedrückt:</span>
                <div className="flex items-center gap-1">
                  {Array.from(pressedKeys).map((k, i) => (
                    <Fragment key={i}>
                      <kbd className="inline-flex items-center justify-center rounded px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-mono text-xs font-semibold border border-violet-300 dark:border-violet-700">
                        {k}
                      </kbd>
                      {i < pressedKeys.size - 1 && <span className="text-muted-foreground/60">+</span>}
                    </Fragment>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
