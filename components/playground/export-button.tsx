'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { algorithmGeneratorSource, algorithmNames } from '@/lib/algorithm-generator-source'
import type { ChartType, ColorScheme, InputType } from '@/lib/playground-utils'

interface ExportConfig {
  algorithmSlug: string
  chartType: ChartType
  colorScheme: ColorScheme
  arraySize: number
  inputType: InputType
  speed: number
}

function buildExportHTML(config: ExportConfig): string {
  const { algorithmSlug, chartType, colorScheme, arraySize, inputType, speed } = config
  const algoName = algorithmNames[algorithmSlug] ?? algorithmSlug
  const chartLabel = { bar: 'Balkendiagramm', scatter: 'Punktdiagramm', line: 'Liniendiagramm', radial: 'Kreisdiagramm' }[chartType]
  const generatorCode = algorithmGeneratorSource[algorithmSlug] ?? ''

  const isRadial = chartType === 'radial'
  const viewBox = isRadial ? '0 0 800 420' : '0 0 800 240'
  const svgHeight = isRadial ? '420' : '240'

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${algoName} – ${chartLabel}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0f1117; color: #e2e8f0; font-family: system-ui, sans-serif; padding: 24px; max-width: 900px; margin: 0 auto; }
  h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 4px; }
  .subtitle { font-size: 0.875rem; color: #64748b; margin-bottom: 20px; }
  #chart-wrap { background: rgba(255,255,255,0.04); border-radius: 12px; overflow: hidden; margin-bottom: 12px; }
  #chart { width: 100%; display: block; }
  #status { font-family: monospace; font-size: 0.75rem; color: #94a3b8; display: flex; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 4px; }
  #scrubber { width: 100%; margin-bottom: 12px; accent-color: #6366f1; }
  #controls { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 16px; }
  button { padding: 6px 14px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: #e2e8f0; cursor: pointer; font-size: 0.8rem; transition: background 0.15s; }
  button:hover { background: #334155; }
  button#btn-play { background: #4f46e5; border-color: #4f46e5; }
  button#btn-play:hover { background: #4338ca; }
  button:disabled { opacity: 0.4; cursor: default; }
  .control-group { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #94a3b8; }
  input[type=range] { accent-color: #6366f1; width: 90px; }
  #legend { display: flex; flex-wrap: wrap; gap: 12px; }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: #94a3b8; }
  .legend-dot { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
</style>
</head>
<body>
<h1>${algoName}</h1>
<p class="subtitle">${chartLabel} · Farbschema: ${colorScheme} · n=${arraySize} · Eingabe: ${inputType}</p>

<div id="chart-wrap">
  <svg id="chart" viewBox="${viewBox}" height="${svgHeight}"></svg>
</div>

<div id="status">
  <span id="status-desc">—</span>
  <span id="status-counts">—</span>
</div>

<input type="range" id="scrubber" min="0" max="0" value="0">

<div id="controls">
  <button id="btn-play">▶ Abspielen</button>
  <button id="btn-back" disabled>◀</button>
  <button id="btn-forward" disabled>▶</button>
  <button id="btn-reset">↺ Zurücksetzen</button>
  <div class="control-group">
    <label for="speed-slider">Tempo</label>
    <input type="range" id="speed-slider" min="30" max="600" step="10" value="${speed}">
    <span id="speed-label">${speed}ms</span>
  </div>
</div>

<div id="legend">
  <div class="legend-item"><div class="legend-dot" id="leg-default"></div><span>Unsortiert</span></div>
  <div class="legend-item"><div class="legend-dot" id="leg-comparing"></div><span>Vergleich</span></div>
  <div class="legend-item"><div class="legend-dot" id="leg-swapping"></div><span>Tausch</span></div>
  <div class="legend-item"><div class="legend-dot" id="leg-pivot"></div><span>Pivot / Aktiv</span></div>
  <div class="legend-item"><div class="legend-dot" id="leg-sorted"></div><span>Sortiert</span></div>
</div>

<script>
// ── Algorithm Generator ──────────────────────────────────────────────────────
${generatorCode}

// ── Input Generation ─────────────────────────────────────────────────────────
function generateInput(type, size) {
  const arr = Array.from({ length: size }, (_, i) => i + 1);
  if (type === 'random') return arr.sort(() => Math.random() - 0.5);
  if (type === 'sorted') return arr;
  if (type === 'reversed') return arr.reverse();
  if (type === 'nearly-sorted') {
    const sw = Math.max(1, Math.floor(size * 0.08));
    for (let i = 0; i < sw; i++) {
      const a = Math.floor(Math.random() * size), b = Math.floor(Math.random() * size);
      [arr[a], arr[b]] = [arr[b], arr[a]];
    }
    return arr;
  }
  return arr;
}

function computeAllSteps(genFn, input) {
  const steps = [];
  const gen = genFn(input);
  let r = gen.next();
  while (!r.done) { steps.push(r.value); r = gen.next(); }
  return steps;
}

// ── Color Scheme ──────────────────────────────────────────────────────────────
const SCHEME = '${colorScheme}';
const DEFAULT_COLORS = { default: 'hsl(215 16% 47%)', comparing: 'hsl(43 96% 56%)', swapping: 'hsl(0 84% 60%)', sorted: 'hsl(152 69% 50%)', pivot: 'hsl(263 70% 63%)' };
const MONO_L = { default: 45, comparing: 75, swapping: 85, sorted: 65, pivot: 55 };

function getColor(state, idx, total) {
  if (SCHEME === 'default') return DEFAULT_COLORS[state] || DEFAULT_COLORS.default;
  if (SCHEME === 'monochrome') return \`hsl(240 5% \${MONO_L[state] || 45}%)\`;
  const hue = (idx / total) * 360;
  if (state === 'default') return \`hsl(\${hue} 70% 55%)\`;
  if (state === 'comparing') return \`hsl(\${hue} 100% 70%)\`;
  if (state === 'swapping') return \`hsl(0 90% 65%)\`;
  if (state === 'sorted') return \`hsl(\${hue} 80% 60%)\`;
  if (state === 'pivot') return \`hsl(280 90% 70%)\`;
  return \`hsl(\${hue} 70% 55%)\`;
}

// Paint legend swatches
['default','comparing','swapping','pivot','sorted'].forEach(s => {
  const el = document.getElementById('leg-' + s);
  if (el) el.style.background = getColor(s, 0, 10);
});

// ── Chart Rendering ───────────────────────────────────────────────────────────
const SVG_NS = 'http://www.w3.org/2000/svg';
const CHART_TYPE = '${chartType}';
const svg = document.getElementById('chart');

function clearSvg() {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
}

function renderChart(step) {
  clearSvg();
  const bars = step.bars, states = step.states, n = bars.length;
  const maxVal = n;

  if (CHART_TYPE === 'bar') {
    const bw = 800 / n, gap = Math.max(1, bw * 0.15);
    bars.forEach((val, idx) => {
      const normH = Math.max(2, (val / maxVal) * 220);
      const r = document.createElementNS(SVG_NS, 'rect');
      r.setAttribute('x', idx * bw + gap / 2);
      r.setAttribute('y', 240 - normH);
      r.setAttribute('width', Math.max(1, bw - gap));
      r.setAttribute('height', normH);
      r.setAttribute('fill', getColor(states[idx], idx, n));
      r.setAttribute('rx', 1);
      svg.appendChild(r);
    });
  } else if (CHART_TYPE === 'scatter') {
    const slotW = 800 / n, r = Math.min(8, Math.max(2, slotW * 0.35));
    bars.forEach((val, idx) => {
      const c = document.createElementNS(SVG_NS, 'circle');
      c.setAttribute('cx', (idx + 0.5) * slotW);
      c.setAttribute('cy', 240 - (val / maxVal) * 220);
      c.setAttribute('r', r);
      c.setAttribute('fill', getColor(states[idx], idx, n));
      svg.appendChild(c);
    });
  } else if (CHART_TYPE === 'line') {
    const slotW = 800 / n, r = Math.min(5, Math.max(1.5, slotW * 0.25));
    const pts = bars.map((v, i) => \`\${(i + 0.5) * slotW},\${240 - (v / maxVal) * 220}\`).join(' ');
    const pl = document.createElementNS(SVG_NS, 'polyline');
    pl.setAttribute('points', pts);
    pl.setAttribute('fill', 'none');
    pl.setAttribute('stroke', 'hsl(240 5% 55%)');
    pl.setAttribute('stroke-width', 1.5);
    pl.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(pl);
    bars.forEach((val, idx) => {
      const c = document.createElementNS(SVG_NS, 'circle');
      c.setAttribute('cx', (idx + 0.5) * slotW);
      c.setAttribute('cy', 240 - (val / maxVal) * 220);
      c.setAttribute('r', r);
      c.setAttribute('fill', getColor(states[idx], idx, n));
      svg.appendChild(c);
    });
  } else if (CHART_TYPE === 'radial') {
    const cx = 400, cy = 210, rInner = 20, rOuter = 190;
    const rawSW = (2 * Math.PI * rOuter / n) * 0.7;
    const strokeW = Math.min(40, Math.max(1, rawSW));
    bars.forEach((val, idx) => {
      const theta = (idx / n) * 2 * Math.PI - Math.PI / 2;
      const len = rInner + (val / maxVal) * (rOuter - rInner);
      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', cx + rInner * Math.cos(theta));
      line.setAttribute('y1', cy + rInner * Math.sin(theta));
      line.setAttribute('x2', cx + len * Math.cos(theta));
      line.setAttribute('y2', cy + len * Math.sin(theta));
      line.setAttribute('stroke', getColor(states[idx], idx, n));
      line.setAttribute('stroke-width', strokeW);
      line.setAttribute('stroke-linecap', 'round');
      svg.appendChild(line);
    });
  }
}

// ── State Machine ─────────────────────────────────────────────────────────────
const ARRAY_SIZE = ${arraySize};
const INPUT_TYPE = '${inputType}';
let steps = [], currentStep = 0, isPlaying = false, intervalId = null;

const btnPlay = document.getElementById('btn-play');
const btnBack = document.getElementById('btn-back');
const btnFwd = document.getElementById('btn-forward');
const btnReset = document.getElementById('btn-reset');
const scrubber = document.getElementById('scrubber');
const speedSlider = document.getElementById('speed-slider');
const speedLabel = document.getElementById('speed-label');
const statusDesc = document.getElementById('status-desc');
const statusCounts = document.getElementById('status-counts');

function updateUI() {
  const step = steps[currentStep];
  if (!step) return;
  renderChart(step);
  statusDesc.textContent = step.description;
  statusCounts.textContent = 'Schritt ' + (currentStep + 1) + '/' + steps.length + ' · ' + step.comparisons + ' Vergleiche · ' + step.swaps + ' Tausche';
  scrubber.value = currentStep;
  btnBack.disabled = currentStep === 0;
  btnFwd.disabled = currentStep >= steps.length - 1;
  btnPlay.textContent = isPlaying ? '⏸ Pause' : '▶ Abspielen';
}

function stopPlayback() {
  if (intervalId) { clearInterval(intervalId); intervalId = null; }
  isPlaying = false;
}

function startPlayback() {
  isPlaying = true;
  const spd = parseInt(speedSlider.value, 10);
  intervalId = setInterval(() => {
    if (currentStep >= steps.length - 1) { stopPlayback(); updateUI(); return; }
    currentStep++;
    updateUI();
  }, spd);
}

function initialize() {
  stopPlayback();
  const input = generateInput(INPUT_TYPE, ARRAY_SIZE);
  steps = computeAllSteps(algorithmSteps, input);
  currentStep = 0;
  scrubber.max = steps.length - 1;
  updateUI();
}

btnPlay.addEventListener('click', () => {
  if (currentStep >= steps.length - 1) { currentStep = 0; startPlayback(); updateUI(); return; }
  if (isPlaying) { stopPlayback(); } else { startPlayback(); }
  updateUI();
});
btnBack.addEventListener('click', () => { stopPlayback(); currentStep = Math.max(0, currentStep - 1); updateUI(); });
btnFwd.addEventListener('click', () => { stopPlayback(); currentStep = Math.min(steps.length - 1, currentStep + 1); updateUI(); });
btnReset.addEventListener('click', () => initialize());
scrubber.addEventListener('input', () => { stopPlayback(); currentStep = parseInt(scrubber.value, 10); updateUI(); });
speedSlider.addEventListener('input', () => {
  speedLabel.textContent = speedSlider.value + 'ms';
  if (isPlaying) { stopPlayback(); startPlayback(); }
});

initialize();
</script>
</body>
</html>`
}

export function ExportButton(config: ExportConfig) {
  const handleExport = () => {
    const html = buildExportHTML(config)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${config.algorithmSlug}-${config.chartType}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button onClick={handleExport} size="sm" variant="outline" className="gap-1.5">
      <Download className="h-3.5 w-3.5" />
      Export HTML
    </Button>
  )
}
