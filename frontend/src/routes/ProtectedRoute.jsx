import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { ErrorState } from '../components/StatePanel';
import Button from '../components/Button';

// UX gate only. The backend enforces real authorization on every request.
export default function ProtectedRoute() {
  const { token, status, profileError, reloadUser, logout } = useAuth();
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  if (status === 'loading') {
    return (
      <div className="fullpage">
        <LoadingSpinner size={36} />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fullpage">
        <ErrorState error={profileError} onRetry={reloadUser} title="We couldn't load your account" />
        <Button variant="ghost" onClick={logout}>
          Log out
        </Button>
      </div>
    );
  }

  return <Outlet />;
}
