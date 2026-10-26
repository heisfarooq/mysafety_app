import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import AuthShell from '../components/AuthShell';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { isEmail } from '../utils/validation';

export default function LoginPage() {
  const { login, token, notice, dismissNotice } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const registeredEmail = location.state?.registered;
  const from = location.state?.from || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  if (token && !busy) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!email.trim()) next.email = 'Enter your email address.';
    else if (!isEmail(email)) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Enter your password.';
    setErrors(next);
    setFormError('');
    if (Object.keys(next).length) return;

    setBusy(true);
    dismissNotice();
    try {
      await login({ email: email.trim(), password });
      toast.success('Signed in successfully.');
      navigate(from, { replace: true });
    } catch (err) {
      if (err.kind === 'http' && (err.status === 401 || err.status === 403)) {
        setFormError('Incorrect email or password. Check your details and try again.');
      } else {
        setFormError(err.message);
      }
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="auth__title">Welcome Back</h1>
      <p className="auth__sub">Sign in to continue to your MY SAFETY account.</p>

      {registeredEmail && (
        <p className="banner banner--ok" role="status">
          <CheckCircle2 size={18} /> Account created for {registeredEmail}. Log in to continue.
        </p>
      )}
      {notice && (
        <p className="banner banner--warn" role="status">
          <AlertTriangle size={18} /> {notice}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="form">
        <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <Input label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}
        <Button type="submit" size="lg" loading={busy} className="btn--block">
          {busy ? 'Logging in…' : 'Login'}
        </Button>
      </form>

      <p className="auth__switch">
        New to MY SAFETY? <Link to="/register">Create an account</Link>
      </p>
    </AuthShell>
  );
}
