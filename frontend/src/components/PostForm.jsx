import { useState } from 'react';
import Input from './Input';
import Button from './Button';

// Used for both create (no `initial`) and update (full object; PUT needs all three fields).
export default function PostForm({ initial, submitLabel, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [published, setPublished] = useState(initial?.published ?? true);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!title.trim()) next.title = 'Enter a title.';
    if (!content.trim()) next.content = 'Enter some content.';
    setErrors(next);
    setFormError('');
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      await onSubmit({ title: title.trim(), content: content.trim(), published });
    } catch (err) {
      setFormError(err.message || 'Something went wrong.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="form">
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} maxLength={200} />
      <Input label="Content" multiline value={content} onChange={(e) => setContent(e.target.value)} error={errors.content} />
      <label className="check">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        <span>Published</span>
      </label>
      {formError && (
        <p className="form-error" role="alert">
          {formError}
        </p>
      )}
      <div className="modal__actions">
        <Button variant="ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button type="submit" loading={busy}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
