let _ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!_ctx) {
      _ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return _ctx
  } catch {
    return null
  }
}

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('soundEnabled') !== 'false'
}

export function setSoundEnabled(v: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('soundEnabled', String(v))
}

function guard(): AudioContext | null {
  if (!isSoundEnabled()) return null
  return getCtx()
}

function note(
  c: AudioContext,
  freq: number,
  startDelay: number,
  duration: number,
  type: OscillatorType = 'sine',
  vol = 0.12,
) {
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain)
  gain.connect(c.destination)
  osc.type = type
  osc.frequency.value = freq
  const t = c.currentTime + startDelay
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(vol, t + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration)
  osc.start(t)
  osc.stop(t + duration + 0.01)
}

function sweep(
  c: AudioContext,
  freqA: number,
  freqB: number,
  duration: number,
  type: OscillatorType = 'sine',
  vol = 0.09,
) {
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain)
  gain.connect(c.destination)
  osc.type = type
  const t = c.currentTime
  osc.frequency.setValueAtTime(freqA, t)
  osc.frequency.exponentialRampToValueAtTime(freqB, t + duration)
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(vol, t + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration)
  osc.start(t)
  osc.stop(t + duration + 0.01)
}

// ── Public sound functions ──────────────────────────────────────────────────

export function playClick() {
  const c = guard(); if (!c) return
  note(c, 380, 0, 0.05, 'sine', 0.1)
}

export function playSuccess() {
  const c = guard(); if (!c) return
  note(c, 523, 0,    0.12, 'sine', 0.13) // C5
  note(c, 659, 0.09, 0.12, 'sine', 0.13) // E5
  note(c, 784, 0.18, 0.18, 'sine', 0.14) // G5
}

export function playError() {
  const c = guard(); if (!c) return
  sweep(c, 300, 100, 0.28, 'sawtooth', 0.1)
}

export function playPop() {
  const c = guard(); if (!c) return
  sweep(c, 900, 380, 0.07, 'sine', 0.08)
}

export function playTick() {
  const c = guard(); if (!c) return
  note(c, 1000, 0, 0.018, 'square', 0.05)
}

export function playFlip() {
  const c = guard(); if (!c) return
  sweep(c, 220, 660, 0.09, 'sine', 0.08)
  note(c, 660, 0.08, 0.1, 'sine', 0.05)
}

export function playToggleOn() {
  const c = guard(); if (!c) return
  sweep(c, 380, 640, 0.07, 'sine', 0.09)
}

export function playToggleOff() {
  const c = guard(); if (!c) return
  sweep(c, 640, 380, 0.07, 'sine', 0.09)
}

export function playReveal() {
  const c = guard(); if (!c) return
  note(c, 900,  0,    0.04, 'sine', 0.07)
  note(c, 1100, 0.03, 0.04, 'sine', 0.07)
  note(c, 1300, 0.06, 0.05, 'sine', 0.07)
}

export function playComplete() {
  const c = guard(); if (!c) return
  note(c, 523,  0,    0.15, 'sine', 0.12)
  note(c, 659,  0.07, 0.15, 'sine', 0.12)
  note(c, 784,  0.14, 0.15, 'sine', 0.12)
  note(c, 1047, 0.21, 0.25, 'sine', 0.14)
}

export function playDrawerOpen() {
  const c = guard(); if (!c) return
  sweep(c, 160, 480, 0.18, 'sine', 0.07)
}

export function playDrawerClose() {
  const c = guard(); if (!c) return
  sweep(c, 480, 160, 0.14, 'sine', 0.07)
}

export function playCorrect() {
  const c = guard(); if (!c) return
  note(c, 659, 0,    0.1,  'sine', 0.15) // E5
  note(c, 784, 0.09, 0.16, 'sine', 0.15) // G5
}

export function playWrong() {
  const c = guard(); if (!c) return
  note(c, 220, 0,    0.09, 'sawtooth', 0.1)
  note(c, 185, 0.08, 0.18, 'sawtooth', 0.09)
}

export function playGameOver() {
  const c = guard(); if (!c) return
  note(c, 523,  0,    0.12, 'sine', 0.14)
  note(c, 659,  0.1,  0.12, 'sine', 0.14)
  note(c, 784,  0.2,  0.12, 'sine', 0.14)
  note(c, 1047, 0.3,  0.35, 'sine', 0.16)
}

/** Pitch proportional to bar height — for sort visualizer (normalized 0–1). */
export function playSort(normalized: number) {
  const c = guard(); if (!c) return
  const freq = 160 + normalized * 1200
  note(c, freq, 0, 0.022, 'sine', 0.035)
}
