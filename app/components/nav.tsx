'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname()
  const showHome = pathname !== '/'

  return (
    <header className={showHome ? 'site-header has-home' : 'site-header'}>
      {showHome ? (
        <Link href="/" className="home-mark" aria-label="Cepheus home">
          cepheus
        </Link>
      ) : null}
      <nav className="essay-nav" aria-label="Essays">
        <button className="essay-trigger" type="button">
          essays
        </button>
        <div className="essay-menu">
          <Link href="/essays/the-omoikane-link">The Omoikane Link</Link>
        </div>
      </nav>
    </header>
  )
}
