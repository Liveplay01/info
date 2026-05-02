export type SkillArea =
  | 'organisation'
  | 'effizienz'
  | 'problemloesung'
  | 'tippen'
  | 'shortcuts'
  | 'algorithmen'

export interface SkillEntry {
  totalXP: number
  totalRounds: number
  lastPlayed: string
}

export interface SkillProgress {
  version: 1
  skills: Record<SkillArea, SkillEntry>
}

export interface LevelInfo {
  level: number
  progressXP: number
  neededXP: number
  name: string
}

const STORAGE_KEY = 'skill-progress'
const OLD_TYPING_KEY = 'typing-progress'

const SKILL_AREAS: SkillArea[] = [
  'organisation', 'effizienz', 'problemloesung', 'tippen', 'shortcuts', 'algorithmen',
]

const LEVEL_NAMES: Record<SkillArea, string[]> = {
  organisation:   ['', 'Chaotisch', 'Strukturiert', 'Geordnet', 'Profi', 'Meister', 'Guru', 'Archiv-Profi', 'Ordnungs-Experte', 'Datei-Meister', 'Ordnungs-Legende'],
  effizienz:      ['', 'Klicker', 'Shortcut-Kenner', 'Workflow-Profi', 'Speedrunner', 'Effizienz-Legende', 'Workflow-Meister', 'Speed-Experte', 'Tastatur-Virtuose', 'Effizienz-Champion', 'Productivity-Guru'],
  problemloesung: ['', 'Hilflos', 'Detektiv', 'Techniker', 'Experte', 'IT-Guru', 'System-Nerd', 'Fehlerbeheber', 'Debug-Meister', 'System-Experte', 'IT-Legende'],
  tippen:         ['', 'Anfänger', 'Lernender', 'Geübter', 'Fortgeschrittener', 'Experte', 'Meister', 'Virtuose', 'Legende', 'Champion', 'Grandmaster'],
  shortcuts:      ['', 'Neuling', 'Lernender', 'Geübter', 'Kenner', 'Virtuose', 'Meister', 'Shortcut-Profi', 'Tastatur-Ninja', 'Shortcut-Meister', 'Keyboard-Legende'],
  algorithmen:    ['', 'Student', 'Assistent', 'Doktorand', 'Forscher', 'Doktor', 'Professor', 'Algorithmus-Experte', 'Informatik-Meister', 'Algorithmus-Legende', 'Turing-Award'],
}

export function totalXpForLevel(n: number): number {
  return (n * (n + 1)) / 2 * 100
}

function defaultEntry(): SkillEntry {
  return { totalXP: 0, totalRounds: 0, lastPlayed: '' }
}

function defaultProgress(): SkillProgress {
  return {
    version: 1,
    skills: {
      organisation:   defaultEntry(),
      effizienz:      defaultEntry(),
      problemloesung: defaultEntry(),
      tippen:         defaultEntry(),
      shortcuts:      defaultEntry(),
      algorithmen:    defaultEntry(),
    },
  }
}

export function getLevelInfo(area: SkillArea, totalXP: number): LevelInfo {
  let level = 1
  while (totalXpForLevel(level + 1) <= totalXP) level++
  const progressXP = totalXP - totalXpForLevel(level)
  const neededXP = (level + 1) * 100
  const names = LEVEL_NAMES[area]
  return {
    level,
    progressXP,
    neededXP,
    name: names[Math.min(level, names.length - 1)],
  }
}

function migrateFromTypingProgress(progress: SkillProgress): SkillProgress {
  try {
    const raw = localStorage.getItem(OLD_TYPING_KEY)
    if (!raw) return progress
    const old = JSON.parse(raw)
    if (typeof old.totalXP === 'number' && old.totalXP > 0) {
      progress.skills.tippen.totalXP = old.totalXP
      progress.skills.tippen.totalRounds = old.totalRounds ?? 0
      progress.skills.tippen.lastPlayed = old.lastPlayed ?? ''
    }
    if (old.personalBests && typeof old.personalBests === 'object') {
      try { localStorage.setItem('typing-bests', JSON.stringify(old.personalBests)) } catch {}
    }
    localStorage.removeItem(OLD_TYPING_KEY)
  } catch {}
  return progress
}

export function loadSkillProgress(): SkillProgress {
  if (typeof window === 'undefined') return defaultProgress()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const migrated = migrateFromTypingProgress(defaultProgress())
      saveSkillProgress(migrated)
      return migrated
    }
    const parsed = JSON.parse(raw) as SkillProgress
    if (parsed.version !== 1 || !parsed.skills) return defaultProgress()
    // Ensure all skill areas exist
    const progress = { ...parsed, skills: { ...parsed.skills } }
    for (const area of SKILL_AREAS) {
      if (!progress.skills[area]) progress.skills[area] = defaultEntry()
    }
    return progress
  } catch {
    return defaultProgress()
  }
}

export function saveSkillProgress(progress: SkillProgress): void {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)) } catch {}
}

export function addXP(
  area: SkillArea,
  amount: number,
): { newProgress: SkillProgress; leveledUp: boolean; fromLevel: number; toLevel: number } {
  const current = loadSkillProgress()
  const entry = current.skills[area]
  const fromLevel = getLevelInfo(area, entry.totalXP).level

  const updated: SkillProgress = {
    ...current,
    skills: {
      ...current.skills,
      [area]: {
        totalXP: entry.totalXP + amount,
        totalRounds: entry.totalRounds + 1,
        lastPlayed: new Date().toISOString(),
      },
    },
  }

  const toLevel = getLevelInfo(area, updated.skills[area].totalXP).level
  saveSkillProgress(updated)

  return { newProgress: updated, leveledUp: toLevel > fromLevel, fromLevel, toLevel }
}
