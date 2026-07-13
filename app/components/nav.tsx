'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const THEME_KEY = 'cepheus-theme'

export function Navbar() {
  const pathname = usePathname()
  const showHome = pathname !== '/'
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const syncTheme = () => {
      setTheme(
        document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
      )
    }
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_KEY) return
      const nextTheme: Theme = event.newValue === 'dark' ? 'dark' : 'light'
      document.documentElement.dataset.theme = nextTheme
      setTheme(nextTheme)
    }

    syncTheme()
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const toggleTheme = () => {
    const nextTheme: Theme =
      document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = nextTheme
    try {
      window.localStorage.setItem(THEME_KEY, nextTheme)
    } catch {
      // The theme still applies for this page when storage is unavailable.
    }
    setTheme(nextTheme)
  }

  const darkMode = theme === 'dark'
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
