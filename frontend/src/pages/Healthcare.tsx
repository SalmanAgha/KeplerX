import React, { useState } from 'react';
import './Healthcare.css';
import Breadcrumb from '../components/Breadcrumb';

const Healthcare: React.FC = () => {
  const [filter, setFilter] = useState('all');
  
  const healthcareItems = [
    {
      id: 1,
      title: 'Hospitals',
      category: 'facilities',
      image: 'https://picsum.photos/id/20/600/400',
      description: 'Modern hospital facilities equipped with the latest medical technology and patient care systems.',
      bgColor: '#2d2150'
    },
    {
      id: 2,
      title: 'Medical Apps',
      category: 'digital',
      image: 'https://picsum.photos/id/21/600/400',
      description: 'User-friendly medical applications designed to improve patient care and healthcare provider efficiency.',
      bgColor: '#1a3a4a'
    },
    {
      id: 3,
      title: 'Telemedicine',
      category: 'digital',
      image: 'https://picsum.photos/id/22/600/400',
      description: 'Remote healthcare solutions connecting patients with healthcare providers through secure video consultations.',
      bgColor: '#3d2d5c'
    },
    {
      id: 4,
      title: 'Medical Equipment',
      category: 'products',
      image: 'https://picsum.photos/id/23/600/400',
      description: 'Cutting-edge medical equipment and devices that enhance diagnosis, treatment, and patient monitoring.',
      bgColor: '#4a2d1a'
    },
    {
      id: 5,
      title: 'Clinics',
      category: 'facilities',
      image: 'https://picsum.photos/id/24/600/400',
      description: 'Specialized medical clinics offering focused healthcare services in convenient locations.',
      bgColor: '#2d4a3a'
    },
    {
      id: 6,
      title: 'Healthcare Management',
      category: 'systems',
      image: 'https://picsum.photos/id/25/600/400',
      description: 'Comprehensive hospital and healthcare management systems that streamline operations and improve efficiency.',
      bgColor: '#4a1a2d'
    },
    {
      id: 7,
      title: 'Patient Care',
      category: 'systems',
      image: 'https://picsum.photos/id/26/600/400',
      description: 'Integrated patient care solutions that enhance the quality of healthcare delivery and patient experience.',
      bgColor: '#1a4a3d'
    },
    {
      id: 8,
      title: 'Medical Research',
      category: 'products',
      image: 'https://picsum.photos/id/27/600/400',
      description: 'Cutting-edge medical research and development facilities that pioneer healthcare innovations.',
      bgColor: '#3a1a4a'
    }
  ];
  
  const filteredItems = filter === 'all' 
    ? healthcareItems 
    : healthcareItems.filter(item => item.category === filter);
  
  return (
    <>
      <Breadcrumb 
        title="Healthcare" 
        path={['Home', 'Core Industries', 'Healthcare']} 
      />
      
      <section className="healthcare-section">
        <div className="container">
          <div className="healthcare-intro">
            <h2>Healthcare Solutions</h2>
            <p>
              We provide innovative healthcare solutions that improve patient care, streamline operations, and enhance healthcare delivery. 
              Our expertise spans across medical facilities, digital health applications, medical equipment, and healthcare management systems.
            </p>
          </div>
          
        
          
          <div className="healthcare-grid">
            {filteredItems.map(item => (
              <div className="healthcare-card" key={item.id}>
                <div className="healthcare-card-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="healthcare-card-content" style={{ backgroundColor: item.bgColor }}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a href="#" className="view-details">View Details</a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="healthcare-cta">
            <h3>Looking for healthcare solutions?</h3>
            <p>Contact us to discuss how our healthcare expertise can help your organization deliver better patient care.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Healthcare; 