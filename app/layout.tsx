import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mr. Giobot, o piloto automático do barbeiro',
  description: 'Mr. Giobot - Por Giovani Amorim',
  generator: 'MR. GIOBOT',
  icons: {
    icon: '/icon3.png',
    shortcut: '/icon3.png',
    apple: '/icon3.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
