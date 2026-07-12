'use client'

import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useInView } from './use-in-view'

type Topic = {
  id: string
  label: string
  category: string
  technicalActivity: number
  policyAttention: number
  frontierScore: number
  quadrant: string
  insight: string
  sourceIds: number[]
}

type Category = { id: string; label: string; series: number }

type GapData = {
  title: string
  description: string
  note: string
  axes: {
    x: { label: string; low: string; high: string }
    y: { label: string; low: string; high: string }
  }
  categories: Category[]
  topics: Topic[]
}

// map a 0..100 value to the plot's 0..100 x, and policy attention to inverted y
const sx = (v: number) => v
const sy = (v: number) => 100 - v
const rFor = (score: number) => 2.4 + (Math.sqrt(score) / 10) * 5.6

export function GapMapMatrix() {
  const { ref, inView } = useInView<HTMLElement>()
  const [data, setData] = useState<GapData | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [cat, setCat] = useState<string>('all')

  useEffect(() => {
    fetch('/data/gap-map.json')
      .then((r) => r.json())
      .then((d: GapData) => {
        setData(d)
        // default to the widest gap (most technical activity beyond attention)
        const widest = [...d.topics].sort(
          (a, b) =>
            b.technicalActivity - b.policyAttention - (a.technicalActivity - a.policyAttention),
        )[0]
        setSelectedId(widest?.id ?? d.topics[0]?.id ?? null)
      })
  }, [])

  const colorOf = useMemo(() => {
    const byCat = new Map((data?.categories ?? []).map((c) => [c.id, c.series]))
    return (t: Topic) => `var(--series-${byCat.get(t.category) ?? 1})`
  }, [data])

  const selected = useMemo(
    () => data?.topics.find((t) => t.id === selectedId),
    [data, selectedId],
  )

  if (!data || !selected) {
    return <div className="tool-loading" aria-live="polite" aria-busy="true" />
  }

  const inCat = (t: Topic) => cat === 'all' || t.category === cat
  const filters = [{ id: 'all', label: 'All' }, ...data.categories]

  // Draw the selected bubble last so its label and halo sit above the cluster.
  const orderedTopics = [...data.topics].sort(
    (a, b) => Number(a.id === selectedId) - Number(b.id === selectedId),
  )

  return (
    <section
      ref={ref}
      className={`tool gap reveal${inView ? ' is-in' : ''}`}
      aria-label={data.title}
    >
      <div className="tool-head">
        <div className="tool-heading">
          <h4 className="tool-title">{data.title}</h4>
          <details className="tool-about">
            <summary>About this tool</summary>
            <div className="tool-about-body">
              Each field is placed by technical activity against policy
              attention. The dashed diagonal is where the two are balanced;
              points below it draw more technical work than attention. Circle
              size is the frontier score. {data.note}
            </div>
          </details>
        </div>
      </div>
      <p className="tool-subtitle">{data.description}</p>

      <div className="gap-toolbar">
        <div className="chip-row" role="group" aria-label="Filter by category">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`chip${cat === f.id ? ' is-on' : ''}`}
              aria-pressed={cat === f.id}
              onClick={() => setCat(f.id)}
            >
              {'series' in f ? (
                <span
                  className="chip-swatch"
                  style={{ background: `var(--series-${(f as Category).series})` }}
                />
              ) : null}
              {f.label}
            </button>
          ))}
        </div>
        <span className="gap-legend-note">
          <span className="bubbles">
            <i style={{ width: '6px', height: '6px' }} />
            <i style={{ width: '10px', height: '10px' }} />
          </span>
          Circle size = frontier score
        </span>
      </div>

      <div className="gap-layout">
        <div className="gap-plot">
          <svg viewBox="-15 -8 123 122" role="img" aria-label={data.title}>
            {/* quadrant fills + guides */}
            <line className="quadrant-line" x1={50} y1={0} x2={50} y2={100} />
            <line className="quadrant-line" x1={0} y1={50} x2={100} y2={50} />
            {/* alignment diagonal */}
            <line
              x1={0}
              y1={100}
              x2={100}
              y2={0}
              stroke="var(--olive)"
              strokeWidth={0.4}
              strokeDasharray="2 2"
              opacity={0.4}
            />
            {/* axes */}
            <line className="chart-axis" x1={0} y1={0} x2={0} y2={100} />
            <line className="chart-axis" x1={0} y1={100} x2={100} y2={100} />

            {/* quadrant corner labels */}
            <text className="quadrant-label" x={3} y={5}>
              High attention
            </text>
            <text className="quadrant-label" x={3} y={8.6}>
              Low activity
            </text>
            <text className="quadrant-label" x={97} y={5} textAnchor="end">
              High attention
            </text>
            <text className="quadrant-label" x={97} y={8.6} textAnchor="end">
              High activity
            </text>
            <text className="quadrant-label" x={3} y={92.4}>
              Low attention
            </text>
            <text className="quadrant-label" x={3} y={96} >
              Low activity
            </text>
            <text className="quadrant-label" x={97} y={92.4} textAnchor="end">
              Low attention
            </text>
            <text className="quadrant-label" x={97} y={96} textAnchor="end">
              High activity
            </text>

            {/* axis titles + ends */}
            <text className="gap-axis-title" x={50} y={112} textAnchor="middle">
              {data.axes.x.label}
            </text>
            <text className="gap-axis-end" x={0} y={108} textAnchor="middle">
              {data.axes.x.low}
            </text>
            <text className="gap-axis-end" x={100} y={108} textAnchor="middle">
              {data.axes.x.high}
            </text>
            <text
              className="gap-axis-title"
              x={-11}
              y={50}
              textAnchor="middle"
              transform="rotate(-90 -11 50)"
            >
              {data.axes.y.label}
            </text>

            {/* bubbles */}
            {orderedTopics.map((t, i) => {
              const on = inCat(t)
              const isSel = selectedId === t.id
              const r = rFor(t.frontierScore)
              const cx = sx(t.technicalActivity)
              const cy = sy(t.policyAttention)
              return (
                <g
                  key={t.id}
                  className={`bubble pop${isSel ? ' is-selected is-labeled' : ''}${on ? '' : ' is-dim'}`}
                  style={{ '--sc': colorOf(t), animationDelay: `${i * 40}ms` } as CSSProperties}
                  role="button"
                  tabIndex={on ? 0 : -1}
                  aria-pressed={isSel}
                  aria-label={`${t.label}: technical activity ${t.technicalActivity}, policy attention ${t.policyAttention}`}
                  onClick={() => on && setSelectedId(t.id)}
                  onKeyDown={(ev) => {
                    if (on && (ev.key === 'Enter' || ev.key === ' ')) {
                      ev.preventDefault()
                      setSelectedId(t.id)
                    }
                  }}
                >
                  {isSel && <circle className="bubble-halo" cx={cx} cy={cy} r={r + 2.6} />}
                  <circle cx={cx} cy={cy} r={r} />
                  <text x={cx} y={cy - r - 1.4}>
                    {t.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <aside
          className="gap-panel"
          style={{ '--sc': colorOf(selected) } as CSSProperties}
          aria-live="polite"
        >
          <span className="gap-panel-kind">
            <span className="dot" />
            {data.categories.find((c) => c.id === selected.category)?.label ?? 'Field'}
          </span>
          <h5>{selected.label}</h5>
          <p className="gap-panel-quadrant">{selected.quadrant}</p>

          <div className="gap-meters">
            {[
              { label: 'Technical activity', value: selected.technicalActivity },
              { label: 'Policy attention', value: selected.policyAttention },
              { label: 'Frontier score', value: selected.frontierScore },
            ].map((m) => (
              <div className="gap-meter-row" key={m.label}>
                <div className="gap-meter-head">
                  <span>{m.label}</span>
                  <span className="val">{Math.round(m.value)} / 100</span>
                </div>
                <div className="meter">
                  <span style={{ width: `${m.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <p className="gap-insight">{selected.insight}</p>

          <div className="visual-sources">
            <span className="visual-sources-label">Sources</span>
            {selected.sourceIds.map((id) => (
              <a href={`#ref-${id}`} key={id}>
                {id}
              </a>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
