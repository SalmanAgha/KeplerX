import React from 'react';
import './OurMission.css';

const OurMission: React.FC = () => {
  return (
    <section className="mission-section">
      <div className="container">
        <div className="mission-header">
          <h2>Our Mission & Vision</h2>
          <div className="mission-divider"></div>
          <p className="mission-subtitle">
            We strive to deliver exceptional services and innovative solutions to help our clients succeed in the digital world.
          </p>
        </div>
        
        <div className="mission-cards">
          <div className="mission-card">
            <div className="card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#045e63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Our Mission</h3>
            <p>
              To empower businesses with cutting-edge digital solutions that drive growth, efficiency, and competitive advantage in an ever-evolving technological landscape.
            </p>
          </div>
          
          <div className="mission-card">
            <div className="card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C14.2091 15 16 13.2091 16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15Z" stroke="#045e63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 11C3 16.5228 7.02944 21 12 21C16.9706 21 21 16.5228 21 11C21 5.47715 16.9706 1 12 1C7.02944 1 3 5.47715 3 11Z" stroke="#045e63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Our Vision</h3>
            <p>
              To be the leading digital transformation partner, recognized for our innovation, expertise, and commitment to delivering exceptional value to our clients worldwide.
            </p>
          </div>
          
          <div className="mission-card">
            <div className="card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#045e63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="#045e63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Our Values</h3>
            <p>
              We believe in integrity, innovation, excellence, and client-centricity. These core values guide our approach and ensure we deliver solutions that exceed expectations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMission; 