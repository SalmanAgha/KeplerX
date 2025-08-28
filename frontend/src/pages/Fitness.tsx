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

const Fitness: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Categories that match this industry
  const industryCategories = ['fitness', 'Fitness', 'gym', 'wellness', 'yoga', 'sports', 'health', 'exercise'];
  
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter for fitness category items only
        const fitnessItems = data.filter((item: PortfolioItem) => 
          item.categories.some(category => 
            industryCategories.includes(category)
          ) ||
          (item.displayCategories && item.displayCategories.some(category => 
            industryCategories.includes(category)
          ))
        );
        
        setPortfolioItems(fitnessItems);
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
  const fitnessServices = [
    {
      id: 1,
      title: 'Fitness Centers',
      category: 'gyms',
      image: 'https://picsum.photos/id/50/600/400',
      description: 'Modern fitness facilities with state-of-the-art equipment and functional training spaces.',
      bgColor: '#3d2a4a'
    },
    {
      id: 2,
      title: 'Yoga Studios',
      category: 'wellness',
      image: 'https://picsum.photos/id/51/600/400',
      description: 'Tranquil yoga spaces designed for mindfulness, flexibility and strength training.',
      bgColor: '#2a4a3d'
    },
    {
      id: 3,
      title: 'CrossFit Boxes',
      category: 'gyms',
      image: 'https://picsum.photos/id/52/600/400',
      description: 'High-performance CrossFit facilities optimized for functional fitness and community building.',
      bgColor: '#4a2a2a'
    },
    {
      id: 4,
      title: 'Pilates Centers',
      category: 'wellness',
      image: 'https://picsum.photos/id/53/600/400',
      description: 'Specialized Pilates studios with reformers and equipment for targeted body conditioning.',
      bgColor: '#2a2a4a'
    }
  ];
  
  // Use either the API-sourced portfolios or sample data if none found
  const displayItems = portfolioItems.length > 0 ? portfolioItems : fitnessServices.map(item => ({
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
        title="Fitness" 
        path={['Home', 'Core Industries', 'Fitness']} 
      />
      
      <section className="fitness-section">
        <div className="">
          <div className="fitness-intro">
            <h2>Fitness Industry Solutions</h2>
            <p>
              We create innovative fitness spaces that inspire physical activity and wellness. From commercial 
              gyms and boutique studios to corporate wellness centers and sports complexes, our designs 
              combine functionality, aesthetics, and technology to enhance member experience and operational efficiency.
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
                <IndustryPortfolioCard key={item._id} item={item} industryName="Fitness" />
              ))}
            </div>
          )}
          
          <div className="fitness-cta">
            <h3>Looking for Fitness Industry solutions?</h3>
            <p>Contact us to discuss how our expertise can help create inspiring fitness spaces that drive member engagement and business growth.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Fitness; 