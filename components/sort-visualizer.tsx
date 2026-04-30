'use client'

import * as React from 'react'
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { SortStep, BarState, GeneratorFn } from '@/lib/algorithms/types'

type InputType = 'random' | 'sorted' | 'reversed' | 'nearly-sorted'

const BAR_COLORS: Record<BarState, string> = {
  default: 'bg-slate-300 dark:bg-slate-600',
  comparing: 'bg-amber-400',
  swapping: 'bg-red-500',
  sorted: 'bg-emerald-500',
  pivot: 'bg-violet-500',
}

function generateInput(type: InputType, size: number): number[] {
  const arr = Array.from({ length: size }, (_, i) => i + 1)
  switch (type) {
    case 'random':
      return arr.sort(() => Math.random() - 0.5)
    case 'sorted':
      return arr
    case 'reversed':
      return [...arr].reverse()
    case 'nearly-sorted': {
      const swapCount = Math.max(1, Math.floor(size * 0.08))
      for (let i = 0; i < swapCount; i++) {
        const a = Math.floor(Math.random() * size)
        const b = Math.floor(Math.random() * size)
        ;[arr[a], arr[b]] = [arr[b], arr[a]]
      }
      return arr
    }
  }
}

function computeAllSteps(generatorFn: GeneratorFn, input: number[]): SortStep[] {
  const steps: SortStep[] = []
  const gen = generatorFn(input)
  let result = gen.next()
  while (!result.done) {
    steps.push(result.value)
    result = gen.next()
  }
  return steps
}

interface SortVisualizerProps {
  generatorFn: GeneratorFn
}

export function SortVisualizer({ generatorFn }: SortVisualizerProps) {
  const [inputType, setInputType] = React.useState<InputType>('random')
  const [arraySize, setArraySize] = React.useState(30)
  const [speed, setSpeed] = React.useState(150)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [steps, setSteps] = React.useState<SortStep[]>([])
  const [currentStep, setCurrentStep] = React.useState(0)
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const initialize = React.useCallback(() => {
    const input = generateInput(inputType, arraySize)
    const allSteps = computeAllSteps(generatorFn, input)
    setSteps(allSteps)
    setCurrentStep(0)
    setIsPlaying(false)
  }, [inputType, arraySize, generatorFn])

  React.useEffect(() => {
    initialize()
  }, [initialize])

  React.useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, speed)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, speed, steps.length])

  const currentStepData = steps[currentStep]
  const maxVal = arraySize

  const handlePlayPause = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0)
      setIsPlaying(true)
    } else {
      setIsPlaying((p) => !p)
    }
  }

  const handleStepBack = () => {
    setIsPlaying(false)
    setCurrentStep((p) => Math.max(0, p - 1))
  }

  const handleStepForward = () => {
    setIsPlaying(false)
    setCurrentStep((p) => Math.min(steps.length - 1, p + 1))
  }

  if (!currentStepData) return null

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      {/* Bar Chart */}
      <div className="flex items-end gap-px h-44 w-full rounded-lg bg-muted/30 px-2 py-2 overflow-hidden">
        {currentStepData.bars.map((value, idx) => (
          <div
            key={idx}
            className={`flex-1 rounded-t-sm transition-all duration-75 ${BAR_COLORS[currentStepData.states[idx]]}`}
            style={{ height: `${Math.max(2, (value / maxVal) * 100)}%` }}
          />
        ))}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span>{currentStepData.description}</span>
        <span>
          Schritt {currentStep + 1}/{steps.length} · {currentStepData.comparisons} Vergleiche · {currentStepData.swaps} Tausche
        </span>
      </div>

      {/* Scrubber */}
      <Slider
        value={[currentStep]}
        onValueChange={([v]) => { setIsPlaying(false); setCurrentStep(v) }}
        min={0}
        max={Math.max(0, steps.length - 1)}
        step={1}
        className="w-full"
      />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handlePlayPause} size="sm" variant="default" className="gap-1.5">
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {isPlaying ? 'Pause' : 'Abspielen'}
        </Button>
        <Button onClick={handleStepBack} size="sm" variant="outline" className="px-2.5" disabled={currentStep === 0}>
          <SkipBack className="h-3.5 w-3.5" />
        </Button>
        <Button onClick={handleStepForward} size="sm" variant="outline" className="px-2.5" disabled={currentStep >= steps.length - 1}>
          <SkipForward className="h-3.5 w-3.5" />
        </Button>
        <Button onClick={initialize} size="sm" variant="ghost" className="gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" />
          Zurücksetzen
        </Button>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Tempo</span>
          <Slider
            value={[speed]}
            onValueChange={([v]) => setSpeed(v)}
            min={30}
            max={600}
            step={10}
            className="w-20"
          />
        </div>

        <Select value={inputType} onValueChange={(v) => setInputType(v as InputType)}>
          <SelectTrigger className="w-36 h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="random">Zufällig</SelectItem>
            <SelectItem value="sorted">Sortiert</SelectItem>
            <SelectItem value="reversed">Umgekehrt</SelectItem>
            <SelectItem value="nearly-sorted">Fast sortiert</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">n=</span>
          <Slider
            value={[arraySize]}
            onValueChange={([v]) => setArraySize(v)}
            min={10}
            max={50}
            step={5}
            className="w-20"
          />
          <span className="text-xs text-muted-foreground w-5">{arraySize}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-1">
        {[
          { state: 'default' as BarState, label: 'Unsortiert' },
          { state: 'comparing' as BarState, label: 'Vergleich' },
          { state: 'swapping' as BarState, label: 'Tausch' },
          { state: 'pivot' as BarState, label: 'Pivot / Aktiv' },
          { state: 'sorted' as BarState, label: 'Sortiert' },
        ].map(({ state, label }) => (
          <div key={state} className="flex items-center gap-1.5">
            <div className={`h-3 w-3 rounded-sm ${BAR_COLORS[state]}`} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
