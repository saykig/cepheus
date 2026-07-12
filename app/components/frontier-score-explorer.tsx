'use client'

import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useInView } from './use-in-view'

type WeightKey = 'momentum' | 'novelty' | 'policySalience' | 'bridgeImportance'
type Subscores = Record<WeightKey, number>

type Topic = {
  id: string
  label: string
  category: string
  subscores: Subscores
  score: number
  sourceIds: number[]
  series: number[]
}

type Category = { id: string; label: string; series: number }

type FrontierData = {
  title: string
  description: string
  scoreLabel: string
  note: string
  periods: string[]
  weightLabels: { key: WeightKey; label: string }[]
  defaultWeights: Subscores
  categories: Category[]
  topics: Topic[]
}

const RANGES = [
  { id: '1Y', quarters: 4 },
  { id: '2Y', quarters: 8 },
  { id: '3Y', quarters: 12 },
  { id: 'All', quarters: 99 },
]

// chart plot geometry (viewBox units)
const VB_W = 300
const VB_H = 172
const PL = 30
const PR = 294
const PT = 12
const PB = 146
const GRID = [0, 25, 50, 75, 100]

const xFor = (i: number, n: number) =>
  n > 1 ? PL + ((PR - PL) * i) / (n - 1) : (PL + PR) / 2
const yFor = (v: number) => PB - (v / 100) * (PB - PT)
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

export function FrontierScoreExplorer() {
  const { ref, inView } = useInView<HTMLElement>()
  const [data, setData] = useState<FrontierData | null>(null)
  const [weights, setWeights] = useState<Subscores | null>(null)
  const [range, setRange] = useState('3Y')
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [showAll, setShowAll] = useState(false)
  const [hover, setHover] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    fetch('/data/frontier-topics.json')
      .then((r) => r.json())
      .then((d: FrontierData) => {
        setData(d)
        setWeights({ ...d.defaultWeights })
      })
  }, [])

  const colorOf = useMemo(() => {
    const byCat = new Map((data?.categories ?? []).map((c) => [c.id, c.series]))
    return (topic: Topic) => `var(--series-${byCat.get(topic.category) ?? 1})`
  }, [data])

  const totalWeight = weights
    ? weights.momentum + weights.novelty + weights.policySalience + weights.bridgeImportance
    : 0

  const scored = useMemo(() => {
    if (!data || !weights) return []
    const denom = totalWeight || 1
    return data.topics.map((t) => {
      const raw =
        t.subscores.momentum * weights.momentum +
        t.subscores.novelty * weights.novelty +
        t.subscores.policySalience * weights.policySalience +
        t.subscores.bridgeImportance * weights.bridgeImportance
      return { ...t, live: Math.round((raw / denom) * 10) / 10 }
    })
  }, [data, weights, totalWeight])

  const ranked = useMemo(
    () => [...scored].sort((a, b) => b.live - a.live),
    [scored],
  )
  const visibleRanked = showAll ? ranked : ranked.slice(0, 8)

  // the charted set: the six leading fields under the default weighting (stable)
  const chartTopics = useMemo(() => {
    if (!data) return []
    return [...data.topics].sort((a, b) => b.score - a.score).slice(0, 6)
  }, [data])

  // ---- FLIP reorder animation for the ranking ----
  const rowRefs = useRef(new Map<string, HTMLDivElement>())
  const prevTops = useRef(new Map<string, number>())
  useLayoutEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const rows = rowRefs.current
    // Always measure natural positions: clear any in-flight transform first so
    // rapid slider drags can never compound transforms and fling a row away.
    rows.forEach((el) => {
      el.style.transition = 'none'
      el.style.transform = ''
    })
    const next = new Map<string, number>()
    rows.forEach((el, id) => next.set(id, el.getBoundingClientRect().top))
    if (!reduce) {
      let animated = false
      next.forEach((top, id) => {
        const prev = prevTops.current.get(id)
        const el = rows.get(id)
        if (prev != null && el && Math.abs(prev - top) > 0.5) {
          el.style.transform = `translateY(${prev - top}px)`
          animated = true
        }
      })
      if (animated) {
        void document.documentElement.offsetHeight // force reflow, then release
        requestAnimationFrame(() => {
          rows.forEach((el) => {
            el.style.transition = 'transform 460ms cubic-bezier(0.16,1,0.3,1)'
            el.style.transform = ''
          })
        })
      }
    }
    prevTops.current = next
  }, [visibleRanked])

  const reset = useCallback(() => {
    if (data) setWeights({ ...data.defaultWeights })
  }, [data])

  const onMove = useCallback(
    (e: ReactPointerEvent<SVGRectElement>) => {
      const svg = svgRef.current
      if (!svg || !data) return
      const rect = svg.getBoundingClientRect()
      const vx = ((e.clientX - rect.left) / rect.width) * VB_W
      const n = Math.min(
        data.periods.length,
        RANGES.find((r) => r.id === range)?.quarters ?? data.periods.length,
      )
      const t = (vx - PL) / (PR - PL)
      setHover(clamp(Math.round(t * (n - 1)), 0, n - 1))
    },
    [data, range],
  )

  if (!data || !weights) {
    return <div className="tool-loading" aria-live="polite" aria-busy="true" />
  }

  const isDefault = (['momentum', 'novelty', 'policySalience', 'bridgeImportance'] as WeightKey[]).every(
    (k) => weights[k] === data.defaultWeights[k],
  )

  const nQuarters = Math.min(
    data.periods.length,
    RANGES.find((r) => r.id === range)?.quarters ?? data.periods.length,
  )
  const start = data.periods.length - nQuarters
  const periodsSlice = data.periods.slice(start)
  const activeIdx = hover ?? nQuarters - 1

  const xTicks = Array.from(
    new Set([0, Math.round((nQuarters - 1) / 3), Math.round((2 * (nQuarters - 1)) / 3), nQuarters - 1]),
  )

  return (
    <section
      ref={ref}
      className={`tool frontier reveal${inView ? ' is-in' : ''}`}
      aria-label={data.title}
    >
      <div className="tool-head">
        <div className="tool-heading">
          <h4 className="tool-title">{data.title}</h4>
          <details className="tool-about">
            <summary>About this tool</summary>
            <div className="tool-about-body">
              A frontier score is a weighted average of four signals. Move the
              sliders to re-weight them; scores normalize to the slider total, so
              the ranking always reads from 0 to 100. {data.note}
            </div>
          </details>
        </div>
      </div>
      <p className="tool-subtitle">{data.description}</p>

      <div className="frontier-grid">
        {/* ---- momentum chart ---- */}
        <div className="frontier-panel">
          <div className="frontier-panel-head">
            <span className="tool-label">Topic momentum</span>
            <div className="chip-row" role="group" aria-label="Time range">
              {RANGES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`chip${range === r.id ? ' is-on' : ''}`}
                  aria-pressed={range === r.id}
                  onClick={() => {
                    setRange(r.id)
                    setHover(null)
                  }}
                >
                  {r.id}
                </button>
              ))}
            </div>
          </div>

          <svg
            ref={svgRef}
            className="chart-svg"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            role="img"
            aria-label={`Momentum over time for ${chartTopics.map((t) => t.label).join(', ')}`}
          >
            <g className="chart-grid">
              {GRID.map((g) => (
                <line key={g} x1={PL} x2={PR} y1={yFor(g)} y2={yFor(g)} />
              ))}
            </g>
            {[0, 50, 100].map((g) => (
              <text
                key={g}
                className="chart-tick"
                x={PL - 5}
                y={yFor(g) + 2.6}
                textAnchor="end"
              >
                {g}
              </text>
            ))}
            {xTicks.map((i) => (
              <text
                key={i}
                className="chart-tick"
                x={xFor(i, nQuarters)}
                y={PB + 12}
                textAnchor="middle"
              >
                {periodsSlice[i]}
              </text>
            ))}

            {chartTopics.map((t) => {
              const pts = t.series.slice(start).map((v, i) => [xFor(i, nQuarters), yFor(v)])
              const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
              let len = 0
              for (let i = 1; i < pts.length; i++) {
                len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
              }
              const off = hidden.has(t.id)
              return (
                <path
                  key={t.id}
                  className={`chart-line draw${off ? ' is-off' : ''}`}
                  d={d}
                  stroke={colorOf(t)}
                  style={{ '--len': len, opacity: off ? 0.12 : 1 } as CSSProperties}
                />
              )
            })}

            {chartTopics
              .filter((t) => !hidden.has(t.id))
              .map((t) => (
                <circle
                  key={`end-${t.id}`}
                  className="chart-end-dot"
                  cx={xFor(nQuarters - 1, nQuarters)}
                  cy={yFor(t.series[start + nQuarters - 1])}
                  r={1.7}
                  fill={colorOf(t)}
                />
              ))}

            {hover != null && (
              <line
                className="chart-crosshair"
                x1={xFor(hover, nQuarters)}
                x2={xFor(hover, nQuarters)}
                y1={PT}
                y2={PB}
              />
            )}
            {hover != null &&
              chartTopics
                .filter((t) => !hidden.has(t.id))
                .map((t) => (
                  <circle
                    key={t.id}
                    className="chart-dot"
                    cx={xFor(hover, nQuarters)}
                    cy={yFor(t.series[start + hover])}
                    r={1.9}
                    fill={colorOf(t)}
                  />
                ))}

            <rect
              x={PL}
              y={PT}
              width={PR - PL}
              height={PB - PT}
              fill="transparent"
              style={{ cursor: 'crosshair' }}
              onPointerMove={onMove}
              onPointerLeave={() => setHover(null)}
            />
          </svg>

          <div className="frontier-readout" aria-hidden="true">
            {chartTopics.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`frontier-legend-row${hidden.has(t.id) ? ' is-off' : ''}`}
                onClick={() =>
                  setHidden((prev) => {
                    const next = new Set(prev)
                    next.has(t.id) ? next.delete(t.id) : next.add(t.id)
                    return next
                  })
                }
              >
                <span
                  className="frontier-legend-swatch"
                  style={{ background: colorOf(t) }}
                />
                <span>{t.label}</span>
                <span className="frontier-legend-value">
                  {Math.round(t.series[start + activeIdx])}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ---- weighted ranking ---- */}
        <div className="frontier-panel">
          <div className="frontier-panel-head">
            <span className="tool-label">Frontier ranking</span>
            <span className="tool-label">{periodsSlice[activeIdx]}</span>
          </div>
          <div className="rank-list">
            {visibleRanked.map((t, i) => (
              <div
                className="rank-row"
                key={t.id}
                ref={(el) => {
                  if (el) rowRefs.current.set(t.id, el)
                  else rowRefs.current.delete(t.id)
                }}
              >
                <span className="rank-num">{i + 1}</span>
                <span className="rank-label">{t.label}</span>
                <span className="rank-score">{t.live.toFixed(1)}</span>
                <div className="rank-track">
                  <span style={{ width: `${t.live}%`, background: colorOf(t) }} />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="rank-more"
            onClick={() => setShowAll((s) => !s)}
          >
            {showAll
              ? 'Show top 8'
              : `View full ranking (${data.topics.length} topics) →`}
          </button>
        </div>

        {/* ---- weight controls ---- */}
        <div className="frontier-panel">
          <div className="frontier-panel-head">
            <span className="tool-label">Weight controls</span>
          </div>
          <div className="weight-list">
            {data.weightLabels.map((w) => (
              <div className="weight-row" key={w.key}>
                <div className="weight-head">
                  <label htmlFor={`w-${w.key}`}>{w.label}</label>
                  <span className="weight-value">{weights[w.key].toFixed(2)}</span>
                </div>
                <input
                  id={`w-${w.key}`}
                  className="slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={weights[w.key]}
                  style={{ '--fill': weights[w.key] * 100 } as CSSProperties}
                  onChange={(e) =>
                    setWeights((prev) => ({ ...prev!, [w.key]: Number(e.target.value) }))
                  }
                  aria-valuetext={`${w.label} weight ${weights[w.key].toFixed(2)}`}
                />
              </div>
            ))}
          </div>
          <div className="weight-total">
            <span>Total weight</span>
            <strong>{totalWeight.toFixed(2)}</strong>
          </div>
          <button
            type="button"
            className="weight-reset"
            onClick={reset}
            disabled={isDefault}
          >
            Reset to default
          </button>
        </div>
      </div>
    </section>
  )
}
