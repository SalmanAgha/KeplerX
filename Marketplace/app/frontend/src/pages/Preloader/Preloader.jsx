import React from 'react';
import HeroBackground from '../../components/HeroBackground/HeroBackground';
import './Preloader.css';

function Preloader() {
  return (
    <div className="preloader-bg">
      <HeroBackground />
      <div className="preloader-content">
        <div className="preloader-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#28CC00" strokeWidth="4" className="logo-circle" />
              <path d="M30 50 L45 65 L70 35" fill="none" stroke="#28CC00" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="logo-check" />
            </svg>
          </div>
        </div>
        
        <h1 className="preloader-title">Loading...</h1>
        
        <div className="preloader-spinner"></div>
        
        <p className="preloader-subtitle">Welcome to AI Marketplace</p>
      </div>
    </div>
  );
}

export default Preloader;

