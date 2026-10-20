'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import GraphQLUrlBar from '@/features/graphql-client/components/GraphQLUrlBar'
import GraphQLEditor from '@/features/graphql-client/components/GraphQLEditor'
import GraphQLResponse from '@/features/graphql-client/components/GraphQLResponse'
import SchemaExplorer from '@/features/graphql-client/components/SchemaExplorer'
import { useGraphQLStore } from '@/features/graphql-client/store/useGraphQLStore'
import { useUIStore } from '@/store/useUIStore'
import { FiMenu } from 'react-icons/fi'
import { timeAgo, getStatusDot } from '@/features/rest-client/lib/request'
import { FaClock, FaArrowLeft, FaArrowRight } from 'react-icons/fa'

export default function GraphQLPage() {
  const [schemaOpen, setSchemaOpen] = useState(true)
  const { history, setQuery, setUrl, clearHistory, removeHistory } = useGraphQLStore();
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <div className="flex flex-1 overflow-hidden">
      
      {/* History sidebar */}
      {!sidebarOpen ? (
        <div className="flex flex-col items-center px-1 py-3.5 border-r border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-100/70 dark:bg-zinc-950/20 shrink-0">
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
      ) : (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 240, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
          className="flex flex-col border-r border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-100/70 dark:bg-zinc-950/20 overflow-hidden shrink-0"
        >
          {/* History header */}
          <div className="flex items-center justify-between px-2 py-2.5 border-b border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-100/80 dark:bg-zinc-950/40">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-zinc-200/30 dark:hover:bg-zinc-800/30 cursor-pointer transition-colors"
              title="Hide sidebar"
            >
              <FiMenu className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            </motion.button>
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">History</span>
            {history.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearHistory}
                className="text-[10px] font-bold text-zinc-400 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 transition-colors cursor-pointer"
              >
                Clear all
              </motion.button>
            )}
          </div>

          {/* History list */}
          <div className="flex-1 overflow-y-auto py-2">
            {history.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-12 text-center">
                <div className="text-2xl mb-2 opacity-20 flex items-center justify-center"><FaClock  className='w-5 h-5'/></div>
                <p className="text-xs font-medium text-zinc-400 dark:text-zinc-700">No queries yet</p>
              </motion.div>
            ) : (
              <AnimatePresence initial={false}>
                {history.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12, height: 0 }}
                    transition={{ delay: i < 8 ? i * 0.02 : 0, duration: 0.15 }}
                    className="group relative px-2 mb-1"
                  >
                    <button
                      onClick={() => { setUrl(item.url); setQuery(item.query) }}
                      className="w-full flex flex-col gap-1 px-3 py-2.5 rounded-xl hover:bg-zinc-200/30 dark:hover:bg-zinc-900/40 border border-transparent hover:border-zinc-200/40 dark:hover:border-zinc-800/55 transition-all text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-extrabold font-mono px-1.5 py-0.5 rounded-md text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-500/10">
                          GQL
                        </span>

                        {item.status && (
                          <div className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusDot(item.status)}`} />
                            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500">{item.status}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] text-zinc-500 dark:text-zinc-500 font-mono truncate group-hover:text-zinc-800 dark:group-hover:text-zinc-300 transition-colors">
                        {item.url}
                      </p>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-600 font-mono truncate italic">
                        {item.query.trim().split('\n')[0]}
                      </p>

                      <div className="flex justify-between items-center mt-0.5">
                        <span className="text-[9px] text-zinc-400 dark:text-zinc-700 font-semibold">{timeAgo(item.timestamp)}</span>
                      </div>
                    </button>

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeHistory(item.id)
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
          <div className="px-4 py-3 border-t border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-100/50 dark:bg-zinc-950/20">
            <Image src="/logo.png" alt="APIY" width={18} height={18} className="size-[18px] rounded-md" />
          </div>
        </motion.aside>
      )}
{/* flex gap-2.5  */}
      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* URL bar */}
        <div className="bg-zinc-100/70 dark:bg-zinc-900/40 backdrop-blur-lg border border-zinc-200/70 dark:border-zinc-800/30 shadow-sm">
          <GraphQLUrlBar />
        </div>

        {/* Editor + Response + Schema */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Editor */}
          <div className="flex flex-col border-r border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-950" style={{ width: '40%' }}>
            <div className="flex-1 overflow-hidden">
              <GraphQLEditor />
            </div>
          </div>

          {/* Middle: Response */}
          <div
            className="flex flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950"
            style={{ width: schemaOpen ? '40%' : '60%', transition: 'width 0.2s' }}
          >
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">Response</span>
              <button
                onClick={() => setSchemaOpen(!schemaOpen)}
                className="text-xs text-zinc-400 dark:text-zinc-700 hover:text-fuchsia-500 dark:hover:text-fuchsia-400 transition-colors cursor-pointer"
              >
                {schemaOpen ? <FaArrowRight title='Hide Schema' className='text-sm'/> : <FaArrowLeft title='Show Schema' className='text-sm'/>}
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <GraphQLResponse />
            </div>
          </div>

          {/* Right: Schema Explorer */}
          <AnimatePresence>
            {schemaOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '20%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                className="overflow-hidden shrink-0"
              >
                <SchemaExplorer />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
