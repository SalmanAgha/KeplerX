import React from 'react';
import './AboutBanner.css';
import logo from '../assets/Images/logo.webp';

const AboutBanner: React.FC = () => {
  // Create duplicated set of logos for seamless looping
  const logoElements = Array(10).fill(null).map((_, index) => (
    <img src={logo} alt={`Partner Logo ${index + 1}`} key={index} />
  ));

  return (
    <div className="about-banner">
      <div className="container">
        <div className="about-banner-content">
          <h1>
            About<br></br> <span className="highlighted">KEPLERX</span>
          </h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
        </div>
      </div>
      <div className="partner-logos">
        <div className="logo-slider">
          {logoElements}
        </div>
      </div>
    </div>
  );
};

export default AboutBanner; 