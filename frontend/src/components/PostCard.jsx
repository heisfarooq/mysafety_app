import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/format';

export default function PostCard({ post, onEdit, onDelete }) {
  return (
    <article className="card post">
      <div className="post__head">
        <h3 className="post__title">
          <Link to={`/posts/${post.id}`}>{post.title || 'Untitled post'}</Link>
        </h3>
        {post.published !== null && (
          <span className={`badge ${post.published ? 'badge--on' : 'badge--off'}`}>{post.published ? 'Published' : 'Draft'}</span>
        )}
      </div>
      <p className="post__content">{post.content}</p>
      <div className="post__foot">
        <span className="muted">{post.createdAt ? formatDate(post.createdAt) : `Post ${post.id}`}</span>
        <div className="post__actions">
          <Link to={`/posts/${post.id}`} className="btn btn--ghost btn--sm">
            View
          </Link>
          {onEdit && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => onEdit(post)}>
              <Pencil size={14} /> Edit
            </button>
          )}
          {onDelete && (
            <button type="button" className="btn btn--ghost btn--sm btn--danger-text" onClick={() => onDelete(post)}>
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
