import React from 'react';
import './FreeToolkit.css';
import Breadcrumb from '../components/Breadcrumb';

const FreeToolkit: React.FC = () => {
  return (
    <>
      <Breadcrumb 
        title="Free Toolkit" 
        path={['Home', 'Free Toolkit']} 
      />
      
      <section className="free-toolkit-section">
        <div className="container">
          <div className="coming-soon">
            <h2>Free Toolkit</h2>
            <p>Our Free Toolkit is coming soon! Stay tuned for exciting resources and tools to help you succeed.</p>
            <div className="coming-soon-animation">
              <span className="dot dot1"></span>
              <span className="dot dot2"></span>
              <span className="dot dot3"></span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FreeToolkit; 