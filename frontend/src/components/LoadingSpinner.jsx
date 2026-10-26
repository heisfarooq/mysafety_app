export default function LoadingSpinner({ size = 24, label = 'Loading' }) {
  return (
    <span className="spinner" style={{ width: size, height: size }} role={label ? 'status' : undefined} aria-label={label || undefined} />
  );
}
