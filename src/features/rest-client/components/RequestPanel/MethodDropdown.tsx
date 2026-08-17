'use client'

import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
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
  const [mounted, setMounted] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)

  // Portals need a client-mounted document to render into.
  useEffect(() => setMounted(true), [])

  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) {
      setCoords({ top: rect.bottom + 6, left: rect.left, width: rect.width })
    }
  }

  useLayoutEffect(() => {
    if (open) updatePosition()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        menuRef.current && !menuRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onScrollOrResize = () => setOpen(false)

    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    // Any scroll/resize while open closes the menu rather than tracking it —
    // simplest way to avoid a stale, misaligned portal position.
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [open])

  return (
    <div className="relative shrink-0">
      <motion.button
        ref={triggerRef}
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

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.ul
                ref={menuRef}
                role="listbox"
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.12 }}
                style={{ position: 'fixed', top: coords.top, left: coords.left, minWidth: Math.max(coords.width, 144) }}
                // Opaque, isolated stacking context of its own — rendered
                // straight into <body> so no ancestor's backdrop-blur,
                // opacity, or overflow can make it read as transparent or
                // let clicks fall through to whatever's underneath.
                className="z-[1000] p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg shadow-zinc-900/10 dark:shadow-black/40"
              >
                {METHODS.map((m) => (
                  <li key={m} role="option" aria-selected={m === value}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
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
          </AnimatePresence>,
          document.body
        )}
    </div>
  )
}
