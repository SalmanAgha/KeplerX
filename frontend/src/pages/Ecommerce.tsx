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

const Ecommerce: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Categories that match this industry
  const industryCategories = ['ecommerce', 'Ecommerce', 'e-commerce', 'E-commerce', 'shop', 'retail', 'Store'];
  
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter for ecommerce category items only
        const ecommerceItems = data.filter((item: PortfolioItem) => 
          item.categories.some(category => 
            industryCategories.includes(category)
          ) ||
          (item.displayCategories && item.displayCategories.some(category => 
            industryCategories.includes(category)
          ))
        );
        
        setPortfolioItems(ecommerceItems);
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
  const ecommerceServices = [
    {
      id: 1,
      title: 'Online Store Development',
      category: 'store',
      image: 'https://picsum.photos/id/96/600/400',
      description: 'Custom online store development with seamless shopping experience and secure payment processing.',
      bgColor: '#2d2150'
    },
    {
      id: 2,
      title: 'Product Catalog Management',
      category: 'catalog',
      image: 'https://picsum.photos/id/94/600/400',
      description: 'Comprehensive product catalog management solutions with advanced filtering and search capabilities.',
      bgColor: '#1a3a4a'
    },
    {
      id: 3,
      title: 'Payment Gateway Integration',
      category: 'payment',
      image: 'https://picsum.photos/id/91/600/400',
      description: 'Secure payment gateway integration supporting multiple payment methods and currencies.',
      bgColor: '#3d2d5c'
    },
    {
      id: 4,
      title: 'Inventory Management',
      category: 'inventory',
      image: 'https://picsum.photos/id/92/600/400',
      description: 'Real-time inventory management systems that sync across all sales channels and warehouses.',
      bgColor: '#4a2d1a'
    }
  ];
  
  // Use either the API-sourced portfolios or sample data if none found
  const displayItems = portfolioItems.length > 0 ? portfolioItems : ecommerceServices.map(item => ({
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
        title="Ecommerce" 
        path={['Home', 'Core Industries', 'Ecommerce']} 
      />
      
      <section className="ecommerce-section">
        <div className="">
          <div className="ecommerce-intro">
            <h2>Ecommerce Solutions</h2>
            <p>
              We create powerful ecommerce solutions that drive online sales and enhance the customer shopping experience.
              Our expertise includes custom online store development, product catalog management, payment gateway integration,
              and inventory management systems.
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
                <IndustryPortfolioCard key={item._id} item={item} industryName="Ecommerce" />
              ))}
            </div>
          )}
          
          <div className="ecommerce-cta">
            <h3>Ready to boost your online sales?</h3>
            <p>Contact us to discuss how our ecommerce solutions can help grow your business and improve customer satisfaction.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Ecommerce; 