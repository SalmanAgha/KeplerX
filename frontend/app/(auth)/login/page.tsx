'use client';
// Lucide react dependency resolution trigger

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/api';
import { Cpu, Eye, EyeOff } from 'lucide-react';
import styles from '@/styles/pages/auth.module.css';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login: authLogin, token: currentToken, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/user');
      }
    }
  }, [user, router]);

  // Handle OAuth callback token from URL
  useEffect(() => {
    const token = searchParams.get('token');
    const userJson = searchParams.get('user');
    
    // Only proceed if we have a token in URL AND it's different from the one we already have
    if (token && userJson && token !== currentToken) {
      try {
        const decodedUser = decodeURIComponent(userJson);
        const user = JSON.parse(decodedUser);
        
        authLogin(token, user);
        
        // Clear parameters from URL for security and to prevent re-execution
        window.history.replaceState({}, document.title, window.location.pathname);
        
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/user');
        }
      } catch (e) {
        console.error('Social login parsing error:', e);
        setError('Failed to process social login. Please try again.');
      }
    }
  }, [searchParams, authLogin, currentToken, router]);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5001/api/auth/google';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await authService.login({ email, password });
      
      if (response.status === 'success') {
        authLogin(response.token, response.user);
        
        if (response.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/user');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <img src="/keplerx-logo-color.png" alt="KeplerX Logo" style={{ width: '160px', height: 'auto' }} />
        </div>
        <h1 className={styles.title} style={{ fontSize: '1.75rem', marginBottom: '24px' }}>Sign in to KeplerX CRM</h1>
        
        {error && <div style={{ background: 'rgba(255, 77, 77, 0.1)', border: '1px solid rgba(255, 77, 77, 0.3)', borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: '24px', textAlign: 'center' }}>
          <p style={{ color: '#ff4d4d', fontSize: '0.875rem', margin: 0 }}>{error}</p>
        </div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px', paddingRight: '40px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div style={{ textAlign: 'right', marginTop: '8px' }}>
              <Link href="/forgot-password" style={{ fontSize: '0.75rem', color: '#094f56', textDecoration: 'none' }}>Forgot Password?</Link>
            </div>
          </div>
          
          <button type="submit" style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: 'var(--radius-md)', 
            background: '#094f56', 
            color: 'white', 
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            transition: 'var(--transition-snappy)'
          }}>
            Continue
          </button>
        </form>


      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading Access...</div>}>
      <LoginContent />
    </Suspense>
  );
}
