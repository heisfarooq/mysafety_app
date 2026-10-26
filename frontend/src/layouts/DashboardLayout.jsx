import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, UserRound, LogOut, Menu } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/posts', label: 'Posts', icon: FileText },
  { to: '/users', label: 'Accounts', icon: Users },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  function handleLogout() {
    navigate('/', { replace: true });
    logout();
    toast.info('You have been logged out.');
  }

  return (
    <div className="app">
      <aside className={`sidebar${open ? ' is-open' : ''}`} aria-label="Sidebar">
        <Logo to="/dashboard" light />
        <nav className="sidebar__nav" aria-label="Main">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `sidebar__link${isActive ? ' is-active' : ''}`}>
              <Icon size={18} aria-hidden="true" /> {label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="sidebar__link sidebar__logout" onClick={handleLogout}>
          <LogOut size={18} aria-hidden="true" /> Log out
        </button>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} aria-hidden="true" />}

      <div className="app__main">
        <header className="topbar">
          <button type="button" className="icon-btn topbar__menu" onClick={() => setOpen(true)} aria-label="Open navigation">
            <Menu size={22} />
          </button>
          <span className="topbar__user" title={user?.email}>
            {user?.email}
          </span>
          <button type="button" className="btn btn--outline btn--sm" onClick={handleLogout}>
            <LogOut size={14} /> Log out
          </button>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
