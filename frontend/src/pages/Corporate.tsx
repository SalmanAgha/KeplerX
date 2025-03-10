import React, { useState } from 'react';
import './Corporate.css';
import Breadcrumb from '../components/Breadcrumb';

const Corporate: React.FC = () => {
  const [filter, setFilter] = useState('all');
  
  const corporateItems = [
    {
      id: 1,
      title: 'Corporate Websites',
      category: 'websites',
      image: 'https://picsum.photos/id/52/600/400',
      description: 'Professional corporate websites that establish a strong online presence for your brand.',
      bgColor: '#2d2150'
    },
    {
      id: 2,
      title: 'Intranets',
      category: 'internal',
      image: 'https://picsum.photos/id/53/600/400',
      description: 'Secure intranet solutions that facilitate internal communication and document sharing.',
      bgColor: '#1a3a4a'
    },
    {
      id: 3,
      title: 'CRM Systems',
      category: 'management',
      image: 'https://picsum.photos/id/54/600/400',
      description: 'Customer relationship management systems that help businesses manage customer interactions.',
      bgColor: '#3d2d5c'
    },
    {
      id: 4,
      title: 'HR Portals',
      category: 'internal',
      image: 'https://picsum.photos/id/55/600/400',
      description: 'Human resources portals that streamline employee management, onboarding, and HR processes.',
      bgColor: '#4a2d1a'
    },
    {
      id: 5,
      title: 'Digital Marketing',
      category: 'marketing',
      image: 'https://picsum.photos/id/56/600/400',
      description: 'Comprehensive digital marketing strategies that increase brand awareness and drive growth.',
      bgColor: '#2d4a3a'
    },
    {
      id: 6,
      title: 'ERP Systems',
      category: 'management',
      image: 'https://picsum.photos/id/57/600/400',
      description: 'Enterprise resource planning systems that integrate core business processes into a unified solution.',
      bgColor: '#4a1a2d'
    },
    {
      id: 7,
      title: 'Business Intelligence',
      category: 'analytics',
      image: 'https://picsum.photos/id/58/600/400',
      description: 'Business intelligence tools that transform data into actionable insights for decision-making.',
      bgColor: '#1a4a3d'
    },
    {
      id: 8,
      title: 'Digital Transformation',
      category: 'transformation',
      image: 'https://picsum.photos/id/59/600/400',
      description: 'End-to-end digital transformation solutions that modernize business operations and processes.',
      bgColor: '#3a1a4a'
    }
  ];
  
  const filteredItems = filter === 'all' 
    ? corporateItems 
    : corporateItems.filter(item => item.category === filter);
  
  return (
    <>
      <Breadcrumb 
        title="Corporate" 
        path={['Home', 'Core Industries', 'Corporate']} 
      />
      
      <section className="corporate-section">
        <div className="container">
          <div className="corporate-intro">
            <h2>Corporate Solutions</h2>
            <p>
              We deliver comprehensive digital solutions for corporate enterprises that drive efficiency, productivity, and growth. 
              Our expertise spans across corporate websites, intranets, CRM systems, HR portals, and digital transformation initiatives.
            </p>
          </div>
          
         
          
          <div className="corporate-grid">
            {filteredItems.map(item => (
              <div className="corporate-card" key={item.id}>
                <div className="corporate-card-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="corporate-card-content" style={{ backgroundColor: item.bgColor }}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a href="#" className="view-details">View Details</a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="corporate-cta">
            <h3>Ready to transform your business?</h3>
            <p>Contact us to discuss how our corporate solutions can help your organization achieve its digital transformation goals.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Corporate; 