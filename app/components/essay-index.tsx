'use client'

import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'

type Section = {
  id: string
  title: string
}

export function EssayIndex({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id)
  const [progress, setProgress] = useState(0)
  const [noteOpacity, setNoteOpacity] = useState(1)

  useEffect(() => {
    const updateProgress = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight
      const nextProgress = scrollable > 0 ? window.scrollY / scrollable : 0
      setProgress(Math.min(1, Math.max(0, nextProgress)))
      setNoteOpacity(Math.max(0, 1 - window.scrollY / 260))

      const current = sections.reduce((active, section) => {
        const element = document.getElementById(section.id)
        if (!element) return active

        const top = element.getBoundingClientRect().top
        if (top <= 320) return section.id

        return active
      }, sections[0]?.id)

      setActiveId(current)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [sections])

  return (
    <aside
      className="essay-side"
      aria-label="Essay sections"
      style={
        {
          '--note-opacity': noteOpacity,
          '--note-shift': `${-12 * (1 - noteOpacity)}px`,
          '--scroll-percent': `${progress * 100}%`,
        } as CSSProperties
      }
    >
      <p className="essay-side-note">
        A research platform for seeing where emerging fields begin to overlap,
        accelerate, and harden into public decisions.
      </p>

      <nav
        className="essay-scroll-index"
      >
        {sections.map((section, index) => {
          const sectionProgress =
            sections.length > 1 ? index / (sections.length - 1) : 0
          const isReached = progress + 0.035 >= sectionProgress

          return (
            <a
              className={[
                'essay-index-item',
                activeId === section.id ? 'is-active' : '',
                isReached ? 'is-reached' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              href={`#${section.id}`}
              key={section.id}
            >
              <span className="essay-index-dot" aria-hidden="true" />
              <span>{section.title}</span>
            </a>
          )
        })}
      </nav>
    </aside>
  )
}
