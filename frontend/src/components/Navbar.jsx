import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { token } = useAuth();
  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Logo />
        <button
          type="button"
          className="icon-btn navbar__toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav id="primary-nav" className={`navbar__links${open ? ' is-open' : ''}`} aria-label="Primary">
          <Link to="/" onClick={close}>Home</Link>
          <Link to="/#about" onClick={close}>About</Link>
          <Link to="/#features" onClick={close}>Features</Link>
          {token ? (
            <Button to="/dashboard" size="sm" onClick={close}>Go to dashboard</Button>
          ) : (
            <>
              <Link to="/login" onClick={close}>Login</Link>
              <Button to="/register" size="sm" onClick={close}>Get Started</Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
