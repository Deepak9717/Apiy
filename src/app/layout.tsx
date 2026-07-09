import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import './globals.css'
import ThemeBody from '@/components/ThemeBody'
import Providers from '@/providers/QueryProvider'
import TopNav from '@/components/TopNav'

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'APIY - Simple API Testing Tool',
  description: 'A clean, fast API testing tool — REST + GraphQL',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <ThemeBody>
        <Providers>
          <div className="flex flex-col h-screen overflow-hidden">
            <TopNav />
            <main className="flex flex-1 overflow-hidden">
              {children}
            </main>
          </div>
        </Providers>
      </ThemeBody>
    </html>
  )
}
