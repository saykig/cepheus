import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// Regenerate the illustrative instrument data:  node scripts/gen-data.mjs
// Deterministic output (seeded), so re-running never churns committed JSON.
const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'data')

// Deterministic PRNG so regenerating never churns the committed data.
function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const round = (n, d = 1) => Number(n.toFixed(d))

// ---------------------------------------------------------------- categories
const categories = [
  { id: 'ai', label: 'AI', series: 1 },
  { id: 'security', label: 'Security', series: 2 },
  { id: 'infrastructure', label: 'Infrastructure', series: 3 },
  { id: 'resources', label: 'Resources', series: 4 },
  { id: 'bio', label: 'Health', series: 5 },
  { id: 'institutions', label: 'Institutions', series: 6 },
]

const defaultWeights = { momentum: 0.35, novelty: 0.25, policySalience: 0.25, bridgeImportance: 0.15 }
const weightLabels = [
  { key: 'momentum', label: 'Momentum' },
  { key: 'novelty', label: 'Novelty' },
  { key: 'policySalience', label: 'Policy Salience' },
  { key: 'bridgeImportance', label: 'Bridge Importance' },
]

// subscores: [momentum, novelty, policySalience, bridgeImportance]
// gap: [technicalActivity, policyAttention]
const topics = [
  { id: 'ai-governance', label: 'AI Governance', category: 'ai', sub: [88, 72, 95, 90], sources: [3, 4, 5, 6], gap: [84, 74],
    insight: 'Rules, standards, and institutions are forming quickly, and policy attention roughly tracks technical progress.' },
  { id: 'compute-governance', label: 'Compute Governance', category: 'infrastructure', sub: [76, 82, 60, 80], sources: [7], gap: [79, 41],
    insight: 'Concentrated computing capacity is advancing faster than the governance frameworks built around it.' },
  { id: 'military-ai', label: 'Military AI', category: 'security', sub: [80, 78, 54, 82], sources: [9], gap: [82, 28],
    insight: 'Rapid technical advancement in military AI is outpacing policy development and public institutional focus.' },
  { id: 'cybersecurity', label: 'Cybersecurity', category: 'security', sub: [74, 55, 82, 78], sources: [5], gap: [77, 72],
    insight: 'A mature field where technical practice and policy attention are relatively well aligned.' },
  { id: 'semiconductor-policy', label: 'Semiconductor Policy', category: 'infrastructure', sub: [70, 60, 80, 72], sources: [7], gap: [88, 68],
    insight: 'Industrial strategy has begun to catch up with a concentrated, strategically vital technical frontier.' },
  { id: 'defence-innovation', label: 'Defence Innovation', category: 'institutions', sub: [68, 70, 58, 78], sources: [9], gap: [71, 52],
    insight: 'Institutions increasingly exist to connect emerging technology with collective security needs.' },
  { id: 'arctic-security', label: 'Arctic Security', category: 'infrastructure', sub: [66, 68, 58, 74], sources: [8], gap: [61, 47],
    insight: 'A widening field where security, climate, and infrastructure meet, still read by many as regional.' },
  { id: 'undersea-infrastructure', label: 'Undersea Infrastructure', category: 'infrastructure', sub: [64, 74, 48, 76], sources: [8], gap: [67, 33],
    insight: 'Strategic importance is easy to miss until a disruption makes the dependency visible.' },
  { id: 'export-controls', label: 'Export Controls', category: 'security', sub: [62, 52, 76, 70], sources: [7], gap: [58, 74],
    insight: 'A policy lever moving ahead of shared technical understanding of its second-order effects.' },
  { id: 'biosecurity', label: 'Biosecurity', category: 'bio', sub: [58, 64, 66, 60], sources: [1], gap: [63, 55],
    insight: 'Convergent life-science and security concerns are drawing attention across separate communities.' },
  { id: 'critical-minerals', label: 'Critical Minerals', category: 'resources', sub: [60, 50, 62, 66], sources: [8], gap: [55, 49],
    insight: 'Supply concentration ties resource policy to security and industrial strategy at once.' },
  { id: 'space-security', label: 'Space Security', category: 'resources', sub: [54, 66, 46, 58], sources: [1], gap: [60, 38],
    insight: 'Capabilities are expanding faster than the norms and institutions meant to govern them.' },
]

const subKeys = ['momentum', 'novelty', 'policySalience', 'bridgeImportance']
function subscoresOf(t) {
  return { momentum: t.sub[0], novelty: t.sub[1], policySalience: t.sub[2], bridgeImportance: t.sub[3] }
}
function weightedScore(sub, w) {
  return sub.momentum * w.momentum + sub.novelty * w.novelty + sub.policySalience * w.policySalience + sub.bridgeImportance * w.bridgeImportance
}

// ---------------------------------------------------------------- periods (14 quarters, 2022 Q1 .. 2025 Q2)
const periods = []
for (let y = 2022; y <= 2025; y++) {
  for (let q = 1; q <= 4; q++) {
    if (y === 2025 && q > 2) break
    periods.push(`${y} Q${q}`)
  }
}

// momentum time-series: rises toward the momentum subscore with gentle seeded texture
function seriesFor(topic, idx) {
  const rand = mulberry32(1000 + idx * 97)
  const end = topic.sub[0]
  const start = Math.max(8, end * 0.42 - 4 + rand() * 8)
  const n = periods.length
  const out = []
  let prev = start
  for (let i = 0; i < n; i++) {
    const p = i / (n - 1)
    // ease-out growth curve from start -> end
    const base = start + (end - start) * (1 - Math.pow(1 - p, 1.7))
    const wobble = (rand() - 0.5) * 6 * (1 - p * 0.5)
    let v = base + wobble
    // keep mostly monotone but allow small dips
    if (v < prev - 5) v = prev - 5
    v = Math.max(4, Math.min(100, v))
    prev = v
    out.push(round(v, 1))
  }
  out[n - 1] = end // land exactly on the subscore
  return out
}

const frontierTopics = topics.map((t, i) => ({
  id: t.id,
  label: t.label,
  category: t.category,
  subscores: subscoresOf(t),
  score: round(weightedScore(subscoresOf(t), defaultWeights), 1),
  sourceIds: t.sources,
  series: seriesFor(t, i),
}))

const frontier = {
  title: 'Frontier Score Explorer',
  description: 'Weight four signals to see which policy fields are hardening into frontiers, and watch the ranking move as priorities change.',
  scoreLabel: 'Frontier score',
  note: 'Illustrative scores, drawn from the cited sources.',
  periods,
  weightLabels,
  defaultWeights,
  categories,
  topics: frontierTopics,
}
writeFileSync(`${DATA_DIR}/frontier-topics.json`, JSON.stringify(frontier, null, 2) + '\n')

// ---------------------------------------------------------------- gap map (scatter)
const scoreById = Object.fromEntries(frontierTopics.map((t) => [t.id, t.score]))
function quadrant(x, y) {
  const hi = 'High', lo = 'Low'
  return `${y >= 50 ? hi : lo} Attention, ${x >= 50 ? hi : lo} Activity`
}
const gap = {
  title: 'Gap Map Matrix',
  description: 'Each field placed by how much technical activity it draws against how much policy attention it holds. Distance from the diagonal is the gap.',
  note: 'Circle size = frontier score. Illustrative, drawn from the cited sources.',
  axes: {
    x: { label: 'Technical Activity', low: 'Low', high: 'High' },
    y: { label: 'Policy Attention', low: 'Low', high: 'High' },
  },
  categories,
  topics: topics.map((t) => ({
    id: t.id,
    label: t.label,
    category: t.category,
    technicalActivity: t.gap[0],
    policyAttention: t.gap[1],
    frontierScore: scoreById[t.id],
    quadrant: quadrant(t.gap[0], t.gap[1]),
    insight: t.insight,
    sourceIds: t.sources,
  })),
}
writeFileSync(`${DATA_DIR}/gap-map.json`, JSON.stringify(gap, null, 2) + '\n')

// ---------------------------------------------------------------- constellation network
// hand-placed layout on a 100x100 field; AI governance central.
const nodeDefs = [
  { id: 'ai-governance', label: 'AI Governance', kind: 'topic', category: 'ai', x: 50, y: 49,
    description: 'A policy field where model capability, risk management, legal accountability, and international rule-making meet.', sources: [3, 4, 5, 6] },
  { id: 'compute-governance', label: 'Compute Governance', kind: 'topic', category: 'infrastructure', x: 25, y: 34,
    description: 'The governance questions created by concentrated computing capacity, advanced chips, and cloud infrastructure.', sources: [7] },
  { id: 'cybersecurity', label: 'Cybersecurity', kind: 'topic', category: 'security', x: 73, y: 29,
    description: 'A security field increasingly linked to model misuse, critical infrastructure, and strategic competition.', sources: [5] },
  { id: 'military-ai', label: 'Military AI', kind: 'topic', category: 'security', x: 79, y: 58,
    description: 'The point where autonomy, deterrence, procurement, legal debate, and technical capability converge.', sources: [9] },
  { id: 'semiconductor-policy', label: 'Semiconductor Policy', kind: 'topic', category: 'infrastructure', x: 37, y: 76,
    description: 'Manufacturing capacity, supply chains, workforce, and national competitiveness becoming one policy system.', sources: [7] },
  { id: 'export-controls', label: 'Export Controls', kind: 'topic', category: 'security', x: 15, y: 55,
    description: 'A policy lever that links strategic technology, trade, security, and access to advanced hardware.', sources: [7] },
  { id: 'arctic-security', label: 'Arctic Security', kind: 'topic', category: 'infrastructure', x: 56, y: 85,
    description: 'Climate, maritime security, critical minerals, and undersea infrastructure widening into one field.', sources: [8] },
  { id: 'undersea-infrastructure', label: 'Undersea Infrastructure', kind: 'topic', category: 'infrastructure', x: 88, y: 75,
    description: 'Cables and pipelines whose strategic importance surfaces mainly when a disruption makes them visible.', sources: [8] },
  { id: 'nist', label: 'NIST', kind: 'institution', category: 'institutions', x: 49, y: 15,
    description: 'A standards body turning technical language into frameworks that later shape regulation.', sources: [5, 7] },
  { id: 'oecd', label: 'OECD', kind: 'institution', category: 'institutions', x: 12, y: 74,
    description: 'An international organization convening actors around mission-oriented, cross-sector problems.', sources: [2, 4] },
  { id: 'eu-commission', label: 'EU Commission', kind: 'institution', category: 'institutions', x: 69, y: 13,
    description: 'A regulator whose risk-based AI framework sets a reference point for other jurisdictions.', sources: [6] },
  { id: 'nato-diana', label: 'NATO DIANA', kind: 'institution', category: 'institutions', x: 94, y: 46,
    description: 'An accelerator connecting emerging and disruptive technology with collective defence needs.', sources: [9] },
  { id: 'standards', label: 'Standards Bodies', kind: 'institution', category: 'institutions', x: 38, y: 93,
    description: 'Organizations that make technical practice interoperable and durable enough to influence policy.', sources: [4, 5] },
]

// edges: kind 'bilateral' (influence/overlap) or 'funding' (programs/support)
const edgeDefs = [
  ['ai-governance', 'nist', 'bilateral', 0.82, 'Standards work translates broad governance aims into durable technical practice.', [4, 5]],
  ['ai-governance', 'oecd', 'bilateral', 0.76, 'Shared principles spread a common governance vocabulary across countries.', [2, 4]],
  ['ai-governance', 'compute-governance', 'bilateral', 0.71, 'Model governance depends on where computing capacity is built and controlled.', [3, 7]],
  ['ai-governance', 'cybersecurity', 'bilateral', 0.69, 'Security risks shape how AI systems are evaluated, deployed, and governed.', [5]],
  ['ai-governance', 'eu-commission', 'bilateral', 0.73, 'A risk-based legal framework anchors much of the governance conversation.', [6]],
  ['ai-governance', 'military-ai', 'bilateral', 0.64, 'Civilian governance and defence applications share technical and legal questions.', [6, 9]],
  ['ai-governance', 'standards', 'bilateral', 0.66, 'Standards give governance aims a more durable technical and organizational form.', [4, 5]],
  ['ai-governance', 'export-controls', 'bilateral', 0.58, 'Access to advanced hardware ties governance to trade and security policy.', [7]],
  ['compute-governance', 'semiconductor-policy', 'bilateral', 0.74, 'Computing capacity and chip manufacturing form one strategic supply question.', [7]],
  ['compute-governance', 'export-controls', 'bilateral', 0.6, 'Infrastructure is already shaped by policy on strategic technology flows.', [7]],
  ['semiconductor-policy', 'export-controls', 'bilateral', 0.63, 'Chip strategy and export policy pull on the same supply chains.', [7]],
  ['semiconductor-policy', 'nist', 'funding', 0.61, 'Public programs link manufacturing with research, workforce, and resilience.', [7]],
  ['military-ai', 'nato-diana', 'funding', 0.7, 'Defence accelerators fund the bridge from emerging technology to capability.', [9]],
  ['military-ai', 'export-controls', 'bilateral', 0.55, 'Strategic competition connects defence applications to hardware access.', [7, 9]],
  ['cybersecurity', 'nist', 'funding', 0.68, 'Risk frameworks give organizations practical footing for managing threats.', [5]],
  ['cybersecurity', 'standards', 'bilateral', 0.5, 'Interoperable practice hardens security expectations into norms.', [5]],
  ['arctic-security', 'nato-diana', 'funding', 0.58, 'Northern defence priorities pull emerging technology toward the region.', [8, 9]],
  ['arctic-security', 'undersea-infrastructure', 'bilateral', 0.72, 'Security in the North increasingly means protecting undersea systems.', [8]],
  ['undersea-infrastructure', 'nato-diana', 'funding', 0.5, 'Resilience of undersea systems draws defence-innovation attention.', [8, 9]],
  ['arctic-security', 'oecd', 'bilateral', 0.4, 'Cross-sector convening frames the Arctic as more than a regional issue.', [2, 8]],
  ['oecd', 'standards', 'bilateral', 0.48, 'International principles and standards reinforce one another.', [2, 4]],
  ['eu-commission', 'standards', 'bilateral', 0.52, 'Regulation leans on standards to become operational.', [4, 6]],
]

// degree + weight sizing
const degree = Object.fromEntries(nodeDefs.map((n) => [n.id, 0]))
const strengthSum = Object.fromEntries(nodeDefs.map((n) => [n.id, 0]))
const neighbors = Object.fromEntries(nodeDefs.map((n) => [n.id, new Set()]))
for (const [s, t, , st] of edgeDefs) {
  degree[s]++; degree[t]++
  strengthSum[s] += st; strengthSum[t] += st
  neighbors[s].add(t); neighbors[t].add(s)
}
// two-hop reach (unique nodes within 2 hops, excluding self)
function reach2(id) {
  const one = neighbors[id]
  const set = new Set(one)
  for (const n of one) for (const m of neighbors[n]) if (m !== id) set.add(m)
  return set.size
}
const maxDeg = Math.max(...Object.values(degree))
const nodes = nodeDefs.map((n) => {
  const d = degree[n.id]
  const size = round(5.4 + (d / maxDeg) * 6.6, 2) // radius in viewBox units
  return {
    id: n.id, label: n.label, kind: n.kind, category: n.category,
    x: n.x, y: n.y, size,
    connections: d,
    reach: reach2(n.id),
    avgStrength: round(d ? strengthSum[n.id] / d : 0, 2),
    description: n.description,
    sourceIds: n.sources,
  }
})
const edges = edgeDefs.map(([source, target, kind, strength, explanation, sourceIds]) => ({ source, target, kind, strength, explanation, sourceIds }))

const network = {
  title: 'Policy Constellation Map',
  description: 'Fields and institutions as a single constellation. Selecting a point reveals how influence, information, and funding move through the landscape.',
  selectionLabel: 'Selected point',
  note: 'Illustrative links, drawn from the cited sources.',
  kinds: [
    { id: 'topic', label: 'Topics' },
    { id: 'institution', label: 'Institutions' },
  ],
  linkKinds: [
    { id: 'bilateral', label: 'Bilateral' },
    { id: 'funding', label: 'Funding' },
  ],
  categories,
  nodes,
  edges,
}
writeFileSync(`${DATA_DIR}/policy-network.json`, JSON.stringify(network, null, 2) + '\n')

// ---------------------------------------------------------------- report
const ranked = [...frontierTopics].sort((a, b) => b.score - a.score)
console.log('frontier topics:', frontierTopics.length, '| periods:', periods.length)
console.log('top 5 (default weights):', ranked.slice(0, 5).map((t) => `${t.label} ${t.score}`).join(', '))
console.log('network nodes:', nodes.length, '| edges:', edges.length)
console.log('gap topics:', gap.topics.length)
console.log('wrote frontier-topics.json, gap-map.json, policy-network.json')
