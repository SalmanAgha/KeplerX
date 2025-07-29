import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaShareAlt, FaQuestionCircle, FaPhoneAlt, FaArrowUp, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './MobileBottomMenu.css';

interface MobileBottomMenuProps {
  openQuoteForm: () => void;
  openEnquiryCanvas: () => void;
}

const MobileBottomMenu: React.FC<MobileBottomMenuProps> = ({ openQuoteForm, openEnquiryCanvas }) => {
  const [showSocialIcons, setShowSocialIcons] = useState(false);

  const toggleSocialIcons = () => {
    setShowSocialIcons(!showSocialIcons);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="mobile-bottom-menu">
      {/* Social Media Popup */}
      {showSocialIcons && (
        <div className="social-popup">
          <a href="https://facebook.com/keplerx" target="_blank" rel="noopener noreferrer">
            <div className="social-popup-icon facebook">
              <FaFacebook />
            </div>
          </a>
          <a href="https://twitter.com/keplerx" target="_blank" rel="noopener noreferrer">
            <div className="social-popup-icon twitter">
              <FaTwitter />
            </div>
          </a>
          <a href="https://instagram.com/keplerx" target="_blank" rel="noopener noreferrer">
            <div className="social-popup-icon instagram">
              <FaInstagram />
            </div>
          </a>
          <a href="https://linkedin.com/company/keplerx" target="_blank" rel="noopener noreferrer">
            <div className="social-popup-icon linkedin">
              <FaLinkedin />
            </div>
          </a>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="bottom-nav-container">
        <div className="bottom-nav-item" onClick={toggleSocialIcons}>
          <FaShareAlt />
          <span>Social</span>
        </div>
        
        <div className="bottom-nav-item" onClick={openQuoteForm}>
          <FaQuestionCircle />
          <span>Quote</span>
        </div>

        <div className="bottom-nav-item home-icon">
          <Link to="/">
            <FaHome />
            <span>Home</span>
          </Link>
        </div>

        <div className="bottom-nav-item" onClick={openEnquiryCanvas}>
          <FaPhoneAlt />
          <span>Enquire</span>
        </div>

        <div className="bottom-nav-item" onClick={scrollToTop}>
          <FaArrowUp />
          <span>Top</span>
        </div>
      </div>
    </div>
  );
};

export default MobileBottomMenu; 