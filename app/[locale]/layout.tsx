import '../global.css'
import type { Metadata } from 'next'
import { IM_Fell_English, Libre_Baskerville } from 'next/font/google'
import { notFound } from 'next/navigation'
import { Navbar } from '../components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from '../components/footer'
import { baseUrl } from '../sitemap'
import { isLocale, locales, selectableLocales } from '../lib/i18n'

const display = IM_Fell_English({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
})

const text = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-text',
})

const sharedMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Cepheus',
    template: '%s | Cepheus',
  },
  description: 'Bridging the gap between policy and technology.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicons/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicons/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      {
        url: '/favicons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  openGraph: {
    title: 'Cepheus',
    description: 'Bridging the gap between policy and technology.',
    url: baseUrl,
    siteName: 'Cepheus',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isDraft = locale !== 'en'
  return {
    ...sharedMetadata,
    robots: isDraft
      ? { index: false, follow: false }
      : sharedMetadata.robots,
  }
}

const cx = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  return <LocalizedDocument params={params}>{children}</LocalizedDocument>
}

async function LocalizedDocument({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <html
      lang={locale}
      data-theme="light"
      className={cx(
        display.variable,
        text.variable
      )}
    >
      <body>
        <main>
          <Navbar locale={locale} localeOptions={selectableLocales} />
          {children}
          <Footer locale={locale} />
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
