'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRequestConfigStore } from '@/features/rest-client/store/useRequestConfigStore'
import { RequestTab, BODY_MODES, RAW_BODY_TYPES } from '@/types/rest'
import { useSendRequest } from '@/features/rest-client/hooks/useSendRequest'
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
  const {
    headers, params, body, bodyMode, bodyRawType, bodyForm, auth, activeTab,
    setHeaders, setParams, setBody, setBodyMode, setBodyRawType, setBodyForm, setActiveTab,
  } = useRequestConfigStore()

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
                  ? 'text-violet-600 dark:text-violet-400'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className="ml-1.5 text-xs text-zinc-400 dark:text-zinc-600">{count}</span>
              )}
              {highlight && tab.key !== activeTab && (
                <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-violet-600 align-middle" />
              )}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="request-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600"
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
              <KeyValueEditor
                pairs={headers}
                onChange={setHeaders}
                keyPlaceholder="Header"
                valuePlaceholder="Value"
                suggestHeaders
              />
            )}
            {activeTab === 'body' && (
              <div className="flex flex-col gap-3 h-full">
                {/* Body mode selector */}
                <div className="flex items-center gap-4 flex-wrap">
                  {BODY_MODES.map((m) => (
                    <label
                      key={m.value}
                      className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer select-none"
                    >
                      <input
                        type="radio"
                        name="body-mode"
                        checked={bodyMode === m.value}
                        onChange={() => setBodyMode(m.value)}
                        className="w-3.5 h-3.5 accent-violet-600 cursor-pointer"
                      />
                      {m.label}
                    </label>
                  ))}

                  {/* Raw sub-type dropdown */}
                  {bodyMode === 'raw' && (
                    <select
                      value={bodyRawType}
                      onChange={(e) => setBodyRawType(e.target.value as typeof bodyRawType)}
                      className="ml-auto text-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/60 rounded-lg px-2 py-1 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-violet-400 dark:focus:border-violet-600/50 cursor-pointer"
                    >
                      {RAW_BODY_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Mode-specific editor */}
                {bodyMode === 'none' && (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xs text-zinc-400 dark:text-zinc-700">This request does not have a body</p>
                  </div>
                )}

                {bodyMode === 'raw' && (
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder={RAW_BODY_TYPES.find((t) => t.value === bodyRawType)?.placeholder}
                    spellCheck={false}
                    className="flex-1 min-h-52 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/60 rounded-xl p-3 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-800 focus:outline-none focus:border-violet-400 dark:focus:border-violet-600/50 font-mono resize-none transition-colors"
                  />
                )}

                {(bodyMode === 'form-data' || bodyMode === 'x-www-form-urlencoded') && (
                  <KeyValueEditor pairs={bodyForm} onChange={setBodyForm} keyPlaceholder="key" valuePlaceholder="value" />
                )}
              </div>
            )}
            {activeTab === 'auth' && <AuthEditor />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
