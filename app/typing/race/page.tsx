'use client'

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Zap } from 'lucide-react'
import { Header } from '@/components/header'
import { generateRaceText, type TypingLang } from '@/lib/typing-content'
import { addXP } from '@/lib/skill-system'
import { playCorrect, playWrong, playGameOver, playClick } from '@/lib/sounds'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = 'idle' | 'active' | 'result'
type CharState = 'untyped' | 'correct' | 'incorrect'

function getCharState(i: number, typed: string, target: string): CharState {
  if (i >= typed.length) return 'untyped'
  if (typed[i] === target[i]) return 'correct'
  return 'incorrect'
}

function computeAccuracy(typed: string, target: string): number {
  if (typed.length === 0) return 100
  let correct = 0
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) correct++
  }
  return Math.round((correct / typed.length) * 100)
}

function computeWPM(chars: number, elapsedSec: number): number {
  if (elapsedSec < 0.5) return 0
  return Math.round((chars / 5) / (elapsedSec / 60))
}

// ── Cursor ────────────────────────────────────────────────────────────────────

function BlinkingCursor({ visible }: { visible: boolean }) {
  return (
    <motion.span
      animate={{ opacity: visible ? [1, 0, 1] : 0 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'steps(1)' }}
      className="inline-block w-[2px] h-[1.2em] bg-amber-400 align-middle mx-px"
      aria-hidden
    />
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function TypingRacePage() {
  const [lang, setLang] = useState<TypingLang>('de')
  const [phase, setPhase] = useState<Phase>('idle')
  const [targetText, setTargetText] = useState(() => generateRaceText('de'))
  const [typed, setTyped] = useState('')
  const [liveWPM, setLiveWPM] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [elapsedSec, setElapsedSec] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const startTimeRef = useRef<number>(0)
  const wpmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const charSpansRef = useRef<(HTMLSpanElement | null)[]>([])

  const endRace = useCallback((finalTyped: string, finalTarget: string) => {
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current)
    const elapsed = (Date.now() - startTimeRef.current) / 1000
    const finalWPM = computeWPM(finalTarget.length, elapsed)
    const finalAccuracy = computeAccuracy(finalTyped, finalTarget)
    const xp = Math.max(1, Math.round(finalWPM * (finalAccuracy / 100) * 0.3))
    setXpEarned(xp)
    addXP('tippen', xp)
    setElapsedSec(Math.round(elapsed))
    setLiveWPM(finalWPM)
    setAccuracy(finalAccuracy)
    setPhase('result')
    playGameOver()
  }, [])

  useEffect(() => {
    if (phase !== 'active') return
    wpmIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      setLiveWPM(computeWPM(typed.length, elapsed))
    }, 1000)
    return () => { if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  function restart() {
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current)
    const newText = generateRaceText(lang)
    setTargetText(newText)
    setTyped('')
    setLiveWPM(0)
    setAccuracy(100)
    setElapsedSec(0)
    setXpEarned(0)
    setPhase('idle')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function handleLangChange(newLang: TypingLang) {
    setLang(newLang)
    const newText = generateRaceText(newLang)
    setTargetText(newText)
    setTyped('')
    setPhase('idle')
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') restart()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (phase === 'result') return
    const newValue = e.target.value

    if (phase === 'idle' && newValue.length > 0) {
      startTimeRef.current = Date.now()
      setPhase('active')
    }

    if (newValue.length > targetText.length) return

    setTyped(newValue)
    setAccuracy(computeAccuracy(newValue, targetText))

    if (newValue.length > 0) {
      const lastChar = newValue[newValue.length - 1]
      const expectedChar = targetText[newValue.length - 1]
      if (lastChar === expectedChar) {
        playCorrect()
      } else {
        playWrong()
      }
    }

    if (newValue === targetText) {
      endRace(newValue, targetText)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      e.preventDefault()
      restart()
    }
  }

  useLayoutEffect(() => {
    if (phase === 'idle') {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [phase])

  const progress = targetText.length > 0 ? (typed.length / targetText.length) * 100 : 0

  // ── Result ─────────────────────────────────────────────────────────────────

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
              animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl mb-6"
            >
              🏁
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">Ziel erreicht!</h2>
            <p className="text-muted-foreground mb-8">Dein Ergebnis:</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: 'WPM', value: liveWPM, icon: '⚡' },
                { label: 'Genauigkeit', value: `${accuracy}%`, icon: '🎯' },
                { label: 'Zeit', value: `${elapsedSec}s`, icon: '⏱️' },
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
                onClick={restart}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg shadow-lg shadow-amber-500/20 transition-colors"
              >
                <RotateCcw className="h-5 w-5" /> Nochmal
              </motion.button>
              <Link
                href="/games"
                className="px-8 py-3.5 rounded-xl border-2 border-border bg-card hover:border-amber-400/60 font-semibold transition-all text-center"
              >
                Spielhalle
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">Esc drücken um neu zu starten</p>
          </motion.div>
        </main>
      </div>
    )
  }

  // ── Typing screen ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 py-10 max-w-3xl mx-auto w-full">

        {/* Title & lang */}
        <div className="w-full flex items-center justify-between mb-8">
          <div>
            <div className="font-mono text-sm font-semibold text-amber-600 dark:text-amber-400 mb-1">⟨race/⟩</div>
            <h1 className="text-2xl font-bold tracking-tight">Typing Race</h1>
          </div>

          <div className="flex gap-1.5">
            {(['de', 'en'] as const).map(l => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
                className={cn(
                  'px-3 py-1.5 rounded-lg border text-sm font-semibold transition-all',
                  lang === l ? 'bg-amber-500 border-amber-500 text-white' : 'border-border bg-card hover:border-amber-400/60',
                )}
              >
                {l === 'de' ? '🇩🇪 DE' : '🇬🇧 EN'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="w-full flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-1.5 font-bold text-xl tabular-nums">
            <Zap className="h-5 w-5 text-amber-500" />
            <span>{liveWPM}</span>
            <span className="text-xs text-muted-foreground font-normal">WPM</span>
          </div>
          <div className="text-muted-foreground tabular-nums">
            <span className="font-bold text-foreground">{typed.length}</span>
            <span className="mx-0.5">/</span>
            {targetText.length}
          </div>
          <div className="tabular-nums">
            <span className={cn('font-bold', accuracy < 90 ? 'text-rose-500' : accuracy < 97 ? 'text-amber-500' : 'text-emerald-500')}>
              {accuracy}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-6">
          <motion.div
            className="h-full rounded-full bg-amber-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Text display */}
        <div
          className={cn(
            'w-full rounded-2xl border-2 p-6 sm:p-8 cursor-text transition-colors',
            phase === 'active' ? 'border-amber-500/50' : 'border-border',
          )}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="font-mono text-lg sm:text-xl leading-relaxed tracking-wide">
            {targetText.split('').map((char, i) => {
              const state = getCharState(i, typed, targetText)
              const isCursor = i === typed.length

              return (
                <span key={i} className="relative">
                  {isCursor && <BlinkingCursor visible={true} />}
                  <span
                    ref={el => { charSpansRef.current[i] = el }}
                    className={cn(
                      'transition-colors duration-75',
                      state === 'correct'   ? 'text-foreground' : '',
                      state === 'incorrect' ? 'text-rose-500 bg-rose-500/15 rounded-sm' : '',
                      state === 'untyped'   ? 'text-muted-foreground/40' : '',
                    )}
                  >
                    {char}
                  </span>
                </span>
              )
            })}
            {typed.length === targetText.length && <BlinkingCursor visible={false} />}
          </div>
        </div>

        {/* Hidden input */}
        <input
          ref={inputRef}
          value={typed}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          className="sr-only"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Tippfeld"
        />

        {/* Instructions */}
        <AnimatePresence>
          {phase === 'idle' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 text-sm text-muted-foreground text-center"
            >
              Einfach lostippen — der Timer startet automatisch. <kbd className="font-mono text-xs bg-muted px-1 py-0.5 rounded">Esc</kbd> zum Neustart.
            </motion.p>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
