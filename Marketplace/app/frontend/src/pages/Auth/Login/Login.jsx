import React, { useState, useEffect } from 'react';
import './Login.css';
import { FaUser, FaLock, FaHome } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../../../utils/api';
import Swal from 'sweetalert2';
import HeroBackground from '../../../components/HeroBackground/HeroBackground';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // If token already present, skip login
  useEffect(() => {
    if (localStorage.getItem('jwt')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { token } = await loginApi(form.email, form.password);
      localStorage.setItem('jwt', token);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const display = payload.name || payload.username || payload.email || form.email || payload.sub;
        if (display) localStorage.setItem('userName', display);
      } catch (_) {/* ignore decode errors */}
      Swal.fire({ title: 'Logged in', icon: 'success', timer: 800, showConfirmButton: false });
      navigate('/dashboard');
    } catch (err) {
      Swal.fire({ title: 'Login failed', text: err.message, icon: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-bg">
      <HeroBackground />
      <Link to="/index" className="home-button">
        <FaHome />
        Home
      </Link>
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        <p className="login-tagline">Welcome back! Start your AI journey today.</p>
        <div className="icon-input">
          <FaUser />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
        <div className="icon-input">
          <FaLock />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
            required
          />
        </div>
        <button type="submit" disabled={submitting}>Login</button>
        
        <Link to="/forgot-password" style={{ textAlign: 'center', fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
          Forgot Password?
        </Link>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <Link to="/register" style={{ flex: 1, textAlign: 'center', fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 600 }}>
            Create Account
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>or</span>
          <Link to="/guest" style={{ flex: 1, textAlign: 'center', fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 600 }}>
            Continue as Guest
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
