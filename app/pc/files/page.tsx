'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Folder, FolderOpen, File, Search, ArrowRight,
  ChevronRight, Check, X, AlertTriangle, RefreshCw,
} from 'lucide-react'

// ── Shared helpers ──────────────────────────────────────────────────────────

function useSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return { ref, inView }
}

function SectionHeading({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-bold shrink-0">
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

// ── 1. Chaos vs. Order ──────────────────────────────────────────────────────

const chaosFiles = [
  'dokument_final.docx', 'dokument_final2.docx', 'WICHTIG.pdf', 'unbenannt(3).jpg',
  'steuern copy.xlsx', 'passwörter.txt', 'video.mp4', 'neues dok.docx',
]
const orderedTree = [
  { name: '📁 Dokumente', children: ['📁 Steuern 2024', '📁 Verträge', '📁 Bewerbungen'] },
  { name: '📁 Bilder', children: ['📁 Urlaub 2024', '📁 Familie'] },
  { name: '📁 Projekte', children: ['📁 Projekt_A', '📁 Schule'] },
]

function FolderChaosVsOrder() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Chaos */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="rounded-xl border-2 border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/10 p-4"
      >
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-rose-700 dark:text-rose-400">
          <X className="h-4 w-4" /> Chaotisch
        </div>
        <div className="space-y-1.5">
          {chaosFiles.map((f, i) => (
            <motion.div
              key={f}
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <File className="h-3 w-3 shrink-0 text-rose-400" />
              <span className="truncate font-mono">{f}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Ordered */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10 p-4"
      >
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          <Check className="h-4 w-4" /> Organisiert
        </div>
        <div className="space-y-2">
          {orderedTree.map((folder, i) => (
            <motion.div
              key={folder.name}
              initial={{ opacity: 0, x: 8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1 + 0.15, type: 'spring', stiffness: 200, damping: 22 }}
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1">
                <FolderOpen className="h-3.5 w-3.5 text-amber-500" />
                {folder.name}
              </div>
              {folder.children.map((c, j) => (
                <motion.div
                  key={c}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: i * 0.1 + j * 0.06 + 0.25 }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground pl-5"
                >
                  <Folder className="h-3 w-3 text-amber-400" />
                  {c}
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ── 2. Folder Tree Builder ──────────────────────────────────────────────────

type TreeNode = { name: string; icon: string; children?: TreeNode[] }

const exampleTree: TreeNode = {
  name: 'Eigene Dateien', icon: '🏠',
  children: [
    { name: 'Schule / Studium', icon: '📚', children: [
      { name: 'Semester 1', icon: '📁', children: [{ name: 'Mathe', icon: '📁' }, { name: 'Info', icon: '📁' }] },
      { name: 'Semester 2', icon: '📁' },
    ]},
    { name: 'Arbeit', icon: '💼', children: [
      { name: 'Projekte', icon: '📁', children: [{ name: 'Projekt_A', icon: '📁' }, { name: 'Projekt_B', icon: '📁' }] },
      { name: 'Rechnungen', icon: '📁' },
    ]},
    { name: 'Privat', icon: '🏡', children: [
      { name: 'Fotos', icon: '📷' },
      { name: 'Steuern', icon: '📋', children: [{ name: '2023', icon: '📁' }, { name: '2024', icon: '📁' }] },
    ]},
  ],
}

function flattenTree(node: TreeNode, depth = 0): { node: TreeNode; depth: number }[] {
  const result: { node: TreeNode; depth: number }[] = [{ node, depth }]
  if (node.children) node.children.forEach((c) => result.push(...flattenTree(c, depth + 1)))
  return result
}

const flatNodes = flattenTree(exampleTree)

function FolderTreeDemo() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} className="rounded-xl border border-border bg-card p-5 font-mono text-sm overflow-x-auto">
      {flatNodes.map(({ node, depth }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: i * 0.06, type: 'spring', stiffness: 220, damping: 24 }}
          style={{ paddingLeft: `${depth * 1.25}rem` }}
          className="flex items-center gap-1.5 py-0.5 text-xs"
        >
          <span>{node.icon}</span>
          <span className={depth === 0 ? 'font-bold text-foreground' : 'text-muted-foreground'}>
            {node.name}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

// ── 3. File Naming Comparison ───────────────────────────────────────────────

const namingPairs = [
  { bad: 'dokument(1) FINAL neu.docx', good: '2024-11_Mietvertrag_Berlin.pdf' },
  { bad: 'IMG_20231005_093412.jpg', good: '2023-10_Urlaub_Rom_Kolosseum.jpg' },
  { bad: 'passwörter.txt', good: 'NICHT_ALS_DATEI_SPEICHERN.txt' },
  { bad: 'Unbenannt kopie 2.xlsx', good: '2024_Steuern_Einnahmen.xlsx' },
]

function FileNamingComparison() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} className="space-y-3">
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1"><X className="h-3 w-3" /> So nicht</div>
        <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><Check className="h-3 w-3" /> Besser so</div>
      </div>
      {namingPairs.map((pair, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 22 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="flex items-center gap-2 rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 px-3 py-2 text-xs font-mono text-rose-800 dark:text-rose-300 break-all">
            <File className="h-3 w-3 shrink-0" /> {pair.bad}
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 text-xs font-mono text-emerald-800 dark:text-emerald-300 break-all">
            <File className="h-3 w-3 shrink-0" /> {pair.good}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ── 4. Search Demo ──────────────────────────────────────────────────────────

const searchOperators = [
  { op: 'datemodified:heute', desc: 'Dateien die heute geändert wurden' },
  { op: 'datemodified:diese Woche', desc: 'Dateien der letzten 7 Tage' },
  { op: 'kind:=document', desc: 'Nur Dokumente (Word, PDF, …)' },
  { op: 'kind:=image', desc: 'Nur Bilder' },
  { op: 'kind:=music', desc: 'Nur Audiodateien' },
  { op: 'size:>10MB', desc: 'Dateien größer als 10 MB' },
  { op: 'ext:.pdf', desc: 'Nur PDF-Dateien' },
  { op: 'ext:.xlsx', desc: 'Nur Excel-Dateien' },
]

const typewriterPhrases = ['steuern 2024', 'datemodified:heute', 'kind:=document', 'ext:.pdf']

function SearchDemo() {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [charIdx, setCharIdx] = useState(0)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const phrase = typewriterPhrases[phraseIdx]
    if (charIdx < phrase.length) {
      const t = setTimeout(() => {
        setDisplayed(phrase.slice(0, charIdx + 1))
        setCharIdx((c) => c + 1)
      }, 60)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => setShowResults(true), 300)
      const t2 = setTimeout(() => {
        setShowResults(false)
        setDisplayed('')
        setCharIdx(0)
        setPhraseIdx((p) => (p + 1) % typewriterPhrases.length)
      }, 2400)
      return () => { clearTimeout(t); clearTimeout(t2) }
    }
  }, [charIdx, phraseIdx])

  const fakeResults = ['Steuererklärung_2024.pdf', 'Steuern_Einnahmen.xlsx', 'Steuer_Quittungen.zip']

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div className="relative flex items-center rounded-lg border border-border bg-background px-3 py-2.5 gap-2">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-sm font-mono flex-1 min-h-[1.25rem]">
          {displayed}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-0.5 h-4 bg-foreground ml-0.5 align-middle"
          />
        </span>
      </div>
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-1.5"
          >
            {fakeResults.map((r, i) => (
              <motion.div
                key={r}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1.5 rounded-md hover:bg-muted"
              >
                <File className="h-3.5 w-3.5 shrink-0" />
                <span className="font-mono">{r}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SearchOperatorList() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {searchOperators.map((op, i) => (
        <motion.div
          key={op.op}
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.06, type: 'spring', stiffness: 200, damping: 22 }}
          className="flex gap-3 items-start rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
        >
          <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded border border-border/60 text-foreground shrink-0 mt-0.5">
            {op.op}
          </code>
          <span className="text-muted-foreground text-xs leading-relaxed">{op.desc}</span>
        </motion.div>
      ))}
    </div>
  )
}

// ── 5. Backup Steps ─────────────────────────────────────────────────────────

const backupSteps = [
  { icon: RefreshCw, title: 'Papierkorb nutzen', desc: 'Gelöschte Dateien landen zunächst im Papierkorb — du hast Zeit zum Wiederherstellen. Regelmäßig leeren spart Speicher.' },
  { icon: FolderOpen, title: 'Datei-Versionsverlauf aktivieren', desc: 'Windows merkt sich frühere Versionen deiner Dateien. Einstellungen → Update und Sicherheit → Sicherung → Laufwerk hinzufügen.' },
  { icon: Search, title: 'Cloud-Synchronisierung', desc: 'OneDrive, Google Drive oder iCloud sichern deine Dokumente automatisch in der Cloud — auch bei PC-Defekt geschützt.' },
  { icon: ArrowRight, title: '3-2-1-Regel', desc: '3 Kopien, auf 2 verschiedenen Medien, davon 1 außer Haus (Cloud). Für wichtige Daten die beste Strategie.' },
]

function BackupSteps() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} className="space-y-4">
      {backupSteps.map((step, i) => {
        const Icon = step.icon
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 200, damping: 22 }}
            className="flex gap-4 p-4 rounded-xl border border-border bg-card"
          >
            <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="font-semibold text-sm mb-1">{step.title}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{step.desc}</div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function FilesPage() {
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
          <span className="text-amber-600 dark:text-amber-400 font-semibold">Dateien organisieren</span>
        </nav>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="font-mono text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">⟨files/⟩</div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Dateien organisieren</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Ein aufgeräumter PC spart täglich Zeit. Mit einer guten Ordnerstruktur, sinnvollen Dateinamen und der Windows-Suche findest du jede Datei in Sekunden.
          </p>
          <div className="mt-6">
            <InfoBox>
              <strong>Der größte Zeitdieb:</strong> Dateien suchen. Studien zeigen, dass Büroangestellte bis zu <strong>2,5 Stunden pro Woche</strong> damit verbringen, Dateien zu suchen — Zeit, die eine gute Struktur komplett einspart.
            </InfoBox>
          </div>
        </motion.div>

        {/* 1. Chaos vs Ordnung */}
        <motion.section
          ref={s1.ref}
          variants={fadeUp}
          initial="hidden"
          animate={s1.inView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <SectionHeading number={1}>Warum Ordnung so wichtig ist</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Der Unterschied zwischen einem chaotischen und einem organisierten Desktop ist enorm — sowohl beim Finden von Dateien als auch beim Stresslevel.
          </p>
          <FolderChaosVsOrder />
        </motion.section>

        {/* 2. Ordnerstruktur */}
        <motion.section
          ref={s2.ref}
          variants={fadeUp}
          initial="hidden"
          animate={s2.inView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <SectionHeading number={2}>Gute Ordnerstruktur aufbauen</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Beginne mit wenigen Hauptordnern und baue von oben nach unten auf. Hier ein Beispiel das für Studium, Arbeit und Privates funktioniert:
          </p>
          <FolderTreeDemo />
          <div className="mt-5 space-y-3">
            <InfoBox>
              <strong>Drei Grundregeln:</strong> Maximal 3–4 Ebenen tief. Jede Datei hat genau einen richtigen Platz. Ordner nach Thema benennen, nicht nach Datum (dafür gibt es Dateinamen).
            </InfoBox>
            <WarnBox>
              Vermeide „Sonstiges" oder „Diverses" Ordner — dort landet alles und du findest nichts.
            </WarnBox>
          </div>
        </motion.section>

        {/* 3. Dateinamen */}
        <motion.section
          ref={s3.ref}
          variants={fadeUp}
          initial="hidden"
          animate={s3.inView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <SectionHeading number={3}>Sinnvolle Dateinamen</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Ein guter Dateiname macht klar was drin ist — ohne die Datei zu öffnen. Das Schema <code className="text-xs bg-muted px-1 rounded">JJJJ-MM_Thema_Details.ext</code> sortiert sich automatisch chronologisch.
          </p>
          <FileNamingComparison />
        </motion.section>

        {/* 4. Suche */}
        <motion.section
          ref={s4.ref}
          variants={fadeUp}
          initial="hidden"
          animate={s4.inView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <SectionHeading number={4}>Windows Suche meistern</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Die Windows-Suchleiste im Explorer kann weit mehr als nur nach Namen suchen. Mit diesen Operatoren findest du Dateien auch dann, wenn du den Namen nicht mehr weißt.
          </p>
          <div className="mb-5">
            <SearchDemo />
          </div>
          <SearchOperatorList />
          <div className="mt-5">
            <InfoBox>
              <strong>Tipp:</strong> Im Explorer oben in die Adressleiste klicken und den Suchbegriff direkt eingeben — oder Alt+D drücken und dann den Suchoperator tippen.
            </InfoBox>
          </div>
        </motion.section>

        {/* 5. Backup */}
        <motion.section
          ref={s5.ref}
          variants={fadeUp}
          initial="hidden"
          animate={s5.inView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <SectionHeading number={5}>Backup & Verlauf</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Die beste Ordnerstruktur hilft nichts, wenn der PC defekt wird oder Dateien versehentlich gelöscht werden. Diese Strategien sichern deine Daten ab.
          </p>
          <BackupSteps />
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
            href="/pc/speed"
            className="group flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-border hover:border-cyan-400/60 bg-card transition-all hover:shadow-md text-sm font-semibold"
          >
            Weiter: PC schneller machen
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
    </div>
  )
}
