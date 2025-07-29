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

const Food: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Categories that match this industry
  const industryCategories = ['food', 'Food', 'restaurant', 'culinary', 'catering', 'bakery', 'agriculture', 'nutrition'];
  
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter for food category items only
        const foodItems = data.filter((item: PortfolioItem) => 
          item.categories.some(category => 
            industryCategories.includes(category)
          ) ||
          (item.displayCategories && item.displayCategories.some(category => 
            industryCategories.includes(category)
          ))
        );
        
        setPortfolioItems(foodItems);
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
  const foodServices = [
    {
      id: 1,
      title: 'Farm-to-Table Restaurants',
      category: 'restaurants',
      image: 'https://picsum.photos/id/20/600/400',
      description: 'Locally sourced ingredients with seasonal menus and sustainable practices.',
      bgColor: '#2d5021'
    },
    {
      id: 2,
      title: 'Food Processing Plants',
      category: 'manufacturing',
      image: 'https://picsum.photos/id/21/600/400',
      description: 'Modern processing facilities with advanced technology and quality control systems.',
      bgColor: '#3a4a1a'
    },
    {
      id: 3,
      title: 'Organic Bakeries',
      category: 'restaurants',
      image: 'https://picsum.photos/id/22/600/400',
      description: 'Artisanal bakeries specializing in organic, gluten-free, and specialty bread products.',
      bgColor: '#4a3a1d'
    },
    {
      id: 4,
      title: 'Food Distributors',
      category: 'distribution',
      image: 'https://picsum.photos/id/23/600/400',
      description: 'Logistics and distribution solutions for perishable and non-perishable food products.',
      bgColor: '#1d3a2d'
    }
  ];
  
  // Use either the API-sourced portfolios or sample data if none found
  const displayItems = portfolioItems.length > 0 ? portfolioItems : foodServices.map(item => ({
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
        title="Food" 
        path={['Home', 'Core Industries', 'Food']} 
      />
      
      <section className="food-section">
          <div className="">
          <div className="food-intro">
            <h2>Food Industry Solutions</h2>
            <p>
              We deliver innovative solutions across the food industry value chain, from production and processing 
              to distribution and retail. Our expertise helps food businesses optimize operations, maintain quality, 
              and meet regulatory requirements while delighting customers.
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
                <IndustryPortfolioCard key={item._id} item={item} industryName="Food" />
              ))}
            </div>
          )}
          
          <div className="food-cta">
            <h3>Looking for Food Industry solutions?</h3>
            <p>Contact us to discuss how our expertise can help optimize your food business operations and drive growth.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Food; 