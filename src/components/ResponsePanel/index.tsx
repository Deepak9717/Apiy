'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSendRequest } from '@/lib/useSendRequest'
import { useUIStore } from '@/store/useUIStore'
import { getStatusColor, formatBytes, tryPrettyPrint } from '@/lib/request'

export default function ResponsePanel() {
  const { response, isPending, isError, error } = useSendRequest()
  const { responseTab, setResponseTab } = useUIStore()
  const [copied, setCopied] = useState(false)

  const copy = () => {
    if (!response) return
    navigator.clipboard.writeText(tryPrettyPrint(response.body))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex flex-col h-full">
      <AnimatePresence mode="wait">
        {isPending && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full gap-4"
          >
            <div className="relative w-10 h-10">
              <motion.div
                className="absolute inset-0 border-2 border-orange-500/20 rounded-full"
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div className="absolute inset-0 border-2 border-zinc-700 border-t-orange-500 rounded-full animate-spin" />
            </div>
            <p className="text-sm text-zinc-600">Sending request…</p>
            <p className="text-xs text-zinc-800">Esc to cancel</p>
          </motion.div>
        )}

        {!isPending && isError && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full gap-3 p-8"
          >
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 text-lg">
              ✕
            </div>
            <p className="text-sm text-red-400 font-medium">Request Failed</p>
            <p className="text-xs text-zinc-600 text-center max-w-xs font-mono leading-relaxed">
              {error.message}
            </p>
          </motion.div>
        )}

        {!isPending && !isError && !response && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full gap-2 select-none"
          >
            <div className="text-4xl opacity-10">⚡</div>
            <p className="text-sm text-zinc-700">No response yet</p>
            <p className="text-xs text-zinc-800">Enter a URL and hit Send</p>
          </motion.div>
        )}

        {!isPending && response && (
          <motion.div
            key="response"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col h-full"
          >
            {/* Status bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`font-bold font-mono text-sm ${getStatusColor(response.status)}`}
              >
                {response.status} {response.statusText}
              </motion.span>
              <span className="text-xs text-zinc-600">{response.time}ms</span>
              <span className="text-xs text-zinc-600">{formatBytes(response.size)}</span>

              <div className="flex gap-1 ml-auto">
                {(['body', 'headers'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setResponseTab(tab)}
                    className={`relative px-3 py-1 text-xs rounded capitalize transition-colors ${
                      responseTab === tab ? 'text-zinc-200' : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                  >
                    {responseTab === tab && (
                      <motion.div
                        layoutId="response-tab-bg"
                        className="absolute inset-0 bg-zinc-700 rounded"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      />
                    )}
                    <span className="relative">
                      {tab}
                      {tab === 'headers' && (
                        <span className="ml-1 text-zinc-600">
                          {Object.keys(response.headers).length}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={copy}
                className="text-xs text-zinc-600 hover:text-orange-400 transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </motion.button>
            </div>

            {/* Body / Headers */}
            <div className="flex-1 overflow-auto p-4">
              <AnimatePresence mode="wait">
                {responseTab === 'body' && (
                  <motion.pre
                    key="body"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-zinc-300 font-mono whitespace-pre-wrap break-words leading-relaxed"
                  >
                    {tryPrettyPrint(response.body) || (
                      <span className="text-zinc-700">Empty response body</span>
                    )}
                  </motion.pre>
                )}

                {responseTab === 'headers' && (
                  <motion.table
                    key="headers"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full text-xs font-mono"
                  >
                    <tbody>
                      {Object.entries(response.headers).map(([key, value]) => (
                        <tr key={key} className="border-b border-zinc-800/50">
                          <td className="py-1.5 pr-4 text-orange-400/70 align-top w-2/5">{key}</td>
                          <td className="py-1.5 text-zinc-500 break-all">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </motion.table>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
