'use client'

import { useEffect, useMemo, useState } from 'react'

type Node = {
  id: string
  label: string
  kind: string
  x: number
  y: number
  size: number
  explanation: string
  sourceIds: number[]
}

type Edge = {
  source: string
  target: string
  explanation: string
  sourceIds: number[]
}

type NetworkData = {
  title: string
  description: string
  selectionLabel: string
  nodes: Node[]
  edges: Edge[]
}

export function PolicyConstellationMap() {
  const [data, setData] = useState<NetworkData | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data/policy-network.json')
      .then((response) => response.json())
      .then((nextData: NetworkData) => {
        setData(nextData)
        setSelectedId(nextData.nodes[0]?.id ?? null)
      })
  }, [])

  const selectedNode = useMemo(
    () => data?.nodes.find((node) => node.id === selectedId),
    [data, selectedId],
  )

  if (!data || !selectedNode) {
    return <div className="omoikane-loading" aria-live="polite" />
  }

  const nodesById = new Map(data.nodes.map((node) => [node.id, node]))

  return (
    <section className="omoikane-visual constellation" aria-label={data.title}>
      <header className="omoikane-visual-header">
        <h4>{data.title}</h4>
        <p>{data.description}</p>
      </header>
      <div className="constellation-layout">
        <div className="constellation-canvas">
          <svg viewBox="0 0 100 100" role="img" aria-label={data.title}>
            {data.edges.map((edge) => {
              const source = nodesById.get(edge.source)
              const target = nodesById.get(edge.target)
              if (!source || !target) return null

              return (
                <line
                  className={[
                    'constellation-edge',
                    selectedId === edge.source || selectedId === edge.target
                      ? 'is-highlighted'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={`${edge.source}-${edge.target}`}
                  x1={source.x}
                  x2={target.x}
                  y1={source.y}
                  y2={target.y}
                >
                  <title>{edge.explanation}</title>
                </line>
              )
            })}
            {data.nodes.map((node) => (
              <g
                className={[
                  'constellation-node',
                  `is-${node.kind}`,
                  selectedId === node.id ? 'is-selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={node.id}
                onClick={() => setSelectedId(node.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedId(node.id)
                  }
                }}
              >
                <circle cx={node.x} cy={node.y} r={node.size / 2} />
                <text x={node.x} y={node.y + node.size / 2 + 5}>
                  {node.label}
                </text>
                <title>{node.explanation}</title>
              </g>
            ))}
          </svg>
        </div>
        <aside className="constellation-detail">
          <span>{data.selectionLabel}</span>
          <h5>{selectedNode.label}</h5>
          <p>{selectedNode.explanation}</p>
          <div className="visual-sources">
            {selectedNode.sourceIds.map((sourceId) => (
              <a href={`#ref-${sourceId}`} key={sourceId}>
                {sourceId}
              </a>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
