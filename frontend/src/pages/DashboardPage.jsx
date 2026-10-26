import { Link, useNavigate } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import Button from '../components/Button';
import PostCard from '../components/PostCard';
import ProfileCard from '../components/ProfileCard';
import Skeleton from '../components/Skeleton';
import { EmptyState, ErrorState } from '../components/StatePanel';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../hooks/usePosts';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { status, data: posts, error, reload } = usePosts();

  const total = posts?.length ?? 0;
  const published = posts?.filter((p) => p.published === true).length ?? 0;
  const drafts = posts?.filter((p) => p.published === false).length ?? 0;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Welcome to MY SAFETY</h1>
          <p className="muted">Manage your information and stay organized from one place.</p>
        </div>
        <Button onClick={() => navigate('/posts', { state: { openCreate: true } })}>
          <Plus size={16} /> Create post
        </Button>
      </div>

      <div className="dash-grid">
        <ProfileCard user={user} />

        <section className="card" aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="card__title">Posts overview</h2>
          {status === 'success' ? (
            <div className="stats">
              <div><strong>{total}</strong><span>Total</span></div>
              <div><strong>{published}</strong><span>Published</span></div>
              <div><strong>{drafts}</strong><span>Drafts</span></div>
            </div>
          ) : (
            <p className="muted">{status === 'error' ? 'Unavailable right now.' : 'Loading…'}</p>
          )}
        </section>
      </div>

      <div className="section-head">
        <h2>Available posts</h2>
        <div className="section-head__actions">
          <button type="button" className="btn btn--ghost btn--sm" onClick={reload}>
            <RefreshCw size={14} /> Refresh
          </button>
          <Link to="/posts" className="btn btn--outline btn--sm">Manage posts</Link>
        </div>
      </div>

      {status === 'loading' && !posts && <Skeleton count={3} />}
      {status === 'error' && <ErrorState error={error} onRetry={reload} title="Posts could not be loaded" />}
      {status === 'success' && posts.length === 0 && (
        <EmptyState message="No posts yet. Create your first post to get started." />
      )}
      {status === 'success' && posts.length > 0 && (
        <div className="post-list">
          {posts.slice(0, 5).map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </>
  );
}
