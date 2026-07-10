'use client'

import { useEffect, useState } from 'react'

type Source = {
  id: number
  title: string
  url: string
  note: string
}

type SourceData = {
  title: string
  sources: Source[]
}

export function SourceNotes() {
  const [data, setData] = useState<SourceData | null>(null)

  useEffect(() => {
    fetch('/data/sources.json')
      .then((response) => response.json())
      .then(setData)
  }, [])

  if (!data) return <div className="omoikane-loading" aria-live="polite" />

  return (
    <section className="references" aria-labelledby="references-heading">
      <h2 id="references-heading">{data.title}</h2>
      <ol>
        {data.sources.map((source) => (
          <li id={`ref-${source.id}`} key={source.id}>
            <a href={source.url} rel="noreferrer" target="_blank">
              {source.title}
            </a>
            <span className="source-note">{source.note}</span>
            <a className="backlink" href={`#ref-back-${source.id}`}>
              back
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
