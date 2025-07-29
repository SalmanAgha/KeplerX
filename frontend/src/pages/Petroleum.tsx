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

const Petroleum: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Categories that match this industry
  const industryCategories = ['petroleum', 'Petroleum', 'oil', 'gas', 'Oil & Gas', 'energy', 'refinery', 'pipeline'];
  
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter for petroleum category items only
        const petroleumItems = data.filter((item: PortfolioItem) => 
          item.categories.some(category => 
            industryCategories.includes(category)
          ) ||
          (item.displayCategories && item.displayCategories.some(category => 
            industryCategories.includes(category)
          ))
        );
        
        setPortfolioItems(petroleumItems);
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
  const petroleumServices = [
    {
      id: 1,
      title: 'Refineries',
      category: 'processing',
      image: 'https://picsum.photos/id/40/600/400',
      description: 'State-of-the-art petroleum refineries with advanced processing technologies.',
      bgColor: '#2d4a50'
    },
    {
      id: 2,
      title: 'Oil Terminals',
      category: 'storage',
      image: 'https://picsum.photos/id/41/600/400',
      description: 'Strategic oil terminal facilities for efficient storage and distribution.',
      bgColor: '#4a3d2d'
    },
    {
      id: 3,
      title: 'Offshore Platforms',
      category: 'extraction',
      image: 'https://picsum.photos/id/42/600/400',
      description: 'Innovative offshore platform designs for safe and efficient oil extraction.',
      bgColor: '#324a3d'
    },
    {
      id: 4,
      title: 'Gas Stations',
      category: 'retail',
      image: 'https://picsum.photos/id/43/600/400',
      description: 'Modern gas station designs with convenience stores and customer amenities.',
      bgColor: '#4a2d32'
    }
  ];
  
  // Use either the API-sourced portfolios or sample data if none found
  const displayItems = portfolioItems.length > 0 ? portfolioItems : petroleumServices.map(item => ({
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
        title="Petroleum" 
        path={['Home', 'Core Industries', 'Petroleum']} 
      />
      
      <section className="petroleum-section">
        <div className="">
          <div className="petroleum-intro">
            <h2>Petroleum Industry Solutions</h2>
            <p>
              We provide specialized solutions for the petroleum industry across the entire value chain,
              from extraction and processing to transportation and retail. Our expertise helps petroleum 
              companies enhance operational efficiency, maintain safety standards, and implement sustainable 
              practices in a changing energy landscape.
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
                <IndustryPortfolioCard key={item._id} item={item} industryName="Petroleum" />
              ))}
            </div>
          )}
          
          <div className="petroleum-cta">
            <h3>Looking for Petroleum Industry solutions?</h3>
            <p>Contact us to discuss how our expertise can help your petroleum operations achieve excellence in a competitive market.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Petroleum; 