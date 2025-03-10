import React from 'react';
import './Banner.css';

const Banner: React.FC = () => {
  return (
    <div className="banner">
      <div className="container">
        <div className="banner-content">
          <h1>
            <span className="text-white">Digitalize</span> your<br />
            <span className="text-white">Business</span> with<br />
            <span className="text-white">KEPLERX</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Banner; 