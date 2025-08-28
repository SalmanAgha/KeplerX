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

const Education: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Categories that match this industry
  const industryCategories = ['education', 'Education', 'learning', 'school', 'university', 'college', 'academic', 'elearning'];
  
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter for education category items only
        const educationItems = data.filter((item: PortfolioItem) => 
          item.categories.some(category => 
            industryCategories.includes(category)
          ) ||
          (item.displayCategories && item.displayCategories.some(category => 
            industryCategories.includes(category)
          ))
        );
        
        setPortfolioItems(educationItems);
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
  const educationServices = [
    {
      id: 1,
      title: 'Learning Management Systems',
      category: 'lms',
      image: 'https://picsum.photos/id/20/600/400',
      description: 'Custom LMS platforms for schools, universities, and corporate training programs.',
      bgColor: '#2d2150'
    },
    {
      id: 2,
      title: 'Educational Websites',
      category: 'websites',
      image: 'https://picsum.photos/id/36/600/400',
      description: 'Interactive educational websites with course catalogs, student portals, and online resources.',
      bgColor: '#1a3a4a'
    },
    {
      id: 3,
      title: 'Online Course Development',
      category: 'courses',
      image: 'https://picsum.photos/id/24/600/400',
      description: 'Comprehensive online course development with interactive content and assessments.',
      bgColor: '#3d2d5c'
    },
    {
      id: 4,
      title: 'Student Information Systems',
      category: 'sis',
      image: 'https://picsum.photos/id/180/600/400',
      description: 'Digital student information systems for managing enrollment, grades, and academic records.',
      bgColor: '#4a2d1a'
    }
  ];
  
  // Use either the API-sourced portfolios or sample data if none found
  const displayItems = portfolioItems.length > 0 ? portfolioItems : educationServices.map(item => ({
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
        title="Education" 
        path={['Home', 'Core Industries', 'Education']} 
      />
      
      <section className="education-section">
          <div className="">
          <div className="education-intro">
            <h2>Education Solutions</h2>
            <p>
              Our education technology solutions help schools, universities, and learning institutions deliver 
              engaging educational experiences. From learning management systems and online course platforms to 
              student information systems and educational websites, we provide comprehensive digital solutions for education.
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
                <IndustryPortfolioCard key={item._id} item={item} industryName="Education" />
              ))}
            </div>
          )}
          
          <div className="education-cta">
            <h3>Need Educational Technology Solutions?</h3>
            <p>Contact us to discuss how our education expertise can help enhance learning experiences and streamline academic operations.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Education; 