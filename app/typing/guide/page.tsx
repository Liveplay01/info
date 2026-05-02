import { Header } from '@/components/header'
import { KeyboardVisual } from '@/components/typing/keyboard-visual'
import { TypingStatsEmbed } from '@/components/typing/typing-stats-embed'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '⟨info/⟩ – Zehnfingersystem',
  description:
    'Lerne die Grundlagen des Touch-Typings: Grundposition, Fingerzuordnung, Haltung und einen praktischen Übungsplan.',
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold mb-4 mt-0">{children}</h2>
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4 text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
      {children}
    </div>
  )
}

function WarnBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
      {children}
    </div>
  )
}

function Step({
  n,
  title,
  children,
}: {
  n: number
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-bold text-sm shrink-0 mt-0.5">
        {n}
      </div>
      <div>
        <p className="font-semibold mb-1">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
      </div>
    </div>
  )
}

export default function TypingGuidePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/typing" className="hover:text-foreground transition-colors">Tippen</Link>
          <span>/</span>
          <span className="font-mono text-violet-600 dark:text-violet-400">⟨guide/⟩</span>
        </div>

        {/* Hero */}
        <section className="mb-12">
          <div className="font-mono text-sm font-semibold text-violet-600 dark:text-violet-400 mb-2">
            ⟨guide/⟩
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">Das Zehnfingersystem</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            Wer blind tippen kann — also ohne auf die Tastatur zu schauen — schreibt im Schnitt
            doppelt so schnell wie jemand, der mit zwei Fingern sucht. Das Zehnfingersystem ist
            keine Magie: Es ist ein erlernbares Muster, das nach ein paar Wochen Training zur
            zweiten Natur wird.
          </p>
          <InfoBox>
            <strong>Ziel dieses Artikels:</strong> Du lernst die Grundposition, welcher Finger
            welche Taste drückt, wie du richtig sitzt — und bekommst einen konkreten Übungsplan,
            mit dem du in 4 Wochen deutlich schneller tippst.
          </InfoBox>
        </section>

        {/* Section 1: Grundposition */}
        <section className="mb-12">
          <SectionHeading>1. Die Grundposition</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Alle Finger kehren nach jedem Tastenanschlag zu ihrer <strong>Ausgangsposition</strong>{' '}
            zurück. Diese liegt auf der mittleren Reihe — der sogenannten{' '}
            <em>Home Row</em>. Die kleinen Noppen auf <kbd className="font-mono text-xs border rounded px-1 py-0.5">F</kbd> und{' '}
            <kbd className="font-mono text-xs border rounded px-1 py-0.5">J</kbd> helfen dir, die Position ohne Hinschauen zu finden.
          </p>

          <div className="rounded-xl border bg-card p-4 sm:p-6 mb-6 overflow-x-auto">
            <KeyboardVisual showHomeRowOnly />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Linke Hand</p>
              <ul className="space-y-1 text-muted-foreground">
                <li><kbd className="font-mono font-bold text-foreground">A</kbd> — Kleinfinger</li>
                <li><kbd className="font-mono font-bold text-foreground">S</kbd> — Ringfinger</li>
                <li><kbd className="font-mono font-bold text-foreground">D</kbd> — Mittelfinger</li>
                <li><kbd className="font-mono font-bold text-foreground">F</kbd> — Zeigefinger</li>
                <li><kbd className="font-mono font-bold text-foreground">Leertaste</kbd> — Daumen</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="font-semibold mb-2 text-orange-700 dark:text-orange-300">Rechte Hand</p>
              <ul className="space-y-1 text-muted-foreground">
                <li><kbd className="font-mono font-bold text-foreground">J</kbd> — Zeigefinger</li>
                <li><kbd className="font-mono font-bold text-foreground">K</kbd> — Mittelfinger</li>
                <li><kbd className="font-mono font-bold text-foreground">L</kbd> — Ringfinger</li>
                <li><kbd className="font-mono font-bold text-foreground">Ö</kbd> — Kleinfinger</li>
                <li><kbd className="font-mono font-bold text-foreground">Leertaste</kbd> — Daumen</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Fingerzuordnung */}
        <section className="mb-12">
          <SectionHeading>2. Fingerzuordnung</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Jede Taste gehört exakt einem Finger. Fahre mit der Maus über eine Taste oder über
            einen Finger in der Legende, um die Zuordnung zu sehen.
          </p>

          <div className="rounded-xl border bg-card p-4 sm:p-6 mb-6 overflow-x-auto">
            <KeyboardVisual />
          </div>

          <InfoBox>
            <strong>Wichtig:</strong> Die Zeigefinger sind am flexibelsten — sie decken je zwei
            Spalten ab (links: R F V T G B, rechts: Z H N U J M). Das ist normal und Teil des
            Systems.
          </InfoBox>
        </section>

        {/* Section 3: Haltung */}
        <section className="mb-12">
          <SectionHeading>3. Haltung & Technik</SectionHeading>
          <div className="space-y-5">
            <div className="flex gap-4 items-start">
              <span className="text-2xl shrink-0">🪑</span>
              <div>
                <p className="font-semibold mb-1">Aufrechte Sitzhaltung</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Rücken gerade, Schultern entspannt, Füße flach auf dem Boden. Der Bildschirm
                  sollte auf Augenhöhe sein, damit du nicht den Nacken belastest.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-2xl shrink-0">🤲</span>
              <div>
                <p className="font-semibold mb-1">Handgelenke leicht angehoben</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Lege die Handgelenke nicht auf der Tastatur ab, während du tippst — das
                  verlangsamt die Bewegungen. Eine leichte Erhebung (oder eine Handballenauflage)
                  schützt außerdem vor Überlastung.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-2xl shrink-0">👀</span>
              <div>
                <p className="font-semibold mb-1">Nicht auf die Tastatur schauen</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Das ist die schwierigste Gewohnheit. Am Anfang wirst du Fehler machen — das ist
                  in Ordnung. Mit der Zeit spürst du die Positionen, ohne hinzuschauen. Klebezettel
                  über die Tastatur helfen beim Entwöhnen.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-2xl shrink-0">⌨️</span>
              <div>
                <p className="font-semibold mb-1">Leichter Anschlag</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tasten müssen nicht fest gedrückt werden — ein leichter, kontrollierter Anschlag
                  reicht. Zu viel Kraft ermüdet die Finger schnell und verlangsamt dich.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Übungsplan */}
        <section className="mb-12">
          <SectionHeading>4. Der Übungsplan</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Schnelligkeit kommt durch Wiederholung — aber nur, wenn die Grundlagen sitzen.
            Fange langsam an und steigere das Tempo erst dann, wenn du eine Runde fehlerfrei
            abschließen kannst.
          </p>
          <div className="space-y-5">
            <Step n={1} title="Woche 1–2: Genauigkeit vor Geschwindigkeit">
              Tippe bewusst langsam. Ziel: 0 Fehler pro Runde. Nutze den 15s- oder 30s-Modus.
              Dein Gehirn lernt erst die Zuordnung — Geschwindigkeit kommt danach von selbst.
            </Step>
            <Step n={2} title="Woche 3: Rhythmus aufbauen">
              Versuche, gleichmäßig zu tippen — kein Zögern, kein Nachdenken. Nutze den
              60s-Modus. Wenn du ins Stocken gerätst, verlangsame lieber, als zu pausieren.
            </Step>
            <Step n={3} title="Woche 4+: Tempo steigern">
              Jetzt darfst du pushen. Nutze den 60s- oder 120s-Modus und ziele auf einen neuen
              Persönlichen Rekord. Fehler werden weniger, wenn Finger und Gehirn synchron arbeiten.
            </Step>
            <Step n={4} title="Langfristig: Täglich 10–15 Minuten">
              Kurze, regelmäßige Sessions sind effektiver als stundenlange Marathons. Das
              Streak-System im Trainer hilft dir, dranzubleiben.
            </Step>
          </div>
        </section>

        {/* Section 5: Häufige Fehler */}
        <section className="mb-12">
          <SectionHeading>5. Häufige Fehler vermeiden</SectionHeading>
          <WarnBox>
            <ul className="space-y-2.5">
              <li>
                <strong>❌ Auf die Tastatur schauen:</strong> Unterbricht den Lernprozess.
                Konsequent vermeiden — auch wenn es langsamer macht.
              </li>
              <li>
                <strong>❌ Nur mit den Zeigefingern tippen:</strong> Zwei-Finger-System ist
                schwer wieder abzugewöhnen, wenn man es zu lange benutzt.
              </li>
              <li>
                <strong>❌ Zu früh zu schnell tippen wollen:</strong> Fehler bei hohem Tempo
                zementieren falsche Muster. Genauigkeit hat immer Vorrang.
              </li>
              <li>
                <strong>❌ Finger nicht zurück zur Grundposition:</strong> Nach jedem Anschlag
                kehren alle Finger zu A S D F / J K L Ö zurück. Immer.
              </li>
              <li>
                <strong>❌ Zu lange Sessions ohne Pause:</strong> Mentale Erschöpfung führt zu
                mehr Fehlern. 10–15 Minuten fokussiert sind besser als 60 Minuten halbherzig.
              </li>
            </ul>
          </WarnBox>
        </section>

        {/* CTA + Stats Embed */}
        <section className="mb-8">
          <SectionHeading>Bereit zum Üben?</SectionHeading>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Theorie ist gut — Praxis ist besser. Starte jetzt eine Runde und wende das Gelernte
            direkt an. Dein aktueller Fortschritt:
          </p>
          <TypingStatsEmbed />
        </section>

      </main>
    </div>
  )
}
