'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { addXP } from '@/lib/skill-system'
import { playCorrect, playWrong, playGameOver, playClick } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { Trophy, RotateCcw, Timer, FolderOpen } from 'lucide-react'

// ── Types ───────────────────────────────────────────────────────────────────

type FolderId = 'schule' | 'freizeit' | 'arbeit' | 'papierkorb'
type Phase = 'idle' | 'playing' | 'result'

interface FilePosition { x: number; y: number } // percent of desktop area

interface DesktopFile {
  id: string
  name: string
  ext: 'docx' | 'pdf' | 'png' | 'jpg' | 'xlsx' | 'tmp' | 'txt' | 'exe'
  correctFolder: FolderId
  hint: string
  position: FilePosition
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

const FOLDERS: { id: FolderId; label: string; icon: string; color: string; bg: string; border: string; glow: string }[] = [
  { id: 'schule',     label: 'Schule',     icon: '📚', color: 'text-blue-200',   bg: 'bg-blue-900/60',   border: 'border-blue-500',   glow: 'shadow-blue-500/50' },
  { id: 'freizeit',  label: 'Freizeit',   icon: '🎮', color: 'text-emerald-200', bg: 'bg-emerald-900/60', border: 'border-emerald-500', glow: 'shadow-emerald-500/50' },
  { id: 'arbeit',    label: 'Arbeit',     icon: '💼', color: 'text-amber-200',   bg: 'bg-amber-900/60',  border: 'border-amber-500',   glow: 'shadow-amber-500/50' },
  { id: 'papierkorb', label: 'Papierkorb', icon: '🗑️', color: 'text-rose-200',   bg: 'bg-rose-900/60',   border: 'border-rose-500',    glow: 'shadow-rose-500/50' },
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
      { id: 'f1', name: 'Hausaufgaben.docx',       ext: 'docx', correctFolder: 'schule',    hint: 'Klingt nach Schularbeit',      position: { x: 8,  y: 12 } },
      { id: 'f2', name: 'urlaub_fotos.png',         ext: 'png',  correctFolder: 'freizeit',  hint: 'Urlaubsfotos → Freizeit',      position: { x: 30, y: 28 } },
      { id: 'f3', name: 'rechnung_januar.pdf',      ext: 'pdf',  correctFolder: 'arbeit',    hint: 'Rechnung → Arbeit',            position: { x: 55, y: 10 } },
      { id: 'f4', name: 'minecraft_screenshot.png', ext: 'png',  correctFolder: 'freizeit',  hint: 'Spielescreens → Freizeit',     position: { x: 72, y: 32 } },
      { id: 'f5', name: 'mathe_aufgaben.pdf',       ext: 'pdf',  correctFolder: 'schule',    hint: 'Mathe-Aufgaben → Schule',      position: { x: 18, y: 52 } },
      { id: 'f6', name: 'alte_datei.tmp',            ext: 'tmp',  correctFolder: 'papierkorb', hint: 'Temp-Dateien können weg',    position: { x: 48, y: 55 } },
    ],
  },
  {
    id: 2,
    missionTitle: 'Chaos aufräumen',
    missionDesc: 'Mehr Dateien, unklarere Namen — du brauchst etwas mehr Köpfchen zum Sortieren.',
    timeLimitSeconds: 90,
    baseXP: 100,
    files: [
      { id: 'f1',  name: 'Hausaufgaben.docx',       ext: 'docx', correctFolder: 'schule',     hint: 'Schularbeit',               position: { x: 6,  y: 10 } },
      { id: 'f2',  name: 'urlaub_fotos.png',         ext: 'png',  correctFolder: 'freizeit',   hint: 'Urlaubserinnerungen',       position: { x: 25, y: 25 } },
      { id: 'f3',  name: 'rechnung_januar.pdf',      ext: 'pdf',  correctFolder: 'arbeit',     hint: 'Rechnung → Arbeit',         position: { x: 50, y: 10 } },
      { id: 'f4',  name: 'minecraft_screenshot.png', ext: 'png',  correctFolder: 'freizeit',   hint: 'Spiel → Freizeit',          position: { x: 70, y: 22 } },
      { id: 'f5',  name: 'mathe_aufgaben.pdf',       ext: 'pdf',  correctFolder: 'schule',     hint: 'Mathe → Schule',            position: { x: 12, y: 42 } },
      { id: 'f6',  name: 'alte_datei.tmp',            ext: 'tmp',  correctFolder: 'papierkorb', hint: 'Temp-Datei weg',           position: { x: 35, y: 48 } },
      { id: 'f7',  name: 'neu (1).docx',             ext: 'docx', correctFolder: 'schule',     hint: 'Unbenannte Schulnotiz',     position: { x: 58, y: 42 } },
      { id: 'f8',  name: 'bericht_v3_FINAL.xlsx',    ext: 'xlsx', correctFolder: 'arbeit',     hint: 'Arbeitsbericht',            position: { x: 76, y: 50 } },
      { id: 'f9',  name: 'Kopie von Kopie.png',      ext: 'png',  correctFolder: 'papierkorb', hint: 'Doppelte Kopie → Papierkorb', position: { x: 20, y: 62 } },
      { id: 'f10', name: 'final_v2_DEFINITIV.pdf',   ext: 'pdf',  correctFolder: 'arbeit',     hint: 'Finaler Bericht → Arbeit',  position: { x: 48, y: 65 } },
    ],
  },
  {
    id: 3,
    missionTitle: 'Profi-Aufräumer',
    missionDesc: 'Maximale Unordnung, knappe Zeit — nur echte Ordnungs-Profis schaffen alle 14 Dateien.',
    timeLimitSeconds: 75,
    baseXP: 150,
    files: [
      { id: 'f1',  name: 'Hausaufgaben.docx',         ext: 'docx', correctFolder: 'schule',     hint: 'Schularbeit',              position: { x: 5,  y: 10 } },
      { id: 'f2',  name: 'urlaub_fotos.png',           ext: 'png',  correctFolder: 'freizeit',   hint: 'Urlaubserinnerungen',      position: { x: 22, y: 20 } },
      { id: 'f3',  name: 'rechnung_januar.pdf',        ext: 'pdf',  correctFolder: 'arbeit',     hint: 'Rechnung → Arbeit',        position: { x: 42, y: 8  } },
      { id: 'f4',  name: 'minecraft_screenshot.png',   ext: 'png',  correctFolder: 'freizeit',   hint: 'Spiel → Freizeit',         position: { x: 62, y: 18 } },
      { id: 'f5',  name: 'mathe_aufgaben.pdf',         ext: 'pdf',  correctFolder: 'schule',     hint: 'Mathe → Schule',           position: { x: 78, y: 8  } },
      { id: 'f6',  name: 'alte_datei.tmp',              ext: 'tmp',  correctFolder: 'papierkorb', hint: 'Temp weg',                 position: { x: 10, y: 35 } },
      { id: 'f7',  name: 'neu (1).docx',               ext: 'docx', correctFolder: 'schule',     hint: 'Schulnotiz',               position: { x: 30, y: 40 } },
      { id: 'f8',  name: 'bericht_v3_FINAL.xlsx',      ext: 'xlsx', correctFolder: 'arbeit',     hint: 'Arbeitsbericht',           position: { x: 52, y: 35 } },
      { id: 'f9',  name: 'Kopie von Kopie.png',        ext: 'png',  correctFolder: 'papierkorb', hint: 'Doppel-Kopie weg',         position: { x: 70, y: 40 } },
      { id: 'f10', name: 'final_v2_DEFINITIV.pdf',     ext: 'pdf',  correctFolder: 'arbeit',     hint: 'Bericht → Arbeit',         position: { x: 15, y: 58 } },
      { id: 'f11', name: 'IMG_20231104.jpg',            ext: 'jpg',  correctFolder: 'freizeit',   hint: 'Kamerafoto → Freizeit',    position: { x: 38, y: 62 } },
      { id: 'f12', name: 'Unbenannt.docx',              ext: 'docx', correctFolder: 'papierkorb', hint: 'Leer & unbenannt → Weg',   position: { x: 58, y: 56 } },
      { id: 'f13', name: 'klausurvorbereitung.txt',     ext: 'txt',  correctFolder: 'schule',     hint: 'Klausurvorbereitung = Schule', position: { x: 76, y: 60 } },
      { id: 'f14', name: 'spesen_november.xlsx',        ext: 'xlsx', correctFolder: 'arbeit',     hint: 'Spesenliste → Arbeit',     position: { x: 5,  y: 70 } },
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
  const [draggingFileId, setDraggingFileId] = useState<string | null>(null)
  const [hoverFolderId, setHoverFolderId] = useState<FolderId | null>(null)
  const [placements, setPlacements] = useState<Record<string, FolderId>>({})
  const [wrongMoves, setWrongMoves] = useState(0)
  const [timeLeft, setTimeLeft] = useState(90)
  const [flashFolderId, setFlashFolderId] = useState<FolderId | null>(null)
  const [xpEarned, setXpEarned] = useState(0)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const level = LEVELS[selectedLevel - 1]
  const remainingFiles = level.files.filter(f => !placements[f.id])

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window)
  }, [])

  const endGame = useCallback((won: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current)
    playGameOver()
    const placedCorrect = Object.entries(placements).filter(([id, fid]) => {
      const file = level.files.find(f => f.id === id)
      return file && file.correctFolder === fid
    }).length
    void placedCorrect
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
    setDraggingFileId(null)
    setHoverFolderId(null)
    setWrongMoves(0)
    setTimeLeft(level.timeLimitSeconds)
    setXpEarned(0)
    setPhase('playing')
  }

  function placeFile(fileId: string, folderId: FolderId) {
    const file = level.files.find(f => f.id === fileId)
    if (!file) return

    if (file.correctFolder === folderId) {
      playCorrect()
      const newPlacements = { ...placements, [fileId]: folderId }
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

  // Touch / click interaction (fallback or primary on touch devices)
  function handleFileClick(fileId: string) {
    if (phase !== 'playing') return
    playClick()
    setSelectedFileId(prev => prev === fileId ? null : fileId)
  }

  function handleFolderClick(folderId: FolderId) {
    if (!selectedFileId || phase !== 'playing') return
    placeFile(selectedFileId, folderId)
  }

  // Drag-and-drop handlers
  function handleDragStart(e: React.DragEvent, fileId: string) {
    e.dataTransfer.setData('text/plain', fileId)
    e.dataTransfer.effectAllowed = 'move'
    setDraggingFileId(fileId)
  }

  function handleDragEnd() {
    setDraggingFileId(null)
    setHoverFolderId(null)
  }

  function handleFolderDragOver(e: React.DragEvent, folderId: FolderId) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setHoverFolderId(folderId)
  }

  function handleFolderDrop(e: React.DragEvent, folderId: FolderId) {
    e.preventDefault()
    const fileId = e.dataTransfer.getData('text/plain')
    setDraggingFileId(null)
    setHoverFolderId(null)
    if (fileId) placeFile(fileId, folderId)
  }

  const timerPct = (timeLeft / level.timeLimitSeconds) * 100
  const timerColor = timeLeft > 20 ? 'bg-emerald-500' : timeLeft > 10 ? 'bg-amber-500' : 'bg-rose-500'

  // ── Idle screen ───────────────────────────────────────────────────────────

  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16 text-center min-h-[calc(100vh-3.5rem)]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full"
          >
            <div className="font-mono text-sm font-semibold text-amber-600 dark:text-amber-400 mb-3">⟨pc/⟩</div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Desktop Chaos Cleanup</h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Dein Desktop ist ein totales Chaos! Sortiere alle Dateien in die richtigen Ordner — durch Drag & Drop direkt auf dem Desktop.
            </p>

            <div className="flex justify-center gap-3 mb-8">
              {FOLDERS.map(f => (
                <div key={f.id} className={cn('flex flex-col items-center gap-1 px-3 py-2 rounded-xl border-2 bg-muted/30', f.border)}>
                  <span className="text-2xl">{f.icon}</span>
                  <span className="text-xs font-semibold text-muted-foreground">{f.label}</span>
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
      <div className="flex flex-col items-center justify-center px-4 py-16 text-center min-h-[calc(100vh-3.5rem)]">
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
      </div>
    )
  }

  // ── Game screen — full visual desktop ─────────────────────────────────────

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden select-none" style={{ background: 'linear-gradient(160deg, #1a2744 0%, #0d1b2a 60%, #0a1628 100%)' }}>

      {/* HUD bar */}
      <div className="relative z-50 flex items-center justify-between px-4 py-2 bg-black/40 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-1.5 font-bold text-white text-sm">
          <FolderOpen className="h-4 w-4 text-amber-400" />
          <span className="text-amber-300">{remainingFiles.length}</span>
          <span className="text-white/60">übrig</span>
        </div>
        <div className={cn('font-mono font-bold text-lg tabular-nums transition-colors', timeLeft <= 10 ? 'text-rose-400' : timeLeft <= 20 ? 'text-amber-400' : 'text-white')}>
          <Timer className="h-4 w-4 inline mr-1 opacity-70" />{timeLeft}s
        </div>
        <div className="text-sm text-white/60">
          ❌ <span className="text-white/80 font-semibold">{wrongMoves}</span> Fehler
        </div>
      </div>

      {/* Timer bar */}
      <div className="relative z-50 h-1 bg-white/10">
        <motion.div
          className={`h-full transition-colors ${timerColor}`}
          animate={{ width: `${timerPct}%` }}
          transition={{ duration: 0.9, ease: 'linear' }}
        />
      </div>

      {/* Desktop area — files scattered */}
      <div className="relative flex-1" style={{ paddingBottom: '5.5rem' }}>
        {/* Subtle desktop grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        {/* Mission hint */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-black/50 backdrop-blur-sm text-white/70 text-xs px-3 py-1 rounded-full border border-white/10">
            {isTouchDevice ? 'Datei antippen → Ordner antippen' : 'Dateien per Drag & Drop in die Ordner ziehen'}
          </div>
        </div>

        {/* File icons scattered on desktop */}
        <AnimatePresence>
          {remainingFiles.map(file => {
            const isSelected = selectedFileId === file.id
            const isDragging = draggingFileId === file.id

            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0, transition: { duration: 0.25 } }}
                style={{ position: 'absolute', left: `${file.position.x}%`, top: `${file.position.y}%` }}
              >
                {/* Use a plain div for HTML5 drag to avoid Framer Motion drag type conflict */}
                <div
                  draggable={!isTouchDevice}
                  onDragStart={isTouchDevice ? undefined : (e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, file.id)}
                  onDragEnd={isTouchDevice ? undefined : handleDragEnd}
                  onClick={isTouchDevice ? () => handleFileClick(file.id) : undefined}
                  title={file.hint}
                  className={cn(
                    'flex flex-col items-center gap-1 w-16 transition-transform duration-75 group',
                    !isTouchDevice && 'cursor-grab active:cursor-grabbing hover:scale-110',
                    isDragging && 'opacity-50',
                    isTouchDevice && 'cursor-pointer active:scale-95',
                  )}
                >
                  {/* Icon */}
                  <div className={cn(
                    'w-12 h-12 flex items-center justify-center rounded-lg border-2 transition-all duration-150 text-3xl',
                    isSelected
                      ? 'border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/40'
                      : 'border-white/20 bg-white/10 group-hover:border-white/40 group-hover:bg-white/15',
                  )}>
                    {EXT_ICONS[file.ext] ?? '📄'}
                  </div>
                  {/* Label */}
                  <span className={cn(
                    'text-[9px] font-medium text-center leading-tight max-w-[72px] px-1 py-0.5 rounded',
                    isSelected ? 'bg-amber-500/30 text-amber-200' : 'bg-black/50 text-white/80',
                    'line-clamp-2 break-all',
                  )}>
                    {file.name}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {remainingFiles.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-white/60 text-lg font-semibold"
            >
              ✨ Desktop aufgeräumt!
            </motion.div>
          </div>
        )}
      </div>

      {/* Taskbar with folder drop targets */}
      <div className="relative z-50 h-20 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-around px-4">
        {FOLDERS.map(folder => {
          const isHovered = hoverFolderId === folder.id
          const isFlashing = flashFolderId === folder.id
          const isActive = draggingFileId !== null || selectedFileId !== null

          return (
            <motion.button
              key={folder.id}
              onDragOver={isTouchDevice ? undefined : (e) => handleFolderDragOver(e, folder.id)}
              onDragLeave={isTouchDevice ? undefined : () => setHoverFolderId(null)}
              onDrop={isTouchDevice ? undefined : (e) => handleFolderDrop(e, folder.id)}
              onClick={isTouchDevice ? () => handleFolderClick(folder.id) : undefined}
              animate={
                isFlashing
                  ? { borderColor: 'hsl(0 72% 51%)', backgroundColor: 'hsl(0 72% 51% / 0.3)' }
                  : isHovered
                  ? { scale: 1.12, borderColor: 'hsl(var(--border))', backgroundColor: 'rgba(255,255,255,0.15)' }
                  : isActive
                  ? { scale: 1.04 }
                  : { scale: 1 }
              }
              transition={{ duration: 0.15 }}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border-2 transition-colors min-w-[64px]',
                folder.bg, folder.border,
                isActive ? 'cursor-pointer shadow-lg' : 'opacity-70',
                isHovered && `shadow-xl ${folder.glow}`,
              )}
            >
              <span className="text-2xl">{folder.icon}</span>
              <span className={cn('text-[10px] font-bold', folder.color)}>{folder.label}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
