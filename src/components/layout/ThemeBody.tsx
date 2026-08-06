'use client'

import { useEffect } from 'react'
import { useUIStore } from '@/store/useUIStore'

interface Props {
  children: React.ReactNode
  fontVariable?: string
}

export default function ThemeBody({ children, fontVariable }: Props) {
  const { theme } = useUIStore()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return (
    <body className={`${fontVariable ?? ''} font-sans antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200`}>
      {children}
    </body>
  )
}
