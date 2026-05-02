'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/header'
import {
  Shield, Lock, Mail, Wifi, RefreshCw,
  Check, X, ChevronRight, Eye, EyeOff, AlertTriangle,
  Smartphone, Server, ArrowRight,
} from 'lucide-react'
import { playClick, playReveal, playComplete } from '@/lib/sounds'

// ── Shared helpers ──────────────────────────────────────────────────────────

function useSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return { ref, inView }
}

function SectionHeading({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-sm font-bold shrink-0">
        {number}
      </span>
      <h2 className="text-2xl font-bold tracking-tight">{children}</h2>
    </div>
  )
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-5 py-4 text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
      {children}
    </div>
  )
}

function WarnBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-5 py-4 text-sm text-amber-900 dark:text-amber-200 leading-relaxed flex gap-3">
      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// ── 1. Password Strength Demo ───────────────────────────────────────────────

function getStrength(pw: string): { score: number; label: string; color: string; checks: { label: string; ok: boolean }[] } {
  const checks = [
    { label: 'Mindestens 8 Zeichen', ok: pw.length >= 8 },
    { label: 'Großbuchstaben (A–Z)', ok: /[A-Z]/.test(pw) },
    { label: 'Kleinbuchstaben (a–z)', ok: /[a-z]/.test(pw) },
    { label: 'Zahl (0–9)', ok: /\d/.test(pw) },
    { label: 'Sonderzeichen (!@#…)', ok: /[^A-Za-z0-9]/.test(pw) },
    { label: 'Mindestens 12 Zeichen', ok: pw.length >= 12 },
  ]
  const score = checks.filter((c) => c.ok).length
  const label = score <= 1 ? 'Sehr schwach' : score <= 2 ? 'Schwach' : score <= 3 ? 'Mittel' : score <= 4 ? 'Gut' : score <= 5 ? 'Stark' : 'Sehr stark'
  const color = score <= 1 ? 'bg-red-500' : score <= 2 ? 'bg-orange-500' : score <= 3 ? 'bg-yellow-500' : score <= 4 ? 'bg-lime-500' : 'bg-emerald-500'
  return { score, label, color, checks }
}

function PasswordStrengthDemo() {
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const { score, label, color, checks } = getStrength(pw)
  const barWidth = `${Math.round((score / 6) * 100)}%`

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Gib ein Passwort ein…"
          className="w-full pr-10 pl-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={() => { playClick(); setShow((s) => !s) }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {/* Strength bar */}
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Stärke</span>
          <span className="font-semibold">{pw ? label : '—'}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${color}`}
            animate={{ width: pw ? barWidth : '0%' }}
            transition={{ type: 'spring', stiffness: 180, damping: 20 }}
          />
        </div>
      </div>

      {/* Criteria checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {checks.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: pw ? 1 : 0.4, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-2 text-xs"
          >
            <span
              className={`flex items-center justify-center w-4 h-4 rounded-full shrink-0 transition-colors ${
                c.ok ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
              }`}
            >
              {c.ok ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
            </span>
            <span className={c.ok ? 'text-foreground' : 'text-muted-foreground'}>{c.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── 2. Two-Factor-Auth Demo ─────────────────────────────────────────────────

function TwoFactorDemo() {
  const [step, setStep] = useState(0)
  const steps = ['Passwort eingeben', 'Code auf Handy', 'Zugang freigegeben']
  const icons = [Lock, Smartphone, Server]

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-2 mb-6">
        {steps.map((s, i) => {
          const Icon = icons[i]
          const active = i === step
          const done = i < step
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 text-center">
              <motion.div
                animate={{
                  scale: active ? 1.1 : 1,
                  backgroundColor: done
                    ? 'hsl(142, 71%, 45%)'
                    : active
                    ? 'hsl(346, 84%, 61%)'
                    : 'hsl(var(--muted))',
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
              >
                <Icon className="w-5 h-5 text-white" />
              </motion.div>
              <span className={`text-xs font-medium leading-tight ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s}
              </span>
              {i < steps.length - 1 && (
                <div className="absolute hidden" />
              )}
            </div>
          )
        })}
      </div>

      {/* Connector lines */}
      <div className="flex items-center gap-1 mb-6 px-6">
        {[0, 1].map((i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden bg-muted">
            <motion.div
              className="h-full bg-emerald-500"
              animate={{ width: step > i ? '100%' : '0%' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="text-sm text-muted-foreground text-center mb-4"
        >
          {step === 0 && 'Du gibst dein Passwort ein — das kennt der Angreifer vielleicht schon.'}
          {step === 1 && 'Ein einmaliger Code wird an dein Handy geschickt. Den kennt nur du.'}
          {step === 2 && '✓ Beide Faktoren stimmen — Zugang gewährt. Ohne Handy kein Einlass.'}
        </motion.p>
      </AnimatePresence>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => { playClick(); setStep((s) => Math.max(0, s - 1)) }}
          disabled={step === 0}
          className="px-4 py-2 text-xs rounded-lg border border-border bg-muted hover:bg-muted/80 disabled:opacity-30 transition-colors"
        >
          ← Zurück
        </button>
        <button
          onClick={() => { playClick(); setStep((s) => Math.min(2, s + 1)) }}
          disabled={step === 2}
          className="px-4 py-2 text-xs rounded-lg bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-30 transition-colors"
        >
          Weiter →
        </button>
      </div>
    </div>
  )
}

// ── 3. Phishing Email Demo ──────────────────────────────────────────────────

const phishingFlags = [
  { id: 'sender', label: 'Falscher Absender', desc: 'support@paypa1.com statt paypal.com — die "1" statt "l"!', top: '14%', left: '2%' },
  { id: 'urgency', label: 'Künstliche Dringlichkeit', desc: '"Sofort handeln" und "24 Stunden" — klassischer Druck-Trick.', top: '38%', left: '2%' },
  { id: 'link', label: 'Verdächtige URL', desc: 'Der Link zeigt paypa1-secure.xyz — nicht die echte Domain.', top: '62%', left: '2%' },
]

function PhishingEmailDemo() {
  const [revealed, setRevealed] = useState<string[]>([])
  const allRevealed = revealed.length === phishingFlags.length

  function toggle(id: string) {
    setRevealed((r) => {
      if (r.includes(id)) return r.filter((x) => x !== id)
      const next = [...r, id]
      if (next.length === phishingFlags.length) playComplete()
      else playReveal()
      return next
    })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Klicke auf die <span className="text-rose-600 dark:text-rose-400 font-semibold">roten Markierungen</span>, um die Warnsignale aufzudecken.
      </p>
      <div className="relative rounded-xl border-2 border-border bg-card overflow-hidden">
        {/* Fake email */}
        <div className="p-5 font-mono text-xs space-y-3 select-none">
          <div className="flex justify-between text-muted-foreground border-b border-border pb-3">
            <div>
              <span className="text-foreground font-semibold">Von: </span>
              <span className={`transition-colors ${revealed.includes('sender') ? 'bg-rose-200 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 rounded px-1' : ''}`}>
                support@paypa<span className="font-bold text-rose-500">1</span>.com
              </span>
            </div>
          </div>
          <div>
            <span className="text-foreground font-semibold">Betreff: </span>
            <span>⚠️ Dein Konto wurde gesperrt — sofort handeln!</span>
          </div>
          <div className="text-foreground leading-relaxed space-y-2 pt-1">
            <p>Sehr geehrter Kunde,</p>
            <p>
              wir haben{' '}
              <span className={`transition-colors ${revealed.includes('urgency') ? 'bg-rose-200 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 rounded px-1' : ''}`}>
                verdächtige Aktivitäten festgestellt. Du musst dein Konto innerhalb von <strong>24 Stunden</strong> bestätigen, sonst wird es dauerhaft gesperrt.
              </span>
            </p>
            <p>
              Klicke hier:{' '}
              <span className={`underline transition-colors ${revealed.includes('link') ? 'bg-rose-200 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 rounded px-1 no-underline' : 'text-blue-500'}`}>
                http://paypa1-secure.xyz/verify
              </span>
            </p>
          </div>
        </div>

        {/* Flag buttons */}
        {phishingFlags.map((flag) => (
          <button
            key={flag.id}
            onClick={() => toggle(flag.id)}
            style={{ top: flag.top, left: flag.left }}
            className="absolute"
          >
            <motion.div
              animate={{ scale: revealed.includes(flag.id) ? 0.9 : 1 }}
              whileHover={{ scale: 1.1 }}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shadow-md transition-colors ${
                revealed.includes(flag.id)
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'bg-background border-rose-400 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20'
              }`}
            >
              !
            </motion.div>
          </button>
        ))}
      </div>

      {/* Revealed flags */}
      <div className="space-y-2">
        <AnimatePresence>
          {phishingFlags
            .filter((f) => revealed.includes(f.id))
            .map((f) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 px-4 py-3 text-sm">
                  <span className="font-semibold text-rose-700 dark:text-rose-300">{f.label}: </span>
                  <span className="text-rose-800 dark:text-rose-200">{f.desc}</span>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {allRevealed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-5 py-3 text-sm text-emerald-800 dark:text-emerald-200 font-medium text-center"
        >
          ✓ Alle 3 Warnsignale gefunden — diese E-Mail nicht anklicken!
        </motion.div>
      )}
    </div>
  )
}

// ── 4. Update Timeline ──────────────────────────────────────────────────────

const updateSteps = [
  { icon: AlertTriangle, color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400', title: 'Sicherheitslücke entdeckt', desc: 'Angreifer finden eine Schwachstelle in Windows oder einer App.' },
  { icon: RefreshCw, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', title: 'Patch entwickelt', desc: 'Microsoft oder der Hersteller entwickelt einen Fix und testet ihn.' },
  { icon: ArrowRight, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', title: 'Update verfügbar', desc: 'Das Update wird über Windows Update oder den App Store verteilt.' },
  { icon: Shield, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', title: 'Du bist geschützt', desc: 'Nach der Installation ist die Lücke auf deinem PC geschlossen.' },
]

function UpdateTimeline() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border" />
      <motion.div
        className="absolute left-5 top-5 w-0.5 bg-emerald-500"
        initial={{ height: 0 }}
        animate={inView ? { height: 'calc(100% - 2.5rem)' } : {}}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
      />

      <div className="space-y-6">
        {updateSteps.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.18 + 0.1, type: 'spring', stiffness: 200, damping: 22 }}
              className="flex gap-4 pl-2"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${s.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-semibold text-sm mb-0.5">{s.title}</div>
                <div className="text-sm text-muted-foreground">{s.desc}</div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ── 5. WLAN Checklist ───────────────────────────────────────────────────────

const wlanTips = [
  { icon: Lock, text: 'WPA3 oder WPA2 Verschlüsselung aktivieren', safe: true },
  { icon: RefreshCw, text: 'Router-Passwort ändern (nicht Standard lassen)', safe: true },
  { icon: Wifi, text: 'Router-Firmware regelmäßig aktualisieren', safe: true },
  { icon: Shield, text: 'Gastnetzwerk für Besucher einrichten', safe: true },
  { icon: X, text: 'Öffentliches WLAN ohne VPN für sensible Daten nutzen', safe: false },
  { icon: X, text: 'Standard-SSID wie "FRITZ!Box 7590" behalten', safe: false },
]

function WlanChecklist() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {wlanTips.map((tip, i) => {
        const Icon = tip.icon
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.07, type: 'spring', stiffness: 220, damping: 24 }}
            className={`flex gap-3 p-4 rounded-xl border text-sm ${
              tip.safe
                ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20'
            }`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 mt-0.5 ${
                tip.safe ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            />
            <span className={tip.safe ? 'text-emerald-900 dark:text-emerald-200' : 'text-rose-900 dark:text-rose-200'}>
              {tip.safe ? '✓ ' : '✗ '}
              {tip.text}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function SafePage() {
  const s1 = useSection()
  const s2 = useSection()
  const s3 = useSection()
  const s4 = useSection()
  const s5 = useSection()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">⟨info/⟩</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-rose-600 dark:text-rose-400 font-semibold">PC-Sicherheit</span>
        </nav>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="font-mono text-sm font-semibold text-rose-600 dark:text-rose-400 mb-2">⟨safe/⟩</div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">PC-Sicherheit</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Dein Computer enthält persönliche Daten, Passwörter und Fotos. Mit ein paar einfachen Maßnahmen schützt du dich vor den häufigsten Bedrohungen.
          </p>
          <div className="mt-6">
            <InfoBox>
              <strong>Das Wichtigste zuerst:</strong> 90 % der erfolgreichen Angriffe nutzen schwache Passwörter, fehlende Updates oder Phishing — keine ausgefeilte Technik. Die gute Nachricht: Das lässt sich leicht vermeiden.
            </InfoBox>
          </div>
        </motion.div>

        {/* 1. Passwörter */}
        <motion.section
          ref={s1.ref}
          variants={fadeUp}
          initial="hidden"
          animate={s1.inView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <SectionHeading number={1}>Starke Passwörter</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Ein starkes Passwort ist deine erste Verteidigungslinie. Teste hier, wie sicher deins wirklich ist — die Eingabe bleibt komplett lokal, es wird nichts gesendet.
          </p>
          <PasswordStrengthDemo />
          <div className="mt-5 space-y-3">
            <InfoBox>
              <strong>Passphrase-Tipp:</strong> Vier zufällige Wörter aneinandergereiht (<em>Kaffee-Fahrrad-Wolke-Stift77!</em>) sind länger, merksamer und sicherer als <em>P@ssw0rd</em>.
            </InfoBox>
            <WarnBox>
              Verwende nie dasselbe Passwort auf mehreren Seiten. Nutze einen Passwort-Manager wie <strong>Bitwarden</strong> (kostenlos) oder KeePass.
            </WarnBox>
          </div>
        </motion.section>

        {/* 2. 2FA */}
        <motion.section
          ref={s2.ref}
          variants={fadeUp}
          initial="hidden"
          animate={s2.inView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <SectionHeading number={2}>Zwei-Faktor-Authentifizierung (2FA)</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            2FA fügt eine zweite Sicherheitsstufe hinzu. Selbst wenn jemand dein Passwort kennt, kommt er ohne deinen zweiten Faktor (meist dein Handy) nicht rein.
          </p>
          <TwoFactorDemo />
          <div className="mt-5">
            <InfoBox>
              <strong>Wo aktivieren?</strong> E-Mail-Konto, Online-Banking, Apple ID / Google-Konto, Social Media. Die meisten Dienste bieten 2FA in den Sicherheitseinstellungen an. Am besten eine Authenticator-App (z.B. <strong>Aegis</strong>, <strong>Google Authenticator</strong>) statt SMS verwenden.
            </InfoBox>
          </div>
        </motion.section>

        {/* 3. Phishing */}
        <motion.section
          ref={s3.ref}
          variants={fadeUp}
          initial="hidden"
          animate={s3.inView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <SectionHeading number={3}>Phishing erkennen</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Phishing-Mails sollen dich dazu bringen, auf einen gefälschten Link zu klicken oder deine Daten einzugeben. Sie wirken oft täuschend echt — hier siehst du die typischen Warnsignale.
          </p>
          <PhishingEmailDemo />
          <div className="mt-5">
            <WarnBox>
              Im Zweifel: Gehe direkt auf die offizielle Website, anstatt dem Link in der Mail zu folgen. Kein seriöser Dienst fordert dich per E-Mail auf, sofort dein Passwort einzugeben.
            </WarnBox>
          </div>
        </motion.section>

        {/* 4. Updates */}
        <motion.section
          ref={s4.ref}
          variants={fadeUp}
          initial="hidden"
          animate={s4.inView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <SectionHeading number={4}>Updates & Patches</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Software-Updates schließen bekannte Sicherheitslücken. Wer nicht updated, bleibt mit offenen Türen stehen — auch wenn die Lücke längst öffentlich bekannt ist.
          </p>
          <UpdateTimeline />
          <div className="mt-6 space-y-3">
            <InfoBox>
              <strong>Windows Update:</strong> Einstellungen → Windows Update → Auf Updates prüfen. Automatische Updates einschalten spart Zeit und schützt im Hintergrund.
            </InfoBox>
            <WarnBox>
              Veraltete Browserversionen sind das häufigste Einfallstor. Chrome, Edge und Firefox updaten sich meist automatisch — prüfe es trotzdem gelegentlich.
            </WarnBox>
          </div>
        </motion.section>

        {/* 5. WLAN */}
        <motion.section
          ref={s5.ref}
          variants={fadeUp}
          initial="hidden"
          animate={s5.inView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <SectionHeading number={5}>Sicheres WLAN</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Dein Heimnetzwerk ist der Eingang zu allen deinen Geräten. Ein schlecht gesicherter Router ist leicht angreifbar — diese Checkliste hilft.
          </p>
          <WlanChecklist />
        </motion.section>

        {/* Footer CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="border-t border-border pt-10 flex flex-wrap gap-4"
        >
          <Link
            href="/pc/files"
            className="group flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-border hover:border-amber-400/60 bg-card transition-all hover:shadow-md text-sm font-semibold"
          >
            Weiter: Dateien organisieren
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/pc/speed"
            className="group flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-border hover:border-cyan-400/60 bg-card transition-all hover:shadow-md text-sm font-semibold"
          >
            Weiter: PC schneller machen
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </main>
    </div>
  )
}
