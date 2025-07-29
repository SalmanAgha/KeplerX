import React, { useState, useEffect } from 'react';
import { FaRocket } from 'react-icons/fa';
import './BackToTop.css';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top scroll position
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div 
      className={`back-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      role="button"
      tabIndex={0}
    >
      <div className="rocket-icon">
        <FaRocket />
      </div>
      <span className="back-to-top-tooltip">Back to Top</span>
    </div>
  );
};

export default BackToTop; 