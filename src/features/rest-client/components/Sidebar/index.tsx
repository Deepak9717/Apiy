'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu } from 'react-icons/fi'
import { useHistoryStore } from '@/features/rest-client/store/useHistoryStore'
import { useRequestConfigStore } from '@/features/rest-client/store/useRequestConfigStore'
import { useUIStore } from '@/store/useUIStore'
import { HttpMethod } from '@/types/rest'
import { getStatusDot, timeAgo } from '@/features/rest-client/lib/request'

const BADGE_COLORS: Record<HttpMethod, string> = {
  GET: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50',
  POST: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50',
  PUT: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50',
  PATCH: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50',
  DELETE: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50',
}

export default function Sidebar() {
  const { items, clear, remove } = useHistoryStore()
  const loadRequest = useRequestConfigStore((s) => s.loadRequest)
  const { sidebarOpen, toggleSidebar } = useUIStore()

  if (!sidebarOpen) {
    // Collapsed rail — always visible so the sidebar can be reopened.
    return (
      <div className="flex flex-col items-center py-3.5 border-r border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-950/20 shrink-0 h-full">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="p-1.5 rounded-full hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
          title="Show sidebar"
        >
          <FiMenu className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </motion.button>
      </div>
    )
  }

  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 240, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
      className="flex flex-col border-r border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-950/20 overflow-hidden shrink-0 h-full"
    >
      {/* History header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-200/50 dark:border-zinc-800/40 bg-white/40 dark:bg-zinc-950/40">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleSidebar}
          className="p-1.5 rounded-full hover:bg-zinc-200/30 dark:hover:bg-zinc-800/30 cursor-pointer transition-colors"
          title="Hide sidebar"
        >
          <FiMenu className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </motion.button>
        <span className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">History</span>
        {items.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={clear}
            className="text-[10px] font-bold text-zinc-400 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 transition-colors cursor-pointer"
          >
            Clear all
          </motion.button>
        )}
      </div>

      {/* History list */}
      <div className="flex-1 overflow-y-auto py-2">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-12 text-center"
          >
            <div className="text-2xl mb-2 opacity-20">🕒</div>
            <p className="text-xs font-medium text-zinc-400 dark:text-zinc-700">No requests yet</p>
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12, height: 0 }}
                transition={{ delay: i < 8 ? i * 0.02 : 0, duration: 0.15 }}
                className="group relative px-2 mb-1"
              >
                <button
                  onClick={() => loadRequest({ method: item.method, url: item.url })}
                  className="w-full flex flex-col gap-1 px-3 py-2.5 rounded-xl hover:bg-zinc-200/30 dark:hover:bg-zinc-900/40 border border-transparent hover:border-zinc-200/40 dark:hover:border-zinc-800/55 transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-extrabold font-mono px-1.5 py-0.5 rounded-md ${BADGE_COLORS[item.method]}`}
                    >
                      {item.method}
                    </span>
                    
                    {item.status && (
                      <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusDot(item.status)}`} />
                        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500">{item.status}</span>
                      </div>
                    )}
                    
                    {item.time && (
                      <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-600 ml-auto">{item.time}ms</span>
                    )}
                  </div>
                  
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-500 font-mono truncate group-hover:text-zinc-800 dark:group-hover:text-zinc-300 transition-colors">
                    {item.url}
                  </p>
                  
                  <div className="flex justify-between items-center mt-0.5">
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-700 font-semibold">{timeAgo(item.timestamp)}</span>
                  </div>
                </button>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    remove(item.id)
                  }}
                  className="absolute top-2 right-4 w-5 h-5 flex items-center justify-center rounded-full text-zinc-400 hover:text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-all text-xs cursor-pointer"
                  title="Remove from history"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-zinc-200/50 dark:border-zinc-800/40 bg-white/20 dark:bg-zinc-950/20">
        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-700 tracking-wider">
          APIY
        </p>
      </div>
    </motion.aside>
  )
}
