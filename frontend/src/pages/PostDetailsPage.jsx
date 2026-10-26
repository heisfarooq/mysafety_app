import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import PostForm from '../components/PostForm';
import ConfirmDialog from '../components/ConfirmDialog';
import Skeleton from '../components/Skeleton';
import { ErrorState } from '../components/StatePanel';
import { getPost, updatePost, deletePost } from '../api/posts';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/format';

export default function PostDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { status, data: post, error, reload } = useFetch(() => getPost(id), [id]);
  const [dialog, setDialog] = useState(null);
  const close = () => setDialog(null);

  async function handleUpdate(values) {
    await updatePost(post.id, values);
    toast.success('Post updated.');
    close();
    reload();
  }

  async function handleDelete() {
    await deletePost(post.id);
    toast.success('Post deleted.');
    navigate('/posts', { replace: true });
  }

  return (
    <>
      <Link to="/posts" className="back-link">
        <ArrowLeft size={16} /> Back to posts
      </Link>

      {status === 'loading' && !post && <Skeleton count={1} />}
      {status === 'error' && (
        <ErrorState error={error} onRetry={reload} title={error?.status === 404 ? 'Post not found' : 'Post could not be loaded'} />
      )}

      {post && (
        <article className="card detail">
          <div className="post__head">
            <h1>{post.title || 'Untitled post'}</h1>
            {post.published !== null && (
              <span className={`badge ${post.published ? 'badge--on' : 'badge--off'}`}>{post.published ? 'Published' : 'Draft'}</span>
            )}
          </div>
          {post.createdAt && <p className="muted">{formatDate(post.createdAt)}</p>}
          <p className="detail__content">{post.content}</p>
          <div className="modal__actions">
            <button type="button" className="btn btn--outline" onClick={() => setDialog('edit')}>
              <Pencil size={16} /> Edit
            </button>
            <button type="button" className="btn btn--danger" onClick={() => setDialog('delete')}>
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </article>
      )}

      {dialog === 'edit' && post && (
        <Modal title="Edit post" onClose={close}>
          <PostForm initial={post} submitLabel="Save changes" onSubmit={handleUpdate} onCancel={close} />
        </Modal>
      )}
      {dialog === 'delete' && (
        <ConfirmDialog message="Are you sure you want to delete this post?" onConfirm={handleDelete} onCancel={close} />
      )}
    </>
  );
}
