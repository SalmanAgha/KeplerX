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

const RealEstate: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Categories that match this industry
  const industryCategories = ['realestate', 'real-estate', 'Real Estate', 'real estate', 'property', 'housing', 'residential', 'commercial'];
  
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter for real estate category items only
        const realEstateItems = data.filter((item: PortfolioItem) => 
          item.categories.some(category => 
            industryCategories.includes(category)
          ) ||
          (item.displayCategories && item.displayCategories.some(category => 
            industryCategories.includes(category)
          ))
        );
        
        setPortfolioItems(realEstateItems);
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
  const realEstateItems = [
    {
      id: 1,
      title: 'Luxury Apartments',
      category: 'residential',
      image: 'https://picsum.photos/id/10/600/400',
      description: 'High-end apartment complexes with premium amenities and modern designs.',
      bgColor: '#2d2150'
    },
    {
      id: 2,
      title: 'Commercial Spaces',
      category: 'commercial',
      image: 'https://picsum.photos/id/11/600/400',
      description: 'Office buildings and retail spaces designed for optimal business performance.',
      bgColor: '#1a3a4a'
    },
    {
      id: 3,
      title: 'Single Family Homes',
      category: 'residential',
      image: 'https://picsum.photos/id/12/600/400',
      description: 'Custom-built single family homes with modern architecture and quality finishes.',
      bgColor: '#3d2d5c'
    },
    {
      id: 4,
      title: 'Shopping Malls',
      category: 'commercial',
      image: 'https://picsum.photos/id/13/600/400',
      description: 'Large retail complexes with various shops, restaurants, and entertainment options.',
      bgColor: '#4a2d1a'
    }
  ];
  
  // Use either the API-sourced portfolios or sample data if none found
  const displayItems = portfolioItems.length > 0 ? portfolioItems : realEstateItems.map(item => ({
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
        title="Real Estate" 
        path={['Home', 'Core Industries', 'Real Estate']} 
      />
      
      <section className="realestate-section">
        <div className="">
          <div className="realestate-intro">
            <h2>Real Estate Development</h2>
            <p>
              We specialize in creating innovative real estate solutions across residential, commercial, and industrial sectors. 
              Our projects are designed with a focus on sustainability, functionality, and architectural excellence.
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
                <IndustryPortfolioCard key={item._id} item={item} industryName="Real Estate" />
              ))}
            </div>
          )}
          
          <div className="realestate-cta">
            <h3>Looking for Real Estate solutions?</h3>
            <p>Contact us to discuss how our real estate expertise can help improve your property development projects.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default RealEstate; 