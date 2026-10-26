import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  title = 'Delete post',
  message = 'Are you sure you want to delete this post?',
  confirmLabel = 'Delete post',
  onConfirm,
  onCancel,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function confirm() {
    setBusy(true);
    setError('');
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      setBusy(false);
    }
  }

  return (
    <Modal title={title} onClose={busy ? () => {} : onCancel} labelledBy="confirm-title">
      <p className="modal__body">{message}</p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="modal__actions">
        <Button variant="ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button variant="danger" onClick={confirm} loading={busy}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
