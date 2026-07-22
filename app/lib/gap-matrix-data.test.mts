import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import assessmentData from '../../public/data/gap-matrix/component-assessments.json' with { type: 'json' }
import evidenceData from '../../public/data/gap-matrix/evidence.json' with { type: 'json' }
import fieldData from '../../public/data/gap-matrix/fields.json' with { type: 'json' }
import instrumentsData from '../../public/data/gap-matrix/instruments.json' with { type: 'json' }
import organizationsData from '../../public/data/gap-matrix/organizations.json' with { type: 'json' }
import rubricData from '../../public/data/gap-matrix/scoring-rubrics.json' with { type: 'json' }
import sourcesData from '../../public/data/gap-matrix/sources.json' with { type: 'json' }
import {
  calculateWeightedScore,
  deriveAssessment,
  type ComponentAssessment,
  type EvidenceDirection,
  type GovernanceField,
  type ScoringRubricData,
  type SelectedJurisdiction,
} from './gap-matrix-scoring.ts'

const field = fieldData as GovernanceField
const assessments = assessmentData.assessments as ComponentAssessment[]
const rubrics = rubricData as ScoringRubricData
const selectedJurisdictions: SelectedJurisdiction[] = [
  'European Union',
  'United States',
  'United Kingdom',
  'China',
]
const directions = new Set<EvidenceDirection>([
  'increases-knowledge-concentration',
  'decreases-knowledge-concentration',
  'increases-public-authority',
  'decreases-public-authority',
  'contextual',
])

describe('Frontier AI governance data integrity', () => {
  it('separates component definitions from assessment state', () => {
    const axisComponents = [
      ...field.metrics.knowledgeConcentration.components,
      ...field.metrics.publicAuthority.components,
    ]

    assert.equal(axisComponents.length, 10)
    for (const component of axisComponents) {
      assert.deepEqual(Object.keys(component).sort(), ['id', 'weight'])
    }
    assert.equal(Object.hasOwn(field, 'scoringRubric'), false)
    assert.equal(Object.hasOwn(field, 'derived'), false)
    assert.equal(field.assessment.evidenceCutoff, '2026-07-21')
    assert.equal(Object.hasOwn(field.assessment, 'asOf'), false)
  })

  it('defines ten component-specific rubrics with all five anchors', () => {
    assert.equal(rubrics.version, '1.0')
    assert.equal(rubrics.fieldId, field.id)
    assert.equal(rubrics.evidenceCutoff, field.assessment.evidenceCutoff)
    assert.deepEqual(rubrics.geographicScope, selectedJurisdictions)
    assert.equal(rubrics.rubrics.length, 10)

    const componentIds = new Set(
      [
        ...field.metrics.knowledgeConcentration.components,
        ...field.metrics.publicAuthority.components,
      ].map((component) => component.id),
    )
    assert.deepEqual(
      new Set(rubrics.rubrics.map((rubric) => rubric.id)),
      componentIds,
    )
    for (const rubric of rubrics.rubrics) {
      assert.deepEqual(Object.keys(rubric.anchors).sort(), ['0', '1', '2', '3', '4'])
      assert.ok(Object.values(rubric.anchors).every((anchor) => anchor.length > 30))
    }
  })

  it('uses five equal components for each axis', () => {
    for (const metric of Object.values(field.metrics)) {
      assert.equal(metric.components.length, 5)
      assert.ok(metric.components.every((component) => component.weight === 0.2))
      assert.equal(
        metric.components.reduce((sum, component) => sum + component.weight, 0),
        1,
      )
    }
  })

  it('contains 18 traceable sources accessed on the coding date', () => {
    assert.equal(sourcesData.sources.length, 18)
    const sourceIds = new Set<string>()
    for (const source of sourcesData.sources) {
      assert.equal(sourceIds.has(source.id), false)
      sourceIds.add(source.id)
      assert.equal(source.accessedDate, '2026-07-22')
      assert.match(source.url, /^https:\/\//)
      assert.ok(source.title.length > 0)
      assert.ok(source.issuingBody.length > 0)
    }
  })

  it('contains 38 atomic evidence records with valid lineage and dates', () => {
    assert.equal(evidenceData.evidence.length, 38)
    const sourceIds = new Set(sourcesData.sources.map((source) => source.id))
    const evidenceIds = new Set<string>()

    for (const evidence of evidenceData.evidence) {
      assert.equal(evidenceIds.has(evidence.id), false)
      evidenceIds.add(evidence.id)
      assert.ok(sourceIds.has(evidence.sourceId))
      assert.equal(Object.hasOwn(evidence, 'score'), false)
      assert.equal(evidence.claim.includes('\n'), false)
      assert.ok(evidence.claim.length > 20)
      assert.ok(evidence.locator.length > 0)
      assert.ok(evidence.limitations.length > 0)
      assert.ok(directions.has(evidence.direction as EvidenceDirection))
      assert.equal(evidence.accessedAt, '2026-07-22')
      assert.ok(evidence.observedAt <= field.assessment.evidenceCutoff)

      if (evidence.jurisdictions.includes('Global')) {
        assert.match(evidence.limitations, /Global evidence:/)
      }
      if (evidence.sourceId === 'stanford-ai-index-2026') {
        assert.doesNotMatch(evidence.claim, /frontier/i)
      }
    }
  })

  it('contains ten assessments and forty jurisdiction evidence cells', () => {
    assert.equal(assessments.length, 10)
    assert.equal(
      assessments.reduce(
        (total, assessment) => total + assessment.jurisdictionEvidence.length,
        0,
      ),
      40,
    )

    const rubricById = new Map(
      rubrics.rubrics.map((rubric) => [rubric.id, rubric]),
    )
    const evidenceById = new Map(
      evidenceData.evidence.map((evidence) => [evidence.id, evidence]),
    )
    const assessmentIds = new Set<string>()

    for (const assessment of assessments) {
      assert.equal(assessmentIds.has(assessment.id), false)
      assessmentIds.add(assessment.id)
      assert.equal(assessment.fieldId, field.id)
      assert.equal(assessment.rubricVersion, rubrics.version)
      assert.equal(assessment.assessedAt, '2026-07-22')
      assert.equal(assessment.reviewStatus, 'awaiting-author-review')
      assert.equal(rubricById.get(assessment.componentId)?.metricId, assessment.metricId)
      assert.ok(assessment.rationale.length > 50)

      if (assessment.score === null) {
        assert.equal(assessment.status, 'pending')
        assert.equal(assessment.confidence, null)
      } else {
        assert.ok(Number.isInteger(assessment.score))
        assert.ok(assessment.score >= 0 && assessment.score <= 4)
        assert.equal(assessment.status, 'provisional')
        assert.ok(['low', 'moderate', 'high'].includes(assessment.confidence as string))
        assert.ok(assessment.supportingEvidenceIds.length > 0)
        assert.ok(assessment.counterEvidenceIds.length > 0)
      }

      const jurisdictionSet = new Set(
        assessment.jurisdictionEvidence.map((cell) => cell.jurisdiction),
      )
      assert.deepEqual(jurisdictionSet, new Set(selectedJurisdictions))

      const referencedEvidenceIds = new Set([
        ...assessment.supportingEvidenceIds,
        ...assessment.counterEvidenceIds,
        ...assessment.jurisdictionEvidence.flatMap((cell) => [
          ...cell.supportingEvidenceIds,
          ...cell.counterEvidenceIds,
        ]),
      ])
      for (const evidenceId of referencedEvidenceIds) {
        const evidence = evidenceById.get(evidenceId)
        assert.ok(evidence, `Missing evidence ${evidenceId}`)
        assert.ok(evidence.relevantComponentIds.includes(assessment.componentId))
      }
    }
  })

  it('derives provisional values without making them public', () => {
    assert.deepEqual(deriveAssessment(field, assessments), {
      knowledgeConcentrationInternal: null,
      publicAuthorityInternal: 50,
      knowledgeConcentration: null,
      publicAuthority: null,
      gap: null,
      governanceSignificanceInternal: null,
      governanceSignificanceTier: null,
      governanceSignificanceRadius: null,
    })
  })

  it('keeps governance significance tier-only and free of a synthetic total', () => {
    assert.equal(field.governanceSignificance.publicDisplay, 'tier-only')
    assert.equal(
      calculateWeightedScore(field.governanceSignificance.components),
      null,
    )
    assert.ok(
      field.governanceSignificance.components.every(
        (component) => component.score === null,
      ),
    )
    assert.equal(Object.hasOwn(field.governanceSignificance, 'score'), false)
    assert.equal(Object.hasOwn(field.governanceSignificance, 'tier'), false)
    assert.doesNotMatch(JSON.stringify(field.governanceSignificance), /96/)
  })

  it('resolves organization and instrument references without universities', () => {
    const organizationIds = new Set(
      organizationsData.organizations.map((organization) => organization.id),
    )
    const instrumentIds = new Set(
      instrumentsData.instruments.map((instrument) => instrument.id),
    )
    const sourceIds = new Set(sourcesData.sources.map((source) => source.id))

    assert.ok(field.organizationIds.every((id) => organizationIds.has(id)))
    assert.ok(field.instrumentIds.every((id) => instrumentIds.has(id)))
    for (const organization of organizationsData.organizations) {
      assert.ok(organization.sourceIds.every((id) => sourceIds.has(id)))
    }
    for (const instrument of instrumentsData.instruments) {
      assert.ok(
        instrument.issuerOrganizationIds.every((id) => organizationIds.has(id)),
      )
      assert.ok(instrument.sourceIds.every((id) => sourceIds.has(id)))
    }

    assert.equal(
      organizationsData.organizations.some(
        (organization) =>
          organization.id.toLowerCase().includes('universit') ||
          organization.label.toLowerCase().includes('universit'),
      ),
      false,
    )
    assert.equal(
      field.organizationIds.some((id) => id.toLowerCase().includes('universit')),
      false,
    )
  })
})
