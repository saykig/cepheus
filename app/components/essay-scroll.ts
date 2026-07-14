const FOOTNOTE_HASH_PREFIX = 'footnote-ref-'

function cssPixels(name: string, fallback: number) {
  const value = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(name),
  )
  return Number.isFinite(value) ? value : fallback
}

export function getEssayTargetOffset(id: string) {
  if (!id.startsWith(FOOTNOTE_HASH_PREFIX)) {
    return window.innerWidth <= 780 ? 76 : 104
  }

  const header = document.querySelector<HTMLElement>('.site-header')
  const headerBottom = header?.getBoundingClientRect().bottom ?? 0
  const context = cssPixels(
    '--footnote-return-context',
    window.innerWidth <= 560 ? 198 : 118,
  )

  return headerBottom + context
}

export function scrollToEssayTarget(id: string, updateHistory = false) {
  const target = document.getElementById(id)
  if (!target) return false

  if (updateHistory) {
    window.history.pushState(null, '', `#${id}`)
  }

  target.focus({ preventScroll: true })

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  const smooth =
    getComputedStyle(document.documentElement).scrollBehavior === 'smooth'

  window.scrollTo({
    top:
      window.scrollY +
      target.getBoundingClientRect().top -
      getEssayTargetOffset(id),
    behavior: !reducedMotion && smooth ? 'smooth' : 'auto',
  })

  return true
}
