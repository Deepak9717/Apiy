'use client'

import { motion } from 'framer-motion'
import { HttpMethod, METHOD_COLORS } from '@/lib/types'
import { isValidUrl } from '@/lib/request'
import { useRequestConfigStore } from '@/store/useRequestConfigStore'

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

interface Props {
  onSend: () => void
  onCancel: () => void
  isPending: boolean
}

export default function UrlBar({ onSend, onCancel, isPending }: Props) {
  const { method, url, setMethod, setUrl } = useRequestConfigStore()

  const valid = isValidUrl(url)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (valid && !isPending) onSend()
    }
    if (e.key === 'Escape' && isPending) onCancel()
  }

  return (
    <div className="flex gap-2 p-4">
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value as HttpMethod)}
        className={`bg-zinc-900 border border-zinc-700/60 rounded-lg px-3 py-2 text-sm font-bold font-mono focus:outline-none focus:border-orange-500/50 cursor-pointer transition-colors ${METHOD_COLORS[method]}`}
      >
        {METHODS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <div className="flex-1 relative">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://api.example.com/endpoint"
          className="w-full bg-zinc-900 border border-zinc-700/60 rounded-lg px-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 font-mono transition-colors"
        />
        {url && !valid && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500/70">
            invalid url
          </span>
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={isPending ? onCancel : onSend}
        disabled={!isPending && (!valid || !url)}
        className={`font-semibold px-5 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:cursor-not-allowed min-w-20 ${
          isPending
            ? 'bg-zinc-700 hover:bg-red-500/80 text-zinc-300 hover:text-white'
            : 'bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-white'
        }`}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3 h-3 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
            Cancel
          </span>
        ) : (
          'Send'
        )}
      </motion.button>
    </div>
  )
}
