import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  to,
  className = '',
  children,
  disabled,
  type = 'button',
  ...rest
}) {
  const cls = `btn btn--${variant} btn--${size} ${className}`.trim();
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading && <LoadingSpinner size={16} label="" />}
      {children}
    </button>
  );
}
