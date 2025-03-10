import React from 'react';
import './Footer.css';
import logo from '../assets/Images/logo.webp';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <img src={logo} alt="Company Logo" />
      </div>
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer; 