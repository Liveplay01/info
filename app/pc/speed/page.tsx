'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Zap, HardDrive, Cpu, Trash2, ChevronRight,
  ArrowRight, AlertTriangle, Check, X, RotateCcw,
} from 'lucide-react'
import { playToggleOn, playToggleOff, playFlip, playReveal, playComplete, playClick } from '@/lib/sounds'

// ── Shared helpers ──────────────────────────────────────────────────────────

function useSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return { ref, inView }
}

function SectionHeading({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm font-bold shrink-0">
        {number}
      </span>
      <h2 className="text-2xl font-bold tracking-tight">{children}</h2>
    </div>
  )
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-5 py-4 text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
      {children}
    </div>
  )
}

function WarnBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-5 py-4 text-sm text-amber-900 dark:text-amber-200 leading-relaxed flex gap-3">
      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// ── 1. Startup List Demo ────────────────────────────────────────────────────

type StartupEntry = { name: string; impact: 'Hoch' | 'Mittel' | 'Gering'; enabled: boolean; time: number }

const initialStartup: StartupEntry[] = [
  { name: 'Microsoft Teams', impact: 'Hoch', enabled: true, time: 4.2 },
  { name: 'Spotify', impact: 'Mittel', enabled: true, time: 1.8 },
  { name: 'Steam', impact: 'Hoch', enabled: true, time: 3.5 },
  { name: 'Discord', impact: 'Mittel', enabled: true, time: 2.1 },
  { name: 'OneDrive', impact: 'Gering', enabled: true, time: 0.6 },
  { name: 'Windows Security', impact: 'Gering', enabled: true, time: 0.3 },
]

const impactColor: Record<string, string> = {
  Hoch: 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30',
  Mittel: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
  Gering: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30',
}

function StartupListDemo() {
  const [items, setItems] = useState(initialStartup)

  function toggle(i: number) {
    setItems((prev) => {
      const next = prev.map((e, idx) => (idx === i ? { ...e, enabled: !e.enabled } : e))
      if (next[i].enabled) playToggleOn(); else playToggleOff()
      return next
    })
  }

  const totalEnabled = items.filter((e) => e.enabled).reduce((s, e) => s + e.time, 0)
  const totalAll = items.reduce((s, e) => s + e.time, 0)
  const saved = totalAll - totalEnabled

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-b border-border text-xs text-muted-foreground font-semibold">
        <span>Programm</span>
        <div className="flex items-center gap-6">
          <span>Startzeit-Einfluss</span>
          <span>Aktiv</span>
        </div>
      </div>

      {items.map((item, i) => (
        <motion.div
          key={item.name}
          animate={{ opacity: item.enabled ? 1 : 0.45 }}
          className="flex items-center justify-between px-4 py-3 border-b border-border/50 last:border-0"
        >
          <motion.span
            animate={{ textDecoration: item.enabled ? 'none' : 'line-through' }}
            className="text-sm font-medium"
          >
            {item.name}
          </motion.span>
          <div className="flex items-center gap-6">
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${impactColor[item.impact]}`}>
              {item.impact}
            </span>
            <button
              onClick={() => toggle(i)}
              className={`relative w-9 h-5 rounded-full transition-colors ${item.enabled ? 'bg-cyan-500' : 'bg-muted'}`}
            >
              <motion.div
                animate={{ x: item.enabled ? 16 : 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>
        </motion.div>
      ))}

      {/* Summary bar */}
      <div className="px-4 py-4 bg-muted/20 border-t border-border">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted-foreground">Startzeit-Einfluss</span>
          <span className="font-semibold">
            ~{totalEnabled.toFixed(1)}s
            {saved > 0 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-emerald-600 dark:text-emerald-400 ml-2"
              >
                (−{saved.toFixed(1)}s gespart)
              </motion.span>
            )}
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-cyan-500"
            animate={{ width: `${(totalEnabled / totalAll) * 100}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Klicke die Toggles um Programme zu deaktivieren — das ist nur eine Demo, nichts wird wirklich geändert.
        </p>
      </div>
    </div>
  )
}

// ── 2. Disk Usage Visual ────────────────────────────────────────────────────

const diskCategories = [
  { label: 'Windows & System', gb: 38, color: 'bg-blue-500' },
  { label: 'Programme & Apps', gb: 24, color: 'bg-violet-500' },
  { label: 'Dokumente & Bilder', gb: 18, color: 'bg-emerald-500' },
  { label: 'Temp & Cache', gb: 12, color: 'bg-amber-500' },
  { label: 'Downloads', gb: 15, color: 'bg-orange-500' },
  { label: 'Frei', gb: 13, color: 'bg-muted' },
]

const totalGb = diskCategories.reduce((s, c) => s + c.gb, 0)

function DiskUsageVisual() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold flex items-center gap-2"><HardDrive className="h-4 w-4" /> Lokaler Datenträger (C:)</span>
        <span className="text-muted-foreground text-xs">{totalGb - 13} GB belegt von {totalGb} GB</span>
      </div>

      {/* Segmented bar */}
      <div className="h-6 rounded-full overflow-hidden flex">
        {diskCategories.map((cat, i) => (
          <motion.div
            key={cat.label}
            className={`h-full ${cat.color}`}
            initial={{ width: 0 }}
            animate={inView ? { width: `${(cat.gb / totalGb) * 100}%` } : {}}
            transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
            title={`${cat.label}: ${cat.gb} GB`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {diskCategories.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08 + 0.3 }}
            className="flex items-center gap-2 text-xs"
          >
            <span className={`w-2.5 h-2.5 rounded-sm shrink-0 ${cat.color}`} />
            <span className="text-muted-foreground truncate">{cat.label}</span>
            <span className="font-mono font-semibold ml-auto">{cat.gb}G</span>
          </motion.div>
        ))}
      </div>

      <div className="pt-1 text-xs text-muted-foreground">
        💡 <strong>Temp & Cache</strong> und <strong>Downloads</strong> lassen sich meist problemlos leeren — das sind zusammen {12 + 15} GB.
      </div>
    </div>
  )
}

// ── 3. RAM Visual ───────────────────────────────────────────────────────────

const ramPrograms = [
  { name: 'Windows & System', gb: 1.8, color: 'bg-blue-400' },
  { name: 'Chrome (8 Tabs)', gb: 1.4, color: 'bg-yellow-400' },
  { name: 'VS Code', gb: 0.8, color: 'bg-blue-600' },
  { name: 'Spotify', gb: 0.4, color: 'bg-emerald-400' },
  { name: 'Teams', gb: 0.6, color: 'bg-violet-400' },
  { name: 'Frei', gb: 2.6, color: 'bg-muted' },
]
const totalRam = ramPrograms.reduce((s, p) => s + p.gb, 0) // 8 GB

function RAMUsageVisual() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold flex items-center gap-2"><Cpu className="h-4 w-4" /> Arbeitsspeicher (RAM)</span>
        <span className="text-muted-foreground text-xs">{totalRam - 2.6} GB belegt von {totalRam} GB</span>
      </div>

      {/* Block-layout RAM visualization */}
      <div className="flex rounded-lg overflow-hidden h-10 border border-border">
        {ramPrograms.map((p, i) => (
          <motion.div
            key={p.name}
            className={`h-full ${p.color} relative group`}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            style={{ width: `${(p.gb / totalRam) * 100}%`, transformOrigin: 'left' }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
            title={`${p.name}: ${p.gb} GB`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-1.5">
        {ramPrograms.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, x: -8 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.07 + 0.4 }}
            className="flex items-center gap-2 text-xs"
          >
            <span className={`w-2.5 h-2.5 rounded-sm shrink-0 ${p.color}`} />
            <span className="text-muted-foreground flex-1">{p.name}</span>
            <span className="font-mono font-semibold">{p.gb.toFixed(1)} GB</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── 4. Myth Cards ───────────────────────────────────────────────────────────

const myths = [
  {
    myth: '"CCleaner macht meinen PC deutlich schneller"',
    truth: 'CCleaner kann etwas Speicher freigeben, hat aber kaum messbaren Einfluss auf die Geschwindigkeit. Windows selbst verwaltet Cache und Temp-Dateien gut. Riskant: Die Registry-Bereinigung kann Fehler verursachen.',
    verdict: false,
  },
  {
    myth: '"RAM-Cleaner / Memory-Booster helfen"',
    truth: 'RAM-Cleaner leeren den Arbeitsspeicher, der dann von Windows erst wieder befüllt werden muss — das macht den PC tatsächlich langsamer. Windows verwaltet RAM von allein optimal.',
    verdict: false,
  },
  {
    myth: '"Mehr Chrome-Tabs = immer langsamer"',
    truth: 'Teils wahr: Chrome nutzt für jeden Tab etwas RAM. Aber modernes Tab-Freezing pausiert inaktive Tabs. Ein Tab zu viel merkt man kaum — 50+ Tabs gleichzeitig schon.',
    verdict: true,
  },
  {
    myth: '"Defragmentierung macht SSDs schneller"',
    truth: 'Falsch — bei SSDs ist Defragmentierung nutzlos und erhöht sogar den Verschleiß unnötig. Nur klassische Festplatten (HDD) profitieren davon. Windows erkennt SSDs und deaktiviert die Defragmentierung automatisch.',
    verdict: false,
  },
]

function MythCard({ myth, truth, verdict }: { myth: string; truth: string; verdict: boolean }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: 1200 }}
      onClick={() => { playFlip(); setFlipped((f) => !f) }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative min-h-[130px]"
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 flex flex-col justify-between backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 italic leading-relaxed">{myth}</p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-3">Tippen zum Aufdecken →</p>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-xl border-2 p-5 flex flex-col justify-between ${
            verdict
              ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20'
              : 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20'
          }`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex items-start gap-2">
            {verdict ? (
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            ) : (
              <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            )}
            <p className="text-sm leading-relaxed text-foreground">{truth}</p>
          </div>
          <div className={`text-xs mt-3 font-semibold ${verdict ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {verdict ? '⚠️ Teils wahr' : '✗ Mythos'}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function MythCards() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {myths.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 22 }}
        >
          <MythCard {...m} />
        </motion.div>
      ))}
    </div>
  )
}

// ── 5. Maintenance Checklist ────────────────────────────────────────────────

const maintenanceItems = [
  { label: 'Windows Update prüfen', freq: 'Monatlich', detail: 'Einstellungen → Windows Update' },
  { label: 'Downloads-Ordner aufräumen', freq: 'Wöchentlich', detail: 'Alles Unnötige löschen' },
  { label: 'Papierkorb leeren', freq: 'Wöchentlich', detail: 'Rechtsklick → Papierkorb leeren' },
  { label: 'Browser-Cache leeren', freq: 'Monatlich', detail: 'Ctrl+Shift+Del im Browser' },
  { label: 'Autostart überprüfen', freq: 'Vierteljährlich', detail: 'Task-Manager → Autostart' },
  { label: 'Festplatte bereinigen', freq: 'Monatlich', detail: 'Windows-Taste → "Datenträgerbereinigung"' },
  { label: 'Backup erstellen / prüfen', freq: 'Monatlich', detail: 'Wichtige Daten auf externer HDD / Cloud' },
]

function MaintenanceChecklist() {
  const [checked, setChecked] = useState<number[]>([])
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  function toggle(i: number) {
    setChecked((c) => {
      if (c.includes(i)) return c.filter((x) => x !== i)
      const next = [...c, i]
      if (next.length === maintenanceItems.length) playComplete()
      else playReveal()
      return next
    })
  }

  return (
    <div ref={ref} className="space-y-2">
      {maintenanceItems.map((item, i) => {
        const done = checked.includes(i)
        return (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.07, type: 'spring', stiffness: 200, damping: 22 }}
            onClick={() => toggle(i)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
              done
                ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-border bg-card hover:border-cyan-300 dark:hover:border-cyan-700'
            }`}
          >
            {/* SVG checkmark */}
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${done ? 'bg-emerald-500 border-emerald-500' : 'border-border'}`}>
              <AnimatePresence>
                {done && (
                  <motion.svg
                    key="check"
                    viewBox="0 0 12 10"
                    fill="none"
                    className="w-3.5 h-3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0 }}
                  >
                    <motion.path
                      d="M1 5L4.5 8.5L11 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium transition-colors ${done ? 'line-through text-muted-foreground' : ''}`}>
                {item.label}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{item.detail}</div>
            </div>

            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${
              item.freq === 'Wöchentlich'
                ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                : item.freq === 'Monatlich'
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                : 'bg-muted text-muted-foreground'
            }`}>
              {item.freq}
            </span>
          </motion.button>
        )
      })}

      {checked.length > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => { playClick(); setChecked([]) }}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mt-2 transition-colors"
        >
          <RotateCcw className="h-3 w-3" /> Zurücksetzen
        </motion.button>
      )}
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function SpeedPage() {
  const s1 = useSection()
  const s2 = useSection()
  const s3 = useSection()
  const s4 = useSection()
  const s5 = useSection()

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">⟨info/⟩</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-cyan-600 dark:text-cyan-400 font-semibold">PC schneller machen</span>
        </nav>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="font-mono text-sm font-semibold text-cyan-600 dark:text-cyan-400 mb-2">⟨speed/⟩</div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">PC schneller machen</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Ein langsamer PC ist meist kein Hardwareproblem — sondern eins aus zu vielen Autostart-Programmen, vollem Speicher und unnötigem Hintergrundlärm. Diese Guides helfen konkret.
          </p>
          <div className="mt-6">
            <InfoBox>
              <strong>Wichtig zuerst:</strong> Die meisten Tricks kosten nur 10 Minuten und brauchen keine Installation. Wir erklären auch, was <em>nicht</em> hilft — damit du keine Zeit mit Mythen verschwendest.
            </InfoBox>
          </div>
        </motion.div>

        {/* 1. Autostart */}
        <motion.section
          ref={s1.ref}
          variants={fadeUp}
          initial="hidden"
          animate={s1.inView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <SectionHeading number={1}>Autostart bereinigen</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Jedes Programm im Autostart verlangsamt den PC-Start. Viele installieren sich dort ungefragt. Deaktiviere, was du beim Start nicht sofort brauchst — du kannst es jederzeit manuell starten.
          </p>
          <StartupListDemo />
          <div className="mt-5">
            <InfoBox>
              <strong>So geht's:</strong> Ctrl+Shift+Esc → Task-Manager → Reiter „Autostart" → Rechtsklick auf ein Programm → „Deaktivieren". Dein PC startet danach spürbar schneller.
            </InfoBox>
          </div>
        </motion.section>

        {/* 2. Disk */}
        <motion.section
          ref={s2.ref}
          variants={fadeUp}
          initial="hidden"
          animate={s2.inView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <SectionHeading number={2}>Speicher freigeben</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Wenn die Festplatte über 90 % voll ist, wird Windows spürbar langsamer — es braucht freien Platz für temporäre Dateien. So sieht eine typische Belegung aus:
          </p>
          <DiskUsageVisual />
          <div className="mt-5 space-y-3">
            <InfoBox>
              <strong>Schnell Speicher freigeben:</strong> Windows-Taste → „Datenträgerbereinigung" → Laufwerk C: auswählen → Temp-Dateien, Papierkorb und Downloads bereinigen. Oft mehrere GB auf einmal.
            </InfoBox>
            <WarnBox>
              Lass den Ordner <code className="text-xs bg-amber-100 dark:bg-amber-900/40 px-1 rounded">C:\Windows</code> in Ruhe. System-Dateien niemals manuell löschen — das kann Windows beschädigen.
            </WarnBox>
          </div>
        </motion.section>

        {/* 3. RAM */}
        <motion.section
          ref={s3.ref}
          variants={fadeUp}
          initial="hidden"
          animate={s3.inView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <SectionHeading number={3}>Arbeitsspeicher (RAM) verstehen</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            RAM ist der "Schreibtisch" deines PCs — je mehr Programme gleichzeitig offen sind, desto voller wird er. Wenn RAM voll ist, lagert Windows auf die Festplatte aus, was alles langsam macht.
          </p>
          <RAMUsageVisual />
          <div className="mt-5 space-y-3">
            <InfoBox>
              <strong>Wie viel RAM brauche ich?</strong> Für normales Surfen und Büroarbeit: 8 GB. Für Gaming oder Video-Editing: 16 GB. Mehr als 32 GB brauchen die meisten Privatanwender nicht.
            </InfoBox>
            <WarnBox>
              RAM-Cleaner-Apps sind kontraproduktiv — sie leeren RAM, den Windows gleich wieder befüllen muss. Das macht den PC langsamer, nicht schneller.
            </WarnBox>
          </div>
        </motion.section>

        {/* 4. Mythen */}
        <motion.section
          ref={s4.ref}
          variants={fadeUp}
          initial="hidden"
          animate={s4.inView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <SectionHeading number={4}>Mythos oder Wahrheit?</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Das Internet ist voll von PC-Tipps, die nichts bringen — oder sogar schaden. Tippe auf eine Karte um die Wahrheit zu sehen.
          </p>
          <MythCards />
        </motion.section>

        {/* 5. Wartung */}
        <motion.section
          ref={s5.ref}
          variants={fadeUp}
          initial="hidden"
          animate={s5.inView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <SectionHeading number={5}>Regelmäßige Wartung</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Ein PC der regelmäßig gepflegt wird bleibt dauerhaft schnell. Diese Checkliste zeigt was wann sinnvoll ist — hake ab was du heute schon gemacht hast.
          </p>
          <MaintenanceChecklist />
        </motion.section>

        {/* Footer CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="border-t border-border pt-10 flex flex-wrap gap-4"
        >
          <Link
            href="/pc/safe"
            className="group flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-border hover:border-rose-400/60 bg-card transition-all hover:shadow-md text-sm font-semibold"
          >
            ← PC-Sicherheit
          </Link>
          <Link
            href="/pc/files"
            className="group flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-border hover:border-amber-400/60 bg-card transition-all hover:shadow-md text-sm font-semibold"
          >
            ← Dateien organisieren
          </Link>
        </motion.div>
    </div>
  )
}
