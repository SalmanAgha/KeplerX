import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaHome } from 'react-icons/fa';
import Swal from 'sweetalert2';
import HeroBackground from '../../../components/HeroBackground/HeroBackground';
import './ForgotPassword.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:6010';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error('Failed to send reset email');
      }

      const data = await res.json();
      setEmailSent(true);
      
      Swal.fire({
        title: 'Email Sent',
        text: data.message || 'If an account exists with this email, a reset link has been sent',
        icon: 'success',
      });
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.message || 'Something went wrong',
        icon: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="forgot-bg">
        <HeroBackground />
        <Link to="/index" className="home-button">
          <FaHome />
          Home
        </Link>
        <div className="forgot-card">
          <h2 className="forgot-title">Check Your Email</h2>
          <p className="forgot-message">
            If an account exists with {email}, a password reset link has been sent.
          </p>
          <Link to="/login" className="forgot-link">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-bg">
      <HeroBackground />
      <Link to="/index" className="home-button">
        <FaHome />
        Home
      </Link>
      <form className="forgot-card" onSubmit={handleSubmit}>
        <h2 className="forgot-title">Forgot Password?</h2>
        <p className="forgot-description">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <div className="icon-input">
          <FaEnvelope />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={submitting}>
          {submitting ? 'Sending...' : 'Send Reset Link'}
        </button>
        
        <Link to="/login" className="forgot-link">
          Back to Login
        </Link>
      </form>
    </div>
  );
}

export default ForgotPassword;

