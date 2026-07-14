'use client'

import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useInView } from './use-in-view'
import { WatercolorNode, WatercolorNodeDefs } from './watercolor-node'

type Topic = {
  id: string
  label: string
  series: number
  importance: number
  gapType: string
  gap: string
  knowledge: number
  authority: number
  dependency: number
  oversight: number
}

type Axis = { key: keyof Topic; label: string; low: string; high: string }
type Preset = { id: string; label: string; x: Axis; y: Axis }

type GapData = {
  title: string
  description: string
  note: string
  presets: Preset[]
  topics: Topic[]
}

const sx = (v: number) => v
const sy = (v: number) => 100 - v
const rFor = (v: number) => (2 + (Math.sqrt(v) / 10) * 3.6) * 1.16

const colorFor = (t: Topic) => `var(--series-${t.series})`

export function GapMapMatrix() {
  const { ref, inView } = useInView<HTMLElement>()
  const [data, setData] = useState<GapData | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [presetId, setPresetId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data/gap-data.json')
      .then((r) => r.json())
      .then((d: GapData) => {
        setData(d)
        setPresetId(d.presets[0]?.id ?? null)
        setSelectedId(d.topics[0]?.id ?? null)
      })
  }, [])

  const preset = useMemo(
    () => data?.presets.find((p) => p.id === presetId) ?? data?.presets[0],
    [data, presetId],
  )
  const selected = useMemo(
    () => data?.topics.find((t) => t.id === selectedId),
    [data, selectedId],
  )

  if (!data || !selected || !preset) {
    return <div className="tool-loading" aria-live="polite" aria-busy="true" />
  }

  const xv = (t: Topic) => t[preset.x.key] as number
  const yv = (t: Topic) => t[preset.y.key] as number

  // draw the selected bubble last so its label and halo sit above the cluster
  const orderedTopics = [...data.topics].sort(
    (a, b) => Number(a.id === selectedId) - Number(b.id === selectedId),
  )

  const meters = [
    { label: preset.x.label, value: xv(selected) },
    { label: preset.y.label, value: yv(selected) },
    { label: 'Importance', value: selected.importance },
  ]

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
              Each field is placed by two institutional measures. The dashed
              diagonal is where the two are balanced; points below it are where
              the gap opens. Circle size is institutional importance. {data.note}
            </div>
          </details>
        </div>
      </div>
      <p className="tool-subtitle">{data.description}</p>

      <div className="gap-toolbar">
        <div className="chip-row" role="group" aria-label="Choose axes">
          {data.presets.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`chip${presetId === p.id ? ' is-on' : ''}`}
              aria-pressed={presetId === p.id}
              onClick={() => setPresetId(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <span className="gap-legend-note">
          <svg className="gap-size-key" viewBox="0 0 28 14" aria-hidden="true">
            <defs>
              <WatercolorNodeDefs id="gap-legend-watercolor" />
            </defs>
            <g style={{ '--sc': 'var(--olive)' } as CSSProperties}>
              <WatercolorNode
                cx={7}
                cy={7}
                radius={2.3}
                filterId="gap-legend-watercolor"
              />
              <WatercolorNode
                cx={20}
                cy={7}
                radius={4.9}
                filterId="gap-legend-watercolor"
              />
            </g>
          </svg>
          Circle size = importance
        </span>
      </div>

      <div className="gap-layout">
        <div className="gap-plot">
          <svg viewBox="-12 -5 116 117" role="img" aria-label={`${data.title}: ${preset.label}`}>
            <defs>
              <WatercolorNodeDefs id="gap-node-watercolor" />
            </defs>
            <line className="quadrant-line" x1={50} y1={0} x2={50} y2={100} />
            <line className="quadrant-line" x1={0} y1={50} x2={100} y2={50} />
            <line
              className="gap-balance-line"
              x1={0}
              y1={100}
              x2={100}
              y2={0}
            />
            <line className="chart-axis" x1={0} y1={0} x2={0} y2={100} />
            <line className="chart-axis" x1={0} y1={100} x2={100} y2={100} />

            <text className="diagonal-label" x={72} y={26} transform="rotate(-45 72 26)">
              in balance
            </text>

            <text className="gap-axis-title" x={50} y={112} textAnchor="middle">
              {preset.x.label}
            </text>
            <text className="gap-axis-end" x={0} y={108} textAnchor="middle">
              {preset.x.low}
            </text>
            <text className="gap-axis-end" x={100} y={108} textAnchor="middle">
              {preset.x.high}
            </text>
            <text
              className="gap-axis-title"
              x={-8}
              y={50}
              textAnchor="middle"
              transform="rotate(-90 -8 50)"
            >
              {preset.y.label}
            </text>

            {orderedTopics.map((t) => {
              const isSel = selectedId === t.id
              const r = rFor(t.importance)
              const cx = sx(xv(t))
              const cy = sy(yv(t))
              return (
                <g
                  key={t.id}
                  className={`bubble${isSel ? ' is-selected is-labeled' : ''}`}
                  style={
                    {
                      '--sc': colorFor(t),
                      transform: `translate(${cx}px, ${cy}px)`,
                    } as CSSProperties
                  }
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSel}
                  aria-label={`${t.label}: ${preset.x.label} ${xv(t)}, ${preset.y.label} ${yv(t)}`}
                  onClick={() => setSelectedId(t.id)}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault()
                      setSelectedId(t.id)
                    }
                  }}
                >
                  <WatercolorNode
                    cx={0}
                    cy={0}
                    radius={r}
                    filterId="gap-node-watercolor"
                    selected={isSel}
                    hitRadius={r + 2.7}
                  />
                  <text x={0} y={-r - 1.4}>
                    {t.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <aside
          className="gap-panel"
          style={{ '--sc': colorFor(selected) } as CSSProperties}
          aria-live="polite"
        >
          <span className="gap-panel-kind">
            <span className="dot" />
            {selected.gapType}
          </span>
          <h5>{selected.label}</h5>
          <p className="gap-panel-quadrant">{preset.label}</p>

          <div className="gap-meters">
            {meters.map((m) => (
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

          <p className="gap-insight">{selected.gap}</p>
        </aside>
      </div>
    </section>
  )
}
