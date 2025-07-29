import React, { useState, useEffect } from 'react';
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

const Corporate: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Categories that match this industry
  const industryCategories = ['corporate', 'Corporate', 'business', 'Business'];
  
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter for corporate category items only
        const corporateItems = data.filter((item: PortfolioItem) => 
          item.categories.some(category => 
            industryCategories.includes(category)
          ) ||
          (item.displayCategories && item.displayCategories.some(category => 
            industryCategories.includes(category)
          ))
        );
        
        setPortfolioItems(corporateItems);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolios:', err);
        setError('Failed to load portfolio items. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPortfolios();
  }, []);
  
  // Fallback to sample data if no portfolios found from API
  const corporateServices = [
    {
      id: 1,
      title: 'Corporate Websites',
      category: 'websites',
      image: 'https://picsum.photos/id/52/600/400',
      description: 'Professional corporate websites that establish a strong online presence for your brand.',
      bgColor: '#2d2150'
    },
    {
      id: 2,
      title: 'Intranets',
      category: 'internal',
      image: 'https://picsum.photos/id/53/600/400',
      description: 'Secure intranet solutions that facilitate internal communication and document sharing.',
      bgColor: '#1a3a4a'
    },
    {
      id: 3,
      title: 'CRM Systems',
      category: 'management',
      image: 'https://picsum.photos/id/54/600/400',
      description: 'Customer relationship management systems that help businesses manage customer interactions.',
      bgColor: '#3d2d5c'
    },
    {
      id: 4,
      title: 'HR Portals',
      category: 'internal',
      image: 'https://picsum.photos/id/55/600/400',
      description: 'Human resources portals that streamline employee management, onboarding, and HR processes.',
      bgColor: '#4a2d1a'
    }
  ];
  
  // Use either the API-sourced portfolios or sample data if none found
  const displayItems = portfolioItems.length > 0 ? portfolioItems : corporateServices.map(item => ({
    _id: item.id.toString(),
    title: item.title,
    categories: [item.category],
    displayCategories: [item.category],
    client: 'Sample Client',
    date: new Date().toISOString(),
    description: item.description,
    image: item.image,
    bgColor: item.bgColor
  }));
  
  // Filter based on subcategory if needed
  const filteredItems = filter === 'all' 
    ? displayItems 
    : displayItems.filter(item => 
        item.categories.includes(filter) || 
        (item.displayCategories && item.displayCategories.includes(filter))
      );
  
  return (
    <>
      <Breadcrumb 
        title="Corporate" 
        path={['Home', 'Core Industries', 'Corporate']} 
      />
      
      <section className="corporate-section">
        <div className="">
          <div className="corporate-intro">
            <h2>Corporate Solutions</h2>
            <p>
              We deliver comprehensive digital solutions for corporate enterprises that drive efficiency, productivity, and growth. 
              Our expertise spans across corporate websites, intranets, CRM systems, HR portals, and digital transformation initiatives.
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
                <IndustryPortfolioCard key={item._id} item={item} industryName="Corporate" />
              ))}
            </div>
          )}
          
          <div className="corporate-cta">
            <h3>Ready to transform your business?</h3>
            <p>Contact us to discuss how our corporate solutions can help your organization achieve its digital transformation goals.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Corporate; 