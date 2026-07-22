export type Confidence = 'low' | 'moderate' | 'high' | null

export type AxisMetricId = 'knowledgeConcentration' | 'publicAuthority'

export type AssessmentStatus =
  | 'pending'
  | 'provisional'
  | 'reviewed'
  | 'published'

export type ReviewStatus = 'awaiting-author-review' | 'author-reviewed'

export type EvidenceDirection =
  | 'increases-knowledge-concentration'
  | 'decreases-knowledge-concentration'
  | 'increases-public-authority'
  | 'decreases-public-authority'
  | 'contextual'

export type EvidenceStrength = 'none' | 'limited' | 'moderate' | 'strong'

export type SelectedJurisdiction =
  | 'European Union'
  | 'United States'
  | 'United Kingdom'
  | 'China'

export type WeightedComponent = {
  id: string
  weight: number
  score: number | null
}

export type ComponentDefinition = {
  id: string
  weight: number
}

export type ComponentScore = ComponentDefinition & {
  score: number | null
}

export type EvidenceRecord = {
  id: string
  sourceId: string
  claim: string
  locator: string
  jurisdictions: Array<SelectedJurisdiction | 'Global'>
  relevantComponentIds: string[]
  direction: EvidenceDirection
  evidenceType: string
  limitations: string
  observedAt: string
  accessedAt: string
}

export type JurisdictionEvidence = {
  jurisdiction: SelectedJurisdiction
  supportingEvidenceIds: string[]
  counterEvidenceIds: string[]
  summary: string
  evidenceStrength: EvidenceStrength
  limitations: string
}

export type ComponentAssessment = {
  id: string
  fieldId: string
  metricId: AxisMetricId
  componentId: string
  rubricVersion: string
  score: number | null
  status: AssessmentStatus
  rationale: string
  supportingEvidenceIds: string[]
  counterEvidenceIds: string[]
  confidence: Confidence
  assessedAt: string
  reviewStatus: ReviewStatus
  jurisdictionEvidence: JurisdictionEvidence[]
}

export type ComponentAssessmentData = {
  assessments: ComponentAssessment[]
}

export type RubricAnchors = Record<'0' | '1' | '2' | '3' | '4', string>

export type ComponentRubric = {
  id: string
  metricId: AxisMetricId
  label: string
  anchors: RubricAnchors
}

export type ScoringRubricData = {
  version: string
  fieldId: string
  evidenceCutoff: string
  geographicScope: SelectedJurisdiction[]
  aggregationRule: string
  globalEvidenceRule: string
  rubrics: ComponentRubric[]
}

export type GovernanceSignificanceTier =
  | 'low'
  | 'moderate'
  | 'high'
  | 'very high'

export type GovernanceField = {
  id: string
  label: string
  unitOfAnalysis: 'governance-field'
  assessment: {
    status: 'pending-coding' | 'complete'
    evidenceCutoff: string
    methodologyVersion: string
    geographicScope: SelectedJurisdiction[]
    scopeNote: string
  }
  definition: string
  scope: {
    included: string[]
    excluded: string[]
  }
  visualMapping: {
    x: string
    y: string
    radius: string
    gap: string
  }
  metrics: Record<
    AxisMetricId,
    {
      label: string
      components: ComponentDefinition[]
    }
  >
  governanceSignificance: {
    publicDisplay: 'tier-only'
    components: WeightedComponent[]
  }
  organizationIds: string[]
  instrumentIds: string[]
}

export type AxisDerivation = {
  internalScore: number | null
  publicScore: number | null
  publicReady: boolean
}

export type DerivedAssessment = {
  knowledgeConcentrationInternal: number | null
  publicAuthorityInternal: number | null
  knowledgeConcentration: number | null
  publicAuthority: number | null
  gap: number | null
  governanceSignificanceInternal: number | null
  governanceSignificanceTier: GovernanceSignificanceTier | null
  governanceSignificanceRadius: number | null
}

const AXIS_METRIC_IDS: AxisMetricId[] = [
  'knowledgeConcentration',
  'publicAuthority',
]

const PUBLIC_STATUSES = new Set<AssessmentStatus>(['reviewed', 'published'])
const WEIGHT_TOLERANCE = 1e-9

function validateComponentScore(component: WeightedComponent) {
  if (component.score === null) return

  if (
    !Number.isInteger(component.score) ||
    component.score < 0 ||
    component.score > 4
  ) {
    throw new RangeError(
      `Component "${component.id}" must have an integer score from 0 to 4 or null.`,
    )
  }
}

export function validateWeights(components: readonly ComponentDefinition[]) {
  if (components.length === 0) {
    throw new RangeError('At least one weighted component is required.')
  }

  for (const component of components) {
    if (!Number.isFinite(component.weight) || component.weight < 0) {
      throw new RangeError(
        `Component "${component.id}" must have a finite, non-negative weight.`,
      )
    }
  }

  const totalWeight = components.reduce(
    (total, component) => total + component.weight,
    0,
  )

  if (Math.abs(totalWeight - 1) > WEIGHT_TOLERANCE) {
    throw new RangeError(
      `Component weights must add to 1; received ${totalWeight}.`,
    )
  }
}

export function calculateWeightedScore(
  components: readonly WeightedComponent[],
): number | null {
  for (const component of components) validateComponentScore(component)
  validateWeights(components)

  if (components.some((component) => component.score === null)) return null

  const weightedScore = components.reduce(
    (total, component) =>
      total + component.weight * ((component.score as number) / 4),
    0,
  )

  return Math.round(100 * weightedScore)
}

export function calculateGap(
  knowledgeConcentration: number | null,
  publicAuthority: number | null,
): number | null {
  if (knowledgeConcentration === null || publicAuthority === null) return null
  return knowledgeConcentration - publicAuthority
}

function assessmentKey(metricId: AxisMetricId, componentId: string) {
  return `${metricId}:${componentId}`
}

function validateAssessmentScore(assessment: ComponentAssessment) {
  const weightedComponent: WeightedComponent = {
    id: assessment.componentId,
    weight: 1,
    score: assessment.score,
  }
  validateComponentScore(weightedComponent)

  if (assessment.score === null) {
    if (assessment.status !== 'pending' || assessment.confidence !== null) {
      throw new RangeError(
        `Pending component "${assessment.componentId}" must have status pending and null confidence.`,
      )
    }
    return
  }

  if (assessment.status === 'pending' || assessment.confidence === null) {
    throw new RangeError(
      `Scored component "${assessment.componentId}" must have a non-pending status and non-null confidence.`,
    )
  }
}

export function validateAssessmentSet(
  field: GovernanceField,
  assessments: readonly ComponentAssessment[],
) {
  const expectedKeys = new Set<string>()
  for (const metricId of AXIS_METRIC_IDS) {
    for (const component of field.metrics[metricId].components) {
      expectedKeys.add(assessmentKey(metricId, component.id))
    }
  }

  const seenIds = new Set<string>()
  const seenKeys = new Set<string>()
  for (const assessment of assessments) {
    if (assessment.fieldId !== field.id) {
      throw new RangeError(
        `Assessment "${assessment.id}" references unknown field "${assessment.fieldId}".`,
      )
    }

    if (!AXIS_METRIC_IDS.includes(assessment.metricId)) {
      throw new RangeError(
        `Assessment "${assessment.id}" references unknown metric "${assessment.metricId}".`,
      )
    }

    const key = assessmentKey(assessment.metricId, assessment.componentId)
    if (!expectedKeys.has(key)) {
      throw new RangeError(
        `Assessment "${assessment.id}" references unknown component "${assessment.componentId}" for ${assessment.metricId}.`,
      )
    }
    if (seenIds.has(assessment.id)) {
      throw new RangeError(`Duplicate assessment id "${assessment.id}".`)
    }
    if (seenKeys.has(key)) {
      throw new RangeError(`Duplicate assessment for "${key}".`)
    }

    validateAssessmentScore(assessment)
    seenIds.add(assessment.id)
    seenKeys.add(key)
  }

  const missingKeys = Array.from(expectedKeys).filter(
    (key) => !seenKeys.has(key),
  )
  if (missingKeys.length > 0) {
    throw new RangeError(`Missing assessments for: ${missingKeys.join(', ')}.`)
  }
}

function deriveAxisFromValidatedAssessments(
  field: GovernanceField,
  assessments: readonly ComponentAssessment[],
  metricId: AxisMetricId,
): AxisDerivation {
  const metricAssessments = new Map(
    assessments
      .filter((assessment) => assessment.metricId === metricId)
      .map((assessment) => [assessment.componentId, assessment]),
  )
  const weightedScores = field.metrics[metricId].components.map((component) => ({
    ...component,
    score: metricAssessments.get(component.id)?.score ?? null,
  }))
  const internalScore = calculateWeightedScore(weightedScores)
  const publicReady =
    internalScore !== null &&
    Array.from(metricAssessments.values()).every((assessment) =>
      PUBLIC_STATUSES.has(assessment.status),
    )

  return {
    internalScore,
    publicScore: publicReady ? internalScore : null,
    publicReady,
  }
}

export function deriveAxisAssessment(
  field: GovernanceField,
  assessments: readonly ComponentAssessment[],
  metricId: AxisMetricId,
): AxisDerivation {
  validateAssessmentSet(field, assessments)
  return deriveAxisFromValidatedAssessments(field, assessments, metricId)
}

export function significanceTierFor(
  score: number | null,
): GovernanceSignificanceTier | null {
  if (score === null) return null
  if (!Number.isInteger(score) || score < 0 || score > 100) {
    throw new RangeError(
      'Governance significance must be an integer from 0 to 100 or null.',
    )
  }
  if (score < 25) return 'low'
  if (score < 50) return 'moderate'
  if (score < 75) return 'high'
  return 'very high'
}

const legacyRadiusFor = (value: number) =>
  (2 + (Math.sqrt(value) / 10) * 3.6) * 1.16

const TIER_RADII: Record<GovernanceSignificanceTier, number> = {
  low: legacyRadiusFor(12.5),
  moderate: legacyRadiusFor(37.5),
  high: legacyRadiusFor(62.5),
  'very high': legacyRadiusFor(87.5),
}

export function radiusForSignificanceTier(
  tier: GovernanceSignificanceTier | null,
): number | null {
  return tier === null ? null : TIER_RADII[tier]
}

export function deriveAssessment(
  field: GovernanceField,
  assessments: readonly ComponentAssessment[],
): DerivedAssessment {
  validateAssessmentSet(field, assessments)
  const knowledgeConcentration = deriveAxisFromValidatedAssessments(
    field,
    assessments,
    'knowledgeConcentration',
  )
  const publicAuthority = deriveAxisFromValidatedAssessments(
    field,
    assessments,
    'publicAuthority',
  )
  const governanceSignificanceInternal = calculateWeightedScore(
    field.governanceSignificance.components,
  )
  const governanceSignificanceTier = significanceTierFor(
    governanceSignificanceInternal,
  )

  return {
    knowledgeConcentrationInternal: knowledgeConcentration.internalScore,
    publicAuthorityInternal: publicAuthority.internalScore,
    knowledgeConcentration: knowledgeConcentration.publicScore,
    publicAuthority: publicAuthority.publicScore,
    gap: calculateGap(
      knowledgeConcentration.publicScore,
      publicAuthority.publicScore,
    ),
    governanceSignificanceInternal,
    governanceSignificanceTier,
    governanceSignificanceRadius: radiusForSignificanceTier(
      governanceSignificanceTier,
    ),
  }
}
