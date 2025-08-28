import React, { useState, useEffect } from 'react';
import './IT.css';
import '../styles/PortfolioCommon.css';
import Breadcrumb from '../components/Breadcrumb';
import IndustryPortfolioCard from '../components/IndustryPortfolioCard';

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

const IT: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Categories that match this industry
  const industryCategories = ['it', 'IT', 'Information Technology'];
  
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter for IT-specific category items only
        const industryItems = data.filter((item: PortfolioItem) => 
          item.categories.some(category => 
            industryCategories.includes(category)
          ) ||
          (item.displayCategories && item.displayCategories.some(category => 
            industryCategories.includes(category)
          ))
        );
        
        setPortfolioItems(industryItems);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolios:', err);
        setError('Failed to load portfolio items. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPortfolios();
  }, []);
  
  const filteredItems = portfolioItems;
  
  return (
    <>
      <Breadcrumb 
        title="Information Technology" 
        path={['Home', 'Core Industries', 'Information Technology']} 
      />
      
      <section className="it-section">
        <div className="">
          <div className="it-intro">
            <h2>IT Solutions</h2>
            <p>
              We deliver cutting-edge IT solutions that drive digital transformation and business growth. 
              Our expertise spans across software development, cloud computing, cybersecurity, AI/ML, 
              and enterprise systems integration, helping businesses leverage technology for competitive advantage.
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
          ) : (
            <div className="portfolio-grid">
              {filteredItems.map(item => (
                <IndustryPortfolioCard key={item._id} item={item} industryName="Information Technology" />
              ))}
            </div>
          )}
          
          <div className="it-cta">
            <h3>Looking for IT Solutions?</h3>
            <p>Contact us to discuss how our IT expertise can help your business thrive in the digital age.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default IT; 