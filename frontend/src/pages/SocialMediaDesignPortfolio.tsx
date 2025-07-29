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

const SocialMediaDesignPortfolio: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Categories that match social media design
  const socialDesignCategories = [
    'social-design', 
    'Social Media Design', 
    'social-media-design', 
    'social-media', 
    'instagram', 
    'facebook',
    'twitter',
    'social'
  ];
  
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter for social media design category items only
        const socialDesignItems = data.filter((item: PortfolioItem) => 
          item.categories.some(category => 
            socialDesignCategories.includes(category)
          ) ||
          (item.displayCategories && item.displayCategories.some(category => 
            socialDesignCategories.includes(category)
          ))
        );
        
        setPortfolioItems(socialDesignItems);
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
  
  return (
    <>
      <Breadcrumb 
        title="Social Media Design Portfolio" 
        path={['Home', 'Portfolio', 'Social Media Design']} 
      />
      
      <section className="portfolio-section">
        <div className="">
          <div className="portfolio-intro">
            <h2>Social Media Design Projects</h2>
            <p>
              Explore our creative social media design portfolio showcasing our expertise in creating 
              engaging visuals for various social platforms. Our designs are optimized for each platform 
              while maintaining brand consistency and driving audience engagement.
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
            <h3>Need Engaging Social Media Content?</h3>
            <p>Contact us to discuss how our social media design expertise can help increase your brand's engagement and reach.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default SocialMediaDesignPortfolio; 