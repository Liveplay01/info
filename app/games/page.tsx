'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { FolderOpen, Zap, Wrench, Keyboard, Command, GraduationCap } from 'lucide-react'
import { loadSkillProgress, getLevelInfo, type SkillArea, type LevelInfo } from '@/lib/skill-system'
import { cn } from '@/lib/utils'

// ── Game entries ──────────────────────────────────────────────────────��──────

interface GameEntry {
  href: string
  label: string
  emoji: string
  skillArea: SkillArea
  flavor: string
  desc: string
}

const GAMES: GameEntry[] = [
  { href: '/sort/interview-trainer', label: 'Interview-Trainer',      emoji: '🧠', skillArea: 'algorithmen',    flavor: 'Java · Algorithmen',   desc: 'Sortieralgorithmen-Quiz für Prüfung & Bewerbung' },
  { href: '/typing/spiel',           label: 'Tipp-Spiel',             emoji: '⌨️', skillArea: 'tippen',         flavor: 'PC · Tippen',           desc: 'WPM-Trainer mit Streak-Bonus und Levels' },
  { href: '/shortcuts/trainer',      label: 'Shortcut-Trainer',       emoji: '⚡', skillArea: 'shortcuts',      flavor: 'PC · Shortcuts',        desc: '60s Shortcut-Quiz mit Streak-Multiplikator' },
  { href: '/pc/desktop-cleanup',     label: 'Desktop Cleanup',        emoji: '🗂️', skillArea: 'organisation',   flavor: 'PC · Organisation',     desc: 'Chaotische Dateien gegen die Zeit sortieren' },
  { href: '/shortcuts/rush',         label: 'Shortcut Rush',          emoji: '🚀', skillArea: 'effizienz',      flavor: 'PC · Effizienz',        desc: 'Workflow-Shortcuts mit Combo-Multiplikator' },
  { href: '/pc/bug-fixer',           label: 'Bug Fixer',              emoji: '🛠️', skillArea: 'problemloesung', flavor: 'PC · Problemlösung',    desc: 'PC-Probleme durch Windows-Navigation lösen' },
]

// ── Skill config ────────────────────────────────────────────────────────���────

const SKILL_CONFIG: Record<SkillArea, { label: string; Icon: React.ElementType; color: string; bg: string; bar: string }> = {
  organisation:   { label: 'Organisation',    Icon: FolderOpen,    color: 'text-amber-600 dark:text-amber-400',    bg: 'bg-amber-100 dark:bg-amber-900/30',    bar: 'bg-amber-500' },
  effizienz:      { label: 'Effizienz',       Icon: Zap,           color: 'text-violet-600 dark:text-violet-400',  bg: 'bg-violet-100 dark:bg-violet-900/30',  bar: 'bg-violet-500' },
  problemloesung: { label: 'Problemlösung',   Icon: Wrench,        color: 'text-rose-600 dark:text-rose-400',      bg: 'bg-rose-100 dark:bg-rose-900/30',      bar: 'bg-rose-500' },
  tippen:         { label: 'Tippen',          Icon: Keyboard,      color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', bar: 'bg-emerald-500' },
  shortcuts:      { label: 'Shortcuts',       Icon: Command,       color: 'text-blue-600 dark:text-blue-400',      bg: 'bg-blue-100 dark:bg-blue-900/30',      bar: 'bg-blue-500' },
  algorithmen:    { label: 'Algorithmen',     Icon: GraduationCap, color: 'text-indigo-600 dark:text-indigo-400',  bg: 'bg-indigo-100 dark:bg-indigo-900/30',  bar: 'bg-indigo-500' },
}

// ── Daily challenge ───────────────────────────────────────────────────────────

interface DailyChallenge {
  title: string
  desc: string
  href: string
  skillArea: SkillArea
  emoji: string
}

const DAILY_TEMPLATES: DailyChallenge[] = [
  { title: 'Shortcut-Sprint',    desc: 'So viele Shortcuts wie möglich in 60 Sekunden',     href: '/shortcuts/trainer',      skillArea: 'shortcuts',      emoji: '⚡' },
  { title: 'Tipp-Rekord',        desc: 'Schlage deinen WPM-Rekord im Wörter-Modus (60s)',   href: '/typing/spiel',           skillArea: 'tippen',         emoji: '⌨️' },
  { title: 'Algorithmus-Quiz',   desc: 'Beantworte Fragen über Sortieralgorithmen',          href: '/sort/interview-trainer', skillArea: 'algorithmen',    emoji: '🧠' },
  { title: 'Desktop aufräumen',  desc: 'Bestehe Level 2 des Desktop Chaos Cleanup',          href: '/pc/desktop-cleanup',     skillArea: 'organisation',   emoji: '🗂️' },
  { title: 'Rush Workflow',      desc: 'Schließe möglichst viele Workflows im Shortcut Rush ab', href: '/shortcuts/rush',    skillArea: 'effizienz',      emoji: '🚀' },
  { title: 'Bug-Jagd',           desc: 'Löse 3 PC-Probleme ohne Hints',                      href: '/pc/bug-fixer',           skillArea: 'problemloesung', emoji: '🛠️' },
  { title: 'Gemischter Tag',     desc: 'Spiele dein stärktes Minigame und hol dir XP',      href: '/games',                  skillArea: 'tippen',         emoji: '🎮' },
]

function getDailyChallenge(): DailyChallenge {
  const d = new Date()
  const start = new Date(d.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((d.getTime() - start.getTime()) / 86400000)
  return DAILY_TEMPLATES[dayOfYear % DAILY_TEMPLATES.length]
}

// ── Skill row ─────────────────────────────────────────────────────────────────

function SkillRow({ area, levelInfo }: { area: SkillArea; levelInfo: LevelInfo }) {
  const cfg = SKILL_CONFIG[area]
  const pct = Math.min(100, (levelInfo.progressXP / levelInfo.neededXP) * 100)
  return (
    <div className="flex items-center gap-3">
      <div className={cn('flex items-center justify-center w-8 h-8 rounded-lg shrink-0', cfg.bg)}>
        <cfg.Icon className={cn('h-3.5 w-3.5', cfg.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold">{cfg.label}</span>
          <span className={cn('text-[11px] font-medium', cfg.color)}>Lvl {levelInfo.level} · {levelInfo.name}</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div className={cn('h-full rounded-full transition-all', cfg.bar)} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GamesPage() {
  const [skillData, setSkillData] = useState<{ area: SkillArea; levelInfo: LevelInfo }[]>([])
  const daily = getDailyChallenge()
  const dailySkillCfg = SKILL_CONFIG[daily.skillArea]

  useEffect(() => {
    const sp = loadSkillProgress()
    const rows = (Object.keys(sp.skills) as SkillArea[]).map(area => ({
      area,
      levelInfo: getLevelInfo(area, sp.skills[area].totalXP),
    }))
    setSkillData(rows)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="font-mono text-sm font-semibold text-violet-600 dark:text-violet-400 mb-1">⟨games/⟩</div>
          <h1 className="text-3xl font-bold tracking-tight">Spielhalle</h1>
          <p className="text-muted-foreground mt-1.5">6 Minigames — Punkte sammeln, Level aufsteigen, besser werden.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Games grid */}
          <div className="lg:col-span-2 space-y-6">

            {/* Daily challenge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link
                href={daily.href}
                className="flex items-start gap-4 rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/20 p-5 hover:shadow-lg transition-all group"
              >
                <div className="text-4xl">{daily.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-200 dark:bg-violet-800 text-violet-700 dark:text-violet-300">
                      Heutige Challenge
                    </span>
                    <span className={cn('text-[11px] font-medium', dailySkillCfg.color)}>
                      {dailySkillCfg.label}
                    </span>
                  </div>
                  <p className="font-bold text-base group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {daily.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">{daily.desc}</p>
                </div>
                <span className="text-sm font-semibold text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
                  Spielen →
                </span>
              </Link>
            </motion.div>

            {/* Game grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GAMES.map((game, i) => {
                const skillRow = skillData.find(s => s.area === game.skillArea)
                const cfg = SKILL_CONFIG[game.skillArea]
                return (
                  <motion.div
                    key={game.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 + 0.15, type: 'spring', stiffness: 260, damping: 24 }}
                  >
                    <Link
                      href={game.href}
                      className="group flex flex-col h-full rounded-xl border-2 border-border bg-card p-5 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-3xl">{game.emoji}</span>
                        {skillRow && (
                          <div className={cn('flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold', cfg.bg, cfg.color)}>
                            <cfg.Icon className="h-3 w-3" />
                            Lvl {skillRow.levelInfo.level}
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground font-medium mb-1">{game.flavor}</p>
                      <h3 className="text-sm font-bold mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {game.label}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed flex-1">{game.desc}</p>
                      <div className="mt-3 text-xs font-semibold text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        Jetzt spielen →
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Right: Skill overview */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 24 }}
            className="space-y-4"
          >
            <div className="rounded-xl border bg-card p-5">
              <h2 className="text-sm font-bold mb-4">Skill-Übersicht</h2>
              <div className="space-y-4">
                {skillData.map(({ area, levelInfo }) => (
                  <SkillRow key={area} area={area} levelInfo={levelInfo} />
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground mb-1">So verdienst du XP</p>
              <ul className="space-y-1">
                <li>⌨️ Tipp-Spiel: WPM × Zeit × Genauigkeit</li>
                <li>⚡ Shortcut-Trainer: Punkte × 0.5</li>
                <li>🧠 Interview-Trainer: Trefferquote × 80</li>
                <li>🗂️ Desktop Cleanup: Basis + Speed − Fehler</li>
                <li>🚀 Shortcut Rush: Score × 0.8 + Workflows × 15</li>
                <li>🛠️ Bug Fixer: Basis − Hints × 20 + Restzeit</li>
              </ul>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  )
}
