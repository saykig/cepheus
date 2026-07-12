'use client'

import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useInView } from './use-in-view'

type Node = {
  id: string
  label: string
  kind: 'topic' | 'institution'
  category: string
  x: number
  y: number
  size: number
  connections: number
  reach: number
  avgStrength: number
  description: string
  sourceIds: number[]
}

type Edge = {
  source: string
  target: string
  kind: 'bilateral' | 'funding'
  strength: number
  explanation: string
  sourceIds: number[]
}

type Category = { id: string; label: string; series: number }

type NetworkData = {
  title: string
  description: string
  selectionLabel: string
  note: string
  categories: Category[]
  nodes: Node[]
  edges: Edge[]
}

type Filter = 'all' | 'topics' | 'institutions' | 'bilateral' | 'funding'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'topics', label: 'Topics' },
  { id: 'institutions', label: 'Institutions' },
  { id: 'bilateral', label: 'Bilateral' },
  { id: 'funding', label: 'Funding' },
]

export function PolicyConstellationMap() {
  const { ref, inView } = useInView<HTMLElement>()
  const [data, setData] = useState<NetworkData | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [strength, setStrength] = useState(true)

  useEffect(() => {
    fetch('/data/policy-network.json')
      .then((r) => r.json())
      .then((d: NetworkData) => {
        setData(d)
        setSelectedId(d.nodes[0]?.id ?? null)
      })
  }, [])

  const colorOf = useMemo(() => {
    const byCat = new Map((data?.categories ?? []).map((c) => [c.id, c.series]))
    return (n: Node) => `var(--series-${byCat.get(n.category) ?? 1})`
  }, [data])

  const nodeVisible = useMemo(
    () => (n: Node) => {
      if (filter === 'topics') return n.kind === 'topic'
      if (filter === 'institutions') return n.kind === 'institution'
      return true
    },
    [filter],
  )

  const edgeVisible = useMemo(
    () => (e: Edge) => {
      if (filter === 'bilateral') return e.kind === 'bilateral'
      if (filter === 'funding') return e.kind === 'funding'
      return true
    },
    [filter],
  )

  const nodesById = useMemo(
    () => new Map((data?.nodes ?? []).map((n) => [n.id, n])),
    [data],
  )

  // keep selection valid under the active filter
  useEffect(() => {
    if (!data) return
    const sel = data.nodes.find((n) => n.id === selectedId)
    if (!sel || !nodeVisible(sel)) {
      const first = data.nodes.find(nodeVisible)
      setSelectedId(first?.id ?? null)
    }
  }, [data, filter, selectedId, nodeVisible])

  const q = query.trim().toLowerCase()
  const matches = (n: Node) => !q || n.label.toLowerCase().includes(q)

  const selected = selectedId ? nodesById.get(selectedId) : undefined

  const topConnections = useMemo(() => {
    if (!data || !selected) return []
    return data.edges
      .filter(
        (e) =>
          edgeVisible(e) &&
          (e.source === selected.id || e.target === selected.id) &&
          nodeVisible(nodesById.get(e.source === selected.id ? e.target : e.source)!),
      )
      .map((e) => {
        const otherId = e.source === selected.id ? e.target : e.source
        return { node: nodesById.get(otherId)!, strength: e.strength, kind: e.kind }
      })
      .sort((a, b) => b.strength - a.strength)
  }, [data, selected, edgeVisible, nodeVisible, nodesById])

  if (!data || !selected) {
    return <div className="tool-loading" aria-live="polite" aria-busy="true" />
  }

  const visibleNodes = data.nodes.filter(nodeVisible)

  // Build renderable edges as gentle arcs; draw highlighted ones last (on top).
  const edgeEls = data.edges
    .map((e, i) => ({ e, i, s: nodesById.get(e.source), t: nodesById.get(e.target) }))
    .filter((x) => x.s && x.t && edgeVisible(x.e) && nodeVisible(x.s!) && nodeVisible(x.t!))
    .map((x) => ({
      ...x,
      incident: x.e.source === selected.id || x.e.target === selected.id,
    }))
    .sort((a, b) => Number(a.incident) - Number(b.incident))

  // Selected node renders last so its halo and label sit above the others.
  const orderedNodes = [...visibleNodes].sort(
    (a, b) => Number(a.id === selectedId) - Number(b.id === selectedId),
  )

  return (
    <section
      ref={ref}
      className={`tool constellation reveal${inView ? ' is-in' : ''}`}
      aria-label={data.title}
    >
      <div className="tool-head">
        <div className="tool-heading">
          <h4 className="tool-title">{data.title}</h4>
          <details className="tool-about">
            <summary>About this tool</summary>
            <div className="tool-about-body">
              Circle size reflects how connected a point is. Solid circles are
              fields; dashed circles are institutions. Line weight shows link
              strength. {data.note}
            </div>
          </details>
        </div>
      </div>
      <p className="tool-subtitle">{data.description}</p>

      <div className="constellation-toolbar">
        <div className="chip-row" role="group" aria-label="Filter the constellation">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`chip${filter === f.id ? ' is-on' : ''}`}
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="constellation-controls">
          <label className="toggle">
            <input
              type="checkbox"
              checked={strength}
              onChange={(e) => setStrength(e.target.checked)}
            />
            <span className="toggle-track" />
            Link strength
          </label>
          <div className="search-box">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="5" cy="5" r="3.4" stroke="currentColor" strokeWidth="1.1" />
              <path d="M7.6 7.6 10.5 10.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Search points"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search points"
            />
          </div>
        </div>
      </div>

      <div className="constellation-layout">
        <div className="constellation-canvas">
          <svg viewBox="-8 -8 116 122" role="img" aria-label={`${data.title}: ${visibleNodes.length} points`}>
            {edgeEls.map(({ e, i, s, t, incident }) => {
              const dim = !!q && !(matches(s!) && matches(t!))
              const dx = t!.x - s!.x
              const dy = t!.y - s!.y
              const len = Math.hypot(dx, dy) || 1
              const cx = (s!.x + t!.x) / 2 + (-dy / len) * len * 0.08
              const cy = (s!.y + t!.y) / 2 + (dx / len) * len * 0.08
              return (
                <path
                  key={`${e.source}-${e.target}-${i}`}
                  className={`constellation-edge draw${incident ? ' is-highlighted' : ''}${dim ? ' is-dim' : ''}`}
                  d={`M ${s!.x} ${s!.y} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${t!.x} ${t!.y}`}
                  strokeWidth={strength ? 0.35 + e.strength * 1.15 : 0.55}
                  style={
                    {
                      '--len': len * 1.2,
                      '--sc': incident ? colorOf(selected) : undefined,
                    } as CSSProperties
                  }
                >
                  <title>{e.explanation}</title>
                </path>
              )
            })}

            {orderedNodes.map((n, i) => {
              const r = n.size * 0.78
              const dim = q ? !matches(n) : false
              const isSel = selectedId === n.id
              return (
                <g
                  key={n.id}
                  className={`constellation-node pop is-${n.kind}${isSel ? ' is-selected' : ''}${dim ? ' is-dim' : ''}`}
                  style={{ '--sc': colorOf(n), animationDelay: `${i * 45}ms` } as CSSProperties}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSel}
                  aria-label={`${n.label}, ${n.kind}`}
                  onClick={() => setSelectedId(n.id)}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault()
                      setSelectedId(n.id)
                    }
                  }}
                >
                  {isSel && <circle className="node-halo" cx={n.x} cy={n.y} r={r + 3.4} />}
                  <circle cx={n.x} cy={n.y} r={r} />
                  <text x={n.x} y={n.y + r + 3.6}>
                    {n.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <aside
          className="node-profile"
          style={{ '--sc': colorOf(selected) } as CSSProperties}
          aria-live="polite"
        >
          <span className="node-profile-kind">
            <span className="dot" />
            {selected.kind === 'institution' ? 'Institution' : 'Field'}
          </span>
          <h5>{selected.label}</h5>
          <p className="node-profile-desc">{selected.description}</p>

          <dl className="node-stats">
            <div className="node-stat">
              <dt>Connections</dt>
              <dd>{selected.connections}</dd>
            </div>
            <div className="node-stat">
              <dt>Reach · 2 hops</dt>
              <dd>{selected.reach}</dd>
            </div>
            <div className="node-stat">
              <dt>Avg strength</dt>
              <dd>{selected.avgStrength.toFixed(2)}</dd>
            </div>
            <div className="node-stat">
              <dt>Sources</dt>
              <dd>{selected.sourceIds.length}</dd>
            </div>
          </dl>

          {topConnections.length > 0 && (
            <div className="node-connections">
              <span className="tool-label">Top connections</span>
              {topConnections.slice(0, 5).map((c) => (
                <button
                  key={c.node.id}
                  type="button"
                  className="node-connection"
                  onClick={() => setSelectedId(c.node.id)}
                >
                  <span>{c.node.label}</span>
                  <span className="val">{c.strength.toFixed(2)}</span>
                </button>
              ))}
            </div>
          )}

          <div className="visual-sources" style={{ marginTop: '0.95rem' }}>
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
