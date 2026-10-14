/**
 * app/login/page.tsx
 *
 * Login page — full-screen centered card layout.
 * No TopNav (login/signup don't need navigation).
 * 
 * The gradient orbs are CSS-only — no JS, no library.
 * They're purely decorative and rendered on the server.
 */
import Link from 'next/link'
import AuthForm from '@/features/auth/components/AuthForm'

export const metadata = { title: 'Sign in — APIY' }

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-zinc-50 dark:bg-[#09090b] px-4">

      {/* Background gradient orbs — purely CSS, no JS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-500/10 dark:bg-violet-500/8 blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-fuchsia-500/10 dark:bg-fuchsia-500/8 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-violet-400/5 dark:bg-violet-400/5 blur-[80px]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#6d28d9 1px, transparent 1px), linear-gradient(to right, #6d28d9 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Card */}
      <div className="relative w-full max-w-[400px] z-10">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9v8l10-12h-9l3-8z" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">APIY</span>
        </div>

        {/* Glass card */}
        <div className="
          rounded-2xl border
          bg-white/80 dark:bg-white/[0.04]
          border-zinc-200/80 dark:border-white/[0.08]
          backdrop-blur-xl
          shadow-xl shadow-black/5 dark:shadow-black/30
          p-8
        ">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Welcome back</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Sign in to your workspace</p>
          </div>

          <AuthForm mode="login" />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-600 mt-6">
          REST · GraphQL · Built with Next.js
        </p>
      </div>
    </div>
  )
}
