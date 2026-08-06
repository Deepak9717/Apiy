'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGraphQLStore } from '@/features/graphql-client/store/useGraphQLStore'

type Tab = 'query' | 'variables' | 'headers'

const TABS: { key: Tab; label: string }[] = [
  { key: 'query', label: 'Query' },
  { key: 'variables', label: 'Variables' },
  { key: 'headers', label: 'Headers' },
]

const PLACEHOLDER_QUERY = `# Write your GraphQL query here
# Example:
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}`

const PLACEHOLDER_VARS = `{
  "id": "1"
}`

const PLACEHOLDER_HEADERS = `{
  "Authorization": "Bearer your-token"
}`

const editorCls =
  'flex-1 w-full min-h-48 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700/40 rounded-xl p-3 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-800 focus:outline-none focus:border-fuchsia-400 dark:focus:border-fuchsia-500/40 font-mono resize-none transition-colors leading-relaxed'

export default function GraphQLEditor() {
  const [tab, setTab] = useState<Tab>('query')
  const { query, variables, headers, setQuery, setVariables, setHeaders } = useGraphQLStore()

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative px-4 py-2.5 text-sm transition-colors ${
              tab === t.key
                ? 'text-fuchsia-500 dark:text-fuchsia-400'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            {t.label}
            {tab === t.key && (
              <motion.div
                layoutId="gql-editor-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-fuchsia-500"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.1 }}
            className="h-full flex flex-col"
          >
            {tab === 'query' && (
              <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder={PLACEHOLDER_QUERY} spellCheck={false} className={editorCls} />
            )}
            {tab === 'variables' && (
              <div className="flex flex-col gap-2 h-full">
                <p className="text-xs text-zinc-400 dark:text-zinc-700">JSON variables passed to the query</p>
                <textarea value={variables} onChange={(e) => setVariables(e.target.value)} placeholder={PLACEHOLDER_VARS} spellCheck={false} className={editorCls} />
              </div>
            )}
            {tab === 'headers' && (
              <div className="flex flex-col gap-2 h-full">
                <p className="text-xs text-zinc-400 dark:text-zinc-700">Extra request headers as JSON</p>
                <textarea value={headers} onChange={(e) => setHeaders(e.target.value)} placeholder={PLACEHOLDER_HEADERS} spellCheck={false} className={editorCls} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
