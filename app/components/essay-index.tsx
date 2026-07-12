'use client'

import type { CSSProperties } from 'react'
import { useCallback, useEffect, useState } from 'react'

type Section = {
  id: string
  title: string
}

export function EssayIndex({
  sections,
  updated,
}: {
  sections: Section[]
  updated?: string
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id)
  const [progress, setProgress] = useState(0)
  const [noteOpacity, setNoteOpacity] = useState(1)

  useEffect(() => {
    const update = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight
      const next = scrollable > 0 ? window.scrollY / scrollable : 0
      setProgress(Math.min(1, Math.max(0, next)))
      setNoteOpacity(Math.max(0.5, 1 - window.scrollY / 360))

      const current = sections.reduce((active, section) => {
        const element = document.getElementById(section.id)
        if (!element) return active
        return element.getBoundingClientRect().top <= 320 ? section.id : active
      }, sections[0]?.id)
      setActiveId(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [sections])

  const handleDownload = useCallback(() => {
    window.print()
  }, [])

  return (
    <aside
      className="essay-side"
      aria-label="Essay contents"
      style={
        {
          '--note-opacity': noteOpacity,
          '--scroll-percent': `${progress * 100}%`,
        } as CSSProperties
      }
    >
      <p className="essay-side-note">
        A research platform for seeing where emerging fields begin to overlap,
        accelerate, and harden into public decisions.
      </p>

      <nav className="essay-scroll-index" aria-label="Sections">
        {sections.map((section, index) => {
          const sectionProgress =
            sections.length > 1 ? index / (sections.length - 1) : 0
          const isReached = progress + 0.035 >= sectionProgress
          const isActive = activeId === section.id

          return (
            <a
              className={[
                'essay-index-item',
                isActive ? 'is-active' : '',
                isReached ? 'is-reached' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              href={`#${section.id}`}
              key={section.id}
              aria-current={isActive ? 'true' : undefined}
            >
              <span className="essay-index-dot" aria-hidden="true" />
              <span>{section.title}</span>
            </a>
          )
        })}
      </nav>

      <div className="essay-rail-actions">
        <button type="button" className="rail-download" onClick={handleDownload}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7 1.4v7.2M4 5.6 7 8.7l3-3.1"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 10.2v1.3c0 .6.5 1.1 1.1 1.1h7.8c.6 0 1.1-.5 1.1-1.1v-1.3"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </svg>
          Download report (PDF)
        </button>
        {updated ? <p className="rail-updated">Last updated {updated}</p> : null}
      </div>
    </aside>
  )
}
