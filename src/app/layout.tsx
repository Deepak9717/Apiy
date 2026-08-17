import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import './globals.css'
import ThemeBody from '@/components/layout/ThemeBody'
import Providers from '@/providers/QueryProvider'
import AuthProvider from '@/providers/AuthProvider'
import TopNav from '@/components/layout/TopNav'

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'APIY - API Testing Tool',
  description: 'A clean, fast API testing tool — REST + GraphQL',
}

// Runs synchronously before first paint (blocking <head> script) so the
// correct theme class is on <html> immediately — avoids a light/dark flash
// on every hard refresh, login/logout redirect, or first load.
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('ui-store');
    var theme = 'dark';
    if (stored) {
      var parsed = JSON.parse(stored);
      theme = (parsed && parsed.state && parsed.state.theme) || 'dark';
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <AuthProvider>
        <ThemeBody fontVariable={geistMono.variable}>
          <Providers>
            <div className="flex flex-col h-screen overflow-hidden">
              <TopNav />
              <main className="flex flex-1 overflow-hidden">
                {children}
              </main>
            </div>
          </Providers>
        </ThemeBody>
      </AuthProvider>
    </html>
  )
}
