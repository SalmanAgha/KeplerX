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

const Finance: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Categories that match this industry
  const industryCategories = ['finance', 'Finance', 'banking', 'fintech', 'financial', 'investment', 'insurance', 'trading'];
  
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter for finance category items only
        const financeItems = data.filter((item: PortfolioItem) => 
          item.categories.some(category => 
            industryCategories.includes(category)
          ) ||
          (item.displayCategories && item.displayCategories.some(category => 
            industryCategories.includes(category)
          ))
        );
        
        setPortfolioItems(financeItems);
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
  const financeServices = [
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
    }
  ];
  
  // Use either the API-sourced portfolios or sample data if none found
  const displayItems = portfolioItems.length > 0 ? portfolioItems : financeServices.map(item => ({
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
        title="Finance" 
        path={['Home', 'Core Industries', 'Finance']} 
      />
      
      <section className="finance-section">
        <div className="">
          <div className="finance-intro">
            <h2>Financial Solutions</h2>
            <p>
              We provide cutting-edge financial technology solutions that empower banks, investment firms, and financial institutions. 
              Our expertise spans across banking applications, payment systems, financial analysis tools, and wealth management platforms.
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
                <IndustryPortfolioCard key={item._id} item={item} industryName="Finance" />
              ))}
            </div>
          )}
          
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