import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-glow"></div>
      <div className="container">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/keplerx-logo-white.webp" alt="KeplerX" height="40" className="footer-logo-img" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
            </Link>
            <p className="footer-tagline">
              Engineering tomorrow's digital infrastructure — software, AI, cloud, and beyond.
            </p>
            <div className="footer-socials">
              <a href="https://www.linkedin.com/company/keplerx.co" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                <SocialIcon name="linkedin" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="footer-links-group">
            <h4>Services</h4>
            <ul>
              <li><Link to="/">Software Development</Link></li>
              <li><Link to="/">Web & App Development</Link></li>
              <li><Link to="/">AI & Machine Learning</Link></li>
              <li><Link to="/">DevOps & Cloud</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Company</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="/admin/dashboard">Admin</a></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:info@keplerx.co">info@keplerx.co</a></li>
              <li><a href="tel:+19253414413">USA: +1 925 341 4413</a></li>
              <li><a href="tel:+923146963877">PK: +92 314 696 3877</a></li>
              <li><span>Hampshire, IL</span></li>
              <li><span>Karachi, Pakistan</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} KeplerX. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon: React.FC<{ name: string }> = ({ name }) => {
  const icons: Record<string, React.ReactNode> = {
    linkedin: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
    twitter: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>,
    github: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>,
    dribbble: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>,
  };
  return <>{icons[name]}</>;
};

export default Footer;