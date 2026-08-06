import AuthForm from '@/features/auth/components/AuthForm';
import '@/features/auth/components/auth.css';

export default function LoginPage() {
  return (
    <div className="auth-container">
      <AuthForm mode="login" />
    </div>
  );
}
