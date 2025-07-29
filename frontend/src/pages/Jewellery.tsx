import React, { useState, useEffect } from 'react';
import './Jewellery.css';
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

const Jewellery: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Categories that match this industry
  const industryCategories = ['jewellery', 'Jewellery', 'jewelry', 'Jewelry'];
  
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter for Jewellery-specific category items only
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
        title="Jewellery" 
        path={['Home', 'Core Industries', 'Jewellery']} 
      />
      
      <section className="jewellery-section">
        <div className="">
          <div className="jewellery-intro">
            <h2>Jewellery Industry Solutions</h2>
            <p>
              We provide specialized digital solutions for the jewellery industry, from e-commerce platforms 
              and inventory management to virtual try-ons and custom design tools. Our expertise helps jewellery 
              businesses enhance their online presence, streamline operations, and create engaging customer experiences.
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
                <IndustryPortfolioCard key={item._id} item={item} industryName="Jewellery" />
              ))}
            </div>
          )}
          
          <div className="jewellery-cta">
            <h3>Looking for Jewellery Industry Solutions?</h3>
            <p>Contact us to discuss how our expertise can help your jewellery business shine in the digital world.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Jewellery; 