'use client'

import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'

type AxisItem = {
  id: string
  label: string
}

type Cell = {
  row: string
  column: string
  score: number
  label: string
  explanation: string
  sourceIds: number[]
}

type GapData = {
  title: string
  description: string
  rows: AxisItem[]
  columns: AxisItem[]
  cells: Cell[]
}

export function GapMapMatrix() {
  const [data, setData] = useState<GapData | null>(null)
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null)

  useEffect(() => {
    fetch('/data/gap-map.json')
      .then((response) => response.json())
      .then((nextData: GapData) => {
        setData(nextData)
        setSelectedCell(nextData.cells[0] ?? null)
      })
  }, [])

  if (!data || !selectedCell) {
    return <div className="omoikane-loading" aria-live="polite" />
  }

  const cellByCoordinate = new Map(
    data.cells.map((cell) => [`${cell.row}:${cell.column}`, cell]),
  )

  return (
    <section className="omoikane-visual gap-matrix" aria-label={data.title}>
      <header className="omoikane-visual-header">
        <h4>{data.title}</h4>
        <p>{data.description}</p>
      </header>
      <div className="gap-grid" style={{ '--gap-columns': data.columns.length } as CSSProperties}>
        <span className="gap-corner" />
        {data.columns.map((column) => (
          <span className="gap-column-label" key={column.id}>
            {column.label}
          </span>
        ))}
        {data.rows.map((row) => (
          <div className="gap-row" key={row.id}>
            <span className="gap-row-label">{row.label}</span>
            {data.columns.map((column) => {
              const cell = cellByCoordinate.get(`${row.id}:${column.id}`)
              if (!cell) return <span className="gap-cell is-empty" key={column.id} />

              return (
                <button
                  aria-pressed={selectedCell === cell}
                  className={selectedCell === cell ? 'gap-cell is-selected' : 'gap-cell'}
                  key={column.id}
                  onClick={() => setSelectedCell(cell)}
                  style={{ '--gap-score': cell.score } as CSSProperties}
                  type="button"
                >
                  <strong>{cell.score}</strong>
                  <span>{cell.label}</span>
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <div className="gap-detail">
        <p>{selectedCell.explanation}</p>
        <div className="visual-sources">
          {selectedCell.sourceIds.map((sourceId) => (
            <a href={`#ref-${sourceId}`} key={sourceId}>
              {sourceId}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
