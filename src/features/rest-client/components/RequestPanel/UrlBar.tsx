import React from 'react'
import { motion } from 'framer-motion'
import { isValidUrl } from '@/features/rest-client/lib/request'
import { useRequestConfigStore } from '@/features/rest-client/store/useRequestConfigStore'
import { FiSend, FiXCircle } from 'react-icons/fi'
import MethodDropdown from './MethodDropdown'

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
    <div className="flex gap-2.5 p-4 bg-white/10 dark:bg-zinc-900/40 backdrop-blur-lg border border-white/20 dark:border-zinc-800/30 shadow-sm">
      {/* Method dropdown */}
      <MethodDropdown value={method} onChange={(m) => setMethod(m)} />

      {/* URL input */}
      <div className="flex-1 relative">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://api.example.com/endpoint"
          className="w-full bg-white/5 dark:bg-zinc-800/60 border border-white/20 dark:border-zinc-700/40 rounded-xl px-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-400 dark:focus:ring-violet-600/50 transition-shadow"
        />
        {url && !valid && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500/80">
            Invalid URL
          </span>
        )}
      </div>

      {/* Action button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={isPending ? onCancel : onSend}
        disabled={!valid || (!isPending && !url)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isPending
            ? 'bg-red-500/80 hover:bg-red-600 text-white'
            : 'bg-violet-600 hover:bg-violet-500 text-white'
        }`}
      >
        {isPending ? (
          <>
            <FiXCircle className="w-4 h-4 animate-pulse" />
            Cancel
          </>
        ) : (
          <>
            <FiSend className="w-4 h-4" />
            Send
          </>
        )}
      </motion.button>
    </div>
  )
}
