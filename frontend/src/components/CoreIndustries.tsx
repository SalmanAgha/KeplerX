import React from 'react';
import './CoreIndustries.css';

const CoreIndustries: React.FC = () => {
  return (
    <section className="core-industries">
      <h2 className="industries-title">Core Industries</h2>
      <p className="industries-description">Explore the core industries we serve, providing tailored solutions to meet the unique needs of each sector.</p>
      <div className="industries-grid">
        {Array.from({ length: 12 }, (_, index) => (
          <div className="industry-card" key={index}>
            <img src={`/path/to/industry${index + 1}-icon.png`} alt={`Industry ${index + 1}`} />
            <h3>Industry {index + 1}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoreIndustries; 