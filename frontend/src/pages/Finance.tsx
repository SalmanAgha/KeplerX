import React, { useState } from 'react';
import './Finance.css';
import Breadcrumb from '../components/Breadcrumb';

const Finance: React.FC = () => {
  const [filter, setFilter] = useState('all');
  
  const financeItems = [
    {
      id: 1,
      title: 'Banking Applications',
      category: 'banking',
      image: 'https://picsum.photos/id/36/600/400',
      description: 'Comprehensive banking applications with robust security features and user-friendly interfaces.',
      bgColor: '#2d2150'
    },
    {
      id: 2,
      title: 'Payment Gateways',
      category: 'payment',
      image: 'https://picsum.photos/id/37/600/400',
      description: 'Secure and efficient payment processing solutions for e-commerce and online businesses.',
      bgColor: '#1a3a4a'
    },
    {
      id: 3,
      title: 'Financial Analysis',
      category: 'analysis',
      image: 'https://picsum.photos/id/38/600/400',
      description: 'Advanced financial analysis tools that provide valuable insights and support decision-making.',
      bgColor: '#3d2d5c'
    },
    {
      id: 4,
      title: 'Wealth Management',
      category: 'management',
      image: 'https://picsum.photos/id/39/600/400',
      description: 'Comprehensive wealth management platforms that help clients manage and grow their assets.',
      bgColor: '#4a2d1a'
    },
    {
      id: 5,
      title: 'Insurance Systems',
      category: 'insurance',
      image: 'https://picsum.photos/id/40/600/400',
      description: 'Robust insurance management systems that streamline policy administration and claims processing.',
      bgColor: '#2d4a3a'
    },
    {
      id: 6,
      title: 'Investment Platforms',
      category: 'management',
      image: 'https://picsum.photos/id/41/600/400',
      description: 'User-friendly investment platforms that enable users to manage their investment portfolios.',
      bgColor: '#4a1a2d'
    },
    {
      id: 7,
      title: 'Trading Systems',
      category: 'trading',
      image: 'https://picsum.photos/id/42/600/400',
      description: 'Advanced trading systems with real-time data, analytics, and automated trading capabilities.',
      bgColor: '#1a4a3d'
    },
    {
      id: 8,
      title: 'Fintech Solutions',
      category: 'banking',
      image: 'https://picsum.photos/id/43/600/400',
      description: 'Innovative fintech solutions that leverage technology to improve financial services and customer experience.',
      bgColor: '#3a1a4a'
    }
  ];
  
  const filteredItems = filter === 'all' 
    ? financeItems 
    : financeItems.filter(item => item.category === filter);
  
  return (
    <>
      <Breadcrumb 
        title="Finance" 
        path={['Home', 'Core Industries', 'Finance']} 
      />
      
      <section className="finance-section">
        <div className="container">
          <div className="finance-intro">
            <h2>Financial Solutions</h2>
            <p>
              We provide cutting-edge financial technology solutions that empower banks, investment firms, and financial institutions. 
              Our expertise spans across banking applications, payment systems, financial analysis tools, and wealth management platforms.
            </p>
          </div>
          
        
          
          <div className="finance-grid">
            {filteredItems.map(item => (
              <div className="finance-card" key={item.id}>
                <div className="finance-card-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="finance-card-content" style={{ backgroundColor: item.bgColor }}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a href="#" className="view-details">View Details</a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="finance-cta">
            <h3>Looking for financial technology solutions?</h3>
            <p>Contact us to discuss how our fintech expertise can help your institution stay ahead in the digital age.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Finance; 