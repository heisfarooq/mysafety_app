export default function Skeleton({ count = 3 }) {
  return (
    <div className="skeleton-list" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card skeleton">
          <span className="skeleton__line skeleton__line--title" />
          <span className="skeleton__line" />
          <span className="skeleton__line skeleton__line--short" />
        </div>
      ))}
    </div>
  );
}
