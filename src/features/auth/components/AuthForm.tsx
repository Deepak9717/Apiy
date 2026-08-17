'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type AuthFormProps = {
  mode: 'login' | 'signup';
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const busy = loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        if (result?.error) {
          setError(result.error);
        } else {
          router.push('/');
        }
      } else {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.message || 'Signup failed');
        } else {
          // after successful signup, automatically sign in
          const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
          });
          if (result?.error) {
            setError(result.error);
          } else {
            router.push('/');
          }
        }
      }
    } catch (err) {
      setError('Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <div>
        <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p className="auth-subtitle">
          {mode === 'login'
            ? 'Sign in to pick up where you left off.'
            : 'Start testing APIs in under a minute.'}
        </p>
      </div>

      {mode === 'signup' && (
        <label className="auth-field">
          <span className="auth-label">Name</span>
          <input
            className="auth-input"
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={busy}
            required
          />
        </label>
      )}
      <label className="auth-field">
        <span className="auth-label">Email</span>
        <input
          className="auth-input"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
          required
        />
      </label>
      <label className="auth-field relative">
        <span className="auth-label">Password</span>
        <input
          className="auth-input"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          style={{ width: "100%", paddingRight: "40px" }}
          onChange={(e) => setPassword(e.target.value)}
          disabled={busy}
          required
        />
        <button
          className="p-1 cursor-pointer absolute right-2 top-8.5"
          type='button'
          disabled={busy}
          title='Show/Hide'
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </label>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" className="auth-button" disabled={busy}>
        {loading && <span className="auth-spinner" aria-hidden="true" />}
        {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 2L3 14h9v8l10-12h-9l3-8z" />
        </svg>
      </button>

      <p className="auth-switch">
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <Link href="/signup">Sign up</Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/login">Sign in</Link>
          </>
        )}
      </p>
    </form>
  );
}
