'use client'

import type { CSSProperties } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getEssayTargetOffset } from './essay-scroll'

type Section = {
  id: string
  title: string
  children?: Section[]
}

export function EssayIndex({
  sections,
  updated,
}: {
  sections: Section[]
  updated?: string
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id)
  const [visibleChildId, setVisibleChildId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [noteOpacity, setNoteOpacity] = useState(1)
  const flatSections = useMemo(
    () => sections.flatMap((section) => [section, ...(section.children ?? [])]),
    [sections],
  )
  const childSections = useMemo(
    () => sections.flatMap((section) => section.children ?? []),
    [sections],
  )

  useEffect(() => {
    const update = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight
      const next = scrollable > 0 ? window.scrollY / scrollable : 0
      setProgress(Math.min(1, Math.max(0, next)))
      setNoteOpacity(Math.max(0.5, 1 - window.scrollY / 360))

      const current = flatSections.reduce((active, section) => {
        const element = document.getElementById(section.id)
        if (!element) return active
        return element.getBoundingClientRect().top <= 320 ? section.id : active
      }, flatSections[0]?.id)
      setActiveId(current)

      const visibleChild = childSections.find((section) => {
        const element = document.getElementById(section.id)
        if (!element) return false
        const rect = element.getBoundingClientRect()
        return rect.top < window.innerHeight && rect.bottom > 0
      })

      setVisibleChildId((previous) => {
        if (visibleChild) return visibleChild.id
        if (!previous) return null

        const previousElement = document.getElementById(previous)
        if (!previousElement) return null
        const rect = previousElement.getBoundingClientRect()
        return rect.top < window.innerHeight && rect.bottom > -48
          ? previous
          : null
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [childSections, flatSections])

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return

    let cancelled = false
    const cancel = () => {
      cancelled = true
    }
    const alignHashTarget = () => {
      if (cancelled) return
      const target = document.getElementById(id)
      if (!target) return

      const root = document.documentElement
      const previousBehavior = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'
      const offset = getEssayTargetOffset(id)
      window.scrollTo({
        top: window.scrollY + target.getBoundingClientRect().top - offset,
      })
      root.style.scrollBehavior = previousBehavior
    }

    const timers = [0, 350, 1000].map((delay) =>
      window.setTimeout(alignHashTarget, delay),
    )
    window.addEventListener('wheel', cancel, { passive: true, once: true })
    window.addEventListener('touchstart', cancel, { passive: true, once: true })
    window.addEventListener('pointerdown', cancel, { passive: true, once: true })

    return () => {
      timers.forEach(window.clearTimeout)
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
      window.removeEventListener('pointerdown', cancel)
    }
  }, [])

  const handleDownload = useCallback(() => {
    window.print()
  }, [])

  const activeIndex = flatSections.findIndex((section) => section.id === activeId)

  const renderIndexLink = (
    section: Section,
    { child = false, tabIndex }: { child?: boolean; tabIndex?: number } = {},
  ) => {
    const index = flatSections.findIndex((item) => item.id === section.id)
    const isReached = index >= 0 && index <= activeIndex
    const activeChildIsHidden =
      !child &&
      section.children?.some((item) => item.id === activeId) &&
      visibleChildId !== activeId
    const isActive = activeId === section.id || Boolean(activeChildIsHidden)

    return (
      <a
        className={[
          'essay-index-item',
          child ? 'is-child' : '',
          isActive ? 'is-active' : '',
          isReached ? 'is-reached' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        href={`#${section.id}`}
        key={section.id}
        aria-current={isActive ? 'true' : undefined}
        tabIndex={tabIndex}
      >
        <span className="essay-index-dot" aria-hidden="true" />
        <span>{section.title}</span>
      </a>
    )
  }

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
        Technology is often built in one world and governed in another. Omoikane
        maps the distance between them.
      </p>

      <nav className="essay-scroll-index" aria-label="Sections">
        {sections.map((section) => {
          const childIds = section.children?.map((child) => child.id) ?? []
          const branchOpen = childIds.includes(visibleChildId ?? '')

          return (
            <div className="essay-index-group" key={section.id}>
              {renderIndexLink(section)}
              {section.children ? (
                <div
                  className={`essay-index-branch${branchOpen ? ' is-open' : ''}`}
                  aria-hidden={!branchOpen}
                >
                  <div className="essay-index-branch-inner">
                    {section.children.map((child) =>
                      renderIndexLink(child, {
                        child: true,
                        tabIndex: branchOpen ? undefined : -1,
                      }),
                    )}
                  </div>
                </div>
              ) : null}
            </div>
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
