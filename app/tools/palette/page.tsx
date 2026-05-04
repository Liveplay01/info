'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'

// ── Color math ────────────────────────────────────────────────────────────────

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const clean = hex.replace('#', '')
  const n = parseInt(clean, 16)
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100, ln = l / 100
  const k = (n: number) => (n + h / 30) % 12
  const a = sn * Math.min(ln, 1 - ln)
  const f = (n: number) => Math.round((ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))) * 255)
  return '#' + [f(0), f(8), f(4)].map((v) => v.toString(16).padStart(2, '0')).join('')
}

function mod(n: number, m: number) { return ((n % m) + m) % m }

type Harmony = 'analogous' | 'komplementaer' | 'triadisch' | 'split' | 'monochromatisch'

function generatePalette(hex: string, harmony: Harmony): string[] {
  const { h, s, l } = hexToHsl(hex)
  switch (harmony) {
    case 'analogous':
      return [-40, -20, 0, 20, 40].map((d) => hslToHex(mod(h + d, 360), s, l))
    case 'komplementaer':
      return [0, 90, 180, 270, 30].map((d) => hslToHex(mod(h + d, 360), s, l))
    case 'triadisch':
      return [0, 60, 120, 240, 300].map((d) => hslToHex(mod(h + d, 360), s, l))
    case 'split':
      return [0, 150, 180, 210, 90].map((d) => hslToHex(mod(h + d, 360), s, l))
    case 'monochromatisch':
      return [20, 35, 50, 65, 80].map((newL) => hslToHex(h, s, newL))
  }
}

// ── Components ────────────────────────────────────────────────────────────────

function ColorSwatch({ color, index }: { color: string; index: number }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(color)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex flex-col items-center gap-2"
    >
      <button
        onClick={copy}
        className="w-full aspect-square rounded-xl border-2 border-transparent hover:border-white/40 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
        style={{ backgroundColor: color }}
        title={`${color} kopieren`}
      />
      <div className="flex items-center gap-1">
        <span className="font-mono text-xs text-muted-foreground">{color}</span>
        <button onClick={copy} className="text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>
    </motion.div>
  )
}

const HARMONIES: { value: Harmony; label: string; desc: string }[] = [
  { value: 'analogous',       label: 'Analogous',        desc: 'Benachbarte Farbtöne' },
  { value: 'komplementaer',   label: 'Komplementär',     desc: 'Gegenüberliegende Farben' },
  { value: 'triadisch',       label: 'Triadisch',        desc: 'Drei gleich verteilte Farben' },
  { value: 'split',           label: 'Split-Komplementär', desc: 'Basis + zwei Nachbarn des Komplements' },
  { value: 'monochromatisch', label: 'Monochromatisch',  desc: 'Gleicher Ton, verschiedene Helligkeit' },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PalettePage() {
  const [baseHex, setBaseHex] = useState('#3b82f6')
  const [harmony, setHarmony] = useState<Harmony>('analogous')

  const palette = useCallback(() => generatePalette(baseHex, harmony), [baseHex, harmony])()

  function copyAll() {
    const css = palette.map((c, i) => `--color-${i + 1}: ${c};`).join('\n')
    navigator.clipboard.writeText(`:root {\n${css}\n}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">⟨tools/⟩</div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Farbpaletten-Generator</h1>
        <p className="text-sm text-muted-foreground mb-8">Harmonische 5-Farb-Paletten aus einer Basisfarbe erzeugen.</p>

        <div className="space-y-5">
          {/* Base color picker */}
          <div className="rounded-xl border border-border bg-card p-4">
            <label className="block text-sm font-semibold mb-3">Basisfarbe</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={baseHex}
                onChange={(e) => setBaseHex(e.target.value)}
                className="h-12 w-16 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
              />
              <span className="font-mono text-sm text-muted-foreground">{baseHex.toUpperCase()}</span>
            </div>
          </div>

          {/* Harmony selector */}
          <div className="rounded-xl border border-border bg-card p-4">
            <label className="block text-sm font-semibold mb-3">Harmonietyp</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {HARMONIES.map((h) => (
                <button
                  key={h.value}
                  onClick={() => setHarmony(h.value)}
                  className={`flex flex-col items-start px-3 py-2.5 rounded-lg border text-left transition-colors ${
                    harmony === h.value
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <span className={`text-sm font-semibold ${harmony === h.value ? 'text-sky-700 dark:text-sky-300' : ''}`}>
                    {h.label}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5">{h.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Palette */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">Palette</span>
              <button
                onClick={copyAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-3.5 w-3.5" />
                Als CSS-Variablen
              </button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {palette.map((color, i) => (
                <ColorSwatch key={i} color={color} index={i} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
