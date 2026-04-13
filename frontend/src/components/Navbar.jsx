import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import React from 'react';
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = user
    ? user.role === 'owner'
      ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/add-property', label: 'Add Property' },
        { to: '/loan-calculator', label: 'EMI Calculator' },
      ]
      : [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/properties', label: 'Browse Properties' },
        { to: '/loan-calculator', label: 'EMI Calculator' },
      ]
    : [
      { to: '/', label: 'Home' },
      { to: '/properties', label: 'Browse' },
    ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      className={`navbar ${location.pathname === '/' ? 'navbar-home' : ''} ${scrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🏘️</span>
          <span className="brand-text">Smart Rental</span>
        </Link>

        <ul className="navbar-links">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`nav-link ${isActive(to) ? 'active' : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          {user ? (
            <div className="navbar-user">
              <div className="user-info">
                <span className="user-avatar">{user?.name?.[0]?.toUpperCase()}</span>
                <span className="user-name">{user?.name}</span>
                <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
              </div>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
