import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import './globals.css'
import Providers from '@/providers/QueryProvider'

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'API Forge — REST Client',
  description: 'A clean, fast API testing tool built with Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistMono.variable} bg-zinc-950 text-zinc-100 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
