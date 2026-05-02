'use client'

import { useState, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { isSoundEnabled, setSoundEnabled, playClick } from '@/lib/sounds'

export function SoundToggle() {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    setEnabled(isSoundEnabled())
  }, [])

  function toggle() {
    const next = !enabled
    setSoundEnabled(next)
    setEnabled(next)
    if (next) playClick()
  }

  return (
    <button
      onClick={toggle}
      title={enabled ? 'Sound deaktivieren' : 'Sound aktivieren'}
      className="inline-flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
    >
      {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </button>
  )
}
