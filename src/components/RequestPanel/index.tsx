'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRequestConfigStore } from '@/store/useRequestConfigStore'
import { RequestTab } from '@/lib/types'
import { useSendRequest } from '@/lib/useSendRequest'
import KeyValueEditor from './KeyValueEditor'
import UrlBar from './UrlBar'
import AuthEditor from './AuthEditor'

const TABS: { key: RequestTab; label: string }[] = [
  { key: 'params', label: 'Params' },
  { key: 'headers', label: 'Headers' },
  { key: 'body', label: 'Body' },
  { key: 'auth', label: 'Auth' },
]

export default function RequestPanel() {
  const { headers, params, body, auth, activeTab, setHeaders, setParams, setBody, setActiveTab } =
    useRequestConfigStore()

  const { send, cancel, isPending } = useSendRequest()

  const paramsCount = params.filter((p) => p.enabled && p.key).length
  const headersCount = headers.filter((h) => h.enabled && h.key).length
  const authActive = auth.type !== 'none'

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <UrlBar onSend={() => send()} onCancel={cancel} isPending={isPending} />

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-4">
        {TABS.map((tab) => {
          const count =
            tab.key === 'params' ? paramsCount
            : tab.key === 'headers' ? headersCount
            : 0
          const highlight = tab.key === 'auth' && authActive

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 py-2.5 text-sm transition-colors ${
                activeTab === tab.key
                  ? 'text-orange-500 dark:text-orange-400'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className="ml-1.5 text-xs text-zinc-400 dark:text-zinc-600">{count}</span>
              )}
              {highlight && tab.key !== activeTab && (
                <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-orange-500 align-middle" />
              )}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="request-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
            </button>
          )
        })}
        <span className="ml-auto text-xs text-zinc-300 dark:text-zinc-800 self-center select-none">
          ⌘ Enter to send
        </span>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="h-full"
          >
            {activeTab === 'params' && (
              <KeyValueEditor pairs={params} onChange={setParams} keyPlaceholder="param" valuePlaceholder="value" />
            )}
            {activeTab === 'headers' && (
              <KeyValueEditor pairs={headers} onChange={setHeaders} keyPlaceholder="Header" valuePlaceholder="Value" />
            )}
            {activeTab === 'body' && (
              <div className="flex flex-col gap-2 h-full">
                <span className="text-xs text-zinc-500 dark:text-zinc-700">Raw JSON body</span>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={'{\n  "key": "value"\n}'}
                  spellCheck={false}
                  className="flex-1 min-h-52 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/60 rounded-lg p-3 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-800 focus:outline-none focus:border-orange-400 dark:focus:border-orange-500/50 font-mono resize-none transition-colors"
                />
              </div>
            )}
            {activeTab === 'auth' && <AuthEditor />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
