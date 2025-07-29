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

const SocialMediaMarketingPortfolio: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Categories that match social media marketing
  const socialMarketingCategories = [
    'social-marketing', 
    'Social Media Marketing', 
    'social-media-marketing', 
    'digital marketing',
    'social-campaign',
    'marketing',
    'social-ads',
    'social-management'
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
        
        // Filter for social media marketing category items only
        const socialMarketingItems = data.filter((item: PortfolioItem) => 
          item.categories.some(category => 
            socialMarketingCategories.includes(category)
          ) ||
          (item.displayCategories && item.displayCategories.some(category => 
            socialMarketingCategories.includes(category)
          ))
        );
        
        setPortfolioItems(socialMarketingItems);
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
        title="Social Media Marketing Portfolio" 
        path={['Home', 'Portfolio', 'Social Media Marketing']} 
      />
      
      <section className="portfolio-section">
        <div className="">
          <div className="portfolio-intro">
            <h2>Social Media Marketing Projects</h2>
            <p>
              Explore our social media marketing portfolio showcasing our expertise in developing and 
              executing effective campaigns across various platforms. Our strategies are designed to 
              increase brand awareness, boost engagement, and drive conversions.
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
            <h3>Need a Successful Marketing Campaign?</h3>
            <p>Contact us to discuss how our social media marketing expertise can help grow your audience and boost your brand.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default SocialMediaMarketingPortfolio; 