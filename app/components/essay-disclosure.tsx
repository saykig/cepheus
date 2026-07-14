'use client'

import type { ReactNode } from 'react'
import { useEffect, useId, useRef, useState } from 'react'

export function EssayDisclosure({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panelRef.current?.toggleAttribute('inert', !open)
  }, [open])

  return (
    <section className={`essay-disclosure${open ? ' is-open' : ''}`}>
      <h3>
        <button
          type="button"
          className="essay-disclosure-trigger"
          aria-controls={panelId}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <span>{title}</span>
          <span className="essay-disclosure-icon" aria-hidden="true" />
        </button>
      </h3>
      <div
        ref={panelRef}
        className="essay-disclosure-panel"
        id={panelId}
        aria-hidden={!open}
      >
        <div className="essay-disclosure-panel-inner">{children}</div>
      </div>
    </section>
  )
}
