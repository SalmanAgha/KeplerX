import React, { useState } from 'react';
import './RealEstate.css';
import Breadcrumb from '../components/Breadcrumb';

const RealEstate: React.FC = () => {
  const [filter, setFilter] = useState('all');
  
  const realEstateItems = [
    {
      id: 1,
      title: 'Luxury Apartments',
      category: 'residential',
      image: 'https://picsum.photos/id/10/600/400',
      description: 'High-end apartment complexes with premium amenities and modern designs.',
      bgColor: '#2d2150'
    },
    {
      id: 2,
      title: 'Commercial Spaces',
      category: 'commercial',
      image: 'https://picsum.photos/id/11/600/400',
      description: 'Office buildings and retail spaces designed for optimal business performance.',
      bgColor: '#1a3a4a'
    },
    {
      id: 3,
      title: 'Single Family Homes',
      category: 'residential',
      image: 'https://picsum.photos/id/12/600/400',
      description: 'Custom-built single family homes with modern architecture and quality finishes.',
      bgColor: '#3d2d5c'
    },
    {
      id: 4,
      title: 'Shopping Malls',
      category: 'commercial',
      image: 'https://picsum.photos/id/13/600/400',
      description: 'Large retail complexes with various shops, restaurants, and entertainment options.',
      bgColor: '#4a2d1a'
    },
    {
      id: 5,
      title: 'Vacation Properties',
      category: 'residential',
      image: 'https://picsum.photos/id/14/600/400',
      description: 'Beautiful vacation homes and resorts in prime tourist destinations.',
      bgColor: '#2d4a3a'
    },
    {
      id: 6,
      title: 'Office Buildings',
      category: 'commercial',
      image: 'https://picsum.photos/id/15/600/400',
      description: 'Modern office buildings with efficient layouts and advanced technology infrastructure.',
      bgColor: '#4a1a2d'
    },
    {
      id: 7,
      title: 'Condominiums',
      category: 'residential',
      image: 'https://picsum.photos/id/16/600/400',
      description: 'Contemporary condominium projects with shared amenities and security features.',
      bgColor: '#1a4a3d'
    },
    {
      id: 8,
      title: 'Industrial Facilities',
      category: 'industrial',
      image: 'https://picsum.photos/id/17/600/400',
      description: 'Warehouses, manufacturing plants, and logistics centers designed for operational efficiency.',
      bgColor: '#3a1a4a'
    }
  ];
  
  const filteredItems = filter === 'all' 
    ? realEstateItems 
    : realEstateItems.filter(item => item.category === filter);
  
  return (
    <>
      <Breadcrumb 
        title="Real Estate" 
        path={['Home', 'Core Industries', 'Real Estate']} 
      />
      
      <section className="real-estate-section">
        <div className="container">
          <div className="real-estate-intro">
            <h2>Real Estate Development</h2>
            <p>
              We specialize in creating innovative real estate solutions across residential, commercial, and industrial sectors. 
              Our projects are designed with a focus on sustainability, functionality, and architectural excellence.
            </p>
          </div>
          
         
          
          <div className="real-estate-grid">
            {filteredItems.map(item => (
              <div className="real-estate-card" key={item.id}>
                <div className="real-estate-card-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="real-estate-card-content" style={{ backgroundColor: item.bgColor }}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a href="#" className="view-details">View Details</a>
                </div>
              </div>
            ))}
          </div>
          <div className="education-cta">
            <h3>Looking for Real estate solutions?</h3>
            <p>Contact us to discuss how our real estate expertise can help improve learning outcomes and institutional efficiency.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default RealEstate; 