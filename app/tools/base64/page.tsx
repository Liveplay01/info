'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, ArrowLeftRight, Trash2 } from 'lucide-react'

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button
      onClick={copy}
      disabled={!text}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-muted-foreground hover:text-foreground"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Kopiert!' : 'Kopieren'}
    </button>
  )
}

function encodeBase64(text: string): string {
  try {
    return btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    ))
  } catch {
    return ''
  }
}

function decodeBase64(text: string): { result: string; error: string } {
  try {
    const decoded = atob(text.trim())
    const result = decodeURIComponent(decoded.split('').map((c) =>
      '%' + c.charCodeAt(0).toString(16).padStart(2, '0')
    ).join(''))
    return { result, error: '' }
  } catch {
    return { result: '', error: 'Ungültiger Base64-String.' }
  }
}

export default function Base64Page() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [input, setInput] = useState('')

  const output = mode === 'encode'
    ? encodeBase64(input)
    : decodeBase64(input).result
  const error = mode === 'decode' && input ? decodeBase64(input).error : ''

  function swap() {
    const newInput = output
    setMode((m) => (m === 'encode' ? 'decode' : 'encode'))
    setInput(newInput)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">⟨tools/⟩</div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Base64 Coder</h1>
        <p className="text-sm text-muted-foreground mb-8">Text in Base64 enkodieren oder dekodieren.</p>

        <div className="space-y-4">
          {/* Mode toggle */}
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg bg-muted p-1 gap-1">
              <button
                onClick={() => setMode('encode')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  mode === 'encode'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Enkodieren
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  mode === 'decode'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Dekodieren
              </button>
            </div>
            <button
              onClick={swap}
              disabled={!output}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-muted-foreground hover:text-foreground"
              title="Ausgabe als Eingabe verwenden"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" /> Tauschen
            </button>
          </div>

          {/* Input */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
              <span className="text-xs font-semibold text-muted-foreground">
                {mode === 'encode' ? 'Klartext' : 'Base64'}
              </span>
              <button
                onClick={() => setInput('')}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Leeren
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              placeholder={mode === 'encode' ? 'Text eingeben…' : 'Base64-String eingeben…'}
              spellCheck={false}
              className="w-full bg-transparent px-4 py-3 text-sm font-mono resize-none focus:outline-none"
            />
          </div>

          {/* Output */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
              <span className="text-xs font-semibold text-muted-foreground">
                {mode === 'encode' ? 'Base64' : 'Klartext'}
              </span>
              <CopyBtn text={output} />
            </div>
            <div className="px-4 py-3 min-h-[100px]">
              {error ? (
                <p className="text-sm text-destructive font-mono">{error}</p>
              ) : output ? (
                <pre className="text-sm font-mono break-all whitespace-pre-wrap text-foreground/90">{output}</pre>
              ) : (
                <p className="text-sm text-muted-foreground">Ausgabe erscheint hier…</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
