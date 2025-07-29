import React, { useState, useEffect } from 'react';
import './Login.css';

interface LoginProps {
  onLogin: (isAuthenticated: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Check if there's a saved token in localStorage
    const token = localStorage.getItem('adminToken');
    if (token) {
      onLogin(true);
    }
  }, [onLogin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple authentication (in a real app, this would be an API call)
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        if (rememberMe) {
          localStorage.setItem('adminToken', 'demo-token-12345');
        } else {
          sessionStorage.setItem('adminToken', 'demo-token-12345');
        }
        onLogin(true);
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-left">
          <div className="login-brand">
            <h1>KeplerX</h1>
            <div className="login-brand-subtitle">Admin Portal</div>
          </div>
          <div className="login-decoration">
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
          </div>
        </div>
        <div className="admin-login-right">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Enter your credentials to access the admin dashboard</p>
          </div>
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">
                <i className="fas fa-user"></i>
              </label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i>
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <div className="login-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <a href="#" className="forgot-password">
                Forgot Password?
              </a>
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          <div className="login-footer">
            <p>Demo Credentials</p>
            <div className="demo-credentials">
              <div className="credential-item">
                <span className="credential-label">Username:</span>
                <span className="credential-value">admin</span>
              </div>
              <div className="credential-item">
                <span className="credential-label">Password:</span>
                <span className="credential-value">admin123</span>
              </div>
            </div>
            <a href="/" className="back-to-site-link">
              <i className="fas fa-arrow-left"></i> Back to Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 