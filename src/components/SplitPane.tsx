'use client'

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { useUIStore } from '@/store/useUIStore'

interface Props {
  left: React.ReactNode
  right: React.ReactNode
}

export default function SplitPane({ left, right }: Props) {
  const { splitPos, setSplitPos } = useUIStore()

  const handleMouseDown = useCallback(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = document.getElementById('split-container')
      if (!container) return
      const rect = container.getBoundingClientRect()
      const pos = ((e.clientX - rect.left) / rect.width) * 100
      setSplitPos(Math.max(25, Math.min(75, pos)))
    }

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [setSplitPos])

  return (
    <div id="split-container" className="flex flex-1 overflow-hidden">
      <div
        className="flex flex-col overflow-hidden border-r border-zinc-200 dark:border-zinc-800"
        style={{ width: `${splitPos}%` }}
      >
        {left}
      </div>

      {/* Drag handle */}
      <motion.div
        whileHover={{ backgroundColor: 'rgba(249, 115, 22, 0.3)' }}
        onMouseDown={handleMouseDown}
        className="w-1 shrink-0 bg-zinc-200 dark:bg-zinc-800 cursor-col-resize transition-colors"
        title="Drag to resize"
      />

      <div
        className="flex flex-col overflow-hidden"
        style={{ width: `${100 - splitPos}%` }}
      >
        {right}
      </div>
    </div>
  )
}
