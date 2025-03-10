import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs: React.FC = () => {
  return (
    <section className="why-choose-section">
      <div className="container">
        <div className="why-choose-container">
          <div className="why-choose-left">
            <h2>Why Choose Us?</h2>
            <div className="divider"></div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec 
              ullamcorper mattis, pulvinar dapibus.
            </p>
            {/* <button className="learn-more-btn">
              Learn More <span className="arrow">→</span>
            </button> */}
          </div>
          
          <div className="why-choose-right">
            <div className="achievement-header">
              <div className="medal-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="white" strokeWidth="2"/>
                  <path d="M12 15V23M12 23L7 20M12 23L17 20" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Our Achievement</h3><br></br>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut.</p>
            </div>
            
            <div className="achievement-stats">
              <div className="stat-item">
                <h2>98<span className="plus">+</span></h2>
                <p>Years Of Experience</p>
              </div>
              <div className="stat-item">
                <h2>80K<span className="plus">+</span></h2>
                <p>User Worldwide</p>
              </div>
              <div className="stat-item">
                <h2>500<span className="plus">+</span></h2>
                <p>Popular Features</p>
              </div>
              <div className="stat-item">
                <h2>25<span className="percent">%</span></h2>
                <p>Satisfied Client</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs; 