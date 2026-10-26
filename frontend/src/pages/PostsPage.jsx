import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import Button from '../components/Button';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Skeleton from '../components/Skeleton';
import { EmptyState, ErrorState } from '../components/StatePanel';
import { createPost, updatePost, deletePost } from '../api/posts';
import { usePosts } from '../hooks/usePosts';
import { useToast } from '../context/ToastContext';

export default function PostsPage() {
  const { status, data: posts, error, reload } = usePosts();
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState(null); // { type: 'create' | 'edit' | 'delete', post? }

  // Dashboard's "Create post" button lands here with the form open.
  useEffect(() => {
    if (location.state?.openCreate) {
      setDialog({ type: 'create' });
      navigate('/posts', { replace: true, state: null });
    }
  }, [location.state, navigate]);

  const close = () => setDialog(null);

  async function handleCreate(values) {
    await createPost(values);
    toast.success('Post created.');
    close();
    reload();
  }

  async function handleUpdate(values) {
    await updatePost(dialog.post.id, values);
    toast.success('Post updated.');
    close();
    reload();
  }

  async function handleDelete() {
    try {
      await deletePost(dialog.post.id);
    } catch (err) {
      if (err.status === 403) toast.error(err.message);
      throw err;
    }
    toast.success('Post deleted.');
    close();
    reload();
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Posts</h1>
          <p className="muted">Create, review, update and delete your posts.</p>
        </div>
        <div className="section-head__actions">
          <button type="button" className="btn btn--outline" onClick={reload}>
            <RefreshCw size={16} /> Refresh
          </button>
          <Button onClick={() => setDialog({ type: 'create' })}>
            <Plus size={16} /> Create post
          </Button>
        </div>
      </div>

      {status === 'loading' && !posts && <Skeleton count={4} />}
      {status === 'error' && <ErrorState error={error} onRetry={reload} title="Posts could not be loaded" />}
      {status === 'success' && posts.length === 0 && (
        <EmptyState
          message="No posts yet. Create your first post to get started."
          action={<Button onClick={() => setDialog({ type: 'create' })}><Plus size={16} /> Create post</Button>}
        />
      )}
      {status === 'success' && posts.length > 0 && (
        <div className="post-list">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} onEdit={(post) => setDialog({ type: 'edit', post })} onDelete={(post) => setDialog({ type: 'delete', post })} />
          ))}
        </div>
      )}

      {dialog?.type === 'create' && (
        <Modal title="Create post" onClose={close}>
          <PostForm submitLabel="Create post" onSubmit={handleCreate} onCancel={close} />
        </Modal>
      )}
      {dialog?.type === 'edit' && (
        <Modal title="Edit post" onClose={close}>
          <PostForm initial={dialog.post} submitLabel="Save changes" onSubmit={handleUpdate} onCancel={close} />
        </Modal>
      )}
      {dialog?.type === 'delete' && (
        <ConfirmDialog message="Are you sure you want to delete this post?" onConfirm={handleDelete} onCancel={close} />
      )}
    </>
  );
}
