'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'

// ── Conversion helpers ────────────────────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  const n = parseInt(clean, 16)
  if (isNaN(n)) return null
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
  else if (max === gn) h = ((bn - rn) / d + 2) / 6
  else h = ((rn - gn) / d + 4) / 6
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const sn = s / 100, ln = l / 100
  const k = (n: number) => (n + h / 30) % 12
  const a = sn * Math.min(ln, 1 - ln)
  const f = (n: number) => ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) }
}

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }

// ── Copy button ───────────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Kopiert!' : 'Kopieren'}
    </button>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ColorConverterPage() {
  const [hex, setHex] = useState('#3b82f6')
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })
  const [hexInput, setHexInput] = useState('#3b82f6')

  const fromHex = useCallback((value: string) => {
    setHexInput(value)
    const parsed = hexToRgb(value)
    if (!parsed) return
    setHex(value.startsWith('#') ? value : '#' + value)
    setRgb(parsed)
    setHsl(rgbToHsl(parsed.r, parsed.g, parsed.b))
  }, [])

  const fromRgb = useCallback((r: number, g: number, b: number) => {
    const newRgb = { r: clamp(r, 0, 255), g: clamp(g, 0, 255), b: clamp(b, 0, 255) }
    setRgb(newRgb)
    const h = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    setHex(h)
    setHexInput(h)
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
  }, [])

  const fromHsl = useCallback((h: number, s: number, l: number) => {
    const newHsl = { h: clamp(h, 0, 360), s: clamp(s, 0, 100), l: clamp(l, 0, 100) }
    setHsl(newHsl)
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
    setRgb(newRgb)
    const hx = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    setHex(hx)
    setHexInput(hx)
  }, [])

  const hexStr = hex
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">⟨tools/⟩</div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Color Converter</h1>
        <p className="text-sm text-muted-foreground mb-8">Farben zwischen HEX, RGB und HSL umrechnen.</p>

        {/* Swatch */}
        <div
          className="w-full h-28 rounded-xl border border-border mb-6 transition-all duration-200"
          style={{ backgroundColor: hex }}
        />

        <div className="space-y-5">
          {/* HEX */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">HEX</span>
              <CopyBtn text={hexStr} />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hex}
                onChange={(e) => fromHex(e.target.value)}
                className="h-10 w-12 cursor-pointer rounded border border-border bg-transparent p-0.5"
              />
              <input
                type="text"
                value={hexInput}
                onChange={(e) => fromHex(e.target.value)}
                placeholder="#3b82f6"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition"
              />
            </div>
          </div>

          {/* RGB */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">RGB</span>
              <CopyBtn text={rgbStr} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(['r', 'g', 'b'] as const).map((ch, idx) => (
                <div key={ch}>
                  <label className="text-xs text-muted-foreground font-medium mb-1 block">{['R', 'G', 'B'][idx]} (0–255)</label>
                  <input
                    type="number"
                    min={0} max={255}
                    value={rgb[ch]}
                    onChange={(e) => fromRgb(
                      ch === 'r' ? +e.target.value : rgb.r,
                      ch === 'g' ? +e.target.value : rgb.g,
                      ch === 'b' ? +e.target.value : rgb.b,
                    )}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition"
                  />
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs font-mono text-muted-foreground">{rgbStr}</p>
          </div>

          {/* HSL */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">HSL</span>
              <CopyBtn text={hslStr} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'h' as const, label: 'H (0–360)', max: 360 },
                { key: 's' as const, label: 'S (0–100)', max: 100 },
                { key: 'l' as const, label: 'L (0–100)', max: 100 },
              ].map(({ key, label, max }) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground font-medium mb-1 block">{label}</label>
                  <input
                    type="number"
                    min={0} max={max}
                    value={hsl[key]}
                    onChange={(e) => fromHsl(
                      key === 'h' ? +e.target.value : hsl.h,
                      key === 's' ? +e.target.value : hsl.s,
                      key === 'l' ? +e.target.value : hsl.l,
                    )}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition"
                  />
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs font-mono text-muted-foreground">{hslStr}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
