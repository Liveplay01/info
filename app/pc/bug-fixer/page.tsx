'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/header'
import { RotateCcw, Timer, ChevronLeft, Lightbulb } from 'lucide-react'
import { addXP } from '@/lib/skill-system'
import { playCorrect, playWrong, playGameOver, playClick } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import {
  BUG_SCENARIOS,
  UI_VIEWS,
  checkSolution,
  type BugScenario,
  type UIView,
  type ActionId,
} from '@/lib/bug-scenarios'

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = 'idle' | 'playing' | 'result'

// ── Main page ─────────────────────────────────────────────────────────────────

export default function BugFixerPage() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [currentView, setCurrentView] = useState<UIView>('desktop')
  const [viewStack, setViewStack] = useState<UIView[]>([])
  const [actionHistory, setActionHistory] = useState<ActionId[]>([])
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [solved, setSolved] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180)
  const [xpEarned, setXpEarned] = useState(0)
  const [score, setScore] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const scenario: BugScenario = BUG_SCENARIOS[scenarioIdx]

  const endGame = useCallback((didSolve: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current)
    playGameOver()
    const earned = didSolve
      ? Math.max(10, scenario.baseXP - hintsUsed * 20 + Math.max(0, timeLeft))
      : Math.max(0, Math.floor(scenario.baseXP * 0.1))
    setXpEarned(earned)
    setScore(s => s + earned)
    if (earned > 0) addXP('problemloesung', earned)
    setPhase('result')
  }, [scenario, hintsUsed, timeLeft])

  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { endGame(false); return 0 }
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase, scenarioIdx, endGame])

  function startGame(idx = 0) {
    playClick()
    setScenarioIdx(idx)
    setCurrentView('desktop')
    setViewStack([])
    setActionHistory([])
    setHintsUsed(0)
    setShowHint(false)
    setSolved(false)
    setTimeLeft(BUG_SCENARIOS[idx].timeLimitSeconds)
    setXpEarned(0)
    setScore(0)
    setPhase('playing')
  }

  function navigate(view: UIView) {
    setViewStack(s => [...s, currentView])
    setCurrentView(view)
  }

  function goBack() {
    const prev = viewStack[viewStack.length - 1]
    if (prev) {
      setViewStack(s => s.slice(0, -1))
      setCurrentView(prev)
    }
  }

  function handleAction(actionId: ActionId, navigatesTo?: UIView) {
    playClick()
    const newHistory = [...actionHistory, actionId]
    setActionHistory(newHistory)

    if (navigatesTo) {
      navigate(navigatesTo)
      return
    }

    // Check if this action solved the problem
    if (checkSolution(newHistory, scenario.solutionPaths)) {
      playCorrect()
      setSolved(true)
      if (timerRef.current) clearInterval(timerRef.current)
      const earned = Math.max(10, scenario.baseXP - hintsUsed * 20 + Math.max(0, timeLeft))
      setXpEarned(earned)
      addXP('problemloesung', earned)
      setTimeout(() => setPhase('result'), 1200)
    }
  }

  function handleHint() {
    playClick()
    setHintsUsed(h => h + 1)
    setShowHint(true)
    setTimeout(() => setShowHint(false), 4000)
  }

  const timerPct = (timeLeft / scenario.timeLimitSeconds) * 100
  const timerColor = timeLeft > 60 ? 'bg-emerald-500' : timeLeft > 30 ? 'bg-amber-500' : 'bg-rose-500'
  const viewDef = UI_VIEWS[currentView]

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
            <div className="font-mono text-sm font-semibold text-rose-600 dark:text-rose-400 mb-3">⟨pc/⟩</div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Bug Fixer</h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Typische PC-Probleme klicken statt googeln. Navigiere durch die Windows-Oberfläche und finde die Lösung — oft gibt es mehrere Wege!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {BUG_SCENARIOS.map((s, i) => (
                <motion.button
                  key={s.id}
                  onClick={() => startGame(i)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border bg-card hover:border-rose-400/60 hover:shadow-md transition-all"
                >
                  <span className="text-3xl">{s.bugEmoji}</span>
                  <span className="text-sm font-semibold">{s.title}</span>
                  <span className="text-xs text-muted-foreground">{s.baseXP} XP</span>
                </motion.button>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              Wähle ein Szenario oder starte mit dem ersten Bug.
            </p>
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
              {solved || xpEarned > 10 ? '🛠️' : '😓'}
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">
              {solved ? 'Bug gefixt!' : 'Zeit abgelaufen!'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {solved
                ? `Du hast "${scenario.title}" erfolgreich gelöst.`
                : `Das Szenario "${scenario.title}" war zu knifflig — kein Problem, nächstes Mal!`}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Szenario', value: scenario.bugEmoji, icon: '' },
                { label: 'Restzeit', value: `${timeLeft}s`, icon: '⏱️' },
                { label: 'Hints genutzt', value: hintsUsed, icon: '💡' },
                { label: 'XP erhalten', value: `+${xpEarned}`, icon: '✨' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3, type: 'spring', stiffness: 220, damping: 22 }}
                  className="rounded-xl border-2 border-border bg-card p-5"
                >
                  <div className="text-2xl mb-1">{stat.icon || stat.value}</div>
                  {stat.icon && <div className="text-2xl font-bold">{stat.value}</div>}
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={() => startGame(scenarioIdx)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-lg shadow-lg shadow-rose-500/20 transition-colors"
              >
                <RotateCcw className="h-5 w-5" /> Nochmal
              </motion.button>
              <button
                onClick={() => setPhase('idle')}
                className="px-8 py-3.5 rounded-xl border-2 border-border bg-card hover:border-rose-400/60 font-semibold transition-all text-center"
              >
                Szenario wählen
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  // ── Game screen ────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 py-6 max-w-xl mx-auto w-full">

        {/* HUD */}
        <div className="w-full mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{scenario.bugEmoji}</span>
              <div>
                <p className="text-xs text-muted-foreground">Problem</p>
                <p className="text-sm font-bold">{scenario.title}</p>
              </div>
            </div>
            <span className={cn('font-mono font-bold text-xl tabular-nums transition-colors', timeLeft <= 30 ? 'text-rose-500' : timeLeft <= 60 ? 'text-amber-500' : 'text-foreground')}>
              <Timer className="h-4 w-4 inline mr-1" />{timeLeft}s
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-colors ${timerColor}`}
              animate={{ width: `${timerPct}%` }}
              transition={{ duration: 0.9, ease: 'linear' }}
            />
          </div>
        </div>

        {/* Problem description */}
        <div className="w-full rounded-xl border bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 px-4 py-3 mb-4 text-sm text-rose-900 dark:text-rose-200">
          {scenario.description}
        </div>

        {/* Hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="w-full rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 mb-4 text-sm text-amber-900 dark:text-amber-200"
            >
              💡 {scenario.hintText}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success overlay */}
        <AnimatePresence>
          {solved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full rounded-xl border-2 border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-4 mb-4 text-center"
            >
              <p className="text-2xl mb-1">✅</p>
              <p className="font-bold text-emerald-700 dark:text-emerald-300">Gelöst! +{xpEarned} XP</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Windows UI simulation */}
        <div className="w-full rounded-xl border-2 border-border bg-card overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50 border-b border-border">
            <div className="flex items-center gap-2">
              {viewStack.length > 0 && (
                <button
                  onClick={goBack}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
              )}
              <span className="text-sm font-semibold">{viewDef.title}</span>
            </div>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
          </div>

          {/* UI items */}
          <div className="p-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.15 }}
              >
                {viewDef.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAction(item.id, item.navigatesTo)}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-accent transition-colors text-left text-sm font-medium group"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {item.navigatesTo && (
                      <span className="text-muted-foreground/50 group-hover:text-muted-foreground text-xs">›</span>
                    )}
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Breadcrumb */}
        {viewStack.length > 0 && (
          <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground/60">
            {[...viewStack, currentView].map((v, i, arr) => (
              <span key={i}>
                {UI_VIEWS[v].title}
                {i < arr.length - 1 && <span className="mx-1">›</span>}
              </span>
            ))}
          </div>
        )}

        {/* Hint button */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleHint}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-amber-500 transition-colors border border-border rounded-lg px-3 py-1.5 hover:border-amber-400"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            Hinweis (-20 XP)
          </button>
          <span className="text-xs text-muted-foreground">
            {hintsUsed} genutzt
          </span>
        </div>

      </main>
    </div>
  )
}
