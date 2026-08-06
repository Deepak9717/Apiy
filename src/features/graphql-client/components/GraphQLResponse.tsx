'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGraphQL } from '@/features/graphql-client/hooks/useGraphQL'
import { useGraphQLStore } from '@/features/graphql-client/store/useGraphQLStore'
import { tryPrettyPrint, formatBytes } from '@/features/rest-client/lib/request'

type Tab = 'data' | 'errors' | 'raw'

export default function GraphQLResponse() {
  const { isPending, isError, error } = useGraphQL()
  // Read response from store — not from mutation — so it persists across re-renders
  const { response } = useGraphQLStore()
  const [tab, setTab] = useState<Tab>('data')
  const [copied, setCopied] = useState(false)

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const hasErrors = response?.errors && (response.errors as unknown[]).length > 0

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-white dark:bg-zinc-950">
        <div className="relative w-10 h-10">
          <motion.div
            className="absolute inset-0 border-2 border-fuchsia-500/20 rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <div className="absolute inset-0 border-2 border-zinc-200 dark:border-zinc-700 border-t-fuchsia-500 rounded-full animate-spin" />
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-600">Running query…</p>
      </div>
    )
  }

  if (isError && error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-full gap-3 p-8 bg-white dark:bg-zinc-950"
      >
        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">✕</div>
        <p className="text-sm text-red-500 dark:text-red-400 font-medium">Request Failed</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-600 text-center max-w-xs font-mono">{error.message}</p>
      </motion.div>
    )
  }

  if (!response) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 select-none bg-white dark:bg-zinc-950">
        <div className="text-4xl opacity-10">◈</div>
        <p className="text-sm text-zinc-400 dark:text-zinc-700">No response yet</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-800">Enter a URL and click Run</p>
      </div>
    )
  }

  const dataStr = JSON.stringify(response.data, null, 2)
  const errorsStr = JSON.stringify(response.errors, null, 2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full bg-white dark:bg-zinc-950"
    >
      {/* Status bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex-wrap gap-y-1.5">
        <span className={`font-bold font-mono text-sm ${response.status < 300 ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
          {response.status}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-600">{response.time}ms</span>
        <span className="text-xs text-zinc-500 dark:text-zinc-600">{formatBytes(new Blob([response.raw]).size)}</span>

        {hasErrors && (
          <span className="text-xs bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">
            {(response.errors as unknown[]).length} error{(response.errors as unknown[]).length > 1 ? 's' : ''}
          </span>
        )}

        <div className="flex gap-1 ml-auto">
          {(['data', 'errors', 'raw'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-3 py-1 text-xs rounded-lg capitalize transition-colors ${
                tab === t
                  ? 'text-zinc-800 dark:text-zinc-200'
                  : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400'
              }`}
            >
              {tab === t && (
                <motion.div
                  layoutId="gql-response-tab"
                  className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700 rounded-lg"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <span className="relative">
                {t}
                {t === 'errors' && hasErrors && (
                  <span className="ml-1 text-red-500 dark:text-red-400">{(response.errors as unknown[]).length}</span>
                )}
              </span>
            </button>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => copy(tab === 'data' ? dataStr : tab === 'errors' ? errorsStr : response.raw)}
          className="text-xs text-zinc-400 hover:text-fuchsia-500 dark:text-zinc-600 dark:hover:text-fuchsia-400 transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {tab === 'data' && (
              <pre className="text-xs text-zinc-700 dark:text-zinc-300 font-mono whitespace-pre-wrap break-words leading-relaxed">
                {dataStr === 'null'
                  ? <span className="text-zinc-400 dark:text-zinc-700">No data returned</span>
                  : dataStr}
              </pre>
            )}
            {tab === 'errors' && (
              <pre className="text-xs text-red-500 dark:text-red-300/80 font-mono whitespace-pre-wrap break-words leading-relaxed">
                {hasErrors ? errorsStr : <span className="text-zinc-400 dark:text-zinc-700">No errors</span>}
              </pre>
            )}
            {tab === 'raw' && (
              <pre className="text-xs text-zinc-600 dark:text-zinc-400 font-mono whitespace-pre-wrap break-words leading-relaxed">
                {tryPrettyPrint(response.raw)}
              </pre>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
