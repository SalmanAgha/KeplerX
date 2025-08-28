import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PortfolioCommon.css';
import Breadcrumb from '../components/Breadcrumb';
import PortfolioCard from '../components/PortfolioCard';

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

const AppDevPortfolio: React.FC = () => {
  const navigate = useNavigate();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Categories related to App Development
  const appCategories = ['app', 'App Development', 'app-development', 'mobile app', 'react native', 'flutter', 'android', 'ios'];

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Filter for app development items only
        const appItems = data.filter((item: PortfolioItem) =>
          item.categories.some(cat => appCategories.includes(cat)) ||
          (item.displayCategories && item.displayCategories.some(cat => appCategories.includes(cat)))
        );

        setPortfolioItems(appItems);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolios:', err);
        setError('Failed to load portfolio items. Please try again later.');
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const handleViewDetails = (id: string) => {
    navigate(`/portfolio/${id}`);
  };

  return (
    <>
      <Breadcrumb title="App Development Portfolio" path={['Home', 'Portfolio', 'App Development']} />

      <section className="portfolio-section">
        <div className="">
          <div className="portfolio-intro">
            <h2>App Development Projects</h2>
            <p>
              Browse our collection of mobile and web application projects demonstrating our capability to deliver high-quality, performant apps across different platforms and industries.
            </p>
          </div>

          {loading ? (
            <div className="loading-container"><p>Loading portfolio items...</p></div>
          ) : error ? (
            <div className="error-container"><p>{error}</p></div>
          ) : portfolioItems.length === 0 ? (
            <div className="empty-container"><p>No portfolio items found in this category.</p></div>
          ) : (
            <div className="portfolio-grid">
              {portfolioItems.map(item => (
                <PortfolioCard key={item._id} item={item} />
              ))}
            </div>
          )}

          <div className="portfolio-cta">
            <h3>Have an App Idea?</h3>
            <p>Contact us to see how we can turn your vision into a high-impact application.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default AppDevPortfolio; 