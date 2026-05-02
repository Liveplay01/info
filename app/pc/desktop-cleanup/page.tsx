'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/header'
import { addXP } from '@/lib/skill-system'
import { playCorrect, playWrong, playGameOver, playClick } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { Trophy, RotateCcw, Timer, FolderOpen } from 'lucide-react'

// ── Types ───────────────────────────────────────────────────────────────────

type FolderId = 'schule' | 'freizeit' | 'arbeit' | 'papierkorb'
type Phase = 'idle' | 'playing' | 'result'

interface DesktopFile {
  id: string
  name: string
  ext: 'docx' | 'pdf' | 'png' | 'jpg' | 'xlsx' | 'tmp' | 'txt' | 'exe'
  correctFolder: FolderId
  hint: string
}

interface CleanupLevel {
  id: 1 | 2 | 3
  missionTitle: string
  missionDesc: string
  files: DesktopFile[]
  timeLimitSeconds: number
  baseXP: number
}

// ── Folder config ────────────────────────────────────────────────────────────

const FOLDERS: { id: FolderId; label: string; icon: string; color: string; bg: string; border: string }[] = [
  { id: 'schule',    label: 'Schule',     icon: '📚', color: 'text-blue-700 dark:text-blue-300',   bg: 'bg-blue-50 dark:bg-blue-900/20',   border: 'border-blue-300 dark:border-blue-700' },
  { id: 'freizeit',  label: 'Freizeit',   icon: '🎮', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-300 dark:border-emerald-700' },
  { id: 'arbeit',    label: 'Arbeit',     icon: '💼', color: 'text-amber-700 dark:text-amber-300',  bg: 'bg-amber-50 dark:bg-amber-900/20',  border: 'border-amber-300 dark:border-amber-700' },
  { id: 'papierkorb', label: 'Papierkorb', icon: '🗑️', color: 'text-rose-700 dark:text-rose-300',   bg: 'bg-rose-50 dark:bg-rose-900/20',   border: 'border-rose-300 dark:border-rose-700' },
]

// ── Level data ────────────────────────────────────────────────────────────────

const LEVELS: CleanupLevel[] = [
  {
    id: 1,
    missionTitle: 'Grundstruktur anlegen',
    missionDesc: 'Sortiere die Dateien in die richtigen Ordner: Schule, Freizeit, Arbeit oder Papierkorb.',
    timeLimitSeconds: 90,
    baseXP: 60,
    files: [
      { id: 'f1', name: 'Hausaufgaben.docx',       ext: 'docx', correctFolder: 'schule',    hint: 'Klingt nach Schularbeit' },
      { id: 'f2', name: 'urlaub_fotos.png',         ext: 'png',  correctFolder: 'freizeit',  hint: 'Urlaubsfotos gehören zur Freizeit' },
      { id: 'f3', name: 'rechnung_januar.pdf',      ext: 'pdf',  correctFolder: 'arbeit',    hint: 'Eine Rechnung gehört zur Arbeit' },
      { id: 'f4', name: 'minecraft_screenshot.png', ext: 'png',  correctFolder: 'freizeit',  hint: 'Spielescreens sind Freizeit' },
      { id: 'f5', name: 'mathe_aufgaben.pdf',       ext: 'pdf',  correctFolder: 'schule',    hint: 'Mathe-Aufgaben = Schule' },
      { id: 'f6', name: 'alte_datei.tmp',            ext: 'tmp',  correctFolder: 'papierkorb', hint: 'Temp-Dateien können weg' },
    ],
  },
  {
    id: 2,
    missionTitle: 'Chaos aufräumen',
    missionDesc: 'Mehr Dateien, unklarere Namen — du brauchst etwas mehr Köpfchen zum Sortieren.',
    timeLimitSeconds: 90,
    baseXP: 100,
    files: [
      { id: 'f1', name: 'Hausaufgaben.docx',       ext: 'docx', correctFolder: 'schule',    hint: 'Schularbeit' },
      { id: 'f2', name: 'urlaub_fotos.png',         ext: 'png',  correctFolder: 'freizeit',  hint: 'Urlaubserinnerungen' },
      { id: 'f3', name: 'rechnung_januar.pdf',      ext: 'pdf',  correctFolder: 'arbeit',    hint: 'Rechnung → Arbeit' },
      { id: 'f4', name: 'minecraft_screenshot.png', ext: 'png',  correctFolder: 'freizeit',  hint: 'Spiel → Freizeit' },
      { id: 'f5', name: 'mathe_aufgaben.pdf',       ext: 'pdf',  correctFolder: 'schule',    hint: 'Mathe → Schule' },
      { id: 'f6', name: 'alte_datei.tmp',            ext: 'tmp',  correctFolder: 'papierkorb', hint: 'Temp-Datei weg' },
      { id: 'f7', name: 'neu (1).docx',             ext: 'docx', correctFolder: 'schule',    hint: 'Unbenannte Schulnotiz' },
      { id: 'f8', name: 'bericht_v3_FINAL.xlsx',    ext: 'xlsx', correctFolder: 'arbeit',    hint: 'Arbeitsbericht' },
      { id: 'f9', name: 'Kopie von Kopie.png',      ext: 'png',  correctFolder: 'papierkorb', hint: 'Doppelte Kopie → Papierkorb' },
      { id: 'f10', name: 'final_v2_DEFINITIV.pdf',  ext: 'pdf',  correctFolder: 'arbeit',    hint: 'Finaler Bericht → Arbeit' },
    ],
  },
  {
    id: 3,
    missionTitle: 'Profi-Aufräumer',
    missionDesc: 'Maximale Unordnung, knappe Zeit — nur echte Ordnungs-Profis schaffen alle 14 Dateien.',
    timeLimitSeconds: 75,
    baseXP: 150,
    files: [
      { id: 'f1', name: 'Hausaufgaben.docx',         ext: 'docx', correctFolder: 'schule',    hint: 'Schularbeit' },
      { id: 'f2', name: 'urlaub_fotos.png',           ext: 'png',  correctFolder: 'freizeit',  hint: 'Urlaubserinnerungen' },
      { id: 'f3', name: 'rechnung_januar.pdf',        ext: 'pdf',  correctFolder: 'arbeit',    hint: 'Rechnung → Arbeit' },
      { id: 'f4', name: 'minecraft_screenshot.png',   ext: 'png',  correctFolder: 'freizeit',  hint: 'Spiel → Freizeit' },
      { id: 'f5', name: 'mathe_aufgaben.pdf',         ext: 'pdf',  correctFolder: 'schule',    hint: 'Mathe → Schule' },
      { id: 'f6', name: 'alte_datei.tmp',              ext: 'tmp',  correctFolder: 'papierkorb', hint: 'Temp weg' },
      { id: 'f7', name: 'neu (1).docx',               ext: 'docx', correctFolder: 'schule',    hint: 'Schulnotiz' },
      { id: 'f8', name: 'bericht_v3_FINAL.xlsx',      ext: 'xlsx', correctFolder: 'arbeit',    hint: 'Arbeitsbericht' },
      { id: 'f9', name: 'Kopie von Kopie.png',        ext: 'png',  correctFolder: 'papierkorb', hint: 'Doppel-Kopie weg' },
      { id: 'f10', name: 'final_v2_DEFINITIV.pdf',    ext: 'pdf',  correctFolder: 'arbeit',    hint: 'Bericht → Arbeit' },
      { id: 'f11', name: 'IMG_20231104.jpg',           ext: 'jpg',  correctFolder: 'freizeit',  hint: 'Kamerafoto → Freizeit' },
      { id: 'f12', name: 'Unbenannt.docx',             ext: 'docx', correctFolder: 'papierkorb', hint: 'Leer & unbenannt → Weg' },
      { id: 'f13', name: 'klausurvorbereitung.txt',    ext: 'txt',  correctFolder: 'schule',    hint: 'Klausurvorbereitung = Schule' },
      { id: 'f14', name: 'spesen_november.xlsx',       ext: 'xlsx', correctFolder: 'arbeit',    hint: 'Spesenliste → Arbeit' },
    ],
  },
]

// ── File icon ─────────────────────────────────────────────────────────────────

const EXT_ICONS: Record<string, string> = {
  docx: '📝', pdf: '📄', png: '🖼️', jpg: '🖼️', xlsx: '📊', tmp: '⚙️', txt: '📋', exe: '⚙️',
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DesktopCleanupPage() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3>(1)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [placements, setPlacements] = useState<Record<string, FolderId>>({})
  const [wrongMoves, setWrongMoves] = useState(0)
  const [timeLeft, setTimeLeft] = useState(90)
  const [flashFolderId, setFlashFolderId] = useState<FolderId | null>(null)
  const [xpEarned, setXpEarned] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const level = LEVELS[selectedLevel - 1]

  const remainingFiles = level.files.filter(f => !placements[f.id])

  const endGame = useCallback((won: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current)
    playGameOver()
    const placedCorrect = Object.entries(placements).filter(([id, fid]) => {
      const file = level.files.find(f => f.id === id)
      return file && file.correctFolder === fid
    }).length
    const earned = Math.max(10, level.baseXP + Math.max(0, timeLeft * 2) - wrongMoves * 10)
    setXpEarned(earned)
    addXP('organisation', earned)
    setPhase('result')
  }, [placements, timeLeft, wrongMoves, level])

  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { endGame(false); return 0 }
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase, endGame])

  function startGame() {
    playClick()
    setPlacements({})
    setSelectedFileId(null)
    setWrongMoves(0)
    setTimeLeft(level.timeLimitSeconds)
    setXpEarned(0)
    setPhase('playing')
  }

  function handleFileClick(fileId: string) {
    if (phase !== 'playing') return
    playClick()
    setSelectedFileId(prev => prev === fileId ? null : fileId)
  }

  function handleFolderClick(folderId: FolderId) {
    if (!selectedFileId || phase !== 'playing') return
    const file = level.files.find(f => f.id === selectedFileId)
    if (!file) return

    if (file.correctFolder === folderId) {
      playCorrect()
      const newPlacements = { ...placements, [selectedFileId]: folderId }
      setPlacements(newPlacements)
      setSelectedFileId(null)
      if (Object.keys(newPlacements).length === level.files.length) {
        endGame(true)
      }
    } else {
      playWrong()
      setWrongMoves(w => w + 1)
      setFlashFolderId(folderId)
      setTimeout(() => setFlashFolderId(null), 500)
    }
  }

  const timerPct = (timeLeft / level.timeLimitSeconds) * 100
  const timerColor = timeLeft > 20 ? 'bg-emerald-500' : timeLeft > 10 ? 'bg-amber-500' : 'bg-rose-500'

  // ── Idle screen ───────────────────────────────────────────────────────────

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
            <div className="font-mono text-sm font-semibold text-amber-600 dark:text-amber-400 mb-3">⟨pc/⟩</div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Desktop Chaos Cleanup</h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Dein Desktop ist ein totales Chaos! Sortiere alle Dateien in die richtigen Ordner — so schnell und akkurat wie möglich.
            </p>

            <div className="flex justify-center gap-3 mb-8">
              {FOLDERS.map(f => (
                <div key={f.id} className={cn('flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2', f.bg, f.border)}>
                  <span className="text-2xl">{f.icon}</span>
                  <span className={cn('text-xs font-semibold', f.color)}>{f.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 mb-8">
              <p className="text-sm text-muted-foreground font-medium">Schwierigkeitsstufe:</p>
              <div className="flex justify-center gap-2">
                {([1, 2, 3] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={cn(
                      'px-5 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all',
                      selectedLevel === lvl
                        ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20'
                        : 'border-border bg-card hover:border-amber-400/60'
                    )}
                  >
                    {lvl === 1 ? '🟢 Leicht' : lvl === 2 ? '🟡 Mittel' : '🔴 Schwer'}
                    <span className="block text-xs font-normal opacity-70 mt-0.5">
                      {LEVELS[lvl - 1].files.length} Dateien · {LEVELS[lvl - 1].timeLimitSeconds}s
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-muted/30 px-4 py-3 text-sm text-muted-foreground mb-6 text-left">
              <strong>Mission:</strong> {level.missionDesc}
            </div>

            <motion.button
              onClick={startGame}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg shadow-lg shadow-amber-500/20 transition-colors"
            >
              Aufräumen starten
            </motion.button>
          </motion.div>
        </main>
      </div>
    )
  }

  // ── Result screen ──────────────────────────────────────────────────────────

  if (phase === 'result') {
    const correctCount = Object.entries(placements).filter(([id, fid]) => {
      const file = level.files.find(f => f.id === id)
      return file && file.correctFolder === fid
    }).length
    const total = level.files.length

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
              {correctCount === total ? '🏆' : correctCount >= total * 0.7 ? '👍' : '🧹'}
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">
              {correctCount === total ? 'Perfekt aufgeräumt!' : 'Aufräumen abgeschlossen!'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {correctCount} von {total} Dateien korrekt einsortiert.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Richtig', value: `${correctCount}/${total}`, icon: '✅' },
                { label: 'Fehler', value: wrongMoves, icon: '❌' },
                { label: 'Restzeit', value: `${timeLeft}s`, icon: '⏱️' },
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
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg shadow-lg shadow-amber-500/20 transition-colors"
              >
                <RotateCcw className="h-5 w-5" /> Nochmal
              </motion.button>
              <button
                onClick={() => setPhase('idle')}
                className="px-8 py-3.5 rounded-xl border-2 border-border bg-card hover:border-amber-400/60 font-semibold transition-all text-center"
              >
                Level wählen
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
      <main className="flex-1 flex flex-col px-4 py-4 max-w-4xl mx-auto w-full gap-4">

        {/* HUD */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 font-bold text-base">
              <FolderOpen className="h-4 w-4 text-amber-500" />
              <span>{remainingFiles.length} übrig</span>
            </div>
            <div className={cn('font-mono font-bold text-xl tabular-nums transition-colors', timeLeft <= 10 ? 'text-rose-500' : timeLeft <= 20 ? 'text-amber-500' : 'text-foreground')}>
              <Timer className="h-4 w-4 inline mr-1" />{timeLeft}s
            </div>
            <div className="text-sm text-muted-foreground">
              ❌ {wrongMoves} Fehler
            </div>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-colors ${timerColor}`}
              animate={{ width: `${timerPct}%` }}
              transition={{ duration: 0.9, ease: 'linear' }}
            />
          </div>
        </div>

        {/* Mission */}
        <div className="rounded-xl border bg-muted/30 px-4 py-2.5 text-sm text-muted-foreground">
          <strong className="text-foreground">Mission:</strong> {level.missionDesc}
          {selectedFileId && (
            <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">
              → Jetzt Ordner wählen!
            </span>
          )}
        </div>

        {/* Desktop files */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 min-h-[200px] rounded-xl border-2 border-dashed border-border bg-muted/10 p-3">
          <AnimatePresence>
            {remainingFiles.map(file => {
              const isSelected = selectedFileId === file.id
              return (
                <motion.button
                  key={file.id}
                  layout
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0, transition: { duration: 0.25 } }}
                  onClick={() => handleFileClick(file.id)}
                  title={file.hint}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all text-center cursor-pointer hover:shadow-md',
                    isSelected
                      ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 shadow-md ring-2 ring-amber-400/50'
                      : 'border-border bg-card hover:border-amber-300'
                  )}
                >
                  <span className="text-2xl">{EXT_ICONS[file.ext] ?? '📄'}</span>
                  <span className="text-[10px] font-medium leading-tight break-all line-clamp-2">
                    {file.name}
                  </span>
                </motion.button>
              )
            })}
          </AnimatePresence>
          {remainingFiles.length === 0 && (
            <div className="col-span-full flex items-center justify-center text-muted-foreground text-sm">
              Alle Dateien sortiert!
            </div>
          )}
        </div>

        {/* Folder targets */}
        <div className="grid grid-cols-4 gap-2">
          {FOLDERS.map(folder => {
            const isFlashing = flashFolderId === folder.id
            const isActive = !!selectedFileId
            return (
              <motion.button
                key={folder.id}
                onClick={() => handleFolderClick(folder.id)}
                animate={isFlashing ? { backgroundColor: 'hsl(0 72% 51% / 0.2)', borderColor: 'hsl(0 72% 51%)' } : {}}
                transition={{ duration: 0.15 }}
                className={cn(
                  'flex flex-col items-center gap-1.5 py-4 rounded-xl border-2 font-semibold transition-all',
                  folder.bg, folder.border,
                  isActive ? 'cursor-pointer hover:scale-105 hover:shadow-lg shadow-sm' : 'opacity-50 cursor-default',
                )}
              >
                <span className="text-3xl">{folder.icon}</span>
                <span className={cn('text-xs', folder.color)}>{folder.label}</span>
              </motion.button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
