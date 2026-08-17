import Link from 'next/link'
import AuthForm from '@/features/auth/components/AuthForm'
import AuthVisual from '@/features/auth/components/AuthVisual'
import '@/features/auth/components/auth.css'

export default function LoginPage() {
  return (
    <div className="auth-container">
      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <AuthForm mode="login" />
        </div>
      </div>

      <AuthVisual
        headline="Test any API, right in your browser"
        subtext="REST and GraphQL clients, request history, and auth workflows — all in one clean workspace."
      />
    </div>
  )
}
