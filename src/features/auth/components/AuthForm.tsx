'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type AuthFormProps = {
  mode: 'login' | 'signup';
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // only used for signup
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        // signup flow: call internal API to create user then sign in
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
      <h2>{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
      {mode === 'signup' && (
        <input
          className="auth-input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}
      <input
        className="auth-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="auth-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <div className="error-message">{error}</div>}
      <button type="submit" className="auth-button" disabled={loading}>
        {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
}
