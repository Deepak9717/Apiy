'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useHistoryStore } from '@/store/useHistoryStore'
import { useRequestConfigStore } from '@/store/useRequestConfigStore'
import { useUIStore } from '@/store/useUIStore'
import { METHOD_COLORS, METHOD_BG } from '@/lib/types'
import { getStatusDot, timeAgo } from '@/lib/request'

export default function Sidebar() {
  const { items, clear, remove } = useHistoryStore()
  const loadRequest = useRequestConfigStore((s) => s.loadRequest)
  const { sidebarOpen } = useUIStore()

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 220, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          className="flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden shrink-0"
        >
          {/* History header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">History</span>
            {items.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clear}
                className="text-xs text-zinc-400 hover:text-red-500 dark:text-zinc-700 dark:hover:text-red-400 transition-colors"
              >
                Clear all
              </motion.button>
            )}
          </div>

          {/* History list */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-8 text-center"
              >
                <p className="text-xs text-zinc-400 dark:text-zinc-700">No requests yet</p>
              </motion.div>
            ) : (
              <AnimatePresence initial={false}>
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12, height: 0 }}
                    transition={{ delay: i < 5 ? i * 0.03 : 0, duration: 0.15 }}
                    className="group relative border-b border-zinc-100 dark:border-zinc-800/40"
                  >
                    <button
                      onClick={() => loadRequest({ method: item.method, url: item.url })}
                      className="w-full flex flex-col gap-1 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-left"
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded text-[10px] ${METHOD_COLORS[item.method]} ${METHOD_BG[item.method]}`}
                        >
                          {item.method}
                        </span>
                        {item.status && (
                          <>
                            <div
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusDot(item.status)}`}
                            />
                            <span className="text-xs text-zinc-500 dark:text-zinc-600">{item.status}</span>
                          </>
                        )}
                        {item.time && (
                          <span className="text-xs text-zinc-400 dark:text-zinc-700 ml-auto">{item.time}ms</span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-600 font-mono truncate group-hover:text-zinc-700 dark:group-hover:text-zinc-400 transition-colors">
                        {item.url}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-800">{timeAgo(item.timestamp)}</p>
                    </button>

                    {/* Remove button */}
                    <motion.button
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      onClick={() => remove(item.id)}
                      className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 dark:text-zinc-700 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                    >
                      ×
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-xs text-zinc-400 dark:text-zinc-800">
              Next.js · React Query · Framer Motion
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
