import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-background">
        {/* Background effect */}
      </div>
      <div className="footer-content">
        <div className="footer-container">
          <h1 className='footer-title'>KeplerX</h1>
        </div>

        <div className="footer-bottom">
          <p className='footer-copyright'>&copy; {new Date().getFullYear()} KeplerX Digital Agency. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;