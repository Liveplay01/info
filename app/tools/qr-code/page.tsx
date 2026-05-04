'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Download, QrCode, RotateCcw } from 'lucide-react'
import QRCode from 'qrcode'

const SIZES = [
  { label: 'Klein', value: 128 },
  { label: 'Mittel', value: 256 },
  { label: 'Groß', value: 512 },
]

export default function QrCodePage() {
  const [text, setText] = useState('https://example.com')
  const [size, setSize] = useState(256)
  const [dataUrl, setDataUrl] = useState('')
  const [error, setError] = useState('')

  const generate = useCallback(async (value: string, px: number) => {
    if (!value.trim()) { setDataUrl(''); setError(''); return }
    try {
      const url = await QRCode.toDataURL(value, {
        width: px,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      })
      setDataUrl(url)
      setError('')
    } catch {
      setError('QR-Code konnte nicht generiert werden.')
    }
  }, [])

  useEffect(() => { generate(text, size) }, [text, size, generate])

  function download() {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'qrcode.png'
    a.click()
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">⟨tools/⟩</div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">QR-Code Generator</h1>
        <p className="text-sm text-muted-foreground mb-8">Text oder URL in einen QR-Code umwandeln.</p>

        <div className="space-y-5">
          {/* Input */}
          <div>
            <label className="block text-sm font-semibold mb-2">Inhalt</label>
            <div className="flex gap-2">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                placeholder="https://example.com oder beliebiger Text…"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition"
              />
              <button
                onClick={() => setText('')}
                className="self-start p-2 rounded-lg border border-border hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                title="Zurücksetzen"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Size selector */}
          <div>
            <label className="block text-sm font-semibold mb-2">Größe</label>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSize(s.value)}
                  className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                    size === s.value
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300'
                      : 'border-border hover:bg-accent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s.label} ({s.value}px)
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center gap-4">
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : dataUrl ? (
              <motion.img
                key={dataUrl}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                src={dataUrl}
                alt="QR-Code"
                className="rounded-lg"
                style={{ width: Math.min(size, 280), height: Math.min(size, 280) }}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground py-8">
                <QrCode className="h-10 w-10 opacity-30" />
                <p className="text-sm">Gib Text oder eine URL ein</p>
              </div>
            )}
            {dataUrl && (
              <button
                onClick={download}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors"
              >
                <Download className="h-4 w-4" />
                PNG herunterladen
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
