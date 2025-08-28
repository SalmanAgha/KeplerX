import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PortfolioCard.css'; // Reusing the same styles

interface IndustryPortfolioCardProps {
  item: {
    _id: string;
    title: string;
    description: string;
    image: string;
    categories?: string[];
    displayCategories?: string[];
    bgColor?: string;
  };
  industryName: string;
}

const IndustryPortfolioCard: React.FC<IndustryPortfolioCardProps> = ({ item, industryName }) => {
  const navigate = useNavigate();
  
  // Function to truncate description to 10 words
  const truncateDescription = (description: string): string => {
    const words = description.split(' ');
    if (words.length > 10) {
      return words.slice(0, 10).join(' ') + '...';
    }
    return description;
  };
  
  // Handle navigation to detail page
  const handleViewDetails = (portfolioId: string) => {
    navigate(`/portfolio/${portfolioId}`);
  };
  
  // Get image URL with proper path
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    return imagePath.startsWith('http') ? imagePath : `${imagePath}`;
  };
  
  return (
    <div className="portfolio-card">
      <div className="portfolio-card-image">
        <img src={getImageUrl(item.image)} alt={item.title} />
        {/* Industry badge */}
        <div className="category-badge">
          {industryName}
        </div>
        <div className="portfolio-card-title">
          <h3>{item.title}</h3>
        </div>
        <div className="portfolio-card-overlay">
          <div className="overlay-content">
            <p>{truncateDescription(item.description)}</p>
            <a 
              href="#" 
              className="view-details" 
              onClick={(e) => {
                e.preventDefault();
                handleViewDetails(item._id);
              }}
            >
              View Details
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryPortfolioCard; 