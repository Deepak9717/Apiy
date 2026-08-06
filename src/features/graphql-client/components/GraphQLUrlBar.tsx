'use client'

import { motion } from 'framer-motion'
import { useGraphQLStore } from '@/features/graphql-client/store/useGraphQLStore'
import { useGraphQL } from '@/features/graphql-client/hooks/useGraphQL'
import { isValidUrl } from '@/features/rest-client/lib/request'

export default function GraphQLUrlBar() {
  const { url, setUrl, schemaLoading } = useGraphQLStore()
  const { run, cancel, fetchSchema, isPending } = useGraphQL()

  const valid = isValidUrl(url)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && valid && !isPending) run()
    if (e.key === 'Escape' && isPending) cancel()
  }

  return (
    <div className="flex gap-2 p-4">
      <div className="shrink-0 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl px-3 py-2 text-xs font-bold text-fuchsia-500 dark:text-fuchsia-400 font-mono flex items-center">
        GQL
      </div>

      <div className="flex-1 relative">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://api.example.com/graphql"
          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/60 rounded-xl px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 focus:outline-none focus:border-fuchsia-400 dark:focus:border-fuchsia-500/50 font-mono transition-colors"
        />
        {url && !valid && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500/70">invalid url</span>
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={fetchSchema}
        disabled={!valid || schemaLoading}
        className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-500 hover:text-fuchsia-500 dark:hover:text-fuchsia-400 hover:border-fuchsia-400 dark:hover:border-fuchsia-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {schemaLoading ? (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 border border-zinc-300 dark:border-zinc-600 border-t-fuchsia-500 dark:border-t-fuchsia-400 rounded-full animate-spin" />
            Schema
          </span>
        ) : 'Schema'}
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={isPending ? cancel : () => run()}
        disabled={!valid && !isPending}
        className={`font-semibold px-5 py-2 rounded-xl text-sm transition-colors min-w-20 ${
          isPending
            ? 'bg-zinc-200 dark:bg-zinc-700 hover:bg-red-500/80 text-zinc-600 dark:text-zinc-300 hover:text-white'
            : 'bg-fuchsia-500 hover:bg-fuchsia-400 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-white'
        }`}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3 h-3 border-2 border-zinc-400 border-t-white rounded-full animate-spin" />
            Cancel
          </span>
        ) : 'Run'}
      </motion.button>
    </div>
  )
}
