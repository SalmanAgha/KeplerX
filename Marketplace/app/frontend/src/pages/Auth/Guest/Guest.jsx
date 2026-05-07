import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserSecret, FaHome } from 'react-icons/fa';
import Swal from 'sweetalert2';
import HeroBackground from '../../../components/HeroBackground/HeroBackground';
import './Guest.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:6010';

function Guest() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGuestAccess = async () => {
    setLoading(true);
    
    try {
      const res = await fetch(`${API}/api/auth/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error('Failed to create guest session');
      }

      const data = await res.json();
      localStorage.setItem('jwt', data.token);
      localStorage.setItem('userName', data.user.name || 'Guest');
      
      Swal.fire({
        title: 'Welcome Guest!',
        text: 'You can now explore the platform',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
      });
      
      navigate('/dashboard');
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.message || 'Something went wrong',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guest-bg">
      <HeroBackground />
      <Link to="/index" className="home-button">
        <FaHome />
        Home
      </Link>
      <div className="guest-card">
        <h2 className="guest-title">Continue as Guest</h2>
        <p className="guest-description">
          Explore our platform without creating an account. You can always register later for full access.
        </p>
        
        <button 
          onClick={handleGuestAccess} 
          disabled={loading}
          className="guest-button"
        >
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <>
              <FaUserSecret style={{ marginRight: '8px' }} />
              Continue as Guest
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Guest;

