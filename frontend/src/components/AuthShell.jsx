import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from './Logo';
import { heroImage } from '../utils/heroImage';

// Shared frame for login + register so the two pages match.
export default function AuthShell({ children }) {
  return (
    <div className="auth">
      <aside className="auth__visual" aria-hidden="true">
        {heroImage && <img src={heroImage} alt="" />}
        <div className="auth__veil" />
        <div className="auth__quote">
          <Logo light large />
          <p>Your Safety. Your Space. Your Peace of Mind.</p>
        </div>
      </aside>
      <main className="auth__main">
        <div className="auth__panel">
          <div className="auth__brand">
            <Logo />
          </div>
          {children}
          <Link to="/" className="auth__back">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
