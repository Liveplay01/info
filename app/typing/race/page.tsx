'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { Header } from '@/components/header'
import { wordsDE, wordsEN, type TypingLang } from '@/lib/typing-content'
import { addXP } from '@/lib/skill-system'
import { playCorrect, playWrong, playGameOver, playClick } from '@/lib/sounds'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = 'idle' | 'playing' | 'result'

interface Asteroid {
  id: number
  text: string
  x: number        // percent 5–85
  y: number        // percent 0–100
  speed: number    // percent per tick
  exploding: boolean
}

// ── Word pool ─────────────────────────────────────────────────────────────────

const WORD_POOLS: Record<TypingLang, string[]> = {
  de: wordsDE.filter(w => w.length >= 3 && w.length <= 10),
  en: wordsEN.filter(w => w.length >= 3 && w.length <= 10),
}

function randomWord(lang: TypingLang, exclude: string[]): string {
  const pool = WORD_POOLS[lang].filter(w => !exclude.includes(w))
  const src = pool.length > 0 ? pool : WORD_POOLS[lang]
  return src[Math.floor(Math.random() * src.length)]
}

// ── Stars background (generated once) ────────────────────────────────────────

const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 1.5 + 0.5,
  opacity: Math.random() * 0.6 + 0.2,
  delay: Math.random() * 3,
}))

// ── Laser beam ────────────────────────────────────────────────────────────────

function LaserBeam({ fromX, toX, toY }: { fromX: number; toX: number; toY: number }) {
  const dx = toX - fromX
  const dy = toY - 88 // ship is at ~88% height
  const len = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)

  return (
    <motion.div
      initial={{ opacity: 1, scaleX: 0 }}
      animate={{ opacity: [1, 1, 0], scaleX: [0, 1, 1] }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        left: `${fromX}%`,
        top: '88%',
        width: `${len}%`,
        height: '2px',
        background: 'linear-gradient(90deg, #f97316, #fbbf24, #fff)',
        transformOrigin: '0 50%',
        rotate: `${angle}deg`,
        borderRadius: '2px',
        boxShadow: '0 0 6px #f97316, 0 0 12px #fbbf24',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    />
  )
}

// ── Explosion ─────────────────────────────────────────────────────────────────

function Explosion({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: [0, 1.8, 2.5], opacity: [1, 0.8, 0] }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, zIndex: 30, pointerEvents: 'none' }}
      className="-translate-x-1/2 -translate-y-1/2 text-3xl"
    >
      💥
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const TICK_MS = 100
const SPAWN_INTERVAL = 2800
const MAX_ASTEROIDS = 4
const BASE_SPEED = 0.28
const SPEED_INCREASE_PER_KILL = 0.012
const MAX_LIVES = 3

let asteroidIdCounter = 0

export default function TypingRacePage() {
  const [lang, setLang] = useState<TypingLang>('de')
  const [phase, setPhase] = useState<Phase>('idle')
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [typed, setTyped] = useState('')
  const [targetId, setTargetId] = useState<number | null>(null)
  const [lives, setLives] = useState(MAX_LIVES)
  const [score, setScore] = useState(0)
  const [killCount, setKillCount] = useState(0)
  const [explosions, setExplosions] = useState<{ id: number; x: number; y: number }[]>([])
  const [lasers, setLasers] = useState<{ id: number; toX: number; toY: number }[]>([])
  const [xpEarned, setXpEarned] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [totalTyped, setTotalTyped] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const livesRef = useRef(MAX_LIVES)
  const killRef = useRef(0)
  const asteroidsRef = useRef<Asteroid[]>([])
  const typedRef = useRef('')
  const targetIdRef = useRef<number | null>(null)
  const phaseRef = useRef<Phase>('idle')
  const langRef = useRef<TypingLang>('de')
  const scoreRef = useRef(0)
  const laserIdRef = useRef(0)
  const explosionIdRef = useRef(0)

  useEffect(() => { langRef.current = lang }, [lang])
  useEffect(() => { asteroidsRef.current = asteroids }, [asteroids])
  useEffect(() => { typedRef.current = typed }, [typed])
  useEffect(() => { targetIdRef.current = targetId }, [targetId])
  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { scoreRef.current = score }, [score])
  useEffect(() => { livesRef.current = lives }, [lives])
  useEffect(() => { killRef.current = killCount }, [killCount])

  const spawnAsteroid = useCallback(() => {
    if (phaseRef.current !== 'playing') return
    const current = asteroidsRef.current
    if (current.length >= MAX_ASTEROIDS) return

    const existingTexts = current.map(a => a.text)
    const text = randomWord(langRef.current, existingTexts)
    const speed = BASE_SPEED + killRef.current * SPEED_INCREASE_PER_KILL
    const usedXZones = current.map(a => Math.round(a.x / 20))
    let x = Math.random() * 75 + 8
    for (let i = 0; i < 5; i++) {
      const zone = Math.round(x / 20)
      if (!usedXZones.includes(zone)) break
      x = Math.random() * 75 + 8
    }

    const newAsteroid: Asteroid = {
      id: ++asteroidIdCounter,
      text,
      x,
      y: -8,
      speed,
      exploding: false,
    }
    setAsteroids(prev => [...prev, newAsteroid])
  }, [])

  const endGame = useCallback(() => {
    if (phaseRef.current !== 'playing') return
    phaseRef.current = 'result'
    setPhase('result')
    if (tickRef.current) clearInterval(tickRef.current)
    if (spawnRef.current) clearInterval(spawnRef.current)
    playGameOver()
    const kills = killRef.current
    const acc = totalTyped > 0 ? Math.round((totalCorrect / totalTyped) * 100) : 100
    const xp = Math.max(1, Math.round(kills * 8 + scoreRef.current * 0.1))
    setXpEarned(xp)
    addXP('tippen', xp)
    setAccuracy(acc)
  }, [totalTyped, totalCorrect])

  // Game tick — move asteroids down
  const tick = useCallback(() => {
    if (phaseRef.current !== 'playing') return
    setAsteroids(prev => {
      const updated: Asteroid[] = []
      let livesLost = 0

      for (const a of prev) {
        if (a.exploding) continue
        const newY = a.y + a.speed
        if (newY >= 92) {
          livesLost++
          playWrong()
          // Clear target if this asteroid was targeted
          if (targetIdRef.current === a.id) {
            setTargetId(null)
            targetIdRef.current = null
            setTyped('')
            typedRef.current = ''
          }
        } else {
          updated.push({ ...a, y: newY })
        }
      }

      if (livesLost > 0) {
        setLives(l => {
          const newLives = l - livesLost
          livesRef.current = newLives
          if (newLives <= 0) {
            setTimeout(() => endGame(), 50)
          }
          return Math.max(0, newLives)
        })
      }

      return updated
    })
  }, [endGame])

  useEffect(() => {
    if (phase !== 'playing') return
    tickRef.current = setInterval(tick, TICK_MS)
    spawnRef.current = setInterval(spawnAsteroid, SPAWN_INTERVAL)
    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
      if (spawnRef.current) clearInterval(spawnRef.current)
    }
  }, [phase, tick, spawnAsteroid])

  function startGame() {
    playClick()
    asteroidIdCounter = 0
    livesRef.current = MAX_LIVES
    killRef.current = 0
    phaseRef.current = 'playing'
    setAsteroids([])
    setTyped('')
    setTargetId(null)
    setLives(MAX_LIVES)
    setScore(0)
    setKillCount(0)
    setExplosions([])
    setLasers([])
    setXpEarned(0)
    setAccuracy(100)
    setTotalTyped(0)
    setTotalCorrect(0)
    setPhase('playing')
    setTimeout(() => {
      inputRef.current?.focus()
      spawnAsteroid()
    }, 100)
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (phase !== 'playing') return
    const value = e.target.value
    setTyped(value)
    typedRef.current = value

    if (value === '') {
      setTargetId(null)
      targetIdRef.current = null
      return
    }

    const currentAsteroids = asteroidsRef.current

    // If already locked onto a target, check it
    if (targetIdRef.current !== null) {
      const target = currentAsteroids.find(a => a.id === targetIdRef.current)
      if (!target) {
        setTargetId(null)
        targetIdRef.current = null
        setTyped('')
        typedRef.current = ''
        return
      }

      setTotalTyped(t => t + 1)

      if (target.text.startsWith(value)) {
        setTotalCorrect(c => c + 1)
        if (value === target.text) {
          destroyAsteroid(target)
        }
      } else {
        // Mistype — clear and re-find
        playWrong()
        setTyped('')
        typedRef.current = ''
        setTargetId(null)
        targetIdRef.current = null
      }
      return
    }

    // Find first matching asteroid
    const match = currentAsteroids.find(a => a.text.startsWith(value) && !a.exploding)
    if (match) {
      setTargetId(match.id)
      targetIdRef.current = match.id
      setTotalTyped(t => t + 1)
      setTotalCorrect(c => c + 1)
      if (value === match.text) {
        destroyAsteroid(match)
      }
    } else {
      // No match — clear
      playWrong()
      setTotalTyped(t => t + 1)
      setTyped('')
      typedRef.current = ''
    }
  }

  function destroyAsteroid(asteroid: Asteroid) {
    playCorrect()
    const shipX = 50
    const lid = ++laserIdRef.current
    const eid = ++explosionIdRef.current

    setLasers(l => [...l, { id: lid, toX: asteroid.x, toY: asteroid.y }])
    setTimeout(() => setLasers(l => l.filter(x => x.id !== lid)), 400)

    setExplosions(ex => [...ex, { id: eid, x: asteroid.x, y: asteroid.y }])
    setTimeout(() => setExplosions(ex => ex.filter(x => x.id !== eid)), 600)

    setAsteroids(prev => prev.filter(a => a.id !== asteroid.id))
    setTargetId(null)
    targetIdRef.current = null
    setTyped('')
    typedRef.current = ''

    const pts = Math.round(asteroid.text.length * 10)
    setScore(s => {
      const ns = s + pts
      scoreRef.current = ns
      return ns
    })
    setKillCount(k => {
      const nk = k + 1
      killRef.current = nk
      return nk
    })

    void shipX
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setTyped('')
      setTargetId(null)
    }
  }

  const shipX = 50

  // ── Idle ───────────────────────────────────────────────────────────────────

  if (phase === 'idle') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #020817 0%, #0a0f1e 100%)' }}>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full"
          >
            {/* Animated stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {STARS.slice(0, 40).map(s => (
                <motion.div
                  key={s.id}
                  className="absolute rounded-full bg-white"
                  style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r * 2, height: s.r * 2, opacity: s.opacity }}
                  animate={{ opacity: [s.opacity, s.opacity * 0.3, s.opacity] }}
                  transition={{ duration: 2 + s.delay, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-6xl mb-6"
              >
                🚀
              </motion.div>
              <h1 className="text-4xl font-bold tracking-tight mb-3 text-white">Typing Race</h1>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                Asteroiden rasen auf dein Raumschiff zu — tippe das Wort auf dem Asteroiden, um es abzuschießen!
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-8 text-sm text-slate-400">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">❤️ 3 Leben</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">⚡ Geschwindigkeit steigt</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">🎯 Genauigkeit zählt</span>
              </div>

              <div className="flex justify-center gap-2 mb-8">
                {(['de', 'en'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={cn(
                      'px-4 py-2 rounded-lg border text-sm font-semibold transition-all',
                      lang === l ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/20 bg-white/5 text-slate-300 hover:border-orange-400/60',
                    )}
                  >
                    {l === 'de' ? '🇩🇪 Deutsch' : '🇬🇧 English'}
                  </button>
                ))}
              </div>

              <motion.button
                onClick={startGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl shadow-lg shadow-orange-500/30 transition-colors"
              >
                Starten 🚀
              </motion.button>
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  // ── Result ─────────────────────────────────────────────────────────────────

  if (phase === 'result') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #020817 0%, #0a0f1e 100%)' }}>
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
              {lives <= 0 ? '💀' : '🏆'}
            </motion.div>
            <h2 className="text-3xl font-bold mb-2 text-white">
              {lives <= 0 ? 'Raumschiff zerstört!' : 'Mission beendet!'}
            </h2>
            <p className="text-slate-400 mb-8">Dein Kampfbericht:</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Punkte', value: score, icon: '⭐' },
                { label: 'Abgeschossen', value: killCount, icon: '💥' },
                { label: 'Genauigkeit', value: `${accuracy}%`, icon: '🎯' },
                { label: 'XP erhalten', value: `+${xpEarned}`, icon: '✨' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3, type: 'spring', stiffness: 220, damping: 22 }}
                  className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={startGame}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-lg shadow-orange-500/20 transition-colors"
              >
                <RotateCcw className="h-5 w-5" /> Nochmal
              </motion.button>
              <Link
                href="/games"
                className="px-8 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:border-orange-400/60 text-white font-semibold transition-all text-center"
              >
                Spielhalle
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  // ── Playing ────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #020817 0%, #0a0f1e 60%, #050d1a 100%)' }}
    >
      {/* Stars */}
      {STARS.map(s => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r * 2, height: s.r * 2, opacity: s.opacity }}
          animate={{ opacity: [s.opacity, s.opacity * 0.2, s.opacity] }}
          transition={{ duration: 1.5 + s.delay, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
        />
      ))}

      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-2 bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <motion.span
              key={i}
              animate={i >= lives ? { scale: [1, 1.3, 0.8], opacity: [1, 1, 0.3] } : {}}
              className="text-lg"
            >
              {i < lives ? '❤️' : '🖤'}
            </motion.span>
          ))}
        </div>
        <div className="text-white font-bold tabular-nums text-lg">
          ⭐ {score}
        </div>
        <div className="text-slate-400 text-sm">
          💥 {killCount} Treffer
        </div>
      </div>

      {/* Lasers */}
      {lasers.map(l => (
        <LaserBeam key={l.id} fromX={shipX} toX={l.toX} toY={l.toY} />
      ))}

      {/* Explosions */}
      <AnimatePresence>
        {explosions.map(ex => (
          <Explosion key={ex.id} x={ex.x} y={ex.y} />
        ))}
      </AnimatePresence>

      {/* Asteroids */}
      <AnimatePresence>
        {asteroids.map(a => {
          const isTarget = targetId === a.id
          const progress = isTarget ? typed.length / a.text.length : 0

          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 2, transition: { duration: 0.25 } }}
              style={{
                position: 'absolute',
                left: `${a.x}%`,
                top: `${a.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
              }}
            >
              <div className={cn(
                'flex flex-col items-center gap-1',
                isTarget && 'drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]',
              )}>
                {/* Asteroid body */}
                <motion.div
                  animate={{ rotate: [0, 5, -5, 3, -3, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-3xl"
                >
                  ☄️
                </motion.div>
                {/* Word label */}
                <div className={cn(
                  'px-2 py-0.5 rounded-md font-mono text-sm font-bold border backdrop-blur-sm',
                  isTarget
                    ? 'bg-orange-500/20 border-orange-400 text-white'
                    : 'bg-slate-900/70 border-slate-600 text-slate-200',
                )}>
                  {isTarget ? (
                    <>
                      <span className="text-orange-300">{a.text.slice(0, typed.length)}</span>
                      <span className="text-slate-400">{a.text.slice(typed.length)}</span>
                    </>
                  ) : a.text}
                </div>
                {/* Progress bar */}
                {isTarget && progress > 0 && (
                  <div className="w-full h-1 rounded-full bg-slate-700 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-orange-500"
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.05 }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Spaceship */}
      <motion.div
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', left: `${shipX}%`, top: '88%', transform: 'translate(-50%, -50%)', zIndex: 15 }}
      >
        <div className="text-4xl drop-shadow-[0_0_16px_rgba(249,115,22,0.6)]">🚀</div>
      </motion.div>

      {/* Danger zone indicator */}
      <div
        className="absolute left-0 right-0 border-t border-dashed border-rose-500/30 pointer-events-none"
        style={{ top: '85%', zIndex: 5 }}
      />

      {/* Input area */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2 z-40 px-4">
        <div className={cn(
          'w-full max-w-sm rounded-xl border-2 px-4 py-2.5 flex items-center gap-2 backdrop-blur-sm transition-all',
          targetId !== null
            ? 'border-orange-500 bg-orange-500/10'
            : 'border-white/20 bg-black/40',
        )}>
          <span className="text-orange-400 font-mono text-sm font-bold shrink-0">{'>'}</span>
          <input
            ref={inputRef}
            value={typed}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none font-mono text-white text-base caret-orange-400 placeholder:text-slate-600"
            placeholder="Tippen um abzuschießen…"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {typed && (
            <button
              onClick={() => { setTyped(''); setTargetId(null) }}
              className="text-slate-500 hover:text-slate-300 text-xs font-mono"
            >
              Esc
            </button>
          )}
        </div>
        <p className="text-xs text-slate-600">
          Fang einfach an zu tippen — das Wort des nächsten Asteroiden wird automatisch erkannt
        </p>
      </div>
    </div>
  )
}
