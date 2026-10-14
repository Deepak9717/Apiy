'use client'

/**
 * AuthForm.tsx
 *
 * Single form component used for both login and signup.
 * Mode prop switches between the two flows.
 *
 * Flow:
 *  signup → POST /api/auth/signup → signIn('credentials') → redirect /
 *  login  → signIn('credentials') → redirect /
 *
 * signIn('credentials', { redirect: false }) lets us catch errors in JS
 * instead of being redirected to an error page by NextAuth.
 */
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

type Mode = 'login' | 'signup'

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  const isLogin = mode === 'login'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const res = await signIn('credentials', { redirect: false, email, password })
        if (res?.error) setError(res.error)
        else router.push('/')
      } else {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error); return }

        // Auto sign-in after successful registration
        const signin = await signIn('credentials', { redirect: false, email, password })
        if (signin?.error) setError(signin.error)
        else router.push('/')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = `
    w-full px-4 py-2.5 rounded-xl text-sm
    bg-white/60 dark:bg-white/5
    border border-zinc-200 dark:border-white/10
    text-zinc-900 dark:text-zinc-100
    placeholder:text-zinc-400 dark:placeholder:text-zinc-600
    focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 dark:focus:border-violet-500
    transition-all duration-150
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">

      <AnimatePresence initial={false}>
        {mode === 'signup' && (
          <motion.div
            key="name"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <label className="block mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Name
            </label>
            <input
              type="text"
              placeholder="Deepak Kumar"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              disabled={loading}
              className={inputCls}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <label className="block mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Email
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
          className={inputCls}
        />
      </div>

      <div>
        <label className="block mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Password {!isLogin && <span className="text-zinc-400 font-normal">(min 8 chars)</span>}
        </label>
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={isLogin ? undefined : 8}
            className={inputCls + ' pr-10'}
          />
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            tabIndex={-1}
          >
            {showPw
              ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 .87-2.47 2.43-4.6 4.46-6.07M9.53 9.53A3.5 3.5 0 0 0 12 15.5a3.5 3.5 0 0 0 2.47-1.03M3 3l18 18"/></svg>
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-xs text-red-600 dark:text-red-400"
          >
            <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-1"
      >
        {loading && (
          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {loading ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
      </motion.button>

      <p className="text-center text-xs text-zinc-500 dark:text-zinc-500">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <Link
          href={isLogin ? '/signup' : '/login'}
          className="text-violet-600 dark:text-violet-400 font-medium hover:underline"
        >
          {isLogin ? 'Sign up' : 'Sign in'}
        </Link>
      </p>
    </form>
  )
}
