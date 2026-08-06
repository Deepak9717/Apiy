import AuthForm from '@/features/auth/components/AuthForm';
import '@/features/auth/components/auth.css';

export default function SignupPage() {
  return (
    <div className="auth-container">
      <AuthForm mode="signup" />
    </div>
  );
}
