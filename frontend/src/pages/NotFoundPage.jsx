import Button from '../components/Button';

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="container notfound">
        <h1>Page not found</h1>
        <p className="muted">The page you are looking for doesn't exist or has moved.</p>
        <Button to="/">Back to home</Button>
      </div>
    </section>
  );
}
