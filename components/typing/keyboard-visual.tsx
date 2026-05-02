'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Finger =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky'

interface KeyDef {
  label: string
  finger: Finger
  homeRow?: boolean
  wide?: 'lg' | 'xl' | '2xl' | '3xl'
}

const fingerLabel: Record<Finger, string> = {
  'left-pinky': 'Linker Kleinfinger',
  'left-ring': 'Linker Ringfinger',
  'left-middle': 'Linker Mittelfinger',
  'left-index': 'Linker Zeigefinger',
  thumb: 'Daumen',
  'right-index': 'Rechter Zeigefinger',
  'right-middle': 'Rechter Mittelfinger',
  'right-ring': 'Rechter Ringfinger',
  'right-pinky': 'Rechter Kleinfinger',
}

const fingerColors: Record<Finger, { bg: string; border: string; text: string; dot: string }> = {
  'left-pinky': {
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    border: 'border-blue-300 dark:border-blue-700',
    text: 'text-blue-800 dark:text-blue-200',
    dot: 'bg-blue-500',
  },
  'left-ring': {
    bg: 'bg-cyan-100 dark:bg-cyan-900/40',
    border: 'border-cyan-300 dark:border-cyan-700',
    text: 'text-cyan-800 dark:text-cyan-200',
    dot: 'bg-cyan-500',
  },
  'left-middle': {
    bg: 'bg-green-100 dark:bg-green-900/40',
    border: 'border-green-300 dark:border-green-700',
    text: 'text-green-800 dark:text-green-200',
    dot: 'bg-green-500',
  },
  'left-index': {
    bg: 'bg-yellow-100 dark:bg-yellow-900/40',
    border: 'border-yellow-300 dark:border-yellow-700',
    text: 'text-yellow-800 dark:text-yellow-200',
    dot: 'bg-yellow-500',
  },
  thumb: {
    bg: 'bg-muted',
    border: 'border-border',
    text: 'text-muted-foreground',
    dot: 'bg-muted-foreground',
  },
  'right-index': {
    bg: 'bg-orange-100 dark:bg-orange-900/40',
    border: 'border-orange-300 dark:border-orange-700',
    text: 'text-orange-800 dark:text-orange-200',
    dot: 'bg-orange-500',
  },
  'right-middle': {
    bg: 'bg-red-100 dark:bg-red-900/40',
    border: 'border-red-300 dark:border-red-700',
    text: 'text-red-800 dark:text-red-200',
    dot: 'bg-red-500',
  },
  'right-ring': {
    bg: 'bg-purple-100 dark:bg-purple-900/40',
    border: 'border-purple-300 dark:border-purple-700',
    text: 'text-purple-800 dark:text-purple-200',
    dot: 'bg-purple-500',
  },
  'right-pinky': {
    bg: 'bg-pink-100 dark:bg-pink-900/40',
    border: 'border-pink-300 dark:border-pink-700',
    text: 'text-pink-800 dark:text-pink-200',
    dot: 'bg-pink-500',
  },
}

// QWERTZ layout
const rows: KeyDef[][] = [
  // Number row
  [
    { label: '^', finger: 'left-pinky' },
    { label: '1', finger: 'left-pinky' },
    { label: '2', finger: 'left-ring' },
    { label: '3', finger: 'left-middle' },
    { label: '4', finger: 'left-index' },
    { label: '5', finger: 'left-index' },
    { label: '6', finger: 'right-index' },
    { label: '7', finger: 'right-index' },
    { label: '8', finger: 'right-middle' },
    { label: '9', finger: 'right-ring' },
    { label: '0', finger: 'right-pinky' },
    { label: 'ß', finger: 'right-pinky' },
    { label: '´', finger: 'right-pinky' },
    { label: '⌫', finger: 'right-pinky', wide: 'xl' },
  ],
  // QWERTZ row
  [
    { label: 'Tab', finger: 'left-pinky', wide: 'lg' },
    { label: 'Q', finger: 'left-pinky' },
    { label: 'W', finger: 'left-ring' },
    { label: 'E', finger: 'left-middle' },
    { label: 'R', finger: 'left-index' },
    { label: 'T', finger: 'left-index' },
    { label: 'Z', finger: 'right-index' },
    { label: 'U', finger: 'right-index' },
    { label: 'I', finger: 'right-middle' },
    { label: 'O', finger: 'right-ring' },
    { label: 'P', finger: 'right-pinky' },
    { label: 'Ü', finger: 'right-pinky' },
    { label: '+', finger: 'right-pinky' },
    { label: '↵', finger: 'right-pinky', wide: 'lg' },
  ],
  // Home row
  [
    { label: 'Caps', finger: 'left-pinky', wide: 'xl' },
    { label: 'A', finger: 'left-pinky', homeRow: true },
    { label: 'S', finger: 'left-ring', homeRow: true },
    { label: 'D', finger: 'left-middle', homeRow: true },
    { label: 'F', finger: 'left-index', homeRow: true },
    { label: 'G', finger: 'left-index', homeRow: true },
    { label: 'H', finger: 'right-index', homeRow: true },
    { label: 'J', finger: 'right-index', homeRow: true },
    { label: 'K', finger: 'right-middle', homeRow: true },
    { label: 'L', finger: 'right-ring', homeRow: true },
    { label: 'Ö', finger: 'right-pinky', homeRow: true },
    { label: 'Ä', finger: 'right-pinky', homeRow: true },
    { label: '#', finger: 'right-pinky' },
  ],
  // Bottom row
  [
    { label: '⇧', finger: 'left-pinky', wide: '2xl' },
    { label: '<', finger: 'left-pinky' },
    { label: 'Y', finger: 'left-pinky' },
    { label: 'X', finger: 'left-ring' },
    { label: 'C', finger: 'left-middle' },
    { label: 'V', finger: 'left-index' },
    { label: 'B', finger: 'left-index' },
    { label: 'N', finger: 'right-index' },
    { label: 'M', finger: 'right-index' },
    { label: ',', finger: 'right-middle' },
    { label: '.', finger: 'right-ring' },
    { label: '-', finger: 'right-pinky' },
    { label: '⇧', finger: 'right-pinky', wide: '3xl' },
  ],
  // Space row
  [
    { label: 'Strg', finger: 'left-pinky', wide: 'lg' },
    { label: '❖', finger: 'left-pinky', wide: 'lg' },
    { label: 'Alt', finger: 'left-pinky', wide: 'lg' },
    { label: '', finger: 'thumb', wide: '3xl' },
    { label: 'AltGr', finger: 'right-pinky', wide: 'lg' },
    { label: '❖', finger: 'right-pinky', wide: 'lg' },
    { label: 'Strg', finger: 'right-pinky', wide: 'lg' },
  ],
]

const wideClass: Record<string, string> = {
  lg: 'w-14',
  xl: 'w-16',
  '2xl': 'w-20',
  '3xl': 'w-28',
}

interface KeyboardVisualProps {
  highlightFinger?: Finger
  showHomeRowOnly?: boolean
}

function Key({
  def,
  highlightFinger,
  hoveredFinger,
  onHover,
}: {
  def: KeyDef
  highlightFinger?: Finger
  hoveredFinger: Finger | null
  onHover: (f: Finger | null) => void
}) {
  const colors = fingerColors[def.finger]
  const isHighlighted =
    highlightFinger === def.finger ||
    hoveredFinger === def.finger
  const isDimmed =
    (highlightFinger !== undefined && highlightFinger !== def.finger) ||
    (hoveredFinger !== null && hoveredFinger !== def.finger)

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-md border text-xs font-mono font-medium h-9 min-w-[2rem] px-1 select-none cursor-default transition-all duration-150',
        def.wide ? wideClass[def.wide] : 'w-9',
        isHighlighted
          ? [colors.bg, colors.border, colors.text, 'shadow-md scale-105']
          : isDimmed
          ? 'bg-muted/40 border-border/30 text-muted-foreground/30'
          : [colors.bg, colors.border, colors.text, 'hover:scale-105 hover:shadow-sm'],
      )}
      onMouseEnter={() => onHover(def.finger)}
      onMouseLeave={() => onHover(null)}
      title={fingerLabel[def.finger]}
    >
      {def.label}
      {def.homeRow && (
        <span
          className={cn(
            'absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-0.5 rounded-full transition-colors',
            colors.dot,
          )}
        />
      )}
    </div>
  )
}

export function KeyboardVisual({ highlightFinger, showHomeRowOnly }: KeyboardVisualProps) {
  const [hoveredFinger, setHoveredFinger] = useState<Finger | null>(null)

  const activeFinger = hoveredFinger ?? highlightFinger ?? null
  const displayRows = showHomeRowOnly ? [rows[2]] : rows

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex flex-col gap-1.5 min-w-max mx-auto">
          {displayRows.map((row, ri) => (
            <div key={ri} className="flex gap-1.5">
              {row.map((key, ki) => (
                <Key
                  key={ki}
                  def={key}
                  highlightFinger={highlightFinger}
                  hoveredFinger={hoveredFinger}
                  onHover={setHoveredFinger}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip / active finger label */}
      <div className="h-6 text-center">
        {activeFinger && (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 text-sm font-medium px-3 py-0.5 rounded-full',
              fingerColors[activeFinger].bg,
              fingerColors[activeFinger].text,
            )}
          >
            <span
              className={cn('w-2 h-2 rounded-full shrink-0', fingerColors[activeFinger].dot)}
            />
            {fingerLabel[activeFinger]}
          </span>
        )}
      </div>

      {/* Legend */}
      {!showHomeRowOnly && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs mt-1">
          {(Object.keys(fingerLabel) as Finger[]).map((f) => (
            <button
              key={f}
              className={cn(
                'flex items-center gap-1.5 rounded px-1.5 py-0.5 transition-all cursor-pointer',
                hoveredFinger === f
                  ? [fingerColors[f].bg, fingerColors[f].text, 'font-semibold']
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onMouseEnter={() => setHoveredFinger(f)}
              onMouseLeave={() => setHoveredFinger(null)}
            >
              <span className={cn('w-2 h-2 rounded-full shrink-0', fingerColors[f].dot)} />
              {fingerLabel[f]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
