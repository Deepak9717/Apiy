'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/store/useUIStore'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { FiGlobe, FiSun, FiMoon } from 'react-icons/fi'
import { SiGraphql } from 'react-icons/si'

const TABS = [
  { href: '/', label: 'REST API', icon: FiGlobe, activeColor: 'text-violet-600 dark:text-violet-400' },
  { href: '/graphql', label: 'GraphQL', icon: SiGraphql, activeColor: 'text-fuchsia-500 dark:text-fuchsia-400' },
]

export default function TopNav() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useUIStore()
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  return (
    <header className="flex items-center gap-4 px-5 h-14 border-b border-zinc-200/50 dark:border-zinc-800/40 shrink-0 glass-header sticky top-0 z-50">
      {/* Logo + sidebar toggle */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 bg-gradient-to-br from-violet-600 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-md shadow-violet-600/20 group-hover:scale-105 transition-transform">
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9v8l10-12h-9l3-8z" />
            </svg>
          </div>
          <span className="font-extrabold text-zinc-800 dark:text-zinc-200 text-sm tracking-wide bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent">
            APIY
          </span>
        </Link>
      </div>

      {!isAuthPage && (
        <>
          <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800" />

          {/* Mode tabs */}
          <nav className="flex items-center gap-1.5">
            {TABS.map((tab) => {
              const isActive = pathname === tab.href
              const Icon = tab.icon
              return (
                <Link key={tab.href} href={tab.href}>
                  <motion.div
                    whileHover={{ y: -0.5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-colors cursor-pointer select-none ${isActive ? tab.activeColor : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-bg"
                        className="absolute inset-0 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40 rounded-xl shadow-sm"
                        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      />
                    )}
                    <Icon className="relative z-10 w-3.5 h-3.5 shrink-0" />
                    <span className="relative z-10">{tab.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </nav>
        </>
      )}

      {/* Right: theme toggle + user menu */}
      <div className="ml-auto flex items-center gap-3">
        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(63, 63, 70, 0.08)' }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-1.5 rounded-xl text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 border border-transparent hover:border-zinc-200/30 dark:hover:border-zinc-800/50 transition-all cursor-pointer"
          title="Toggle theme"
        >
          {theme === 'dark' ? (
            <FiMoon className="w-4 h-4 text-violet-400" />
          ) : (
            <FiSun className="w-4 h-4 text-amber-500" />
          )}
        </motion.button>

        {!isAuthPage && <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800" />}
        {status === 'loading' && !isAuthPage && (
          <div className="w-4 h-4 border-2 border-zinc-200 dark:border-zinc-700 border-t-violet-600 rounded-full animate-spin" />
        )}

        {!isAuthPage && status === 'unauthenticated' && (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors px-4 py-2 cursor-pointer"
              >
                Sign in
              </motion.button>
            </Link>
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.02, y: -0.5 }}
                whileTap={{ scale: 0.98 }}
                className="text-xs bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:opacity-95 text-white px-5 py-2 rounded-lg font-semibold shadow-md shadow-violet-600/10 transition-all cursor-pointer"
              >
                Sign up
              </motion.button>
            </Link>
          </div>
        )}

        {!isAuthPage && status === 'authenticated' && session?.user && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-extrabold shrink-0 shadow-sm">
                {session.user.name?.[0]?.toUpperCase() ?? session.user.email?.[0]?.toUpperCase() ?? '?'}
              </div>
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 max-w-28 truncate hidden sm:block">
                {session.user.name ?? session.user.email}
              </span>
              <svg className="w-3 h-3 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </motion.button>

            <AnimatePresence>
              {menuOpen && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />

                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 z-20 w-52 bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl shadow-lg shadow-zinc-200/20 dark:shadow-none overflow-hidden"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 bg-zinc-50/50 dark:bg-zinc-900/20 border-b border-zinc-200/50 dark:border-zinc-800/50">
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                        {session.user.name}
                      </p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5 font-mono">
                        {session.user.email}
                      </p>
                    </div>

                    {/* Sign out */}
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        signOut({ callbackUrl: '/login' })
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors cursor-pointer"
                    >
                      Sign out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  )
}
