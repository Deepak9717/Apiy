'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GraphQLUrlBar from '@/components/GraphQL/GraphQLUrlBar'
import GraphQLEditor from '@/components/GraphQL/GraphQLEditor'
import GraphQLResponse from '@/components/GraphQL/GraphQLResponse'
import SchemaExplorer from '@/components/GraphQL/SchemaExplorer'
import { useGraphQLStore } from '@/store/useGraphQLStore'

export default function GraphQLPage() {
  const [schemaOpen, setSchemaOpen] = useState(true)
  const { history, setQuery, setUrl } = useGraphQLStore()

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* History sidebar */}
      <aside className="w-52 border-r border-zinc-800 flex flex-col bg-zinc-950 shrink-0">
        <div className="px-4 py-3 border-b border-zinc-800">
          <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">History</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-zinc-800">No queries yet</p>
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
                  className="w-full flex flex-col gap-1 px-4 py-3 hover:bg-zinc-900 transition-colors text-left border-b border-zinc-800/40"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-pink-400/80 font-mono">GQL</span>
                    {item.status && (
                      <span className={`text-xs ${item.status < 300 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 font-mono truncate">{item.url}</p>
                  <p className="text-xs text-zinc-800 font-mono truncate italic">
                    {item.query.trim().split('\n')[0]}
                  </p>
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* URL bar */}
        <div className="border-b border-zinc-800 shrink-0">
          <GraphQLUrlBar />
        </div>

        {/* Editor + Response + Schema */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Editor */}
          <div className="flex flex-col border-r border-zinc-800 overflow-hidden" style={{ width: '40%' }}>
            <div className="px-4 py-2.5 border-b border-zinc-800 shrink-0">
              <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Query</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <GraphQLEditor />
            </div>
          </div>

          {/* Middle: Response */}
          <div className="flex flex-col overflow-hidden" style={{ width: schemaOpen ? '40%' : '60%', transition: 'width 0.2s' }}>
            <div className="px-4 py-2.5 border-b border-zinc-800 shrink-0 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Response</span>
              <button
                onClick={() => setSchemaOpen(!schemaOpen)}
                className="text-xs text-zinc-700 hover:text-pink-400 transition-colors"
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
