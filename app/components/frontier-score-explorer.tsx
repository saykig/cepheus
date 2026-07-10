'use client'

import { useEffect, useState } from 'react'

type Topic = {
  id: string
  label: string
  score: number
  explanation: string
  sourceIds: number[]
}

type FrontierData = {
  title: string
  description: string
  scoreLabel: string
  topics: Topic[]
}

export function FrontierScoreExplorer() {
  const [data, setData] = useState<FrontierData | null>(null)

  useEffect(() => {
    fetch('/data/frontier-topics.json')
      .then((response) => response.json())
      .then(setData)
  }, [])

  if (!data) return <div className="omoikane-loading" aria-live="polite" />

  return (
    <section className="omoikane-visual frontier-explorer" aria-label={data.title}>
      <header className="omoikane-visual-header">
        <h4>{data.title}</h4>
        <p>{data.description}</p>
      </header>
      <div className="frontier-list">
        {data.topics.map((topic) => (
          <article className="frontier-topic" key={topic.id}>
            <div className="frontier-topic-heading">
              <span>{topic.label}</span>
              <strong>{topic.score}</strong>
            </div>
            <div className="frontier-score-track" aria-label={`${topic.label}: ${topic.score}`}>
              <span style={{ width: `${topic.score}%` }} />
            </div>
            <p>{topic.explanation}</p>
            <div className="visual-sources">
              <span>{data.scoreLabel}</span>
              {topic.sourceIds.map((sourceId) => (
                <a href={`#ref-${sourceId}`} key={sourceId}>
                  {sourceId}
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
