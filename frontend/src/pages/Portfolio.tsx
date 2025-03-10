import React, { useState } from 'react';
import './Portfolio.css';
import Breadcrumb from '../components/Breadcrumb';

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState('all');
  
  const portfolioItems = [
    {
      id: 1,
      title: 'Identity Design',
      category: 'graphic',
      image: 'https://picsum.photos/id/1/600/400',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      bgColor: '#2d2150'
    },
    {
      id: 2,
      title: 'Website Design',
      category: 'web',
      image: 'https://picsum.photos/id/2/600/400',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      bgColor: '#1a3a4a'
    },
    {
      id: 3,
      title: 'Product Design',
      category: 'graphic',
      image: 'https://picsum.photos/id/3/600/400',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      bgColor: '#3d2d5c'
    },
    {
      id: 4,
      title: 'Digital Advertising',
      category: 'marketing',
      image: 'https://picsum.photos/id/4/600/400',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      bgColor: '#4a2d1a'
    },
    {
      id: 5,
      title: 'Mobile App Design',
      category: 'mobile',
      image: 'https://picsum.photos/id/5/600/400',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      bgColor: '#2d4a3a'
    },
    {
      id: 6,
      title: 'Social Media Design',
      category: 'marketing',
      image: 'https://picsum.photos/id/6/600/400',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      bgColor: '#4a1a2d'
    },
    {
      id: 7,
      title: 'UI/UX Design',
      category: 'web',
      image: 'https://picsum.photos/id/7/600/400',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      bgColor: '#1a4a3d'
    },
    {
      id: 8,
      title: 'Packaging Design',
      category: 'graphic',
      image: 'https://picsum.photos/id/8/600/400',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      bgColor: '#3a1a4a'
    }
  ];
  
  const filteredItems = filter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);
  
  return (
    <>
      <Breadcrumb 
        title="Portfolio" 
        path={['Home', 'Portfolio']} 
      />
      
      <section className="portfolio-section">
        <div className="container">
          <div className="portfolio-intro">
            <h2>Our Creative Portfolio</h2>
            <p>
              Explore our diverse collection of projects that showcase our expertise in web development, 
              mobile applications, and graphic design. Each project represents our commitment to quality, 
              innovation, and client satisfaction.
            </p>
          </div>
          
          <div className="portfolio-filter">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
              onClick={() => setFilter('all')}
            >
              All Projects
            </button>
            <button 
              className={`filter-btn ${filter === 'web' ? 'active' : ''}`} 
              onClick={() => setFilter('web')}
            >
              Web Development
            </button>
            <button 
              className={`filter-btn ${filter === 'mobile' ? 'active' : ''}`} 
              onClick={() => setFilter('mobile')}
            >
              Mobile Apps
            </button>
            <button 
              className={`filter-btn ${filter === 'graphic' ? 'active' : ''}`} 
              onClick={() => setFilter('graphic')}
            >
              Graphic Design
            </button>
            <button 
              className={`filter-btn ${filter === 'marketing' ? 'active' : ''}`} 
              onClick={() => setFilter('marketing')}
            >
              Marketing
            </button>
          </div>
          
          <div className="portfolio-grid">
            {filteredItems.map(item => (
              <div className="portfolio-card" key={item.id}>
                <div className="portfolio-card-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="portfolio-card-content" style={{ backgroundColor: item.bgColor }}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a href="#" className="view-details">View Details</a>
                </div>
              </div>
            ))}
          </div>
          
         
        </div>
      </section>
    </>
  );
};

export default Portfolio; 