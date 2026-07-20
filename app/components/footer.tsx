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
          <svg
            className="colophon-sigil"
            width="30"
            height="22"
            viewBox="0 0 30 22"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 15C7 6 12 6 15 11s8 5 12-4"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.7"
            />
            <circle cx="3" cy="15" r="2" fill="currentColor" />
            <circle cx="15" cy="11" r="2.4" fill="currentColor" />
            <circle cx="27" cy="7" r="2" fill="currentColor" />
          </svg>
          <div>
            <div className="colophon-word">Cepheus</div>
            <p className="colophon-tagline">
              {copy.tagline}
            </p>
          </div>
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
