'use client'

import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useInView } from './use-in-view'

type Node = {
  id: string
  label: string
  kind: 'topic' | 'institution'
  type: string
  series: number
  x: number
  y: number
  size: number
  description: string
  gap: string
}

type EdgeKind = 'knowledge' | 'authority' | 'dependency' | 'interface'
type Edge = {
  source: string
  target: string
  kind: EdgeKind
  strength: number
  description: string
  directed: boolean
  interfaceType: string | null
}

type NetworkData = {
  title: string
  description: string
  selectionLabel: string
  note: string
  filters: { id: string; label: string }[]
  nodes: Node[]
  edges: Edge[]
}

const colorFor = (n: Node) => `var(--series-${n.series})`

function edgeStyle(kind: EdgeKind, strength: number, on: boolean) {
  if (kind === 'authority') return { width: on ? 0.7 + strength * 0.9 : 1.1, dash: undefined, arrow: false }
  if (kind === 'interface') return { width: on ? 0.3 + strength * 0.45 : 0.4, dash: '1.8 1.6', arrow: false }
  if (kind === 'dependency') return { width: on ? 0.3 + strength * 0.55 : 0.45, dash: undefined, arrow: true }
  return { width: on ? 0.3 + strength * 0.55 : 0.45, dash: undefined, arrow: false } // knowledge
}

// The function name is kept so the essay page import stays valid; the tool is
// the Institutional Relationship Map.
export function PolicyConstellationMap() {
  const { ref, inView } = useInView<HTMLElement>()
  const [data, setData] = useState<NetworkData | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [strength, setStrength] = useState(true)

  useEffect(() => {
    fetch('/data/relationships.json')
      .then((r) => r.json())
      .then((d: NetworkData) => {
        setData(d)
        setSelectedId(d.nodes[0]?.id ?? null)
      })
  }, [])

  const nodesById = useMemo(
    () => new Map((data?.nodes ?? []).map((n) => [n.id, n])),
    [data],
  )

  const edgeVisible = (e: Edge) => filter === 'all' || e.kind === filter

  const q = query.trim().toLowerCase()
  const matches = (n: Node) => !q || n.label.toLowerCase().includes(q)

  const selected = selectedId ? nodesById.get(selectedId) : undefined

  // grouped connections for the selected node
  const panel = useMemo(() => {
    if (!data || !selected) return null
    const inc = data.edges.filter((e) => e.source === selected.id || e.target === selected.id)
    const other = (e: Edge) => nodesById.get(e.source === selected.id ? e.target : e.source)!
    const uniq = (arr: Node[]) => Array.from(new Map(arr.map((n) => [n.id, n])).values())
    const byKind = (k: EdgeKind) => uniq(inc.filter((e) => e.kind === k).map(other))
    const dependsOn = uniq(inc.filter((e) => e.kind === 'dependency' && e.source === selected.id).map(other))
    const reliedOnBy = uniq(inc.filter((e) => e.kind === 'dependency' && e.target === selected.id).map(other))
    const interfaces = inc
      .filter((e) => e.kind === 'interface')
      .map((e) => ({ node: other(e), type: e.interfaceType }))
    const connected = uniq(inc.map(other))
    return {
      knowledge: byKind('knowledge'),
      authority: byKind('authority'),
      dependsOn,
      reliedOnBy,
      interfaces,
      connected,
    }
  }, [data, selected, nodesById])

  if (!data || !selected || !panel) {
    return <div className="tool-loading" aria-live="polite" aria-busy="true" />
  }

  const edgeEls = data.edges
    .map((e, i) => ({ e, i, s: nodesById.get(e.source), t: nodesById.get(e.target) }))
    .filter((x) => x.s && x.t && edgeVisible(x.e))
    .map((x) => ({ ...x, incident: x.e.source === selected.id || x.e.target === selected.id }))
    .sort((a, b) => Number(a.incident) - Number(b.incident))

  const orderedNodes = [...data.nodes].sort(
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
              Solid lines are knowledge, thick lines are authority, arrows are
              dependency, and dashed lines are interface mechanisms. Solid circles
              are fields; dashed circles are institutions. {data.note}
            </div>
          </details>
        </div>
      </div>
      <p className="tool-subtitle">{data.description}</p>

      <div className="constellation-toolbar">
        <div className="chip-row" role="group" aria-label="Filter relationships">
          {data.filters.map((f) => (
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
            Line strength
          </label>
          <div className="search-box">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="5" cy="5" r="3.4" stroke="currentColor" strokeWidth="1.1" />
              <path d="M7.6 7.6 10.5 10.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Search nodes"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search nodes"
            />
          </div>
        </div>
      </div>

      <div className="constellation-layout">
        <div className="constellation-canvas">
          <svg viewBox="-10 10 122 96" role="img" aria-label={`${data.title}: ${data.nodes.length} nodes`}>
            <defs>
              <marker
                id="rel-arrow"
                viewBox="0 0 10 10"
                refX="8.5"
                refY="5"
                markerWidth="3.6"
                markerHeight="3.6"
                orient="auto-start-reverse"
              >
                <path d="M0 0 L10 5 L0 10 z" fill="context-stroke" />
              </marker>
            </defs>

            {edgeEls.map(({ e, i, s, t, incident }) => {
              const dim = !!q && !(matches(s!) && matches(t!))
              const style = edgeStyle(e.kind, e.strength, strength)
              const dx = t!.x - s!.x
              const dy = t!.y - s!.y
              const len = Math.hypot(dx, dy) || 1
              const ux = dx / len
              const uy = dy / len
              const back = style.arrow ? t!.size * 0.74 + 1.0 : 0
              const tx = t!.x - ux * back
              const ty = t!.y - uy * back
              const cx = (s!.x + tx) / 2 + (-uy) * len * 0.08
              const cy = (s!.y + ty) / 2 + ux * len * 0.08
              return (
                <path
                  key={`${e.source}-${e.target}-${i}`}
                  className={`constellation-edge${incident ? ' is-highlighted' : ''}${dim ? ' is-dim' : ''}`}
                  d={`M ${s!.x} ${s!.y} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${tx.toFixed(2)} ${ty.toFixed(2)}`}
                  strokeWidth={style.width}
                  strokeDasharray={style.dash}
                  markerEnd={style.arrow ? 'url(#rel-arrow)' : undefined}
                  style={{ '--sc': incident ? colorFor(selected) : undefined } as CSSProperties}
                >
                  <title>{e.description}</title>
                </path>
              )
            })}

            {orderedNodes.map((n) => {
              const r = n.size * 0.74
              const dim = q ? !matches(n) : false
              const isSel = selectedId === n.id
              return (
                <g
                  key={n.id}
                  className={`constellation-node is-${n.kind}${isSel ? ' is-selected' : ''}${dim ? ' is-dim' : ''}`}
                  style={{ '--sc': colorFor(n) } as CSSProperties}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSel}
                  aria-label={`${n.label}, ${n.type}`}
                  onClick={() => setSelectedId(n.id)}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault()
                      setSelectedId(n.id)
                    }
                  }}
                >
                  {isSel && <circle className="node-halo" cx={n.x} cy={n.y} r={r + 2.2} />}
                  <circle cx={n.x} cy={n.y} r={r} />
                  <text x={n.x} y={n.y + r + 2.7}>
                    {n.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <aside
          className="node-profile"
          style={{ '--sc': colorFor(selected) } as CSSProperties}
          aria-live="polite"
        >
          <span className="node-profile-kind">
            <span className="dot" />
            {selected.type}
          </span>
          <h5>{selected.label}</h5>
          <p className="node-profile-desc">{selected.description}</p>

          <div className="node-facet">
            <span className="tool-label">Main gap</span>
            <p className="node-gap">{selected.gap}</p>
          </div>

          {(
            [
              { label: 'Expertise in', items: panel.knowledge },
              { label: 'Authority over', items: panel.authority },
              { label: 'Relies on', items: panel.dependsOn },
              { label: 'Relied on by', items: panel.reliedOnBy },
            ] as { label: string; items: Node[] }[]
          )
            .filter((f) => f.items.length > 0)
            .map((f) => (
              <div className="node-facet" key={f.label}>
                <span className="tool-label">{f.label}</span>
                <div className="node-tags">
                  {f.items.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      className="node-tag"
                      onClick={() => setSelectedId(n.id)}
                    >
                      {n.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

          {panel.interfaces.length > 0 && (
            <div className="node-facet">
              <span className="tool-label">Interfaces</span>
              <div className="node-tags">
                {panel.interfaces.map((it, idx) => (
                  <button
                    key={`${it.node.id}-${idx}`}
                    type="button"
                    className="node-tag"
                    onClick={() => setSelectedId(it.node.id)}
                  >
                    {it.node.label}
                    <span className="mech">{it.type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
