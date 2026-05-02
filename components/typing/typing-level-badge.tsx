'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Keyboard } from 'lucide-react'

interface TypingProgress {
  totalXP: number
  personalBests: Record<string, number>
  totalRounds: number
}

function totalXpForLevel(n: number): number {
  return (n * (n + 1)) / 2 * 100
}

function getLevelInfo(totalXP: number) {
  let level = 1
  while (totalXpForLevel(level + 1) <= totalXP) level++
  const progressXP = totalXP - totalXpForLevel(level)
  const neededXP = (level + 1) * 100
  const names = [
    '', 'Anfänger', 'Lernender', 'Geübter', 'Fortgeschrittener',
    'Experte', 'Meister', 'Virtuose', 'Legende', 'Champion', 'Grandmaster',
  ]
  return {
    level,
    progressXP,
    neededXP,
    name: names[Math.min(level, names.length - 1)],
  }
}

export function TypingLevelBadge() {
  const [info, setInfo] = useState<ReturnType<typeof getLevelInfo> | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('typing-progress')
      if (!raw) return
      const p: TypingProgress = JSON.parse(raw)
      if (p.totalRounds > 0) {
        setInfo(getLevelInfo(p.totalXP))
      }
    } catch {}
  }, [])

  return (
    <AnimatePresence>
      {info && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26, delay: 0.4 }}
          className="fixed bottom-5 right-5 z-50"
        >
          <Link
            href="/typing/spiel"
            className="flex items-center gap-3 rounded-xl border bg-card/95 backdrop-blur-sm shadow-lg px-4 py-3 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 shrink-0">
              <Keyboard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground leading-none mb-1">Tippen · Level {info.level}</p>
              <p className="text-sm font-semibold leading-none">{info.name}</p>
              <div className="mt-2 h-1 w-24 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${Math.min(100, (info.progressXP / info.neededXP) * 100)}%` }}
                />
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
