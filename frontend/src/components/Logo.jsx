import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Logo({ to = '/', light = false, large = false }) {
  return (
    <Link to={to} className={`logo${light ? ' logo--light' : ''}${large ? ' logo--large' : ''}`} aria-label="MY SAFETY home">
      <span className="logo__mark">
        <ShieldCheck aria-hidden="true" />
      </span>
      <span className="logo__text">MY SAFETY</span>
    </Link>
  );
}
