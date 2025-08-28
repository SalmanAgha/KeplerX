import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PortfolioDetail.css';
import Breadcrumb from '../components/Breadcrumb';

interface PortfolioItem {
  _id: string;
  title: string;
  categories: string[];
  displayCategories: string[];
  client: string;
  date: string;
  description: string;
  challenge?: string;
  solution?: string;
  results?: string;
  completionDate?: string;
  technologies?: string;
  testimonial?: {
    text: string;
    author: string;
    position: string;
  };
  image: string;
  images?: string[];
  bgColor?: string;
  whatWeDelivered?: {
    description: string;
    items: Array<{
      title: string;
      icon: string;
    }>;
  };
}

const PortfolioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animatedElements, setAnimatedElements] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    const fetchPortfolioDetail = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error('Portfolio ID is missing');
        }
        
        // First try to fetch all portfolios and find the matching one
        const response = await fetch('/api/portfolio');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const allPortfolios = await response.json();
        const selectedPortfolio = allPortfolios.find((item: PortfolioItem) => item._id === id);
        
        if (!selectedPortfolio) {
          throw new Error('Portfolio not found');
        }
        
        setPortfolio(selectedPortfolio);
        setLoading(false);
        
        // Set timeout to trigger animations after content is loaded
        setTimeout(() => {
          setAnimatedElements(true);
        }, 100);
      } catch (err) {
        console.error('Error fetching portfolio detail:', err);
        setError('Failed to load portfolio details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPortfolioDetail();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);
  
  // Setup auto-slide functionality with pause on hover
  useEffect(() => {
    if (!portfolio || !portfolio.images || portfolio.images.length <= 1 || isHovering) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === (portfolio.images?.length || 0) - 1 ? 0 : prev + 1
      );
    }, 3000); // Change slide every 3 seconds
    
    return () => clearInterval(interval); // Clean up on unmount
  }, [portfolio, isHovering]);
  
  const handleBackClick = () => {
    navigate('/portfolio');
  };
  
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    return imagePath.startsWith('http') ? imagePath : `${imagePath}`;
  };

  const handlePrevSlide = () => {
    if (portfolio && portfolio.images && portfolio.images.length > 0) {
      setCurrentSlide((prev) => 
        prev === 0 ? portfolio.images!.length - 1 : prev - 1
      );
    }
  };

  const handleNextSlide = () => {
    if (portfolio && portfolio.images && portfolio.images.length > 0) {
      setCurrentSlide((prev) => 
        prev === portfolio.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleThumbClick = (index: number) => {
    setCurrentSlide(index);
  };
  
  const handleSliderMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleSliderMouseLeave = () => {
    setIsHovering(false);
  };
  
  if (loading) {
    return (
      <>
        <Breadcrumb 
          title="Portfolio Detail" 
          path={['Home', 'Portfolio', 'Loading...']} 
        />
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading portfolio details...</p>
          </div>
        </div>
      </>
    );
  }
  
  if (error || !portfolio) {
    return (
      <>
        <Breadcrumb 
          title="Portfolio Detail" 
          path={['Home', 'Portfolio', 'Error']} 
        />
        <div className="container">
          <div className="error-container">
            <p>{error || 'Portfolio not found'}</p>
            <button className="back-button" onClick={handleBackClick}>
              Back to Portfolio
            </button>
          </div>
        </div>
      </>
    );
  }

  // Prepare images array for slider - only use additional images, not the main image
  const sliderImages = portfolio.images && portfolio.images.length > 0 ? [...portfolio.images] : [];
  
  return (
    <>
      <Breadcrumb 
        title={portfolio.title} 
        path={['Home', 'Portfolio', portfolio.title]} 
      />
      
     
      
      <div className="portfolio-detail-section">
        <div className="">
          <div className="portfolio-detail-layout">
            {/* Main content area with slider */}
            <div className="portfolio-detail-main">
              <div className="portfolio-slider" 
                onMouseEnter={handleSliderMouseEnter}
                onMouseLeave={handleSliderMouseLeave}
              >
                <div className="slider-main">
                  {sliderImages.length > 0 ? (
                    <>
                      <div className="slider-main-image">
                        <img src={getImageUrl(sliderImages[currentSlide])} alt={portfolio.title} />
                      </div>
                      <button className="slider-arrow prev" onClick={handlePrevSlide}>
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <button className="slider-arrow next" onClick={handleNextSlide}>
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </>
                  ) : (
                    <div className="slider-main-image">
                      <img src={getImageUrl(portfolio.image)} alt={portfolio.title} />
                    </div>
                  )}
                </div>
                
                {sliderImages.length > 1 && (
                  <div className="slider-thumbnails">
                    {sliderImages.map((image, index) => (
                      <div 
                        key={index} 
                        className={`slider-thumbnail ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => handleThumbClick(index)}
                      >
                        <img src={getImageUrl(image)} alt={`Thumbnail ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
                
                {sliderImages.length > 1 && (
                  <div className="slider-indicators">
                    {sliderImages.map((_, index) => (
                      <span 
                        key={index} 
                        className={`slider-indicator ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => handleThumbClick(index)}
                      ></span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="portfolio-content">
                <div className={`project-overview ${animatedElements ? 'animate' : ''}`}>
                  <div className="section-header">
                    
                    <h2>Project Overview</h2>
                  </div>
                  <div className="overview-content">
                    <p>{portfolio.description}</p>
                  </div>
                </div>
                
                <div className="project-phases">
                  {portfolio.challenge && (
                    <div className={`phase-card challenge-card ${animatedElements ? 'animate' : ''}`}>
                      <div className="phase-icon">
                        <i className="fas fa-exclamation-triangle"></i>
                      </div>
                      <div className="phase-content">
                        <h3>The Challenge</h3>
                        <p>{portfolio.challenge}</p>
                      </div>
                     
                    </div>
                  )}
                  
                  {portfolio.solution && (
                    <div className={`phase-card solution-card ${animatedElements ? 'animate' : ''}`}>
                      <div className="phase-icon">
                        <i className="fas fa-lightbulb"></i>
                      </div>
                      <div className="phase-content">
                        <h3>Our Solution</h3>
                        <p>{portfolio.solution}</p>
                      </div>
                    
                    </div>
                  )}
                  
                  {portfolio.results && (
                    <div className={`phase-card results-card ${animatedElements ? 'animate' : ''}`}>
                      <div className="phase-icon">
                        <i className="fas fa-chart-line"></i>
                      </div>
                      <div className="phase-content">
                        <h3>The Results</h3>
                        <p>{portfolio.results}</p>
                      </div>
                     
                    </div>
                  )}
                </div>

                {/* What We Delivered Section */}
                {portfolio.whatWeDelivered && portfolio.whatWeDelivered.items && portfolio.whatWeDelivered.items.length > 0 && (
                  <div className={`delivered-section ${animatedElements ? 'animate' : ''}`}>
                    <div className="section-header">
                      
                      <h2>What We Delivered</h2>
                    </div>
                    {portfolio.whatWeDelivered.description && (
                      <p className="delivery-description">{portfolio.whatWeDelivered.description}</p>
                    )}
                    <div className="delivery-items">
                      {portfolio.whatWeDelivered.items.map((item, index) => (
                        <div 
                          key={index} 
                          className={`delivery-item ${animatedElements ? 'animate' : ''}`}
                          style={{ animationDelay: `${0.1 * index}s` }}
                        >
                          <div className="delivery-icon">
                            <i className={`fas ${item.icon}`}></i>
                          </div>
                          <h3>{item.title}</h3>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="cta-section">
                  <div className="cta-content">
                    <h3>Interested in a similar project?</h3>
                    <p>Let's discuss how we can help you achieve your goals.</p>
                  </div>
                  <div className="cta-buttons">
                    <button className="back-button" onClick={handleBackClick}>
                      <i className="fas fa-arrow-left"></i> Back to Portfolio
                    </button>
                    <a href="/contact" className="contact-cta-button">
                      <i className="fas fa-envelope"></i> Get in Touch
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar with project info */}
            <div className="portfolio-detail-sidebar">
              {/* Project Info Card */}
              <div className={`sidebar-card project-info-card ${animatedElements ? 'animate' : ''}`}>
                <h3 className="sidebar-card-title">
                  <i className="fas fa-briefcase"></i> Project Information
                </h3>
                <div className="sidebar-card-content">
                  <div className="info-item">
                    <div className="info-label"><i className="fas fa-building"></i> Client</div>
                    <div className="info-value">{portfolio.client}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label"><i className="fas fa-calendar-check"></i> Completion Date</div>
                    <div className="info-value">{portfolio.completionDate || portfolio.date}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label"><i className="fas fa-tags"></i> Categories</div>
                    <div className="info-value categories">
                      {(portfolio.displayCategories || portfolio.categories || ['Uncategorized']).map((cat, index) => (
                        <span key={index} className="category-tag">{cat}</span>
                      ))}
                    </div>
                  </div>
                  {portfolio.technologies && (
                    <div className="info-item">
                      <div className="info-label"><i className="fas fa-code"></i> Technologies</div>
                      <div className="info-value technologies-list">
                        {portfolio.technologies.split(',').map((tech, index) => (
                          <span key={index} className="technology-tag">{tech.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Testimonial Card */}
              {portfolio.testimonial && portfolio.testimonial.text && (
                <div className={`sidebar-card testimonial-card ${animatedElements ? 'animate' : ''}`}>
                  <h3 className="sidebar-card-title">
                    <i className="fas fa-comment-alt"></i> Client Testimonial
                  </h3>
                  <div className="sidebar-card-content">
                    <div className="testimonial-text">
                      <i className="fas fa-quote-left"></i>
                      <p>{portfolio.testimonial.text}</p>
                      <i className="fas fa-quote-right"></i>
                    </div>
                    <div className="testimonial-author-info">
                      <p className="testimonial-author-name">{portfolio.testimonial.author}</p>
                      <p className="testimonial-author-position">{portfolio.testimonial.position}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Contact Card */}
              <div className={`sidebar-card contact-card ${animatedElements ? 'animate' : ''}`}>
                <h3 className="sidebar-card-title">
                  <i className="fas fa-lightbulb"></i> Need a Similar Project?
                </h3>
                <div className="sidebar-card-content">
                  <p>Let's discuss how we can help bring your vision to life.</p>
                  <div className="contact-features">
                    <div className="feature-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Expert Consultation</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Custom Solutions</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Timely Delivery</span>
                    </div>
                  </div>
                  <a href="/contact" className="contact-button">
                    <i className="fas fa-envelope"></i> Contact Us
                  </a>
                </div>
              </div>
              
              {/* Related Services Card */}
              <div className={`sidebar-card related-services-card ${animatedElements ? 'animate' : ''}`}>
                <h3 className="sidebar-card-title">
                  <i className="fas fa-cogs"></i> Related Services
                </h3>
                <div className="sidebar-card-content">
                  <div className="related-services-list">
                    <a href="/services/web-development" className="related-service-item">
                      <i className="fas fa-laptop-code"></i>
                      <span>Web Development</span>
                    </a>
                    <a href="/services/ui-ux-design" className="related-service-item">
                      <i className="fas fa-pencil-ruler"></i>
                      <span>UI/UX Design</span>
                    </a>
                    <a href="/services/digital-marketing" className="related-service-item">
                      <i className="fas fa-bullhorn"></i>
                      <span>Digital Marketing</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PortfolioDetail; 