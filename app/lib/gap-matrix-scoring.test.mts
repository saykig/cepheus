import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  calculateGap,
  calculateWeightedScore,
  radiusForSignificanceTier,
  significanceTierFor,
  type WeightedComponent,
} from './gap-matrix-scoring.ts'

const componentsWithScore = (score: number | null): WeightedComponent[] =>
  Array.from({ length: 5 }, (_, index) => ({
    id: `component-${index + 1}`,
    weight: 0.2,
    score,
  }))

describe('calculateWeightedScore', () => {
  it('returns 0 when every component is scored 0', () => {
    assert.equal(calculateWeightedScore(componentsWithScore(0)), 0)
  })

  it('returns 100 when every component is scored 4', () => {
    assert.equal(calculateWeightedScore(componentsWithScore(4)), 100)
  })

  it('returns null when any component is incomplete', () => {
    const components = componentsWithScore(2)
    components[2].score = null
    assert.equal(calculateWeightedScore(components), null)
  })

  for (const score of [-1, 1.5, 5, Number.NaN, Number.POSITIVE_INFINITY]) {
    it(`rejects invalid score ${score}`, () => {
      const components = componentsWithScore(2)
      components[0].score = score
      assert.throws(() => calculateWeightedScore(components), RangeError)
    })
  }

  it('rejects weights that do not add to 1', () => {
    const components = componentsWithScore(2)
    components[0].weight = 0.1
    assert.throws(() => calculateWeightedScore(components), RangeError)
  })

  it('validates bad weights even when a score is pending', () => {
    const components = componentsWithScore(null)
    components[0].weight = -0.2
    assert.throws(() => calculateWeightedScore(components), RangeError)
  })
})

describe('calculateGap', () => {
  it('subtracts public authority from knowledge concentration', () => {
    assert.equal(calculateGap(82, 48), 34)
    assert.equal(calculateGap(40, 65), -25)
  })

  it('returns null if either axis is pending', () => {
    assert.equal(calculateGap(null, 48), null)
    assert.equal(calculateGap(82, null), null)
  })
})

describe('governance significance tiers', () => {
  const boundaries = [
    [0, 'low'],
    [24, 'low'],
    [25, 'moderate'],
    [49, 'moderate'],
    [50, 'high'],
    [74, 'high'],
    [75, 'very high'],
    [100, 'very high'],
  ] as const

  for (const [score, tier] of boundaries) {
    it(`maps ${score} to ${tier}`, () => {
      assert.equal(significanceTierFor(score), tier)
    })
  }

  it('returns no tier or radius for a pending score', () => {
    assert.equal(significanceTierFor(null), null)
    assert.equal(radiusForSignificanceTier(null), null)
  })

  it('uses a progressively larger fixed radius for each tier', () => {
    const radii = (['low', 'moderate', 'high', 'very high'] as const).map(
      radiusForSignificanceTier,
    )
    assert.ok((radii[0] as number) < (radii[1] as number))
    assert.ok((radii[1] as number) < (radii[2] as number))
    assert.ok((radii[2] as number) < (radii[3] as number))
  })
})
