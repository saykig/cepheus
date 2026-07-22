'use client'

import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from './use-in-view'
import { WatercolorNode, WatercolorNodeDefs } from './watercolor-node'
import type { Locale } from 'app/lib/i18n'
import { visualCopy } from 'app/lib/visual-copy'
import {
  deriveAssessment,
  type ComponentAssessment,
  type ComponentAssessmentData,
  type GovernanceField,
  type GovernanceSignificanceTier,
} from 'app/lib/gap-matrix-scoring'

type HelpId = 'knowledge' | 'authority' | 'gap' | 'significance'

const HELP_TEXT: Record<HelpId, string> = {
  knowledge:
    'How strongly technical capability, information, and evaluation access are concentrated outside public institutions. A higher score means greater non-public concentration.',
  authority:
    'The extent to which public institutions possess binding, operational powers over that field. A higher score means broader and more enforceable public authority.',
  gap:
    'Calculated by subtracting public authority from knowledge concentration. A larger positive result indicates a wider institutional gap.',
  significance:
    'An assessment of the field’s scale of exposure, severity and reversibility, strategic dependence, and pace of spillover. It is shown as a tier rather than a precise public score.',
}

const HELP_DOM_IDS: Record<HelpId, string> = {
  knowledge: 'gap-help-knowledge',
  authority: 'gap-help-authority',
  gap: 'gap-help-result',
  significance: 'gap-help-significance',
}

const sx = (value: number) => value
const sy = (value: number) => 100 - value
const fieldColor = 'var(--series-1)'

const tierLabel = (tier: GovernanceSignificanceTier | null) => {
  if (tier === null) return 'Pending'
  return tier.replace(/^./, (letter) => letter.toUpperCase())
}

function HelpTooltip({
  active,
  className,
  helpId,
}: {
  active: boolean
  className: string
  helpId: HelpId
}) {
  return (
    <span
      id={HELP_DOM_IDS[helpId]}
      className={`gap-help-tooltip ${className}`}
      role="tooltip"
      hidden={!active}
    >
      {HELP_TEXT[helpId]}
    </span>
  )
}

export function GapMapMatrix({ locale = 'en' }: { locale?: Locale }) {
  const copy = visualCopy[locale]
  const { ref, inView } = useInView<HTMLElement>()
  const [field, setField] = useState<GovernanceField | null>(null)
  const [assessments, setAssessments] = useState<ComponentAssessment[] | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<HelpId | null>(null)
  const touchStartedOpen = useRef(false)

  useEffect(() => {
    const controller = new AbortController()

    const loadJson = async <T,>(path: string) => {
      const response = await fetch(path, { signal: controller.signal })
      if (!response.ok) {
        throw new Error(`Gap Matrix data returned ${response.status} for ${path}`)
      }
      return response.json() as Promise<T>
    }

    Promise.all([
      loadJson<GovernanceField>('/data/gap-matrix/fields.json'),
      loadJson<ComponentAssessmentData>(
        '/data/gap-matrix/component-assessments.json',
      ),
    ])
      .then(([fieldData, assessmentData]) => {
        setField(fieldData)
        setAssessments(assessmentData.assessments)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setLoadFailed(true)
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (activeTooltip === null) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveTooltip(null)
    }
    const closeOutside = (event: globalThis.PointerEvent) => {
      const target = event.target
      if (target instanceof Element && target.closest('[data-gap-help-trigger]')) return
      setActiveTooltip(null)
    }

    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOutside)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOutside)
    }
  }, [activeTooltip])

  const derived = useMemo(
    () => (field && assessments ? deriveAssessment(field, assessments) : null),
    [assessments, field],
  )

  if (loadFailed) {
    return (
      <div className="tool-loading tool-loading-error" role="alert">
        Gap Matrix data could not be loaded.
      </div>
    )
  }

  if (!field || !assessments || !derived) {
    return <div className="tool-loading" aria-live="polite" aria-busy="true" />
  }

  const isPositioned =
    derived.knowledgeConcentration !== null &&
    derived.publicAuthority !== null &&
    derived.governanceSignificanceRadius !== null
  const isPending = !isPositioned

  const showHelp = (helpId: HelpId) => setActiveTooltip(helpId)
  const hideHelp = (helpId: HelpId) =>
    setActiveTooltip((current) => (current === helpId ? null : current))
  const helpProps = (helpId: HelpId) => ({
    'aria-describedby': HELP_DOM_IDS[helpId],
    'data-gap-help-trigger': true,
    onFocus: () => showHelp(helpId),
    onBlur: () => hideHelp(helpId),
    onMouseEnter: () => showHelp(helpId),
    onMouseLeave: (event: ReactMouseEvent<Element>) => {
      if (document.activeElement !== event.currentTarget) hideHelp(helpId)
    },
    onPointerDown: (event: ReactPointerEvent<Element>) => {
      if (event.pointerType !== 'mouse') {
        touchStartedOpen.current = activeTooltip === helpId
      }
    },
    onPointerUp: (event: ReactPointerEvent<Element>) => {
      if (event.pointerType !== 'mouse') {
        setActiveTooltip(touchStartedOpen.current ? null : helpId)
      }
    },
  })

  const axisMeters = [
    {
      helpId: 'knowledge' as const,
      label: field.metrics.knowledgeConcentration.label,
      value: derived.knowledgeConcentration,
    },
    {
      helpId: 'authority' as const,
      label: field.metrics.publicAuthority.label,
      value: derived.publicAuthority,
    },
  ]

  return (
    <section
      ref={ref}
      className={`tool gap reveal${inView ? ' is-in' : ''}`}
      aria-label={copy.gapTitle}
    >
      <div className="tool-head">
        <div className="tool-heading">
          <h4 className="tool-title">{copy.gapTitle}</h4>
          <details className="tool-about">
            <summary>{copy.about}</summary>
            <div className="tool-about-body">
              Each point is a dated assessment of a defined governance field.
              Knowledge concentration measures how strongly technical capability,
              information, and evaluation access are concentrated outside public
              institutions. Public authority measures binding rules, compulsory
              access to information, independent evaluation powers, and enforcement
              capacity. Both scores are calculated from a published component
              rubric. The diagonal marks equal index scores; points below it have
              greater non-public knowledge concentration than public authority.
              Circle size shows governance significance as a tier. Full sources,
              coding decisions, and methodological limitations are documented on{' '}
              <a
                href="https://github.com/saykig/cepheus"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
              .
            </div>
          </details>
        </div>
      </div>
      <p className="tool-subtitle">{copy.gapDescription}</p>

      <div className="gap-toolbar">
        <button
          type="button"
          className="gap-legend-note gap-help-button"
          {...helpProps('significance')}
        >
          <svg className="gap-size-key" viewBox="0 0 28 14" aria-hidden="true">
            <defs>
              <WatercolorNodeDefs id="gap-legend-watercolor" />
            </defs>
            <g style={{ '--sc': 'var(--olive)' } as CSSProperties}>
              <WatercolorNode
                cx={7}
                cy={7}
                radius={2.3}
                filterId="gap-legend-watercolor"
              />
              <WatercolorNode
                cx={20}
                cy={7}
                radius={4.9}
                filterId="gap-legend-watercolor"
              />
            </g>
          </svg>
          Governance significance
        </button>
        <HelpTooltip
          active={activeTooltip === 'significance'}
          className="is-significance"
          helpId="significance"
        />
      </div>

      <div className="gap-layout">
        <div className="gap-plot">
          <svg
            viewBox="-12 -5 116 117"
            role="img"
            aria-label={`${copy.gapTitle}: Knowledge concentration by Public authority`}
          >
            <defs>
              <WatercolorNodeDefs id="gap-node-watercolor" />
            </defs>
            <line className="quadrant-line" x1={50} y1={0} x2={50} y2={100} />
            <line className="quadrant-line" x1={0} y1={50} x2={100} y2={50} />
            <line
              className="gap-balance-line"
              x1={0}
              y1={100}
              x2={100}
              y2={0}
            />
            <line className="chart-axis" x1={0} y1={0} x2={0} y2={100} />
            <line className="chart-axis" x1={0} y1={100} x2={100} y2={100} />

            <text
              className="diagonal-label"
              x={72}
              y={26}
              transform="rotate(-45 72 26)"
            >
              Equal index scores
            </text>

            <text
              className="gap-axis-title gap-help-trigger"
              x={50}
              y={112}
              textAnchor="middle"
              role="button"
              tabIndex={0}
              {...helpProps('knowledge')}
            >
              Knowledge concentration
            </text>
            <text className="gap-axis-end" x={0} y={108} textAnchor="middle">
              Low
            </text>
            <text className="gap-axis-end" x={100} y={108} textAnchor="middle">
              High
            </text>
            <text
              className="gap-axis-title gap-help-trigger"
              x={-8}
              y={50}
              textAnchor="middle"
              transform="rotate(-90 -8 50)"
              role="button"
              tabIndex={0}
              {...helpProps('authority')}
            >
              Public authority
            </text>

            {isPositioned && (
              <g
                className="bubble is-selected is-labeled"
                style={
                  {
                    '--sc': fieldColor,
                    transform: `translate(${sx(derived.knowledgeConcentration as number)}px, ${sy(derived.publicAuthority as number)}px)`,
                  } as CSSProperties
                }
                role="img"
                aria-label={`${field.label}: Knowledge concentration ${derived.knowledgeConcentration}, Public authority ${derived.publicAuthority}, Governance significance ${derived.governanceSignificanceTier}`}
              >
                <WatercolorNode
                  cx={0}
                  cy={0}
                  radius={derived.governanceSignificanceRadius as number}
                  filterId="gap-node-watercolor"
                  selected
                  hitRadius={(derived.governanceSignificanceRadius as number) + 2.7}
                />
                <text
                  x={0}
                  y={-(derived.governanceSignificanceRadius as number) - 1.4}
                >
                  {field.label}
                </text>
              </g>
            )}
          </svg>

          <HelpTooltip
            active={activeTooltip === 'knowledge'}
            className="is-knowledge"
            helpId="knowledge"
          />
          <HelpTooltip
            active={activeTooltip === 'authority'}
            className="is-authority"
            helpId="authority"
          />
        </div>

        <aside
          className={`gap-panel${isPending ? ' is-pending' : ''}`}
          style={{ '--sc': fieldColor } as CSSProperties}
          aria-live="polite"
        >
          <span className="gap-panel-kind">
            <span className="dot" />
            {isPending ? 'Assessment pending' : 'Dated assessment'}
          </span>
          <h5>{field.label}</h5>
          <p className="gap-panel-quadrant">
            As of {field.assessment.evidenceCutoff}
          </p>

          <div className="gap-meters">
            {axisMeters.map((meter) => (
              <div className="gap-meter-row" key={meter.helpId}>
                <div className="gap-meter-head">
                  <span>{meter.label}</span>
                  <span className="val">
                    {meter.value === null
                      ? 'Pending'
                      : `${Math.round(meter.value)} / 100`}
                  </span>
                </div>
                {meter.value !== null && (
                  <div
                    className="meter"
                    role="meter"
                    aria-label={meter.label}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(meter.value)}
                  >
                    <span style={{ width: `${meter.value}%` }} />
                  </div>
                )}
              </div>
            ))}

            <div className="gap-meter-row">
              <div className="gap-meter-head">
                <button
                  type="button"
                  className="gap-help-button"
                  {...helpProps('gap')}
                >
                  Gap result
                </button>
                <span className="val">
                  {derived.gap === null
                    ? 'Pending'
                    : `${derived.gap > 0 ? '+' : ''}${derived.gap}`}
                </span>
              </div>
              <HelpTooltip
                active={activeTooltip === 'gap'}
                className="is-gap"
                helpId="gap"
              />
            </div>

            <div className="gap-meter-row">
              <div className="gap-meter-head">
                <span>Governance significance</span>
                <span className="val">
                  {tierLabel(derived.governanceSignificanceTier)}
                </span>
              </div>
            </div>
          </div>

          <p className="gap-insight">{field.definition}</p>
          <p className="gap-scope-note">{field.assessment.scopeNote}</p>
        </aside>
      </div>
    </section>
  )
}
