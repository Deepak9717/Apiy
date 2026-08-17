import Link from 'next/link'
import AuthForm from '@/features/auth/components/AuthForm'
import AuthVisual from '@/features/auth/components/AuthVisual'
import '@/features/auth/components/auth.css'

export default function SignupPage() {
  return (
    <div className="auth-container">
      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <AuthForm mode="signup" />
        </div>
      </div>

      <AuthVisual
        headline="Ship faster with a workspace built for APIs"
        subtext="Save requests, share collections with your team, and skip the CORS headaches entirely."
      />
    </div>
  )
}
