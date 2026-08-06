'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HttpMethod, METHOD_CHIP } from '@/types/rest'
import { FiChevronDown } from 'react-icons/fi'

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

interface Props {
  value: HttpMethod
  onChange: (method: HttpMethod) => void
}

export default function MethodDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div ref={ref} className="relative shrink-0">
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-1.5 pl-3 pr-2.5 py-2.5 rounded-xl border text-xs font-bold font-mono tracking-wide transition-colors cursor-pointer ${METHOD_CHIP[value]}`}
      >
        {value}
        <FiChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform ${open ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full mt-1.5 z-50 w-40 p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg shadow-zinc-900/5 dark:shadow-black/30 overflow-hidden"
          >
            {METHODS.map((m) => (
              <li key={m} role="option" aria-selected={m === value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(m)
                    setOpen(false)
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-bold font-mono tracking-wide transition-colors cursor-pointer ${
                    m === value
                      ? METHOD_CHIP[m]
                      : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {m}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
