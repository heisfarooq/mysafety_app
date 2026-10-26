import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import { EmptyState, ErrorState } from '../components/StatePanel';
import { getUsers } from '../api/users';
import { useFetch } from '../hooks/useFetch';
import { formatDate } from '../utils/format';

export default function UsersPage() {
  const { status, data: users, error, reload } = useFetch(getUsers, []);
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Accounts</h1>
          <p className="muted">Accounts returned by the server for your session.</p>
        </div>
        <button type="button" className="btn btn--outline" onClick={reload}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {status === 'loading' && !users && <Skeleton count={2} />}
      {status === 'error' && <ErrorState error={error} onRetry={reload} title="Accounts could not be loaded" />}
      {status === 'success' && users.length === 0 && <EmptyState message="No accounts were returned." />}
      {status === 'success' && users.length > 0 && (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Email</th><th>Created</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td><Link to={`/users/${u.id}`}>{u.email}</Link></td>
                  <td>{formatDate(u.timeCreated)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
