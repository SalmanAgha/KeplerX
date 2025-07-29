import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Portfolio.css';
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

const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Use all portfolio items regardless of category
        setPortfolioItems(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolios:', err);
        setError('Failed to load portfolio items. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPortfolios();
  }, []);
  
  // Set up category filters based on available categories in the data
  const availableCategories = Array.from(new Set(
    portfolioItems.flatMap(item => item.displayCategories || [])
  ));
  
  // Filter items if a specific category is selected
  const filteredItems = filter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.displayCategories && item.displayCategories.includes(filter));
  
  return (
    <>
      <Breadcrumb 
        title="Our Portfolio" 
        path={['Home', 'Portfolio']} 
      />
      
      <section className="portfolio-section">
        <div className="">
          <div className="portfolio-intro">
            <h2>Our Complete Portfolio</h2>
            <p>
              Explore our diverse portfolio showcasing our expertise across various industries and services.
              From web development to graphic design and social media marketing, our team delivers
              high-quality solutions tailored to our clients' unique needs.
            </p>
          </div>
          
          {/* Category filter */}
          {availableCategories.length > 0 && (
            <div className="portfolio-filter">
              <button 
                className={filter === 'all' ? 'active' : ''} 
                onClick={() => setFilter('all')}
              >
                All
              </button>
              {availableCategories.map(category => (
                <button 
                  key={category}
                  className={filter === category ? 'active' : ''} 
                  onClick={() => setFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
          
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
              <p>No portfolio items found. Please check back later.</p>
            </div>
          ) : (
            <div className="portfolio-grid">
              {filteredItems.map(item => (
                <PortfolioCard key={item._id} item={item} />
              ))}
            </div>
          )}
          
          <div className="portfolio-cta">
            <h3>Need a Custom Solution?</h3>
            <p>Contact us to discuss how our expertise can help bring your vision to life.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Portfolio; 