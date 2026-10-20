'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

type Mode = 'login' | 'signup'

export default function AuthPage({ mode }: { mode: Mode }) {
  const isLogin = mode === 'login'
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      if (isLogin) {
        const res = await signIn('credentials', { redirect: false, email, password })
        if (res?.error) setError(res.error)
        else window.location.href = '/'
      } else {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error); setLoading(false); return }
        const signin = await signIn('credentials', { redirect: false, email, password })
        if (signin?.error) setError(signin.error)
        else window.location.href = '/'
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        /*
         * Blob keyframes — large translate values (80-120px) make
         * the movement clearly visible. Long durations (18-26s)
         * keep it calm. No glow, no box-shadow — just the blurred circle.
         */
        @keyframes driftA {
          0%   { transform: translate(0px,    0px)  scale(1);    }
          25%  { transform: translate(100px, -80px) scale(1.08); }
          50%  { transform: translate(60px,  110px) scale(0.94); }
          75%  { transform: translate(-90px,  50px) scale(1.05); }
          100% { transform: translate(0px,    0px)  scale(1);    }
        }
        @keyframes driftB {
          0%   { transform: translate(0px,     0px)  scale(1);    }
          25%  { transform: translate(-110px,  70px) scale(1.06); }
          50%  { transform: translate(-50px, -100px) scale(0.96); }
          75%  { transform: translate(90px,  -40px)  scale(1.04); }
          100% { transform: translate(0px,     0px)  scale(1);    }
        }
        @keyframes driftC {
          0%   { transform: translate(0px,   0px)  scale(1);    }
          33%  { transform: translate(70px,  90px) scale(1.07); }
          66%  { transform: translate(-80px, 60px) scale(0.93); }
          100% { transform: translate(0px,   0px)  scale(1);    }
        }
        @keyframes driftD {
          0%   { transform: translate(0px,    0px)  scale(1);    }
          40%  { transform: translate(-100px,-80px) scale(1.09); }
          80%  { transform: translate(70px,  -50px) scale(0.95); }
          100% { transform: translate(0px,    0px)  scale(1);    }
        }
        .blob-a { animation: driftA 22s ease-in-out infinite; }
        .blob-b { animation: driftB 26s ease-in-out infinite; }
        .blob-c { animation: driftC 19s ease-in-out infinite; }
        .blob-d { animation: driftD 24s ease-in-out infinite; }
      `}</style>

      <div
        className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4 py-12 bg-zinc-100 dark:bg-[#0e0e14]"
      >
        {/* Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="blob-a absolute rounded-full"
            style={{ top: '-8%', left: '-4%', width: '540px', height: '540px',
              background: '#3730a3', opacity: 0.35, filter: 'blur(90px)' }} />
          <div className="blob-b absolute rounded-full"
            style={{ top: '-4%', right: '-6%', width: '500px', height: '500px',
              background: '#5b21b6', opacity: 0.28, filter: 'blur(100px)' }} />
          <div className="blob-c absolute rounded-full"
            style={{ bottom: '-10%', left: '4%', width: '460px', height: '460px',
              background: '#1e3a8a', opacity: 0.32, filter: 'blur(85px)' }} />
          <div className="blob-d absolute rounded-full"
            style={{ bottom: '-6%', right: '-2%', width: '420px', height: '420px',
              background: '#4c1d95', opacity: 0.25, filter: 'blur(95px)' }} />
        </div>

        {/* Dot grid */}
        <div className="auth-dot-grid absolute inset-0 pointer-events-none" />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[390px]"
        >
          <div
            className="rounded-2xl px-7 pt-7 pb-7 bg-zinc-50/90 dark:bg-[rgba(18,18,26,0.82)] border border-zinc-200/90 dark:border-white/[0.07] backdrop-blur-[18px] shadow-[0_16px_48px_rgba(39,39,42,0.14)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
          >
            {/* Logo + heading */}
            <div className="flex flex-col items-center mb-6">
              <div className="mb-3">
                <Image
                  src="/logo.png"
                  alt="APIY"
                  width={42}
                  height={42}
                  className="rounded-xl"
                  priority
                />
              </div>
              <h1 className="text-[1.2rem] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {isLogin ? 'Sign in to APIY' : 'Create your account'}
              </h1>
              <p className="text-xs mt-1 text-zinc-500 dark:text-zinc-400">
                {isLogin ? 'Enter your credentials to continue' : 'Start testing APIs in seconds'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

              <AnimatePresence initial={false}>
                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <Field label="Name" type="text" placeholder="Deepak Kumar"
                      value={name} onChange={setName} disabled={loading} />
                  </motion.div>
                )}
              </AnimatePresence>

              <Field label="Email" type="email" placeholder="you@example.com"
                value={email} onChange={setEmail} disabled={loading} />

              {/* Password */}
              <div>
                <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
                  Password
                  {!isLogin && <span className="ml-1 font-normal text-zinc-400 dark:text-zinc-500">(min 8 chars)</span>}
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
                    className="w-full px-3 py-2.5 pr-9 rounded-lg text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/[0.09] outline-none transition-all focus:border-violet-500/60 focus:bg-violet-500/[0.06] disabled:opacity-50"
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                  >
                    {showPw
                      ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" strokeLinecap="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 .87-2.47 2.43-4.6 4.46-6.07M9.53 9.53A3.5 3.5 0 0 0 12 15.5a3.5 3.5 0 0 0 2.47-1.03M3 3l18 18"/></svg>
                      : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" strokeLinecap="round"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs text-red-600 dark:text-red-300 bg-red-500/[0.08] border border-red-500/[0.18]"
                  >
                    <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: loading ? 1 : 0.985 }}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-0.5"
                style={{
                  background: 'linear-gradient(135deg, #4c1d95, #6d28d9)',
                  boxShadow: '0 2px 10px rgba(76,29,149,0.4)',
                }}
              >
                {loading && <span className="w-3.5 h-3.5 border-2 border-white/25 border-t-white rounded-full animate-spin" />}
                {loading ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-zinc-200 dark:bg-white/[0.06]" />
              <span className="text-xs text-zinc-400 dark:text-zinc-500">or</span>
              <div className="flex-1 h-px bg-zinc-200 dark:bg-white/[0.06]" />
            </div>

            {/* Switch */}
            <p className="text-center text-xs text-zinc-500 dark:text-zinc-500">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Link
                href={isLogin ? '/signup' : '/login'}
                className="font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}

function Field({ label, type, placeholder, value, onChange, disabled }: {
  label: string; type: string; placeholder: string
  value: string; onChange: (v: string) => void; disabled?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
        {label}
      </label>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled} required
        className="w-full px-3 py-2.5 rounded-lg text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/[0.09] outline-none transition-all focus:border-violet-500/60 focus:bg-violet-500/[0.06] disabled:opacity-50"
      />
    </div>
  )
}
