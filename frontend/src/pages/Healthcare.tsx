import React, { useState, useEffect } from 'react';
import './Healthcare.css';
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

const Healthcare: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Categories that match this industry
  const industryCategories = ['healthcare', 'Healthcare', 'medical', 'Medical', 'hospital', 'clinic', 'telemedicine', 'health'];
  
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter for healthcare category items only
        const healthcareItems = data.filter((item: PortfolioItem) => 
          item.categories.some(category => 
            industryCategories.includes(category)
          ) ||
          (item.displayCategories && item.displayCategories.some(category => 
            industryCategories.includes(category)
          ))
        );
        
        setPortfolioItems(healthcareItems);
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
  const healthcareServices = [
    {
      id: 1,
      title: 'Hospitals',
      category: 'facilities',
      image: 'https://picsum.photos/id/20/600/400',
      description: 'Modern hospital facilities equipped with the latest medical technology and patient care systems.',
      bgColor: '#2d2150'
    },
    {
      id: 2,
      title: 'Medical Apps',
      category: 'digital',
      image: 'https://picsum.photos/id/21/600/400',
      description: 'User-friendly medical applications designed to improve patient care and healthcare provider efficiency.',
      bgColor: '#1a3a4a'
    },
    {
      id: 3,
      title: 'Telemedicine',
      category: 'digital',
      image: 'https://picsum.photos/id/22/600/400',
      description: 'Remote healthcare solutions connecting patients with healthcare providers through secure video consultations.',
      bgColor: '#3d2d5c'
    },
    {
      id: 4,
      title: 'Medical Equipment',
      category: 'products',
      image: 'https://picsum.photos/id/23/600/400',
      description: 'Cutting-edge medical equipment and devices that enhance diagnosis, treatment, and patient monitoring.',
      bgColor: '#4a2d1a'
    }
  ];
  
  // Use either the API-sourced portfolios or sample data if none found
  const displayItems = portfolioItems.length > 0 ? portfolioItems : healthcareServices.map(item => ({
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
        title="Healthcare" 
        path={['Home', 'Core Industries', 'Healthcare']} 
      />
      
      <section className="healthcare-section">
        <div className="">
          <div className="healthcare-intro">
            <h2>Healthcare Solutions</h2>
            <p>
              We provide innovative healthcare solutions that improve patient care, streamline operations, and enhance healthcare delivery. 
              Our expertise spans across medical facilities, digital health applications, medical equipment, and healthcare management systems.
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
                <IndustryPortfolioCard key={item._id} item={item} industryName="Healthcare" />
              ))}
            </div>
          )}
          
          <div className="healthcare-cta">
            <h3>Looking for healthcare solutions?</h3>
            <p>Contact us to discuss how our healthcare expertise can help your organization deliver better patient care.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Healthcare; 