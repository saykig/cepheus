import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import fieldData from '../../public/data/gap-matrix/fields.json' with { type: 'json' }
import instrumentsData from '../../public/data/gap-matrix/instruments.json' with { type: 'json' }
import organizationsData from '../../public/data/gap-matrix/organizations.json' with { type: 'json' }
import sourcesData from '../../public/data/gap-matrix/sources.json' with { type: 'json' }
import {
  calculateWeightedScore,
  deriveAssessment,
  type GovernanceField,
} from './gap-matrix-scoring.ts'

const field = fieldData as GovernanceField

describe('Frontier AI governance data integrity', () => {
  it('keeps every component pending without a stored derived total', () => {
    const components = [
      ...field.metrics.knowledgeConcentration.components,
      ...field.metrics.publicAuthority.components,
      ...field.governanceSignificance.components,
    ]

    assert.ok(components.every((component) => component.score === null))
    assert.equal(Object.hasOwn(field, 'derived'), false)
    assert.equal(Object.hasOwn(field.metrics.knowledgeConcentration, 'score'), false)
    assert.equal(Object.hasOwn(field.metrics.publicAuthority, 'score'), false)
    assert.equal(Object.hasOwn(field.governanceSignificance, 'score'), false)
    assert.deepEqual(deriveAssessment(field), {
      knowledgeConcentration: null,
      publicAuthority: null,
      gap: null,
      governanceSignificanceInternal: null,
      governanceSignificanceTier: null,
      governanceSignificanceRadius: null,
    })
  })

  it('uses valid component weights for every metric', () => {
    assert.equal(
      calculateWeightedScore(field.metrics.knowledgeConcentration.components),
      null,
    )
    assert.equal(
      calculateWeightedScore(field.metrics.publicAuthority.components),
      null,
    )
    assert.equal(
      calculateWeightedScore(field.governanceSignificance.components),
      null,
    )
  })

  it('resolves every organization, instrument, and source reference', () => {
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
  })

  it('contains no university organization or organization reference', () => {
    assert.equal(
      field.organizationIds.some((id) => id.includes('universit')),
      false,
    )
    assert.equal(
      organizationsData.organizations.some(
        (organization) =>
          organization.id.includes('universit') ||
          organization.label.toLowerCase().includes('universit'),
      ),
      false,
    )
  })
})
