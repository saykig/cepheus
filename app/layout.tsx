import './global.css'
import type { Metadata } from 'next'
import { IM_Fell_English, Libre_Baskerville } from 'next/font/google'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { baseUrl } from './sitemap'

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

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Cepheus',
    template: '%s | Cepheus',
  },
  description: 'Bridging the gap between policy and technology.',
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

const cx = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        display.variable,
        text.variable
      )}
    >
      <body>
        <main>
          <Navbar />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}
