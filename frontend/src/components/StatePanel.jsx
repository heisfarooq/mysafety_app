import { AlertTriangle, FileText } from 'lucide-react';
import Button from './Button';
import { RefreshCw } from 'lucide-react';

export function ErrorState({ error, onRetry, title = 'Something went wrong' }) {
  const denied = error?.status === 403;
  return (
    <div className="state state--error" role="alert">
      <AlertTriangle size={28} aria-hidden="true" />
      <h3>{denied ? 'Access denied' : title}</h3>
      <p>{error?.message || 'Please try again.'}</p>
      {onRetry && !denied && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw size={16} /> Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ message, action }) {
  return (
    <div className="state">
      <FileText size={28} aria-hidden="true" />
      <p>{message}</p>
      {action}
    </div>
  );
}
