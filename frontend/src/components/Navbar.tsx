import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = 'auto';
  }, [location]);

  const toggleMenu = () => {
    setMenuOpen(p => {
      document.body.style.overflow = !p ? 'hidden' : 'auto';
      return !p;
    });
  };

  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  const handleServicesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#services');
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <img src="/keplerx-logo-white.webp" alt="KeplerX" height="32" className="nav-logo-img" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <a href="/#services" className="nav-link" onClick={handleServicesClick}>Services</a>
          <Link to="/marketplace" className={`nav-link ${isActive('/marketplace') ? 'active' : ''}`}>Portfolio</Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
        </div>

        {/* CTA */}
        <div className="nav-actions">
          <Link to="/contact" className="btn-nav-cta">
            <span>Start a Project</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>

          {/* Hamburger */}
          <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} ref={menuRef}>
        <div className="mobile-menu-inner">
          <Link to="/" className={`mobile-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <a href="/#services" className="mobile-link" onClick={handleServicesClick}>Services</a>
          <Link to="/marketplace" className={`mobile-link ${isActive('/marketplace') ? 'active' : ''}`}>Portfolio</Link>
          <Link to="/about" className={`mobile-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
          <Link to="/contact" className={`mobile-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
          <Link to="/contact" className="mobile-cta">Start a Project →</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;