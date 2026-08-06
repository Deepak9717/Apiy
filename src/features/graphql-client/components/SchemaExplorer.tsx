'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGraphQLStore } from '@/features/graphql-client/store/useGraphQLStore'
import { useGraphQL } from '@/features/graphql-client/hooks/useGraphQL'

interface SchemaType {
  name: string
  kind: string
  description?: string
  fields?: { name: string; description?: string; type: { name?: string; kind: string; ofType?: { name?: string } } }[]
}

export default function SchemaExplorer() {
  const { schema, schemaLoading, url } = useGraphQLStore()
  const { fetchSchema } = useGraphQL()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const parsedSchema = schema ? (() => {
    try { return JSON.parse(schema) } catch { return null }
  })() : null

  const types: SchemaType[] = parsedSchema?.types?.filter(
    (t: SchemaType) => t.kind === 'OBJECT' && !t.name.startsWith('__')
  ) ?? []

  const filtered = types.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex flex-col h-full border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">Schema</span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={fetchSchema}
          disabled={!url || schemaLoading}
          className="text-xs text-zinc-400 dark:text-zinc-600 hover:text-fuchsia-500 dark:hover:text-fuchsia-400 transition-colors disabled:opacity-40"
        >
          {schemaLoading ? (
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 border border-zinc-300 dark:border-zinc-600 border-t-fuchsia-500 rounded-full animate-spin" />
              Loading
            </span>
          ) : '↻ Refresh'}
        </motion.button>
      </div>

      {!schema && !schemaLoading && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 p-4 text-center">
          <div className="text-3xl opacity-10">◈</div>
          <p className="text-xs text-zinc-400 dark:text-zinc-700">
            Click &ldquo;Schema&rdquo; in the URL bar to load via introspection
          </p>
        </div>
      )}

      {schema && (
        <>
          <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search types…"
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/40 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 focus:outline-none focus:border-fuchsia-400 dark:focus:border-fuchsia-500/40 font-mono"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.map((type) => (
              <div key={type.name} className="border-b border-zinc-100 dark:border-zinc-800/50">
                <button
                  onClick={() => setExpanded(expanded === type.name ? null : type.name)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-left"
                >
                  <span className="text-xs font-mono text-fuchsia-500 dark:text-fuchsia-400/80">{type.name}</span>
                  <span className="text-zinc-400 dark:text-zinc-700 text-xs">{expanded === type.name ? '▲' : '▼'}</span>
                </button>

                <AnimatePresence>
                  {expanded === type.name && type.fields && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-2 flex flex-col gap-1">
                        {type.description && (
                          <p className="text-xs text-zinc-400 dark:text-zinc-700 italic mb-1">{type.description}</p>
                        )}
                        {type.fields.map((field) => {
                          const typeName = field.type.name ?? field.type.ofType?.name ?? field.type.kind
                          return (
                            <div key={field.name} className="flex items-baseline gap-1.5">
                              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">{field.name}</span>
                              <span className="text-xs text-zinc-400 dark:text-zinc-700">:</span>
                              <span className="text-xs font-mono text-emerald-500 dark:text-emerald-400/60">{typeName}</span>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
