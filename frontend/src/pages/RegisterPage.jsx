import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import Input from '../components/Input';
import Button from '../components/Button';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { isEmail } from '../utils/validation';

export default function RegisterPage() {
  const { token } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  if (token) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!email.trim()) next.email = 'Enter your email address.';
    else if (!isEmail(email)) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Choose a password.';
    if (!confirm) next.confirm = 'Re-enter your password.';
    else if (confirm !== password) next.confirm = 'Passwords do not match.';
    setErrors(next);
    setFormError('');
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      // Only { email, password } is sent. The confirm field never leaves the browser.
      const account = await register({ email: email.trim(), password });
      toast.success(`Account created for ${account.email}.`);
      navigate('/login', { replace: true, state: { registered: account.email } });
    } catch (err) {
      setFormError(err.status === 409 ? 'An account with this email already exists.' : err.message);
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="auth__title">Create Your Account</h1>
      <p className="auth__sub">Register with your email and a password to get started.</p>

      <form onSubmit={handleSubmit} noValidate className="form">
        <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <Input label="Password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <Input label="Confirm password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} />
        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}
        <Button type="submit" size="lg" loading={busy} className="btn--block">
          {busy ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>

      <p className="auth__switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </AuthShell>
  );
}
