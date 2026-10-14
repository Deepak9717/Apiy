/**
 * app/layout.tsx — Root layout
 *
 * Wraps every page with:
 * - ThemeBody: applies .dark class to <html> and handles font variable
 * - Providers: SessionProvider (NextAuth) + QueryClientProvider (React Query)
 * - TopNav + <main> shell
 *
 * The inline <script> in <head> runs BEFORE React hydrates so the
 * correct theme class is on <html> immediately — prevents a flash of
 * the wrong theme (FOIT) on hard refresh or first load.
 */
import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import './globals.css'
import ThemeBody from '@/components/layout/ThemeBody'
import Providers from '@/lib/providers'
import TopNav from '@/components/layout/TopNav'

const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'APIY - API Testing Tool',
  description: 'REST and GraphQL API client — no CORS headaches',
  icons: { icon: '/icon.svg' },
}

// Blocking script: reads theme from localStorage before first paint.
// Must be synchronous (no defer/async) so the class lands before CSS parses.
const themeScript = `(function(){try{var s=localStorage.getItem('ui-store');var t='dark';if(s){var p=JSON.parse(s);t=(p&&p.state&&p.state.theme)||'dark';}document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <Providers>
        <ThemeBody fontVariable={geistMono.variable}>
          <div className="flex flex-col h-screen overflow-hidden">
            <TopNav />
            <main className="flex flex-1 overflow-hidden">
              {children}
            </main>
          </div>
        </ThemeBody>
      </Providers>
    </html>
  )
}
