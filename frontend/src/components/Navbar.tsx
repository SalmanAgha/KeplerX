import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import './Navbar.css'; // Create this file for custom styles
import logo from '../assets/Images/logo.webp'; // Update the path
import EnquiryOffCanvas from './EnquiryOffCanvas';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEnquiryOpen(!isEnquiryOpen);
  };

  const toggleDropdown = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Custom navigation function
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    closeMenu(); // Close the menu after navigation
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isMenuClick = target.closest('.offcanvas-menu');
      const isMenuToggleClick = target.closest('.navbar-toggler');
      
      if (isOpen && !isMenuClick && !isMenuToggleClick) {
        closeMenu();
      }
    };
    
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    } else {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = ''; // Restore scrolling when menu is closed
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isEnquiryOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isEnquiryOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      const topBar = document.querySelector('.top-bar') as HTMLElement;
      
      if (navbar && topBar) {
        if (window.scrollY > 50) {
          navbar.classList.add('sticky');
          topBar.style.visibility = 'hidden';
        } else {
          navbar.classList.remove('sticky');
          topBar.style.visibility = 'visible';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className="top-bar bg-teal text-white ">
        <div className="container d-flex justify-content-between">
          <a href="#" className="text-white">Download E-Profile</a>
          <div className='top-bar-menu'>
            <a href="#" className="text-white mx-2">Free Offers</a>
            <a href="#" className="text-white mx-2">Region</a>
            <a href="#" className="text-white mx-2">Call Now</a>
            <a href="#" className="text-white mx-2">Let's Chat Now</a>
            <a href="#" className="text-white mx-2 enquire-now-link" onClick={toggleEnquiry}>Enquire Now</a>
            <a href="/admin/dashboard" className="text-white mx-2" onClick={(e) => handleNavigation(e, '/admin/dashboard')}>Admin</a>
          </div>
        </div>
      </div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/" onClick={(e) => handleNavigation(e, '/')}>
            <img src={logo} alt="Logo" className="logo" />
          </a>
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu();
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/" onClick={(e) => handleNavigation(e, '/')}>Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about" onClick={(e) => handleNavigation(e, '/about')}>About Us</a>
              </li>
              <li className={`nav-item ${activeDropdown === 0 ? 'show' : ''}`}>
                <a className="nav-link dropdown-toggle" href="/services" onClick={(e) => toggleDropdown(0, e)}>Services</a>
                <div className="dropdown-menu">
                  <a className="dropdown-item" href="/services/web-development" onClick={(e) => handleNavigation(e, '/services/web-development')}>Web Development</a>
                  <a className="dropdown-item" href="/services/graphic-designing" onClick={(e) => handleNavigation(e, '/services/graphic-designing')}>Graphic Designing</a>
                  <a className="dropdown-item" href="/services/mobile-development" onClick={(e) => handleNavigation(e, '/services/mobile-development')}>Mobile Development</a>
                  <a className="dropdown-item" href="/services/ui-ux-design" onClick={(e) => handleNavigation(e, '/services/ui-ux-design')}>UI/UX Design</a>
                </div>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/portfolio" onClick={(e) => handleNavigation(e, '/portfolio')}>Portfolio</a>
              </li>
              <li className={`nav-item ${activeDropdown === 1 ? 'show' : ''}`}>
                <a className="nav-link dropdown-toggle" href="/industries" onClick={(e) => toggleDropdown(1, e)}>Core Industries</a>
                <div className="dropdown-menu">
                  <a className="dropdown-item" href="/industries/real-estate" onClick={(e) => handleNavigation(e, '/industries/real-estate')}>Real Estate</a>
                  <a className="dropdown-item" href="/industries/healthcare" onClick={(e) => handleNavigation(e, '/industries/healthcare')}>Healthcare</a>
                  <a className="dropdown-item" href="/industries/education" onClick={(e) => handleNavigation(e, '/industries/education')}>Education</a>
                  <a className="dropdown-item" href="/industries/finance" onClick={(e) => handleNavigation(e, '/industries/finance')}>Finance</a>
                  <a className="dropdown-item" href="/industries/ecommerce" onClick={(e) => handleNavigation(e, '/industries/ecommerce')}>E-commerce</a>
                  <a className="dropdown-item" href="/industries/corporate" onClick={(e) => handleNavigation(e, '/industries/corporate')}>Corporate</a>
                </div>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/toolkit" onClick={(e) => handleNavigation(e, '/toolkit')}>Free Toolkit</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contact" onClick={(e) => handleNavigation(e, '/contact')}>Contact Us</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
      <div className={`offcanvas-overlay ${isOpen ? 'show' : ''}`} onClick={closeMenu}></div>
      <div className={`offcanvas-menu ${isOpen ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="offcanvas-close" onClick={closeMenu}>&times;</button>
        <img src={logo} alt="Logo" className="offcanvas-logo" />
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a className="nav-link" href="/" onClick={(e) => handleNavigation(e, '/')}>Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/about" onClick={(e) => handleNavigation(e, '/about')}>About Us</a>
          </li>
          <li className={`nav-item ${activeDropdown === 0 ? 'show' : ''}`}>
            <a className="nav-link dropdown-toggle" href="/services" onClick={(e) => toggleDropdown(0, e)}>Services</a>
            <div className="dropdown-menu">
              <a className="dropdown-item" href="/services/web-development" onClick={(e) => handleNavigation(e, '/services/web-development')}>Web Development</a>
              <a className="dropdown-item" href="/services/graphic-designing" onClick={(e) => handleNavigation(e, '/services/graphic-designing')}>Graphic Designing</a>
              <a className="dropdown-item" href="/services/mobile-development" onClick={(e) => handleNavigation(e, '/services/mobile-development')}>Mobile Development</a>
              <a className="dropdown-item" href="/services/ui-ux-design" onClick={(e) => handleNavigation(e, '/services/ui-ux-design')}>UI/UX Design</a>
            </div>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/portfolio" onClick={(e) => handleNavigation(e, '/portfolio')}>Portfolio</a>
          </li>
          <li className={`nav-item ${activeDropdown === 1 ? 'show' : ''}`}>
            <a className="nav-link dropdown-toggle" href="/industries" onClick={(e) => toggleDropdown(1, e)}>Core Industries</a>
            <div className="dropdown-menu">
              <a className="dropdown-item" href="/industries/real-estate" onClick={(e) => handleNavigation(e, '/industries/real-estate')}>Real Estate</a>
              <a className="dropdown-item" href="/industries/healthcare" onClick={(e) => handleNavigation(e, '/industries/healthcare')}>Healthcare</a>
              <a className="dropdown-item" href="/industries/education" onClick={(e) => handleNavigation(e, '/industries/education')}>Education</a>
              <a className="dropdown-item" href="/industries/finance" onClick={(e) => handleNavigation(e, '/industries/finance')}>Finance</a>
              <a className="dropdown-item" href="/industries/ecommerce" onClick={(e) => handleNavigation(e, '/industries/ecommerce')}>E-commerce</a>
              <a className="dropdown-item" href="/industries/corporate" onClick={(e) => handleNavigation(e, '/industries/corporate')}>Corporate</a>
            </div>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/toolkit" onClick={(e) => handleNavigation(e, '/toolkit')}>Free Toolkit</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/contact" onClick={(e) => handleNavigation(e, '/contact')}>Contact Us</a>
          </li>
          <li className="nav-item mobile-only">
            <a className="nav-link" href="#" onClick={toggleEnquiry}>Enquire Now</a>
          </li>
        </ul>
      </div>
      <EnquiryOffCanvas isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </>
  );
};

export default Navbar; 