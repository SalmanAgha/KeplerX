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

const GraphicPortfolio: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Categories that match graphic design
  const graphicCategories = ['graphic', 'Graphic Designing', 'graphic-designing', 'design', 'branding', 'logo', 'illustration', 'print'];
  
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter for graphic design category items only
        const graphicItems = data.filter((item: PortfolioItem) => 
          item.categories.some(category => 
            graphicCategories.includes(category)
          ) ||
          (item.displayCategories && item.displayCategories.some(category => 
            graphicCategories.includes(category)
          ))
        );
        
        setPortfolioItems(graphicItems);
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
        title="Graphic Design Portfolio" 
        path={['Home', 'Portfolio', 'Graphic Design']} 
      />
      
      <section className="portfolio-section">
        <div className="">
          <div className="portfolio-intro">
            <h2>Graphic Design Projects</h2>
            <p>
              Explore our creative graphic design portfolio showcasing our expertise in branding, 
              print design, digital media, and visual communication. Our designs blend aesthetics 
              with functionality to create memorable visual experiences that elevate brands and engage audiences.
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
            <h3>Need Stunning Graphic Design?</h3>
            <p>Contact us to discuss how our graphic design expertise can help elevate your brand's visual identity.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default GraphicPortfolio; 