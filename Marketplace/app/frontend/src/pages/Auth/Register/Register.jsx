import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaUserCircle, FaHome } from 'react-icons/fa';
import { register } from '../../../utils/api';
import Swal from 'sweetalert2';
import HeroBackground from '../../../components/HeroBackground/HeroBackground';
import './Register.css';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name || form.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Valid email is required';
    }
    
    if (!form.password || form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters with letters and numbers';
    }
    
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire({ title: 'Validation Error', text: 'Please fix the errors in the form', icon: 'error' });
      return;
    }
    
    setSubmitting(true);
    try {
      const { token } = await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      
      localStorage.setItem('jwt', token);
      localStorage.setItem('userName', form.name);
      
      Swal.fire({ title: 'Registration successful!', icon: 'success', timer: 1000, showConfirmButton: false });
      navigate('/dashboard');
    } catch (err) {
      Swal.fire({ title: 'Registration failed', text: err.message || 'Something went wrong', icon: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-bg">
      <HeroBackground />
      <Link to="/index" className="home-button">
        <FaHome />
        Home
      </Link>
      <form className="register-card" onSubmit={handleSubmit}>
        <h2 className="register-title">Create Account</h2>
        <p className="register-tagline">Join us and start your AI journey today.</p>
        
        <div className="icon-input">
          <FaUserCircle />
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        {errors.name && <span className="error-text">{errors.name}</span>}
        
        <div className="icon-input">
          <FaEnvelope />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
        {errors.email && <span className="error-text">{errors.email}</span>}
        
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
        {errors.password && <span className="error-text">{errors.password}</span>}
        
        <div className="icon-input">
          <FaLock />
          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={e => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
            required
          />
        </div>
        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating Account...' : 'Register'}
        </button>
        
        <p className="register-footer">
          Already have an account? <Link to="/login" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;

