'use client'

import Link from 'next/link'
import { useState } from 'react'

type Point = {
  id: string
  x: number
  y: number
  width: number
  height: number
  size: 'large' | 'medium' | 'small'
  tone: 'sage' | 'brown' | 'blue'
}

const MAX_MARKS = 18
const SIZES = ['large', 'medium', 'small'] as const
const TONES = ['sage', 'brown', 'blue'] as const

export function LandingWatercolor() {
  const [points, setPoints] = useState<Point[]>([])

  function addMark(event: React.MouseEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const point = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
      width: bounds.width,
      height: bounds.height,
      size: SIZES[Math.floor(Math.random() * SIZES.length)],
      tone: TONES[Math.floor(Math.random() * TONES.length)],
    }

    setPoints((current) => [...current.slice(-(MAX_MARKS - 1)), point])
  }

  return (
    <section
      className="landing"
      aria-label="Cepheus"
      onClick={addMark}
    >
      <div className="watercolor-field" aria-hidden="true">
        <span className="watercolor-drop green large" />
        <span className="watercolor-drop brown medium" />
        <span className="watercolor-drop blue small" />
        <span className="watercolor-drop sepia wide" />

        <svg className="watercolor-links" viewBox="0 0 100 100" preserveAspectRatio="none">
          {points.slice(1).map((point, index) => {
            const previous = points[index]
            const lineLength = Math.max(
              Math.hypot(
                ((point.x - previous.x) / 100) * point.width,
                ((point.y - previous.y) / 100) * point.height,
              ),
              0.01,
            )
            const drawValues = `${lineLength};${lineLength * 0.3};0`

            return (
              <g
                key={`${previous.id}-${point.id}`}
                className={`watercolor-connection tone-${point.tone}`}
              >
                <path
                  className="watercolor-link watercolor-link-wash"
                  d={`M ${previous.x} ${previous.y} L ${point.x} ${point.y}`}
                  strokeDasharray={lineLength}
                  strokeDashoffset={lineLength}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    calcMode="spline"
                    dur="14.8s"
                    fill="freeze"
                    keySplines="0.16 0.72 0.25 1; 0.2 0.68 0.18 1"
                    keyTimes="0;0.72;1"
                    values={drawValues}
                  />
                </path>
                <path
                  className="watercolor-link watercolor-link-middle"
                  d={`M ${previous.x} ${previous.y} L ${point.x} ${point.y}`}
                  strokeDasharray={lineLength}
                  strokeDashoffset={lineLength}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    calcMode="spline"
                    dur="14.1s"
                    fill="freeze"
                    keySplines="0.16 0.72 0.25 1; 0.2 0.68 0.18 1"
                    keyTimes="0;0.72;1"
                    values={drawValues}
                  />
                </path>
                <path
                  className="watercolor-link watercolor-link-core"
                  d={`M ${previous.x} ${previous.y} L ${point.x} ${point.y}`}
                  strokeDasharray={lineLength}
                  strokeDashoffset={lineLength}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    calcMode="spline"
                    dur="13.5s"
                    fill="freeze"
                    keySplines="0.16 0.72 0.25 1; 0.2 0.68 0.18 1"
                    keyTimes="0;0.72;1"
                    values={drawValues}
                  />
                </path>
                <circle
                  className="watercolor-link-pigment watercolor-link-pigment-source"
                  cx={previous.x}
                  cy={previous.y}
                  r="1.15"
                />
                <circle
                  className="watercolor-link-pigment watercolor-link-pigment-destination"
                  cx={point.x}
                  cy={point.y}
                  r="1.35"
                />
              </g>
            )
          })}
        </svg>

        {points.map((point, index) => (
          <span
            key={point.id}
            className={`watercolor-mark size-${point.size} tone-${point.tone}`}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          />
        ))}
      </div>
      <div className="landing-lockup">
        <h1>Cepheus</h1>
        <p className="landing-tagline">
          Essays on power, technology, and policy.
        </p>
        <Link
          href="/essays/the-omoikane-link"
          className="landing-enter"
          onClick={(event) => event.stopPropagation()}
        >
          Enter the essay
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
            <path
              d="M1 5h13M10 1l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
      <p className="landing-hint" aria-hidden="true">
        Click anywhere to trace a connection
      </p>
    </section>
  )
}
