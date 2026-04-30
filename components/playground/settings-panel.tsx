'use client'

import { BarChart2, Circle, LineChart, ScatterChart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { algorithms } from '@/lib/algorithm-registry'
import { COLOR_SCHEME_LABELS } from './color-schemes'
import type { ChartType, ColorScheme, InputType } from '@/lib/playground-utils'

const CHART_TYPES: { id: ChartType; label: string; icon: React.ReactNode }[] = [
  { id: 'bar', label: 'Balken', icon: <BarChart2 className="h-3.5 w-3.5" /> },
  { id: 'scatter', label: 'Punkte', icon: <ScatterChart className="h-3.5 w-3.5" /> },
  { id: 'line', label: 'Linie', icon: <LineChart className="h-3.5 w-3.5" /> },
  { id: 'radial', label: 'Radial', icon: <Circle className="h-3.5 w-3.5" /> },
]

interface SettingsPanelProps {
  algorithmSlug: string
  onAlgorithmChange: (slug: string) => void
  chartType: ChartType
  onChartTypeChange: (t: ChartType) => void
  colorScheme: ColorScheme
  onColorSchemeChange: (s: ColorScheme) => void
  arraySize: number
  onArraySizeChange: (n: number) => void
  inputType: InputType
  onInputTypeChange: (t: InputType) => void
  speed: number
  onSpeedChange: (ms: number) => void
}

export function SettingsPanel({
  algorithmSlug,
  onAlgorithmChange,
  chartType,
  onChartTypeChange,
  colorScheme,
  onColorSchemeChange,
  arraySize,
  onArraySizeChange,
  inputType,
  onInputTypeChange,
  speed,
  onSpeedChange,
}: SettingsPanelProps) {
  return (
    <div className="space-y-3">
      {/* Row 1: Algorithm + Chart Type */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={algorithmSlug} onValueChange={onAlgorithmChange}>
          <SelectTrigger className="w-48 h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {algorithms.map((algo) => (
              <SelectItem key={algo.slug} value={algo.slug} className="text-xs">
                {algo.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-1">
          {CHART_TYPES.map(({ id, label, icon }) => (
            <Button
              key={id}
              size="sm"
              variant={chartType === id ? 'default' : 'outline'}
              className="gap-1.5 text-xs px-2.5"
              onClick={() => onChartTypeChange(id)}
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Row 2: Speed, Size, Input Type, Color Scheme */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Tempo</span>
          <Slider
            value={[speed]}
            onValueChange={([v]) => onSpeedChange(v)}
            min={30}
            max={600}
            step={10}
            className="w-24"
          />
          <span className="text-xs text-muted-foreground w-10">{speed}ms</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">n =</span>
          <Slider
            value={[arraySize]}
            onValueChange={([v]) => onArraySizeChange(v)}
            min={10}
            max={100}
            step={5}
            className="w-24"
          />
          <span className="text-xs text-muted-foreground w-6">{arraySize}</span>
        </div>

        <Select value={inputType} onValueChange={(v) => onInputTypeChange(v as InputType)}>
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

        <Select value={colorScheme} onValueChange={(v) => onColorSchemeChange(v as ColorScheme)}>
          <SelectTrigger className="w-36 h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(COLOR_SCHEME_LABELS) as [ColorScheme, string][]).map(([key, label]) => (
              <SelectItem key={key} value={key} className="text-xs">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
