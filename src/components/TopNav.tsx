'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useUIStore } from '@/store/useUIStore'

const TABS = [
  { href: '/', label: 'REST', color: 'text-orange-400', activeBg: 'bg-orange-500' },
  { href: '/graphql', label: 'GraphQL', color: 'text-pink-400', activeBg: 'bg-pink-500' },
]

export default function TopNav() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar, theme, toggleTheme } = useUIStore()

  return (
    <header className="flex items-center gap-4 px-4 h-12 border-b border-zinc-200 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-950">
      {/* Logo + sidebar toggle */}
      <div className="flex items-center gap-2.5">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="text-zinc-400 hover:text-zinc-700 dark:text-zinc-600 dark:hover:text-zinc-300 transition-colors text-sm leading-none"
        >
          {sidebarOpen ? '◀' : '▶'}
        </motion.button>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center text-xs text-white font-bold">
            ⚡
          </div>
          <span className="font-bold text-zinc-700 dark:text-zinc-300 text-sm tracking-tight">APIY</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800" />

      {/* Mode tabs */}
      <nav className="flex items-center gap-1">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link key={tab.href} href={tab.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? tab.color : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-bg"
                    className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="relative">{tab.label}</span>
              </motion.div>
            </Link>
          )
        })}

        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="ml-2 px-2 py-1 rounded-lg text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Toggle light/dark theme"
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </motion.button>
      </nav>
    </header>
  )
}
