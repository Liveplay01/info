'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, RefreshCw, Eye, EyeOff } from 'lucide-react'
import * as Slider from '@radix-ui/react-slider'
import * as SwitchPrimitive from '@radix-ui/react-switch'

// ── Password generation ───────────────────────────────────────────────────────

const CHARS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

function generatePassword(length: number, opts: Record<string, boolean>): string {
  let pool = ''
  if (opts.uppercase) pool += CHARS.uppercase
  if (opts.lowercase) pool += CHARS.lowercase
  if (opts.digits)    pool += CHARS.digits
  if (opts.symbols)   pool += CHARS.symbols
  if (!pool) pool = CHARS.lowercase

  const arr = new Uint32Array(length)
  crypto.getRandomValues(arr)
  return Array.from(arr).map((v) => pool[v % pool.length]).join('')
}

function strength(pw: string): { label: string; color: string; width: string } {
  let score = 0
  if (pw.length >= 12) score++
  if (pw.length >= 16) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  if (score <= 2) return { label: 'Schwach', color: 'bg-red-500', width: '25%' }
  if (score <= 3) return { label: 'Mittel',  color: 'bg-amber-500', width: '50%' }
  if (score <= 4) return { label: 'Stark',   color: 'bg-emerald-500', width: '75%' }
  return { label: 'Sehr stark', color: 'bg-sky-500', width: '100%' }
}

// ── Toggle switch ─────────────────────────────────────────────────────────────

function Toggle({ checked, onCheckedChange, label }: { checked: boolean; onCheckedChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <label className="text-sm font-medium cursor-pointer select-none">{label}</label>
      <SwitchPrimitive.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="relative inline-flex h-5 w-9 items-center rounded-full border-2 border-transparent transition-colors focus:outline-none data-[state=checked]:bg-sky-500 data-[state=unchecked]:bg-muted"
      >
        <SwitchPrimitive.Thumb className="block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5" />
      </SwitchPrimitive.Root>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PasswordPage() {
  const [length, setLength] = useState(16)
  const [opts, setOpts] = useState({ uppercase: true, lowercase: true, digits: true, symbols: false })
  const [password, setPassword] = useState(() => generatePassword(16, { uppercase: true, lowercase: true, digits: true, symbols: false }))
  const [copied, setCopied] = useState(false)
  const [show, setShow] = useState(false)

  const regen = useCallback(() => {
    setPassword(generatePassword(length, opts))
    setCopied(false)
  }, [length, opts])

  function setOpt(key: string, val: boolean) {
    const next = { ...opts, [key]: val }
    setOpts(next)
    setPassword(generatePassword(length, next))
    setCopied(false)
  }

  function setLen(val: number) {
    setLength(val)
    setPassword(generatePassword(val, opts))
    setCopied(false)
  }

  function copy() {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const str = strength(password)

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">⟨tools/⟩</div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Passwort-Generator</h1>
        <p className="text-sm text-muted-foreground mb-8">Kryptografisch sichere Passwörter erstellen.</p>

        <div className="space-y-4">
          {/* Password output */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 font-mono text-sm bg-muted rounded-lg px-3 py-2.5 break-all min-h-[44px] flex items-center">
                {show ? password : '•'.repeat(password.length)}
              </div>
              <button
                onClick={() => setShow((v) => !v)}
                className="p-2 rounded-lg border border-border hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                title={show ? 'Verstecken' : 'Anzeigen'}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={regen}
                className="p-2 rounded-lg border border-border hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                title="Neu generieren"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Kopiert!' : 'Kopieren'}
              </button>
            </div>

            {/* Strength */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">Stärke</span>
                <span className={`text-xs font-semibold ${str.color.replace('bg-', 'text-')}`}>{str.label}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${str.color}`}
                  animate={{ width: str.width }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                />
              </div>
            </div>
          </div>

          {/* Length */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Länge</span>
              <span className="font-mono text-sm font-bold text-sky-600 dark:text-sky-400">{length} Zeichen</span>
            </div>
            <Slider.Root
              min={4} max={64} step={1}
              value={[length]}
              onValueChange={([v]) => setLen(v)}
              className="relative flex items-center select-none touch-none w-full h-5"
            >
              <Slider.Track className="relative h-2 flex-1 rounded-full bg-muted overflow-hidden">
                <Slider.Range className="absolute h-full bg-sky-500 rounded-full" />
              </Slider.Track>
              <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-sky-500 bg-background shadow focus:outline-none focus:ring-2 focus:ring-sky-500/40" />
            </Slider.Root>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>4</span><span>64</span>
            </div>
          </div>

          {/* Options */}
          <div className="rounded-xl border border-border bg-card px-4 divide-y divide-border">
            <Toggle label="Großbuchstaben (A–Z)" checked={opts.uppercase} onCheckedChange={(v) => setOpt('uppercase', v)} />
            <Toggle label="Kleinbuchstaben (a–z)" checked={opts.lowercase} onCheckedChange={(v) => setOpt('lowercase', v)} />
            <Toggle label="Zahlen (0–9)" checked={opts.digits} onCheckedChange={(v) => setOpt('digits', v)} />
            <Toggle label="Symbole (!@#$…)" checked={opts.symbols} onCheckedChange={(v) => setOpt('symbols', v)} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
