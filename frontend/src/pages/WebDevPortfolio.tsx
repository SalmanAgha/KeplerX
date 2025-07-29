import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PortfolioCommon.css';
import Breadcrumb from '../components/Breadcrumb';
import PortfolioCard from '../components/PortfolioCard';

interface PortfolioItem {
  _id: string;
  title: string;
  categories: string[];
  displayCategories: string[];
  client: string;
  date: string;
  description: string;
  image: string;
  bgColor?: string;
}

const WebDevPortfolio: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Categories that match web development
  const webDevCategories = ['web', 'Web Development', 'web-development', 'website', 'frontend', 'backend', 'fullstack', 'responsive'];
  
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter for web development category items only
        const webDevItems = data.filter((item: PortfolioItem) => 
          item.categories.some(category => 
            webDevCategories.includes(category)
          ) ||
          (item.displayCategories && item.displayCategories.some(category => 
            webDevCategories.includes(category)
          ))
        );
        
        setPortfolioItems(webDevItems);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolios:', err);
        setError('Failed to load portfolio items. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPortfolios();
  }, []);
  
  // Use either the API-sourced portfolios or empty array if loading
  const filteredItems = filter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => 
        item.categories.includes(filter) || 
        (item.displayCategories && item.displayCategories.includes(filter))
      );
  
  // Handle navigation to detail page
  const handleViewDetails = (portfolioId: string) => {
    navigate(`/portfolio/${portfolioId}`);
  };
  
  return (
    <>
      <Breadcrumb 
        title="Web Development Portfolio" 
        path={['Home', 'Portfolio', 'Web Development']} 
      />
      
      <section className="portfolio-section">
        <div className="">
          <div className="portfolio-intro">
            <h2>Web Development Projects</h2>
            <p>
              Explore our diverse portfolio of web development projects, showcasing our expertise in creating 
              innovative, scalable, and user-friendly web applications across various industries. From e-commerce 
              platforms to corporate websites, we deliver solutions that drive business growth and user engagement.
            </p>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <p>Loading portfolio items...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
            </div>
          ) : portfolioItems.length === 0 ? (
            <div className="empty-container">
              <p>No portfolio items found in this category. Please check back later.</p>
            </div>
          ) : (
            <div className="portfolio-grid">
              {filteredItems.map(item => (
                <PortfolioCard key={item._id} item={item} />
              ))}
            </div>
          )}
          
          <div className="portfolio-cta">
            <h3>Need a Custom Web Solution?</h3>
            <p>Contact us to discuss how our web development expertise can help bring your digital vision to life.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default WebDevPortfolio; 