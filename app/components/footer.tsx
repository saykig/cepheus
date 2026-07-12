'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  if (pathname === '/') return null

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
              Essays on power, technology, and policy.
            </p>
          </div>
        </div>

        <nav className="colophon-nav" aria-label="Footer">
          <Link href="/">Home</Link>
          <button type="button" onClick={toTop}>
            Back to top
          </button>
        </nav>
      </div>

      <p className="colophon-note">
        The instruments in this essay are illustrative. Omoikane is a proposed
        platform; the figures are synthetic and drawn from the cited sources to
        show how such a map might read.
      </p>
    </footer>
  )
}
