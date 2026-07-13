'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const showHome = pathname !== '/'
  const [darkMode, setDarkMode] = useState(false)

  const toggleTheme = () => {
    const nextDarkMode = !darkMode
    document.documentElement.dataset.theme = nextDarkMode ? 'dark' : 'light'
    setDarkMode(nextDarkMode)
  }

  const themeLabel = darkMode ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <header className={showHome ? 'site-header has-home' : 'site-header'}>
      {showHome ? (
        <Link href="/" className="home-mark" aria-label="Cepheus home">
          cepheus
        </Link>
      ) : null}
      <div className="header-actions">
        <nav className="essay-nav" aria-label="Essays">
          <button className="essay-trigger" type="button">
            essays
          </button>
          <div className="essay-menu">
            <Link href="/essays/the-omoikane-link">The Omoikane Link</Link>
          </div>
        </nav>
        <button
          type="button"
          className="theme-toggle"
          role="switch"
          aria-checked={darkMode}
          aria-label={themeLabel}
          title={themeLabel}
          onClick={toggleTheme}
        >
          <span className="visually-hidden">{themeLabel}</span>
        </button>
      </div>
    </header>
  )
}
