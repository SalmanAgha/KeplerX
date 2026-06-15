'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/pages/auth.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/user');
      }
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for sending reset link would go here
    setSubmitted(true);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Reset Access</h1>
        <p className={styles.subtitle}>Enter your email to recover your neural link</p>
        
        {!submitted ? (
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
              Send Reset Link
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>If an account exists for {email}, a recovery link has been sent.</p>
            <Link href="/login" className={styles.link}>Return to Login</Link>
          </div>
        )}

        <p className={styles.footer} style={{ marginTop: '24px' }}>
          Remember your password? <Link href="/login" className={styles.link}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
