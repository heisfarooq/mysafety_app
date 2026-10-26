import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <Logo light />
          <p className="footer__copy">&copy; {new Date().getFullYear()} MY SAFETY. All rights reserved.</p>
        </div>
        <nav aria-label="Footer" className="footer__links">
          <Link to="/">Home</Link>
          <Link to="/#about">About</Link>
          <Link to="/#features">Features</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Get Started</Link>
        </nav>
      </div>
    </footer>
  );
}
