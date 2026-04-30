'use client'

import * as React from 'react'
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import type { SortStep, BarState } from '@/lib/algorithms/types'
import {
  type ChartType,
  type ColorScheme,
  type InputType,
  computeAllSteps,
  generateInput,
  generatorMap,
} from '@/lib/playground-utils'
import { getColor } from './color-schemes'
import { ChartBar } from './chart-bar'
import { ChartLine } from './chart-line'
import { ChartRadial } from './chart-radial'
import { ChartScatter } from './chart-scatter'
import { ExportButton } from './export-button'
import { SettingsPanel } from './settings-panel'

const LEGEND_STATES: { state: BarState; label: string }[] = [
  { state: 'default', label: 'Unsortiert' },
  { state: 'comparing', label: 'Vergleich' },
  { state: 'swapping', label: 'Tausch' },
  { state: 'pivot', label: 'Pivot / Aktiv' },
  { state: 'sorted', label: 'Sortiert' },
]

export function PlaygroundVisualizer() {
  const [algorithmSlug, setAlgorithmSlug] = React.useState('bubble-sort')
  const [chartType, setChartType] = React.useState<ChartType>('bar')
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>('default')
  const [inputType, setInputType] = React.useState<InputType>('random')
  const [arraySize, setArraySize] = React.useState(30)
  const [speed, setSpeed] = React.useState(150)
  const [steps, setSteps] = React.useState<SortStep[]>([])
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const initialize = React.useCallback(() => {
    const genFn = generatorMap[algorithmSlug]
    if (!genFn) return
    const input = generateInput(inputType, arraySize)
    const allSteps = computeAllSteps(genFn, input)
    setSteps(allSteps)
    setCurrentStep(0)
    setIsPlaying(false)
  }, [algorithmSlug, inputType, arraySize])

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

  const step = steps[currentStep]
  const maxVal = arraySize

  const handlePlayPause = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0)
      setIsPlaying(true)
    } else {
      setIsPlaying((p) => !p)
    }
  }

  const handleStepBack = () => { setIsPlaying(false); setCurrentStep((p) => Math.max(0, p - 1)) }
  const handleStepForward = () => { setIsPlaying(false); setCurrentStep((p) => Math.min(steps.length - 1, p + 1)) }

  if (!step) return null

  const chartProps = { bars: step.bars, states: step.states, maxVal, colorScheme }

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      {/* Settings */}
      <SettingsPanel
        algorithmSlug={algorithmSlug}
        onAlgorithmChange={setAlgorithmSlug}
        chartType={chartType}
        onChartTypeChange={setChartType}
        colorScheme={colorScheme}
        onColorSchemeChange={setColorScheme}
        arraySize={arraySize}
        onArraySizeChange={setArraySize}
        inputType={inputType}
        onInputTypeChange={setInputType}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      {/* Chart */}
      {chartType === 'bar' && <ChartBar {...chartProps} />}
      {chartType === 'scatter' && <ChartScatter {...chartProps} />}
      {chartType === 'line' && <ChartLine {...chartProps} />}
      {chartType === 'radial' && <ChartRadial {...chartProps} />}

      {/* Status bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span>{step.description}</span>
        <span>
          Schritt {currentStep + 1}/{steps.length} · {step.comparisons} Vergleiche · {step.swaps} Tausche
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

        <ExportButton
          algorithmSlug={algorithmSlug}
          chartType={chartType}
          colorScheme={colorScheme}
          arraySize={arraySize}
          inputType={inputType}
          speed={speed}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-1">
        {LEGEND_STATES.map(({ state, label }) => (
          <div key={state} className="flex items-center gap-1.5">
            <div
              className="h-3 w-3 rounded-sm"
              style={{ background: getColor(state, 0, 10, colorScheme) }}
            />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
