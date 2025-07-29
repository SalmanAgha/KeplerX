import React from 'react';
import { Link } from 'react-router-dom';
import './CoreIndustries.css';

const CoreIndustries = () => {
  const industries = [
    { name: "Real Estate", image: "/images/realestate.png", path: "/industries/real-estate" },
    { name: "Ecommerce", image: "/images/ecommerce.png", path: "/industries/ecommerce" },
    { name: "Automobile", image: "/images/automobile.png", path: "/industries/automobile" },
    { name: "Education", image: "/images/education.png", path: "/industries/education" },
    { name: "Finance", image: "/images/finance.png", path: "/industries/finance" },
    { name: "Corporate", image: "/images/corporate.png", path: "/industries/corporate" },
    { name: "Food", image: "/images/food.png", path: "/industries/food" },
    { name: "Medical", image: "/images/medical.png", path: "/industries/healthcare" },
    { name: "IT", image: "/images/it.png", path: "/industries/it" },
    { name: "Petroleum", image: "/images/petroleum.png", path: "/industries/petroleum" },
    { name: "Fitness", image: "/images/fitness.png", path: "/industries/fitness" },
    { name: "Jewellery", image: "/images/jewellery.png", path: "/industries/jewellery" },
  ];

  return (
    <div className="core-industries">
      <div className="">
        <div className="section-heading">
          <h2 className='industries-title'>Core Industries</h2>
          <p className='industries-description'>We provide specialized solutions across these key sectors</p>
        </div>
        
      <div className="industries-grid">
          {industries.map((industry, index) => (
            <Link to={industry.path} className="industry-card-link" key={index}>
              <div className="industry-card">
                <img 
                  src={industry.image} 
                  alt={industry.name}
                  onError={(e) => {
                    console.error(`Failed to load image for ${industry.name}`);
                    // Optional: set a fallback image
                    // e.currentTarget.src = "/images/default.png";
                  }}
                />
                <h3>{industry.name}</h3>
          </div>
            </Link>
        ))}
        </div>
      </div>
    </div>
  );
};

export default CoreIndustries; 