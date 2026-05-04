'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Trash2, Braces, Minimize2 } from 'lucide-react'
import * as Tabs from '@radix-ui/react-tabs'

function CopyBtn({ text, disabled }: { text: string; disabled?: boolean }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    if (!text || disabled) return
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button
      onClick={copy}
      disabled={disabled}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-muted-foreground hover:text-foreground"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Kopiert!' : 'Kopieren'}
    </button>
  )
}

const EXAMPLE = `{"name":"Max Mustermann","age":30,"skills":["Java","TypeScript","React"],"address":{"city":"Berlin","zip":"10115"}}`

export default function JsonFormatterPage() {
  const [input, setInput] = useState(EXAMPLE)
  const [tab, setTab] = useState('format')

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' }
    try {
      const parsed = JSON.parse(input)
      const result = tab === 'format'
        ? JSON.stringify(parsed, null, 2)
        : JSON.stringify(parsed)
      return { output: result, error: '' }
    } catch (e) {
      return { output: '', error: (e as Error).message }
    }
  }, [input, tab])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">⟨tools/⟩</div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">JSON Formatter</h1>
        <p className="text-sm text-muted-foreground mb-8">JSON formatieren, minifizieren und auf Fehler prüfen.</p>

        <Tabs.Root value={tab} onValueChange={setTab}>
          <Tabs.List className="flex gap-1 mb-4 rounded-lg bg-muted p-1 w-fit">
            <Tabs.Trigger
              value="format"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground"
            >
              <Braces className="h-3.5 w-3.5" /> Formatieren
            </Tabs.Trigger>
            <Tabs.Trigger
              value="minify"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground"
            >
              <Minimize2 className="h-3.5 w-3.5" /> Minifizieren
            </Tabs.Trigger>
          </Tabs.List>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Input */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
                <span className="text-xs font-semibold text-muted-foreground">Eingabe</span>
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
                rows={16}
                placeholder='{"key": "value"}'
                spellCheck={false}
                className="w-full bg-transparent px-4 py-3 text-sm font-mono resize-none focus:outline-none"
              />
            </div>

            {/* Output */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
                <span className="text-xs font-semibold text-muted-foreground">Ausgabe</span>
                <CopyBtn text={output} disabled={!output} />
              </div>
              {error ? (
                <div className="px-4 py-3">
                  <p className="text-xs font-semibold text-destructive mb-1">Fehler</p>
                  <p className="text-sm font-mono text-destructive/80 break-all">{error}</p>
                </div>
              ) : (
                <pre className="w-full bg-transparent px-4 py-3 text-sm font-mono overflow-auto h-[calc(100%-45px)] whitespace-pre-wrap break-all text-foreground/90">
                  {output || <span className="text-muted-foreground">Ausgabe erscheint hier…</span>}
                </pre>
              )}
            </div>
          </div>
        </Tabs.Root>
      </motion.div>
    </div>
  )
}
