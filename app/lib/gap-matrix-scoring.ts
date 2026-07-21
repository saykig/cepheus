export type Confidence = 'low' | 'medium' | 'high' | null

export type WeightedComponent = {
  id: string
  weight: number
  score: number | null
}

export type ComponentScore = WeightedComponent & {
  rationale: string | null
  sourceIds: string[]
  assessedAt: string | null
  confidence: Confidence
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
    asOf: string
    methodologyVersion: string
    geographicScope: string[]
    scopeNote: string
  }
  definition: string
  scope: {
    included: string[]
    excluded: string[]
  }
  scoringRubric: Record<'0' | '1' | '2' | '3' | '4', string>
  visualMapping: {
    x: string
    y: string
    radius: string
    gap: string
  }
  metrics: {
    knowledgeConcentration: {
      label: string
      components: ComponentScore[]
    }
    publicAuthority: {
      label: string
      components: ComponentScore[]
    }
  }
  governanceSignificance: {
    publicDisplay: 'tier-only'
    components: WeightedComponent[]
  }
  organizationIds: string[]
  instrumentIds: string[]
}

export type DerivedAssessment = {
  knowledgeConcentration: number | null
  publicAuthority: number | null
  gap: number | null
  governanceSignificanceInternal: number | null
  governanceSignificanceTier: GovernanceSignificanceTier | null
  governanceSignificanceRadius: number | null
}

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

export function validateWeights(components: readonly WeightedComponent[]) {
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

export function significanceTierFor(
  score: number | null,
): GovernanceSignificanceTier | null {
  if (score === null) return null
  if (!Number.isInteger(score) || score < 0 || score > 100) {
    throw new RangeError('Governance significance must be an integer from 0 to 100 or null.')
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

export function deriveAssessment(field: GovernanceField): DerivedAssessment {
  const knowledgeConcentration = calculateWeightedScore(
    field.metrics.knowledgeConcentration.components,
  )
  const publicAuthority = calculateWeightedScore(
    field.metrics.publicAuthority.components,
  )
  const governanceSignificanceInternal = calculateWeightedScore(
    field.governanceSignificance.components,
  )
  const governanceSignificanceTier = significanceTierFor(
    governanceSignificanceInternal,
  )

  return {
    knowledgeConcentration,
    publicAuthority,
    gap: calculateGap(knowledgeConcentration, publicAuthority),
    governanceSignificanceInternal,
    governanceSignificanceTier,
    governanceSignificanceRadius: radiusForSignificanceTier(
      governanceSignificanceTier,
    ),
  }
}
