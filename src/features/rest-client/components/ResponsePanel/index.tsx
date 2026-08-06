'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSendRequest } from '@/features/rest-client/hooks/useSendRequest'
import { useResponseStore } from '@/features/rest-client/store/useResponseStore'
import { useUIStore } from '@/store/useUIStore'
import { getStatusColor, formatBytes, tryPrettyPrint } from '@/features/rest-client/lib/request'

type ResponseTab = 'body' | 'headers' | 'preview'

function isHtmlContent(headers: Record<string, string>): boolean {
  const ct = headers['content-type'] || headers['Content-Type'] || ''
  return ct.includes('text/html')
}

function HtmlPreview({ html }: { html: string }) {
  return (
    <iframe
      srcDoc={html}
      sandbox="allow-scripts allow-same-origin"
      className="w-full h-full border-0 rounded-xl bg-white"
      title="Response Preview"
    />
  )
}

export default function ResponsePanel() {
  const { isPending, isError, error } = useSendRequest()
  const { response } = useResponseStore()
  const { responseTab, setResponseTab } = useUIStore()
  const [localTab, setLocalTab] = useState<ResponseTab>('body')
  const [copied, setCopied] = useState(false)

  // Use localTab for the preview tab since UIStore only knows body/headers
  const activeTab: ResponseTab = localTab

  const handleTabClick = (tab: ResponseTab) => {
    setLocalTab(tab)
    if (tab === 'body' || tab === 'headers') setResponseTab(tab)
  }

  // Sync localTab when store changes externally
  const copy = () => {
    if (!response) return
    navigator.clipboard.writeText(tryPrettyPrint(response.body))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const showPreviewTab = response && isHtmlContent(response.headers)

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
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
                className="absolute inset-0 border-2 border-violet-600/20 rounded-full"
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div className="absolute inset-0 border-2 border-zinc-200 dark:border-zinc-700 border-t-violet-600 rounded-full animate-spin" />
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-600">Sending request…</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-800">Esc to cancel</p>
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
            <p className="text-xs text-zinc-500 dark:text-zinc-600 text-center max-w-xs font-mono leading-relaxed">
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
            <p className="text-sm text-zinc-400 dark:text-zinc-700">No response yet</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-800">Enter a URL and hit Send</p>
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
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex-wrap gap-y-1.5">
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`font-bold font-mono text-sm ${getStatusColor(response.status)}`}
              >
                {response.status} {response.statusText}
              </motion.span>
              <span className="text-xs text-zinc-500 dark:text-zinc-600">{response.time}ms</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-600">{formatBytes(response.size)}</span>

              <div className="flex gap-1 ml-auto">
                {/* Always show body & headers tabs */}
                {(['body', 'headers'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`relative px-3 py-1 text-xs rounded-lg capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-zinc-800 dark:text-zinc-200'
                        : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400'
                    }`}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="response-tab-bg"
                        className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700 rounded-lg"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      />
                    )}
                    <span className="relative">
                      {tab}
                      {tab === 'headers' && (
                        <span className="ml-1 text-zinc-400 dark:text-zinc-600">
                          {Object.keys(response.headers).length}
                        </span>
                      )}
                    </span>
                  </button>
                ))}

                {/* Preview tab — only shown for HTML responses */}
                {showPreviewTab && (
                  <button
                    onClick={() => handleTabClick('preview')}
                    className={`relative px-3 py-1 text-xs rounded-lg capitalize transition-colors ${
                      activeTab === 'preview'
                        ? 'text-zinc-800 dark:text-zinc-200'
                        : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400'
                    }`}
                  >
                    {activeTab === 'preview' && (
                      <motion.div
                        layoutId="response-tab-bg"
                        className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700 rounded-lg"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      />
                    )}
                    <span className="relative flex items-center gap-1">
                      Preview
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    </span>
                  </button>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={copy}
                className="text-xs text-zinc-400 hover:text-violet-600 dark:text-zinc-600 dark:hover:text-violet-400 transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </motion.button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-auto p-4">
              <AnimatePresence mode="wait">
                {activeTab === 'body' && (
                  <motion.pre
                    key="body"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-zinc-700 dark:text-zinc-300 font-mono whitespace-pre-wrap break-words leading-relaxed"
                  >
                    {tryPrettyPrint(response.body) || (
                      <span className="text-zinc-400 dark:text-zinc-700">Empty response body</span>
                    )}
                  </motion.pre>
                )}

                {activeTab === 'headers' && (
                  <motion.table
                    key="headers"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full text-xs font-mono"
                  >
                    <tbody>
                      {Object.entries(response.headers).map(([key, value]) => (
                        <tr key={key} className="border-b border-zinc-100 dark:border-zinc-800/50">
                          <td className="py-1.5 pr-4 text-violet-600 dark:text-violet-400/70 align-top w-2/5">{key}</td>
                          <td className="py-1.5 text-zinc-600 dark:text-zinc-500 break-all">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </motion.table>
                )}

                {activeTab === 'preview' && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full min-h-64"
                    style={{ height: 'calc(100vh - 220px)' }}
                  >
                    {isHtmlContent(response.headers) ? (
                      <HtmlPreview html={response.body} />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                        <span className="text-2xl opacity-30">🖼️</span>
                        <p className="text-sm text-zinc-400 dark:text-zinc-600">
                          Preview is only available for HTML responses.
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-700">
                          Content-Type: {response.headers['content-type'] || 'unknown'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
