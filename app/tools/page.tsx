'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { QrCode, Palette, Lock, Braces, Binary, Pipette } from 'lucide-react'

const TOOLS = [
  {
    href: '/tools/qr-code',
    icon: QrCode,
    tag: '⟨tools/⟩',
    label: 'QR-Code Generator',
    desc: 'Text oder URL in einen QR-Code umwandeln — mit Größenauswahl und direktem Download als PNG.',
    chips: ['Text', 'URL', 'Download'],
    badge: 'Generator',
  },
  {
    href: '/tools/color-converter',
    icon: Pipette,
    tag: '⟨tools/⟩',
    label: 'Color Converter',
    desc: 'Farben zwischen HEX, RGB und HSL umrechnen — mit Live-Vorschau und Copy-Buttons.',
    chips: ['HEX', 'RGB', 'HSL'],
    badge: 'Konverter',
  },
  {
    href: '/tools/palette',
    icon: Palette,
    tag: '⟨tools/⟩',
    label: 'Farbpaletten-Generator',
    desc: 'Aus einer Basisfarbe harmonische 5-Farb-Paletten erzeugen — Analogous, Komplementär, Triadisch und mehr.',
    chips: ['Analogous', 'Komplementär', 'Triadisch', 'Monochromatisch'],
    badge: 'Generator',
  },
  {
    href: '/tools/password',
    icon: Lock,
    tag: '⟨tools/⟩',
    label: 'Passwort-Generator',
    desc: 'Kryptografisch sichere Passwörter erstellen — Länge, Zeichensätze und Stärke-Anzeige.',
    chips: ['Groß/Klein', 'Zahlen', 'Symbole', 'Stärke-Meter'],
    badge: 'Generator',
  },
  {
    href: '/tools/json-formatter',
    icon: Braces,
    tag: '⟨tools/⟩',
    label: 'JSON Formatter',
    desc: 'JSON-Daten formatieren oder minifizieren — mit Syntaxfehler-Erkennung und Copy-Funktion.',
    chips: ['Formatieren', 'Minifizieren', 'Validierung'],
    badge: 'Formatter',
  },
  {
    href: '/tools/base64',
    icon: Binary,
    tag: '⟨tools/⟩',
    label: 'Base64 Coder',
    desc: 'Text in Base64 enkodieren oder dekodieren — UTF-8-sicher, direkt im Browser.',
    chips: ['Encode', 'Decode', 'UTF-8'],
    badge: 'Coder',
  },
]

export default function ToolsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <div className="font-mono text-sm font-semibold text-sky-600 dark:text-sky-400 mb-1">⟨tools/⟩</div>
        <h1 className="text-3xl font-bold tracking-tight">Browser-Tools</h1>
        <p className="text-muted-foreground mt-1.5">6 praktische Tools — kein Login, kein Download, direkt loslegen.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TOOLS.map((tool, i) => (
          <motion.div
            key={tool.href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 + 0.1, type: 'spring', stiffness: 260, damping: 24 }}
            className="h-full"
          >
            <Link
              href={tool.href}
              className="group flex flex-col h-full rounded-xl border-2 border-border bg-card p-6 transition-all duration-200 hover:border-sky-400/60 dark:hover:border-sky-500/60 hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-900/30">
                  <tool.icon className="h-4.5 w-4.5 text-sky-600 dark:text-sky-400 h-[18px] w-[18px]" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800">
                  {tool.badge}
                </span>
              </div>
              <span className="font-mono text-[11px] font-semibold text-sky-500 dark:text-sky-400 mb-1">{tool.tag}</span>
              <h3 className="text-base font-bold mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug">
                {tool.label}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{tool.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {tool.chips.map((c) => (
                  <span key={c} className="font-mono text-[11px] bg-muted px-2 py-0.5 rounded border border-border/50">
                    {c}
                  </span>
                ))}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
