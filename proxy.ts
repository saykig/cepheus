import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, isLocale, localeCookie } from './app/lib/i18n'

const canonicalEssayPath = '/essays/what-we-owe-to-each-other'
const retiredEssayPath = '/essays/the-cepheus-link'

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const firstSegment = pathname.split('/')[1]
  const legacyEssayPath = process.env.LEGACY_ESSAY_PATH

  if (legacyEssayPath && pathname === legacyEssayPath) {
    return NextResponse.redirect(
      new URL(`${canonicalEssayPath}${search}`, request.url),
      308,
    )
  }

  if (pathname === retiredEssayPath) {
    return NextResponse.redirect(
      new URL(`${canonicalEssayPath}${search}`, request.url),
      308,
    )
  }

  if (
    firstSegment &&
    isLocale(firstSegment) &&
    pathname === `/${firstSegment}${retiredEssayPath}`
  ) {
    return NextResponse.redirect(
      new URL(`/${firstSegment}${canonicalEssayPath}${search}`, request.url),
      308,
    )
  }

  if (firstSegment && isLocale(firstSegment)) {
    const response = NextResponse.next()
    response.cookies.set(localeCookie, firstSegment, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    })
    return response
  }

  const preferred = request.cookies.get(localeCookie)?.value
  if (preferred && isLocale(preferred) && preferred !== defaultLocale) {
    return NextResponse.redirect(
      new URL(`/${preferred}${pathname}${search}`, request.url),
    )
  }

  const rewrite = request.nextUrl.clone()
  rewrite.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.rewrite(rewrite)
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|favicon.ico|robots.txt|sitemap.xml|rss.xml|og|.*\\..*).*)',
  ],
}
