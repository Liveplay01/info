'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { FolderOpen, Zap, Wrench, Keyboard, Command, GraduationCap } from 'lucide-react'
import { loadSkillProgress, getLevelInfo, type SkillArea, type LevelInfo } from '@/lib/skill-system'

const SKILL_CONFIG: Record<SkillArea, { label: string; Icon: React.ElementType; color: string; bg: string }> = {
  organisation:   { label: 'Organisation',    Icon: FolderOpen,     color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-100 dark:bg-amber-900/40' },
  effizienz:      { label: 'Effizienz',       Icon: Zap,            color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/40' },
  problemloesung: { label: 'Problemlösung',   Icon: Wrench,         color: 'text-rose-600 dark:text-rose-400',     bg: 'bg-rose-100 dark:bg-rose-900/40' },
  tippen:         { label: 'Tippen',          Icon: Keyboard,       color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
  shortcuts:      { label: 'Shortcuts',       Icon: Command,        color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-100 dark:bg-blue-900/40' },
  algorithmen:    { label: 'Algorithmen',     Icon: GraduationCap,  color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/40' },
}

interface SkillRow {
  area: SkillArea
  levelInfo: LevelInfo
}

export function SkillBadge() {
  const [skills, setSkills] = useState<SkillRow[]>([])

  useEffect(() => {
    const sp = loadSkillProgress()
    const rows: SkillRow[] = (Object.keys(sp.skills) as SkillArea[])
      .filter(a => sp.skills[a].totalRounds > 0)
      .sort((a, b) => sp.skills[b].totalRounds - sp.skills[a].totalRounds)
      .slice(0, 2)
      .map(a => ({ area: a, levelInfo: getLevelInfo(a, sp.skills[a].totalXP) }))
    setSkills(rows)
  }, [])

  return (
    <AnimatePresence>
      {skills.length > 0 && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26, delay: 0.4 }}
          className="fixed bottom-5 right-5 z-50"
        >
          <Link
            href="/games"
            className="flex flex-col gap-2.5 rounded-xl border bg-card/95 backdrop-blur-sm shadow-lg px-4 py-3 hover:shadow-xl transition-shadow group min-w-[200px]"
          >
            {skills.map(({ area, levelInfo }) => {
              const cfg = SKILL_CONFIG[area]
              return (
                <div key={area} className="flex items-center gap-2.5">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${cfg.bg}`}>
                    <cfg.Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-muted-foreground leading-none mb-1">
                      {cfg.label} · Lvl {levelInfo.level}
                    </p>
                    <p className="text-xs font-semibold leading-none mb-1.5">{levelInfo.name}</p>
                    <div className="h-1 w-20 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${cfg.color.replace('text-', 'bg-')}`}
                        style={{ width: `${Math.min(100, (levelInfo.progressXP / levelInfo.neededXP) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
            <p className="text-[10px] text-muted-foreground/60 text-center -mb-0.5 group-hover:text-violet-500 transition-colors">
              Zur Spielhalle →
            </p>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
