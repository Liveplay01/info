'use client'

import { motion } from 'framer-motion'
import { ArrayTypeMeta } from '@/lib/array-registry'

interface ArrayVisualizerProps {
  arrayType: ArrayTypeMeta
}

function getCellStyle(value: string | number | boolean | null, category: ArrayTypeMeta['category'], javaType: string): string {
  if (value === null || value === 'null') {
    return 'border-dashed border-muted-foreground/40 bg-muted/30 text-muted-foreground/60'
  }
  if (javaType === 'boolean[]') {
    return value === true || value === 'true'
      ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
      : 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
  }
  if (javaType === 'char[]') {
    return 'border-purple-400 dark:border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
  }
  if (javaType === 'String[]' || javaType === 'Object[]') {
    return 'border-orange-400 dark:border-orange-600 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300'
  }
  return 'border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
}

function formatValue(value: string | number | boolean | null): string {
  if (value === null) return 'null'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return String(value)
}

function TwoDimensionalVisualizer() {
  const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs text-muted-foreground font-mono">matrix[Zeile][Spalte]</span>
      </div>
      <div className="flex gap-1 items-center">
        <div className="flex flex-col gap-1 mr-2">
          {matrix.map((_, rowIdx) => (
            <div key={rowIdx} className="h-12 flex items-center">
              <span className="text-xs text-muted-foreground font-mono w-6 text-right">[{rowIdx}]</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          {/* Column headers */}
          <div className="flex gap-1 mb-1 ml-0">
            {matrix[0].map((_, colIdx) => (
              <div key={colIdx} className="w-12 text-center">
                <span className="text-xs text-muted-foreground font-mono">[{colIdx}]</span>
              </div>
            ))}
          </div>
          {/* Matrix rows */}
          {matrix.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-1">
              {row.map((val, colIdx) => (
                <motion.div
                  key={colIdx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (rowIdx * 3 + colIdx) * 0.05, duration: 0.3 }}
                  className="w-12 h-12 border-2 rounded-md flex items-center justify-center border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                >
                  <span className="font-mono text-sm font-semibold">{val}</span>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 font-mono">
        3 Zeilen × 3 Spalten — matrix[1][1] = 5 (Mitte)
      </p>
    </div>
  )
}

export function ArrayVisualizer({ arrayType }: ArrayVisualizerProps) {
  if (arrayType.javaType === 'int[][]') {
    return (
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-sm font-semibold text-foreground">{arrayType.javaType}</span>
          <span className="text-xs text-muted-foreground">— 2D-Array Visualisierung</span>
        </div>
        <TwoDimensionalVisualizer />
      </div>
    )
  }

  const values = arrayType.visualExample

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="font-mono text-sm font-semibold text-foreground">{arrayType.javaType}</span>
        <span className="text-xs text-muted-foreground">— {values.length} Elemente</span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-fit">
          {values.map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07, duration: 0.3 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={`w-16 h-14 border-2 rounded-md flex items-center justify-center ${getCellStyle(value, arrayType.category, arrayType.javaType)}`}
              >
                <span className="font-mono text-xs font-semibold leading-tight text-center px-1 break-all">
                  {formatValue(value)}
                </span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">[{idx}]</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t flex flex-wrap gap-x-6 gap-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Länge:</span>
          <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{values.length}</code>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Letzter Index:</span>
          <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{values.length - 1}</code>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Standardwert:</span>
          <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{arrayType.defaultValue}</code>
        </div>
        {arrayType.bits && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Bits/Element:</span>
            <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{arrayType.bits} Bit</code>
          </div>
        )}
      </div>
    </div>
  )
}
