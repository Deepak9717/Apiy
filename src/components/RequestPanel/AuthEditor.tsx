'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRequestConfigStore } from '@/store/useRequestConfigStore'
import { AuthType } from '@/lib/types'

const AUTH_TYPES: { value: AuthType; label: string; description: string }[] = [
  { value: 'none', label: 'No Auth', description: 'Request will be sent without any auth headers' },
  { value: 'bearer', label: 'Bearer Token', description: 'Adds Authorization: Bearer <token>' },
  { value: 'basic', label: 'Basic Auth', description: 'Adds Authorization: Basic <base64>' },
  { value: 'apikey', label: 'API Key', description: 'Add a key/value to header or query params' },
]

const inputCls =
  'w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/60 rounded-lg px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 focus:outline-none focus:border-orange-400 dark:focus:border-orange-500/50 font-mono transition-colors'

const labelCls = 'text-xs text-zinc-500 dark:text-zinc-500 mb-1 block'

export default function AuthEditor() {
  const { auth, setAuth } = useRequestConfigStore()

  return (
    <div className="flex flex-col gap-4">
      {/* Auth type selector */}
      <div className="grid grid-cols-2 gap-2">
        {AUTH_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setAuth({ type: t.value })}
            className={`flex flex-col gap-0.5 p-3 rounded-lg border text-left transition-all ${
              auth.type === t.value
                ? 'border-orange-500/50 bg-orange-500/5 text-orange-400'
                : 'border-zinc-200 dark:border-zinc-700/60 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <span className="text-sm font-medium">{t.label}</span>
            <span className="text-xs opacity-60 leading-snug">{t.description}</span>
          </button>
        ))}
      </div>

      {/* Fields per auth type */}
      <AnimatePresence mode="wait">
        {auth.type === 'none' && (
          <motion.div
            key="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          >
            <span className="text-xl">🔓</span>
            <p className="text-xs text-zinc-500 dark:text-zinc-600">
              No authentication will be added to this request.
            </p>
          </motion.div>
        )}

        {auth.type === 'bearer' && (
          <motion.div
            key="bearer"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="flex flex-col gap-3"
          >
            <div>
              <label className={labelCls}>Token</label>
              <input
                type="text"
                value={auth.token}
                onChange={(e) => setAuth({ token: e.target.value })}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className={inputCls}
              />
            </div>
            {auth.token && (
              <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500 dark:text-zinc-600 font-mono break-all">
                  Authorization: Bearer{' '}
                  <span className="text-orange-500 dark:text-orange-400/70">{auth.token.slice(0, 24)}…</span>
                </p>
              </div>
            )}
          </motion.div>
        )}

        {auth.type === 'basic' && (
          <motion.div
            key="basic"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="flex flex-col gap-3"
          >
            <div>
              <label className={labelCls}>Username</label>
              <input
                type="text"
                value={auth.username}
                onChange={(e) => setAuth({ username: e.target.value })}
                placeholder="user@example.com"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Password</label>
              <input
                type="password"
                value={auth.password}
                onChange={(e) => setAuth({ password: e.target.value })}
                placeholder="••••••••"
                className={inputCls}
              />
            </div>
            {auth.username && (
              <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500 dark:text-zinc-600 font-mono break-all">
                  Authorization: Basic{' '}
                  <span className="text-orange-500 dark:text-orange-400/70">
                    {btoa(`${auth.username}:${auth.password}`).slice(0, 24)}…
                  </span>
                </p>
              </div>
            )}
          </motion.div>
        )}

        {auth.type === 'apikey' && (
          <motion.div
            key="apikey"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="flex flex-col gap-3"
          >
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelCls}>Key name</label>
                <input
                  type="text"
                  value={auth.apiKeyName}
                  onChange={(e) => setAuth({ apiKeyName: e.target.value })}
                  placeholder="X-API-Key"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Value</label>
                <input
                  type="text"
                  value={auth.apiKeyValue}
                  onChange={(e) => setAuth({ apiKeyValue: e.target.value })}
                  placeholder="your-api-key"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Add to</label>
              <div className="flex gap-2">
                {(['header', 'query'] as const).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setAuth({ apiKeyIn: loc })}
                    className={`flex-1 py-2 rounded-lg border text-sm capitalize transition-all ${
                      auth.apiKeyIn === loc
                        ? 'border-orange-500/50 bg-orange-500/5 text-orange-400'
                        : 'border-zinc-200 dark:border-zinc-700/60 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                    }`}
                  >
                    {loc === 'header' ? 'Request Header' : 'Query Param'}
                  </button>
                ))}
              </div>
            </div>

            {auth.apiKeyName && auth.apiKeyValue && (
              <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500 dark:text-zinc-600 font-mono">
                  {auth.apiKeyIn === 'header' ? 'Header: ' : 'Query param: '}
                  <span className="text-orange-500 dark:text-orange-400/70">{auth.apiKeyName}</span>
                  {' = '}
                  <span className="text-emerald-500 dark:text-emerald-400/70">{auth.apiKeyValue}</span>
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
