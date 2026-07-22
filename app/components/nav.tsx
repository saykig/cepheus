'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  defaultLocale,
  localeCookie,
  localeNames,
  localizeHref,
  stripLocale,
  type Locale,
} from 'app/lib/i18n'
import { siteCopy } from 'app/lib/site-copy'

export function Navbar({
  locale,
  localeOptions,
}: {
  locale: Locale
  localeOptions: readonly Locale[]
}) {
  const pathname = usePathname()
  const unprefixedPath = stripLocale(pathname)
  const showHome = unprefixedPath !== '/'
  const [darkMode, setDarkMode] = useState(false)
  const copy = siteCopy[locale]

  const toggleTheme = () => {
    const nextDarkMode = !darkMode
    document.documentElement.dataset.theme = nextDarkMode ? 'dark' : 'light'
    setDarkMode(nextDarkMode)
  }

  const themeLabel = darkMode ? copy.light : copy.dark

  const changeLocale = (nextLocale: Locale) => {
    document.cookie = `${localeCookie}=${nextLocale}; max-age=31536000; path=/; samesite=lax`
    const nextPath =
      nextLocale === defaultLocale
        ? unprefixedPath
        : localizeHref(unprefixedPath, nextLocale)
    window.location.assign(`${nextPath}${window.location.search}${window.location.hash}`)
  }

  return (
    <header className={showHome ? 'site-header has-home' : 'site-header'}>
      {showHome ? (
        <Link href={localizeHref('/', locale)} className="home-mark" aria-label={`Cepheus ${copy.home}`}>
          cepheus
        </Link>
      ) : null}
      <div className="header-actions">
        <nav className="essay-nav" aria-label={copy.essays}>
          <button className="essay-trigger" type="button">
            {copy.essays}
          </button>
          <div className="essay-menu">
            <Link href={localizeHref('/essays/what-we-owe-to-each-other', locale)}>
              {copy.essayMenuTitle}
            </Link>
          </div>
        </nav>
        {localeOptions.length > 1 ? (
          <label className="language-picker">
            <span className="visually-hidden">{copy.language}</span>
            <select
              aria-label={copy.language}
              value={locale}
              onChange={(event) => changeLocale(event.target.value as Locale)}
            >
              {localeOptions.map((option) => (
                <option key={option} value={option}>
                  {localeNames[option]}
                </option>
              ))}
            </select>
          </label>
        ) : null}
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
