import { RefreshCw } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, reloadUser } = useAuth();
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Profile</h1>
          <p className="muted">The account details held by the server.</p>
        </div>
        <button type="button" className="btn btn--outline" onClick={reloadUser}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>
      <ProfileCard user={user} title="Your account" />
    </>
  );
}
