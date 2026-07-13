'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

const OPEN_MAP_EVENT = 'omoikane:open-map'

type MapAccordionContextValue = {
  openId: string | null
  setOpenId: (id: string | null) => void
}

const MapAccordionContext = createContext<MapAccordionContextValue | null>(null)

export function EssayMapAccordion({
  children,
  mapIds,
}: {
  children: ReactNode
  mapIds: string[]
}) {
  const [openId, setOpenId] = useState<string | null>(null)
  const pendingScroll = useRef<string | null>(null)

  useEffect(() => {
    const openFromHash = (shouldScroll: boolean) => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (!mapIds.includes(id)) return
      pendingScroll.current = shouldScroll ? id : null
      setOpenId(id)
    }

    const handleOpenRequest = (event: Event) => {
      const { id } = (event as CustomEvent<{ id: string }>).detail
      if (!mapIds.includes(id)) return
      pendingScroll.current = id
      setOpenId(id)
    }
    const handleHashChange = () => openFromHash(true)

    openFromHash(false)
    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener(OPEN_MAP_EVENT, handleOpenRequest)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener(OPEN_MAP_EVENT, handleOpenRequest)
    }
  }, [mapIds])

  useEffect(() => {
    if (!openId || pendingScroll.current !== openId) return

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const target = document.getElementById(openId)
        if (!target) return
        const reducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches
        target.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'start',
        })
        pendingScroll.current = null
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [openId])

  return (
    <MapAccordionContext.Provider value={{ openId, setOpenId }}>
      <div className="map-accordion">{children}</div>
    </MapAccordionContext.Provider>
  )
}

export function EssayMapPanel({
  children,
  id,
  index,
  title,
}: {
  children: ReactNode
  id: string
  index: number
  title: string
}) {
  const context = useContext(MapAccordionContext)
  if (!context) {
    throw new Error('EssayMapPanel must be rendered inside EssayMapAccordion')
  }

  const isOpen = context.openId === id
  const headingId = `${id}-heading`
  const panelId = `${id}-panel`

  return (
    <section
      className={`map-section map-accordion-item${isOpen ? ' is-open' : ''}`}
      id={id}
      aria-labelledby={headingId}
    >
      <h3 id={headingId}>
        <button
          type="button"
          className="map-accordion-trigger"
          aria-controls={panelId}
          aria-expanded={isOpen}
          onClick={() => context.setOpenId(isOpen ? null : id)}
        >
          <span className="map-index">{index}.</span>
          <span>{title}</span>
          <span className="map-accordion-icon" aria-hidden="true" />
        </button>
      </h3>
      <div
        className="map-accordion-panel"
        id={panelId}
        aria-hidden={!isOpen}
      >
        <div className="map-accordion-panel-inner">{children}</div>
      </div>
    </section>
  )
}

export function openEssayMap(id: string) {
  window.dispatchEvent(new CustomEvent(OPEN_MAP_EVENT, { detail: { id } }))
}
