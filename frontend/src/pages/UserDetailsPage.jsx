import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import Skeleton from '../components/Skeleton';
import { ErrorState } from '../components/StatePanel';
import { getUser } from '../api/users';
import { useFetch } from '../hooks/useFetch';

export default function UserDetailsPage() {
  const { id } = useParams();
  const { status, data: user, error, reload } = useFetch(() => getUser(id), [id]);
  return (
    <>
      <Link to="/users" className="back-link">
        <ArrowLeft size={16} /> Back to accounts
      </Link>
      {status === 'loading' && !user && <Skeleton count={1} />}
      {status === 'error' && (
        <ErrorState error={error} onRetry={reload} title={error?.status === 404 ? 'Account not found' : 'Account could not be loaded'} />
      )}
      {user && <ProfileCard user={user} title={`Account ${user.id}`} />}
    </>
  );
}
