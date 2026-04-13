import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import './LoginPage.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const { login } = useAuth();
  const navigate = useNavigate();

  // Login state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // ── Login ──────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(''); setLoginLoading(true);
    try {
      const res = await api.post('/login.php', loginForm);
      if (res.data.success) {
        login(res.data.user);
        navigate('/dashboard');
      } else {
        setLoginError(res.data.message || 'Login failed');
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Server error. Is XAMPP running?');
    } finally { setLoginLoading(false); }
  };

  // ── Register ───────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError(''); setRegSuccess(''); setRegLoading(true);
    try {
      const res = await api.post('/register.php', regForm);
      if (res.data.success) {
        setRegSuccess(res.data.message);
        setRegForm({ name: '', email: '', password: '', role: 'user' });
        setTimeout(() => setTab('login'), 1800);
      } else {
        setRegError(res.data.message || 'Registration failed');
      }
    } catch (err) {
      setRegError(err.response?.data?.message || 'Server error. Is XAMPP running?');
    } finally { setRegLoading(false); }
  };

  return (
    <div className="login-bg">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Brand */}
        <div className="login-brand">
          <span className="brand-icon-lg">🏘️</span>
          <h1 className="login-title">Smart Rental</h1>
          <p className="login-subtitle">The intelligent way to find your next home.</p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Login</button>
          <button className={`tab-btn ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Register</button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'login' ? (
            <motion.form
              key="login-form"
              onSubmit={handleLogin}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              {loginError && <div className="alert alert-error">{loginError}</div>}
              <div className="form-group">
                <label htmlFor="l-email">Email Address</label>
                <input id="l-email" type="email" className="form-control" placeholder="you@example.com"
                  value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label htmlFor="l-password">Password</label>
                <input id="l-password" type="password" className="form-control" placeholder="••••••••"
                  value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg shine-effect" disabled={loginLoading}>
                {loginLoading ? <><span className="spinner" /> Signing in…</> : 'Sign In →'}
              </button>

            </motion.form>
          ) : (
            <motion.form
              key="reg-form"
              onSubmit={handleRegister}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              {regError && <div className="alert alert-error">{regError}</div>}
              {regSuccess && <div className="alert alert-success">{regSuccess}</div>}
              <div className="form-group">
                <label htmlFor="r-name">Full Name</label>
                <input id="r-name" type="text" className="form-control" placeholder="John Doe"
                  value={regForm.name} onChange={e => setRegForm({ ...regForm, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label htmlFor="r-email">Email Address</label>
                <input id="r-email" type="email" className="form-control" placeholder="you@example.com"
                  value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label htmlFor="r-password">Password</label>
                <input id="r-password" type="password" className="form-control" placeholder="Min. 6 characters"
                  value={regForm.password} onChange={e => setRegForm({ ...regForm, password: e.target.value })} required minLength={6} />
              </div>
              <div className="form-group">
                <label htmlFor="r-role">I am a…</label>
                <select id="r-role" className="form-control"
                  value={regForm.role} onChange={e => setRegForm({ ...regForm, role: e.target.value })}>
                  <option value="user">🏠 Tenant (searching for property)</option>
                  <option value="owner">🔑 Owner (listing property)</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg shine-effect" disabled={regLoading}>
                {regLoading ? <><span className="spinner" /> Creating account…</> : 'Create Account →'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
