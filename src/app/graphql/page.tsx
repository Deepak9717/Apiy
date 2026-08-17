'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GraphQLUrlBar from '@/features/graphql-client/components/GraphQLUrlBar'
import GraphQLEditor from '@/features/graphql-client/components/GraphQLEditor'
import GraphQLResponse from '@/features/graphql-client/components/GraphQLResponse'
import SchemaExplorer from '@/features/graphql-client/components/SchemaExplorer'
import { useGraphQLStore } from '@/features/graphql-client/store/useGraphQLStore'
import { useUIStore } from '@/store/useUIStore'

export default function GraphQLPage() {
  const [schemaOpen, setSchemaOpen] = useState(true)
  const { history, setQuery, setUrl } = useGraphQLStore();
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <div className="flex flex-1 overflow-hidden">
      
      {/* History sidebar */}
      {!sidebarOpen ? (
        <div className="flex flex-col items-center py-3.5 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 shrink-0">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(63, 63, 70, 0.08)' }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            title="Show sidebar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </motion.button>
        </div>
      ) : (
      <aside className="w-52 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50 dark:bg-zinc-950 shrink-0">
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(63, 63, 70, 0.08)' }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
          title="Hide sidebar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </motion.button>
        <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">History</span>
        </div>
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {history.length === 0 ? (
            <div className="px-2 py-8 text-center">
              <p className="text-xs text-zinc-400 dark:text-zinc-700">No queries yet</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {history.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i < 5 ? i * 0.03 : 0 }}
                  onClick={() => { setUrl(item.url); setQuery(item.query) }}
                  className="w-full flex flex-col gap-1 px-3 py-2.5 mb-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200/40 dark:hover:border-zinc-800/55 transition-all text-left"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-fuchsia-500 dark:text-fuchsia-400/80 font-mono">GQL</span>
                    {item.status && (
                      <span className={`text-xs ${item.status < 300 ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-600 font-mono truncate">{item.url}</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-700 font-mono truncate italic">
                    {item.query.trim().split('\n')[0]}
                  </p>
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>
      </aside>
      )}

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* URL bar */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-950">
          <GraphQLUrlBar />
        </div>

        {/* Editor + Response + Schema */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Editor */}
          <div className="flex flex-col border-r border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950" style={{ width: '40%' }}>
            <div className="px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">Query</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <GraphQLEditor />
            </div>
          </div>

          {/* Middle: Response */}
          <div
            className="flex flex-col overflow-hidden bg-white dark:bg-zinc-950"
            style={{ width: schemaOpen ? '40%' : '60%', transition: 'width 0.2s' }}
          >
            <div className="px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 shrink-0 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">Response</span>
              <button
                onClick={() => setSchemaOpen(!schemaOpen)}
                className="text-xs text-zinc-400 dark:text-zinc-700 hover:text-fuchsia-500 dark:hover:text-fuchsia-400 transition-colors"
              >
                {schemaOpen ? 'Hide Schema ▶' : '◀ Show Schema'}
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
