import React, { useState, useEffect } from 'react';
import './Automotive.css';
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

const Automotive: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Categories that match this industry
  const industryCategories = ['automotive', 'Automotive', 'auto', 'cars', 'vehicles', 'automobile', 'motor', 'automaker'];
  
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter for automotive category items only
        const automotiveItems = data.filter((item: PortfolioItem) => 
          item.categories.some(category => 
            industryCategories.includes(category)
          ) ||
          (item.displayCategories && item.displayCategories.some(category => 
            industryCategories.includes(category)
          ))
        );
        
        setPortfolioItems(automotiveItems);
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
  const automotiveServices = [
    {
      id: 1,
      title: 'Manufacturing Plants',
      category: 'manufacturing',
      image: 'https://picsum.photos/id/30/600/400',
      description: 'State-of-the-art automotive manufacturing facilities with advanced automation.',
      bgColor: '#1a3d4a'
    },
    {
      id: 2,
      title: 'Dealership Showrooms',
      category: 'retail',
      image: 'https://picsum.photos/id/31/600/400',
      description: 'Modern showrooms designed to enhance the customer experience and vehicle presentation.',
      bgColor: '#3d1a4a'
    },
    {
      id: 3,
      title: 'Service Centers',
      category: 'service',
      image: 'https://picsum.photos/id/32/600/400',
      description: 'Efficient service facilities with the latest diagnostic equipment and repair technology.',
      bgColor: '#4a2d1a'
    },
    {
      id: 4,
      title: 'R&D Facilities',
      category: 'research',
      image: 'https://picsum.photos/id/33/600/400',
      description: 'Advanced research and development centers for automotive innovation and testing.',
      bgColor: '#1a4a3d'
    }
  ];
  
  // Use either the API-sourced portfolios or sample data if none found
  const displayItems = portfolioItems.length > 0 ? portfolioItems : automotiveServices.map(item => ({
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
        title="Automotive" 
        path={['Home', 'Core Industries', 'Automotive']} 
      />
      
      <section className="automotive-section">
        <div className="">
          <div className="automotive-intro">
            <h2>Automotive Solutions</h2>
            <p>
              We provide comprehensive solutions for the automotive industry, from manufacturing 
              facilities and dealerships to service centers and specialized infrastructure. Our expertise 
              helps automotive businesses improve efficiency, enhance customer experience, and adapt to 
              industry trends like electric vehicles and smart manufacturing.
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
                <IndustryPortfolioCard key={item._id} item={item} industryName="Automotive" />
              ))}
            </div>
          )}
          
          <div className="automotive-cta">
            <h3>Looking for Automotive Industry solutions?</h3>
            <p>Contact us to discuss how our expertise can help your automotive business thrive in a competitive market.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Automotive; 