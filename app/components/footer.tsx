'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { localizeHref, stripLocale, type Locale } from 'app/lib/i18n'
import { siteCopy } from 'app/lib/site-copy'

export default function Footer({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const copy = siteCopy[locale]
  if (stripLocale(pathname) === '/') return null

  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="colophon">
      <div className="colophon-inner">
        <div className="colophon-mark">
          <img
            className="colophon-brand-image"
            src="/brand/cepheus-footer-lockup.png"
            alt="Cepheus: Mapping the Gap. Aligning Our Future."
            width="1496"
            height="505"
          />
        </div>

        <nav className="colophon-nav" aria-label={copy.footer}>
          <Link href={localizeHref('/', locale)}>{copy.home}</Link>
          <button type="button" onClick={toTop}>
            {copy.backToTop}
          </button>
        </nav>
      </div>

      <p className="colophon-note">
        {copy.disclaimer}
      </p>
    </footer>
  )
}
