'use client'

import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion'
import { Trophy, RotateCcw, Zap, Target, Timer, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  generateTargetText,
  type TypingMode,
  type TypingLang,
} from '@/lib/typing-content'
import { addXP, loadSkillProgress, getLevelInfo, type LevelInfo } from '@/lib/skill-system'

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'idle' | 'countdown' | 'active' | 'completed'
type CharState = 'untyped' | 'correct' | 'incorrect'
type Duration = 15 | 30 | 60 | 120

interface RoundResults {
  wpm: number
  accuracy: number
  maxStreak: number
  xpEarned: number
  timeBonus: number
  duration: Duration
  mode: TypingMode
  lang: TypingLang
}

function computeNetWPM(keystrokes: number, elapsedSeconds: number, accuracy: number): number {
  if (elapsedSeconds < 0.5) return 0
  const gross = (keystrokes * 12) / elapsedSeconds
  return Math.round(gross * (accuracy / 100))
}

function computeAccuracy(typed: string, target: string): number {
  if (typed.length === 0) return 100
  let correct = 0
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) correct++
  }
  return Math.round((correct / typed.length) * 100)
}

function getCharState(i: number, typed: string, target: string): CharState {
  if (i >= typed.length) return 'untyped'
  if (typed[i] === target[i]) return 'correct'
  return 'incorrect'
}

const charColors: Record<CharState, string> = {
  untyped: 'text-muted-foreground',
  correct: 'text-emerald-500 dark:text-emerald-400',
  incorrect: 'text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-sm',
}

const DURATION_OPTIONS: Duration[] = [15, 30, 60, 120]
const MODE_LABELS: Record<TypingMode, { de: string; en: string }> = {
  words:       { de: 'Wörter',           en: 'Words' },
  sentences:   { de: 'Sätze',            en: 'Sentences' },
  programming: { de: 'Code-Begriffe',    en: 'Code Terms' },
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function TypingTrainer() {
  // Config
  const [lang, setLang] = useState<TypingLang>('de')
  const [mode, setMode] = useState<TypingMode>('words')
  const [duration, setDuration] = useState<Duration>(60)

  // Round state
  const [phase, setPhase] = useState<Phase>('idle')
  const [targetText, setTargetText] = useState<string>(() => generateTargetText('words', 'de'))
  const [typed, setTyped] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState<number>(60)
  const [liveWPM, setLiveWPM] = useState<number>(0)
  const [accuracy, setAccuracy] = useState<number>(100)
  const [currentStreak, setCurrentStreak] = useState<number>(0)
  const [maxStreak, setMaxStreak] = useState<number>(0)
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0)
  const [countdown, setCountdown] = useState<number>(3)
  const [results, setResults] = useState<RoundResults | null>(null)
  const [isNewBest, setIsNewBest] = useState(false)
  const [levelUp, setLevelUp] = useState<{ from: number; to: number } | null>(null)

  // Skill progress (localStorage, hydrated after mount)
  const [currentLevelInfo, setCurrentLevelInfo] = useState<LevelInfo | null>(null)
  const personalBestsRef = useRef<Record<string, number>>({})
  const [personalBests, setPersonalBests] = useState<Record<string, number>>({})

  // Refs
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const wpmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeLeftRef = useRef<number>(duration)
  const durationRef = useRef<Duration>(duration)
  const typedRef = useRef<string>('')
  const keystrokesRef = useRef<number>(0)
  const streakRef = useRef<number>(0)
  const maxStreakRef = useRef<number>(0)

  // Cursor animation
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const springX = useSpring(cursorX, { stiffness: 400, damping: 28 })
  const springY = useSpring(cursorY, { stiffness: 400, damping: 28 })

  // Keep durationRef in sync
  useEffect(() => { durationRef.current = duration }, [duration])

  // ── Skill progress hydration ───────────────────────────────────────────────
  useEffect(() => {
    const sp = loadSkillProgress()
    setCurrentLevelInfo(getLevelInfo('tippen', sp.skills.tippen.totalXP))
    try {
      const raw = localStorage.getItem('typing-bests')
      if (raw) {
        const bests = JSON.parse(raw)
        personalBestsRef.current = bests
        setPersonalBests(bests)
      }
    } catch {}
  }, [])

  // ── Auto-focus on mount ────────────────────────────────────────────────────
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // ── Cursor position via layout effect ─────────────────────────────────────
  useLayoutEffect(() => {
    if (!containerRef.current) return
    const idx = typed.length
    const span = containerRef.current.querySelector<HTMLSpanElement>(`[data-idx="${idx}"]`)
    if (span) {
      const r = span.getBoundingClientRect()
      const cr = containerRef.current.getBoundingClientRect()
      cursorX.set(r.left - cr.left)
      cursorY.set(r.top - cr.top)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed.length, targetText])

  // ── Enter key on completed screen ─────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'completed') return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') restart()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // ── Core: restart ─────────────────────────────────────────────────────────
  const restart = useCallback((newLang?: TypingLang, newMode?: TypingMode, newDuration?: Duration) => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current)
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    const l = newLang ?? lang
    const m = newMode ?? mode
    const d = newDuration ?? duration
    const text = generateTargetText(m, l)
    setTargetText(text)
    setTyped('')
    typedRef.current = ''
    keystrokesRef.current = 0
    streakRef.current = 0
    maxStreakRef.current = 0
    setPhase('idle')
    setTimeLeft(d)
    timeLeftRef.current = d
    setLiveWPM(0)
    setAccuracy(100)
    setCurrentStreak(0)
    setMaxStreak(0)
    setTotalKeystrokes(0)
    setResults(null)
    setIsNewBest(false)
    setLevelUp(null)
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [lang, mode, duration])

  // ── Core: complete round ───────────────────────────────────────────────────
  const completeRound = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current)

    const elapsed = (Date.now() - startTimeRef.current) / 1000
    const finalAcc = computeAccuracy(typedRef.current, generateTargetText(mode, lang))
    const finalWPM = computeNetWPM(keystrokesRef.current, elapsed, accuracy)
    const mStreak = maxStreakRef.current
    const timeBonus = timeLeftRef.current > 0 ? Math.round(timeLeftRef.current * 2) : 0
    const xpEarned = Math.round(finalWPM * (durationRef.current / 60) * (accuracy / 100) * 10)
      + Math.floor(mStreak / 5) * 5
      + timeBonus

    const bestKey = `${mode}-${durationRef.current}`

    // Update personal bests
    const prevBest = personalBestsRef.current[bestKey] ?? 0
    const newBests = { ...personalBestsRef.current, [bestKey]: Math.max(prevBest, finalWPM) }
    personalBestsRef.current = newBests
    setPersonalBests(newBests)
    try { localStorage.setItem('typing-bests', JSON.stringify(newBests)) } catch {}
    setIsNewBest(finalWPM > prevBest)

    // Update global skill XP
    const { newProgress, leveledUp, fromLevel, toLevel } = addXP('tippen', xpEarned)
    setCurrentLevelInfo(getLevelInfo('tippen', newProgress.skills.tippen.totalXP))
    if (leveledUp) setLevelUp({ from: fromLevel, to: toLevel })

    setResults({ wpm: finalWPM, accuracy, maxStreak: mStreak, xpEarned, timeBonus, duration, mode, lang })
    setPhase('completed')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accuracy, duration, mode, lang])

  // ── Core: start timer ─────────────────────────────────────────────────────
  const startTimers = useCallback(() => {
    startTimeRef.current = Date.now()

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        const next = t - 1
        timeLeftRef.current = next
        if (next <= 0) {
          clearInterval(timerRef.current!)
          completeRound()
          return 0
        }
        return next
      })
    }, 1000)

    wpmIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      if (elapsed < 0.5) return
      const wpm = computeNetWPM(keystrokesRef.current, elapsed, accuracy)
      setLiveWPM(wpm)
    }, 250)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completeRound])

  // ── Countdown ─────────────────────────────────────────────────────────────
  const startCountdown = useCallback(() => {
    setPhase('countdown')
    setCountdown(3)
    let count = 3
    countdownIntervalRef.current = setInterval(() => {
      count -= 1
      if (count <= 0) {
        clearInterval(countdownIntervalRef.current!)
        setPhase('active')
        startTimers()
      } else {
        setCountdown(count)
      }
    }, 1000)
  }, [startTimers])

  // ── Input handler ──────────────────────────────────────────────────────────
  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (phase === 'completed' || phase === 'countdown') {
      e.target.value = ''
      return
    }

    const value = e.target.value
    // Prevent typing past target (with small overflow buffer)
    if (value.length > targetText.length + 5) return

    if (phase === 'idle' && value.length > 0) {
      e.target.value = ''
      startCountdown()
      return
    }

    const prev = typedRef.current
    const wasLonger = value.length > prev.length

    typedRef.current = value
    setTyped(value)

    if (wasLonger) {
      keystrokesRef.current += 1
      setTotalKeystrokes(k => k + 1)

      const idx = value.length - 1
      const correct = value[idx] === targetText[idx]

      // Streak: increments on correct space (word boundary)
      if (value[idx] === ' ' && correct) {
        streakRef.current += 1
        maxStreakRef.current = Math.max(maxStreakRef.current, streakRef.current)
        setCurrentStreak(streakRef.current)
        setMaxStreak(maxStreakRef.current)
      } else if (!correct) {
        streakRef.current = 0
        setCurrentStreak(0)
      }
    }

    const acc = computeAccuracy(value, targetText)
    setAccuracy(acc)

    // Auto-complete if all target chars typed correctly
    if (value === targetText) {
      completeRound()
    }
  }, [phase, targetText, startTimers, completeRound])

  // ── Key intercepts (Tab, Escape) ───────────────────────────────────────────
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab' || e.key === 'Escape') {
      e.preventDefault()
      restart()
    }
  }, [restart])

  // ── Config change handlers ─────────────────────────────────────────────────
  const handleLang = useCallback((l: TypingLang) => {
    setLang(l)
    restart(l, undefined, undefined)
  }, [restart])

  const handleMode = useCallback((m: TypingMode) => {
    setMode(m)
    restart(undefined, m, undefined)
  }, [restart])

  const handleDuration = useCallback((d: Duration) => {
    setDuration(d)
    restart(undefined, undefined, d)
  }, [restart])

  const chars = targetText.split('')
  const levelInfo = currentLevelInfo
  const bestKey = `${mode}-${duration}`
  const personalBest = personalBests[bestKey] ?? 0

  // ── Render: completed ──────────────────────────────────────────────────────
  if (phase === 'completed' && results) {
    return (
      <ResultsScreen
        results={results}
        isNewBest={isNewBest}
        levelUp={levelUp}
        previousBest={personalBest}
        levelInfo={levelInfo}
        onRestart={() => restart()}
      />
    )
  }

  // ── Render: idle / active ──────────────────────────────────────────────────
  return (
    <div
      className="rounded-xl border bg-card shadow-sm overflow-hidden"
      onKeyDown={handleKeyDown}
    >
      {/* Control bar */}
      <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b bg-muted/30">
        {/* Language toggle */}
        <div className="flex items-center rounded-lg border bg-background overflow-hidden">
          {(['de', 'en'] as TypingLang[]).map(l => (
            <button
              key={l}
              onClick={() => handleLang(l)}
              className={cn(
                'px-3 py-1.5 text-sm font-semibold transition-colors',
                lang === l
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent text-muted-foreground'
              )}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Mode selector */}
        <div className="flex items-center rounded-lg border bg-background overflow-hidden">
          {(['words', 'sentences', 'programming'] as TypingMode[]).map(m => (
            <button
              key={m}
              onClick={() => handleMode(m)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium transition-colors',
                mode === m
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent text-muted-foreground'
              )}
            >
              {MODE_LABELS[m][lang]}
            </button>
          ))}
        </div>

        {/* Duration selector */}
        <div className="flex items-center rounded-lg border bg-background overflow-hidden ml-auto">
          {DURATION_OPTIONS.map(d => (
            <button
              key={d}
              onClick={() => handleDuration(d)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium transition-colors',
                duration === d
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent text-muted-foreground'
              )}
            >
              {d}s
            </button>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex items-center gap-6 px-5 py-3 border-b">
        <StatItem
          icon={<Timer className="h-4 w-4" />}
          value={timeLeft}
          label={lang === 'de' ? 'Sekunden' : 'Seconds'}
          highlight={timeLeft <= 5 && phase === 'active'}
        />
        <StatItem
          icon={<Zap className="h-4 w-4 text-yellow-500" />}
          value={liveWPM}
          label="WPM"
        />
        <StatItem
          icon={<Target className="h-4 w-4 text-blue-500" />}
          value={`${accuracy}%`}
          label={lang === 'de' ? 'Genauigkeit' : 'Accuracy'}
        />
        <StatItem
          icon={<Flame className="h-4 w-4 text-orange-500" />}
          value={currentStreak}
          label="Streak"
          highlight={currentStreak >= 5}
        />
        {personalBest > 0 && (
          <div className="ml-auto text-xs text-muted-foreground hidden sm:block">
            {lang === 'de' ? 'Bestleistung' : 'Best'}: <span className="font-semibold text-foreground">{personalBest} WPM</span>
          </div>
        )}
      </div>

      {/* XP / Level bar */}
      {levelInfo && (
        <div className="flex items-center gap-3 px-5 py-2.5 border-b bg-muted/20">
          <span className="text-xs font-semibold text-muted-foreground">
            Lvl {levelInfo.level} · {levelInfo.name}
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-accent overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (levelInfo.progressXP / levelInfo.neededXP) * 100)}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {levelInfo.progressXP}/{levelInfo.neededXP} XP
          </span>
        </div>
      )}

      {/* Typing area */}
      <div
        className="px-5 py-6 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <div
          ref={containerRef}
          className="relative font-mono text-xl leading-relaxed tracking-wide select-none"
          style={{ minHeight: '5rem' }}
        >
          {chars.map((char, i) => (
            <span
              key={i}
              data-idx={i}
              className={cn(
                'transition-colors duration-75',
                charColors[getCharState(i, typed, targetText)]
              )}
            >
              {char}
            </span>
          ))}

          {/* Animated cursor */}
          <motion.div
            className="absolute top-0 w-[2px] rounded-full bg-primary pointer-events-none"
            style={{ x: springX, y: springY, height: '1.4em' }}
            animate={phase === 'active' ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
            transition={
              phase === 'active'
                ? { duration: 0.1 }
                : { duration: 1, repeat: Infinity, ease: 'linear', times: [0, 0.5, 0.5, 1] }
            }
          />

          {/* Hidden input */}
          <input
            ref={inputRef}
            value={typed}
            onChange={handleInput}
            className="opacity-0 absolute w-px h-px top-0 left-0 pointer-events-none"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label={lang === 'de' ? 'Tippfeld' : 'Typing input'}
          />

          {/* Idle / Countdown overlay */}
          <AnimatePresence>
            {phase === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-lg"
              >
                <div className="text-center">
                  <p className="text-base font-medium text-muted-foreground">
                    {lang === 'de' ? 'Beliebige Taste zum Starten' : 'Press any key to start'}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Tab / Escape {lang === 'de' ? '→ Neustart' : '→ restart'}
                  </p>
                </div>
              </motion.div>
            )}
            {phase === 'countdown' && (
              <motion.div
                key="countdown"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-lg"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={countdown}
                    initial={{ scale: 1.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="text-8xl font-bold text-primary tabular-nums select-none"
                  >
                    {countdown}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer hint */}
      <div className="flex items-center justify-between px-5 py-2.5 border-t bg-muted/20">
        <span className="text-xs text-muted-foreground/60">
          Tab / Esc {lang === 'de' ? '→ Neustart' : '→ restart'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={() => restart()}
        >
          <RotateCcw className="h-3 w-3" />
          {lang === 'de' ? 'Neustart' : 'Restart'}
        </Button>
      </div>
    </div>
  )
}

// ─── Sub-components (internal) ─────────────────────────────────────────────────

function StatItem({
  icon,
  value,
  label,
  highlight,
}: {
  icon: React.ReactNode
  value: number | string
  label: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn(highlight && 'text-red-500')}>{icon}</span>
      <div>
        <span className={cn('text-lg font-bold tabular-nums', highlight && 'text-red-500')}>
          {value}
        </span>
        <span className="text-xs text-muted-foreground ml-1">{label}</span>
      </div>
    </div>
  )
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
}

function ResultsScreen({
  results,
  isNewBest,
  levelUp,
  previousBest,
  levelInfo,
  onRestart,
}: {
  results: RoundResults
  isNewBest: boolean
  levelUp: { from: number; to: number } | null
  previousBest: number
  levelInfo: LevelInfo | null
  onRestart: () => void
}) {
  const isDE = results.lang === 'de'

  return (
    <div className="rounded-xl border bg-card shadow-sm p-6">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-5"
      >
        {/* Header */}
        <motion.div variants={staggerItem} className="flex items-center gap-3">
          {isNewBest ? (
            <motion.div
              animate={{ scale: [1, 1.2, 0.95, 1.05, 1] }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <Trophy className="h-8 w-8 text-yellow-500" />
            </motion.div>
          ) : (
            <RotateCcw className="h-7 w-7 text-muted-foreground" />
          )}
          <div>
            <h2 className="text-xl font-bold">
              {isNewBest
                ? (isDE ? '🎉 Neuer Rekord!' : '🎉 New Record!')
                : (isDE ? 'Runde beendet' : 'Round complete')}
            </h2>
            {!isNewBest && previousBest > 0 && (
              <p className="text-sm text-muted-foreground">
                {isDE ? 'Bestleistung' : 'Best'}: {previousBest} WPM
              </p>
            )}
          </div>
        </motion.div>

        {/* Time bonus banner */}
        {results.timeBonus > 0 && (
          <motion.div
            variants={staggerItem}
            className="rounded-lg border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-950/30 px-4 py-3 flex items-center gap-3"
          >
            <motion.span
              animate={{ rotate: [0, -15, 15, -8, 8, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl"
            >
              ⚡
            </motion.span>
            <div>
              <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                {isDE ? 'Zeitbonus!' : 'Time bonus!'}
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                {isDE ? `Text vor Ablauf fertig — +${results.timeBonus} XP` : `Finished early — +${results.timeBonus} XP`}
              </p>
            </div>
          </motion.div>
        )}

        {/* Main stats */}
        <motion.div variants={staggerItem} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ResultStat
            label="WPM"
            value={results.wpm}
            sub={isNewBest && previousBest > 0 ? `+${results.wpm - previousBest} vs vorher` : undefined}
            accent
          />
          <ResultStat
            label={isDE ? 'Genauigkeit' : 'Accuracy'}
            value={`${results.accuracy}%`}
          />
          <ResultStat
            label="Max Streak"
            value={results.maxStreak}
          />
          <ResultStat
            label="XP erhalten"
            value={`+${results.xpEarned}`}
            accent={results.xpEarned > 0}
          />
        </motion.div>

        {/* Level up */}
        {levelUp && (
          <motion.div
            variants={staggerItem}
            className="rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 flex items-center gap-3"
          >
            <motion.span
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl"
            >
              ⬆️
            </motion.span>
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                {isDE ? 'Level aufgestiegen!' : 'Level up!'}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Level {levelUp.from} → {levelUp.to}
              </p>
            </div>
          </motion.div>
        )}

        {/* XP bar */}
        {levelInfo && (
          <motion.div variants={staggerItem} className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Lvl {levelInfo.level} · {levelInfo.name}</span>
              <span>{levelInfo.progressXP}/{levelInfo.neededXP} XP</span>
            </div>
            <div className="h-2 rounded-full bg-accent overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (levelInfo.progressXP / levelInfo.neededXP) * 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* Feedback message */}
        <motion.p variants={staggerItem} className="text-sm text-muted-foreground">
          {results.wpm >= 80
            ? (isDE ? 'Beeindruckend! Du tippst wie ein Profi.' : 'Impressive! You type like a pro.')
            : results.wpm >= 50
            ? (isDE ? 'Gut gemacht! Mit etwas Übung erreichst du noch mehr.' : 'Well done! A bit more practice and you\'ll fly.')
            : (isDE ? 'Weiter so! Regelmäßiges Üben macht den Unterschied.' : 'Keep going! Regular practice makes the difference.')}
        </motion.p>

        {/* Actions */}
        <motion.div variants={staggerItem} className="flex items-center gap-3 pt-1">
          <Button onClick={onRestart} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            {isDE ? 'Nochmal' : 'Again'}
          </Button>
          <span className="text-xs text-muted-foreground">
            {isDE ? 'oder Enter drücken' : 'or press Enter'}
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}

function ResultStat({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: number | string
  sub?: string
  accent?: boolean
}) {
  return (
    <div className="rounded-lg border bg-muted/30 px-4 py-3">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className={cn('text-2xl font-bold tabular-nums', accent && 'text-primary')}>
        {value}
      </p>
      {sub && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">{sub}</p>}
    </div>
  )
}
