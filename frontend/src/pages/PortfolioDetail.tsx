import React, { useState, useEffect } from 'react';
import './PortfolioDetail.css';
import Breadcrumb from '../components/Breadcrumb';

interface PortfolioDetailProps {
  id?: string;
}

const PortfolioDetail: React.FC<PortfolioDetailProps> = ({ id }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [portfolioItem, setPortfolioItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock portfolio items data - in a real app, this would come from an API
  const portfolioItems = [
    {
      id: 1,
      title: 'Identity Design',
      category: 'graphic',
      client: 'Tech Innovations Inc.',
      completionDate: 'June 15, 2023',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi.',
      challenge: 'The client needed a complete brand identity that would stand out in a competitive market while conveying their innovative approach to technology solutions.',
      solution: 'We developed a comprehensive brand identity system including logo design, color palette, typography, and brand guidelines. The design focused on clean, modern aesthetics with a touch of futuristic elements to represent the client\'s forward-thinking approach.',
      results: 'The new brand identity helped the client increase brand recognition by 45% within the first six months. The consistent visual language across all platforms strengthened their market position and attracted new partnership opportunities.',
      technologies: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma'],
      images: [
        '/images/cover.webp',
        '/images/cover.webp',
        '/images/cover.webp',
        '/images/cover.webp'
      ],
      testimonial: {
        text: "The team delivered beyond our expectations. The new brand identity perfectly captures our company's vision and has significantly improved our market presence.",
        author: "John Smith",
        position: "CEO, Tech Innovations Inc."
      }
    },
    {
      id: 2,
      title: 'Website Design',
      category: 'web',
      client: 'Global Retail Solutions',
      completionDate: 'August 22, 2023',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi.',
      challenge: 'The client needed a modern e-commerce website that would provide an exceptional user experience while handling a large inventory of products.',
      solution: 'We designed and developed a responsive e-commerce platform with advanced filtering, search functionality, and a streamlined checkout process. The design focused on showcasing products effectively while ensuring fast loading times and intuitive navigation.',
      results: 'The new website increased online sales by 78% and reduced cart abandonment rates by 35%. The improved user experience led to longer session durations and higher conversion rates.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
      images: [
        '/images/cover.webp',
        '/images/cover.webp',
        '/images/cover.webp',
        '/images/cover.webp'
      ],
      testimonial: {
        text: "Our online presence has been completely transformed. The new website not only looks beautiful but has significantly improved our sales and customer satisfaction.",
        author: "Sarah Johnson",
        position: "Marketing Director, Global Retail Solutions"
      }
    },
    {
      id: 3,
      title: 'Product Design',
      category: 'graphic',
      client: 'EcoLife Products',
      completionDate: 'October 10, 2023',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi.',
      challenge: 'The client needed packaging designs for their new line of eco-friendly household products that would communicate their sustainable values while standing out on retail shelves.',
      solution: 'We created a cohesive packaging design system using recycled materials and eco-friendly printing techniques. The designs featured natural imagery, earthy colors, and clear communication of the products\' environmental benefits.',
      results: 'The new packaging helped the product line achieve 40% higher sales than projected in the first quarter. Consumer surveys indicated that 85% of customers were attracted to the products because of the packaging design.',
      technologies: ['Adobe Illustrator', 'Adobe Photoshop', '3D Mockup Software'],
      images: [
        '/images/cover.webp',
        '/images/cover.webp',
        '/images/cover.webp',
        '/images/cover.webp'
      ],
      testimonial: {
        text: "The packaging designs perfectly capture our brand's commitment to sustainability. They've been instrumental in our successful product launch.",
        author: "Michael Green",
        position: "Product Manager, EcoLife Products"
      }
    },
    {
      id: 4,
      title: 'Digital Advertising',
      category: 'marketing',
      client: 'Urban Fitness Club',
      completionDate: 'September 5, 2023',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi.',
      challenge: 'The client needed a digital advertising campaign to promote their new fitness centers opening in three major cities, targeting health-conscious young professionals.',
      solution: 'We developed a comprehensive digital advertising strategy including social media ads, display banners, and video content. The campaign featured dynamic visuals, compelling copy, and targeted messaging based on demographic data.',
      results: 'The campaign generated over 2 million impressions, resulting in 15,000 new membership sign-ups across the three locations. ROI on ad spend was 320%, exceeding industry benchmarks by 85%.',
      technologies: ['Adobe Creative Suite', 'Facebook Ads Manager', 'Google Ads', 'After Effects'],
      images: [
        '/images/cover.webp',
        '/images/cover.webp',
        '/images/cover.webp',
        '/images/cover.webp'
      ],
      testimonial: {
        text: "The digital campaign was a game-changer for our new locations. The creative approach and strategic targeting delivered results far beyond our expectations.",
        author: "Lisa Rodriguez",
        position: "Marketing Manager, Urban Fitness Club"
      }
    },
    {
      id: 5,
      title: 'Mobile App Design',
      category: 'mobile',
      client: 'HealthTrack',
      completionDate: 'July 30, 2023',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi.',
      challenge: 'The client needed a user-friendly mobile app for tracking health metrics, exercise routines, and nutrition that would appeal to users of all fitness levels.',
      solution: 'We designed an intuitive mobile app with a clean interface, customizable dashboards, and gamified elements to encourage user engagement. The app featured seamless integration with wearable devices and social sharing capabilities.',
      results: 'The app achieved 500,000 downloads in the first three months, with a 4.8/5 star rating on app stores. User retention rates were 65% higher than industry average for health and fitness apps.',
      technologies: ['React Native', 'Firebase', 'HealthKit', 'Google Fit', 'Figma'],
      images: [
        '/images/cover.webp',
        '/images/cover.webp',
        '/images/cover.webp',
        '/images/cover.webp'
      ],
      testimonial: {
        text: "The app design exceeded our expectations in every way. User feedback has been overwhelmingly positive, particularly regarding the intuitive interface and personalization options.",
        author: "David Chen",
        position: "Product Director, HealthTrack"
      }
    },
    {
      id: 6,
      title: 'Social Media Design',
      category: 'marketing',
      client: 'Bloom Cosmetics',
      completionDate: 'November 12, 2023',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi.',
      challenge: 'The client needed a cohesive social media visual strategy to launch their new line of organic cosmetics and build a strong online community.',
      solution: 'We created a comprehensive social media design package including post templates, story highlights, profile layouts, and animated content. The designs featured a soft color palette, botanical elements, and lifestyle photography to showcase the products in use.',
      results: 'The client\'s social media following increased by 215% within six months. Engagement rates improved by 78%, and the product launch generated 3x more sales than previous launches.',
      technologies: ['Adobe Photoshop', 'Adobe Illustrator', 'After Effects', 'Canva'],
      images: [
        '/images/cover.webp',
        '/images/cover.webp',
        '/images/cover.webp',
        '/images/cover.webp'
      ],
      testimonial: {
        text: "The social media designs transformed our online presence. We've not only gained followers but built a genuine community around our brand.",
        author: "Emma Taylor",
        position: "Social Media Manager, Bloom Cosmetics"
      }
    },
    {
      id: 7,
      title: 'UI/UX Design',
      category: 'web',
      client: 'FinTech Solutions',
      completionDate: 'December 5, 2023',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi.',
      challenge: 'The client needed a complete redesign of their financial management platform to improve user experience, increase feature adoption, and reduce support tickets.',
      solution: 'We conducted extensive user research and developed a new UI/UX design with simplified workflows, intuitive navigation, and clear data visualization. The redesign included a design system for consistent components and accessibility improvements.',
      results: 'After implementation, user satisfaction scores increased by 42%. Feature adoption improved by 65%, and support tickets related to usability decreased by 78%.',
      technologies: ['Figma', 'Sketch', 'InVision', 'Adobe XD', 'Zeplin'],
      images: [
        '/images/cover.webp',
        '/images/cover.webp',
        '/images/cover.webp',
        '/images/cover.webp'
      ],
      testimonial: {
        text: "The redesign has completely transformed how our users interact with our platform. Complex financial tasks are now intuitive, and our customers love the new experience.",
        author: "Robert Kim",
        position: "Head of Product, FinTech Solutions"
      }
    },
    {
      id: 8,
      title: 'Packaging Design',
      category: 'graphic',
      client: 'Artisan Foods',
      completionDate: 'October 25, 2023',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi.',
      challenge: 'The client needed distinctive packaging for their premium line of artisanal food products that would communicate quality and craftsmanship while standing out in specialty stores.',
      solution: 'We designed packaging that combined rustic elements with modern typography and a sophisticated color palette. Each product featured custom illustrations and storytelling elements about the ingredients and production methods.',
      results: 'The new packaging helped secure distribution in high-end retail chains, resulting in a 125% increase in sales. The designs won two industry awards for packaging excellence.',
      technologies: ['Adobe Illustrator', 'Adobe Photoshop', 'Dimension', 'Procreate'],
      images: [
        '/images/cover.webp',
        '/images/cover.webp',
        '/images/cover.webp',
        '/images/cover.webp'
      ],
      testimonial: {
        text: "The packaging designs have been transformative for our brand. They perfectly capture our commitment to quality and have helped us reach new customers who are drawn to the visual storytelling.",
        author: "Isabella Martinez",
        position: "Founder, Artisan Foods"
      }
    }
  ];

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchPortfolioItem = () => {
      setLoading(true);
      // Find the portfolio item with the matching ID
      const item = portfolioItems.find(item => item.id === Number(id));
      
      if (item) {
        setPortfolioItem(item);
      }
      
      setLoading(false);
    };

    fetchPortfolioItem();

    // Set up slider interval
    const interval = setInterval(() => {
      if (portfolioItem) {
        setCurrentSlide(prev => (prev + 1) % portfolioItem.images.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id, portfolioItem?.images?.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Custom navigation function
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    window.history.pushState({}, '', path);
    // Create and dispatch custom events
    const pushStateEvent = new Event('pushstate');
    window.dispatchEvent(pushStateEvent);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading project details...</p>
      </div>
    );
  }

  if (!portfolioItem) {
    return (
      <div className="error-container">
        <h2>Project Not Found</h2>
        <p>The project you're looking for doesn't exist or has been removed.</p>
        <a 
          href="/portfolio" 
          className="back-button"
          onClick={(e) => handleNavigation(e, '/portfolio')}
        >
          Back to Portfolio
        </a>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb 
        title={portfolioItem.title} 
        path={['Home', 'Portfolio', portfolioItem.title]} 
      />
      
      <section className="portfolio-detail-section">
        <div className="hero-slider">
          <div className="slider-container">
            {portfolioItem.images.map((image: string, index: number) => (
              <div 
                key={index} 
                className={`slide ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${image})` }}
              >
                <div className="slide-content">
                  <h1>{portfolioItem.title}</h1>
                  <p className="category">{portfolioItem.category.charAt(0).toUpperCase() + portfolioItem.category.slice(1)}</p>
                </div>
              </div>
            ))}
            
            <div className="slider-controls">
              {portfolioItem.images.map((_: string, index: number) => (
                <button 
                  key={index} 
                  className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="container">
          <div className="portfolio-detail-content">
            <div className="project-overview">
              <h2>Project Overview</h2>
              <p>{portfolioItem.description}</p>
              
              <div className="project-meta">
                <div className="meta-item">
                  <h3>Client</h3>
                  <p>{portfolioItem.client}</p>
                </div>
                <div className="meta-item">
                  <h3>Category</h3>
                  <p>{portfolioItem.category.charAt(0).toUpperCase() + portfolioItem.category.slice(1)}</p>
                </div>
                <div className="meta-item">
                  <h3>Completion Date</h3>
                  <p>{portfolioItem.completionDate}</p>
                </div>
                <div className="meta-item">
                  <h3>Technologies</h3>
                  <div className="tech-tags">
                    {portfolioItem.technologies.map((tech: string, index: number) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="project-details">
              <div className="detail-section">
                <h2>The Challenge</h2>
                <p>{portfolioItem.challenge}</p>
              </div>
              
              <div className="detail-section">
                <h2>Our Solution</h2>
                <p>{portfolioItem.solution}</p>
              </div>
              
              <div className="detail-section">
                <h2>The Results</h2>
                <p>{portfolioItem.results}</p>
              </div>
            </div>
            
            <div className="project-gallery">
              <h2>Project Gallery</h2>
              <div className="gallery-grid">
                {portfolioItem.images.map((image: string, index: number) => (
                  <div key={index} className="gallery-item">
                    <img src={image} alt={`${portfolioItem.title} - Image ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="testimonial-section">
              <div className="testimonial">
                <div className="quote-icon">❝</div>
                <p className="testimonial-text">{portfolioItem.testimonial.text}</p>
                <div className="testimonial-author">
                  <p className="author-name">{portfolioItem.testimonial.author}</p>
                  <p className="author-position">{portfolioItem.testimonial.position}</p>
                </div>
              </div>
            </div>
            
            <div className="cta-section">
              <h2>Ready to start your project?</h2>
              <p>Let's discuss how we can help bring your vision to life.</p>
              <a href="/contact" className="contact-button">Contact Us</a>
            </div>
            
            <div className="navigation-buttons">
              <a 
                href="/portfolio" 
                className="back-button"
                onClick={(e) => handleNavigation(e, '/portfolio')}
              >
                Back to Portfolio
              </a>
              <div className="project-navigation">
                {portfolioItem.id > 1 && (
                  <a 
                    href={`/portfolio/${portfolioItem.id - 1}`} 
                    className="prev-button"
                    onClick={(e) => handleNavigation(e, `/portfolio/${portfolioItem.id - 1}`)}
                  >
                    Previous Project
                  </a>
                )}
                {portfolioItem.id < portfolioItems.length && (
                  <a 
                    href={`/portfolio/${portfolioItem.id + 1}`} 
                    className="next-button"
                    onClick={(e) => handleNavigation(e, `/portfolio/${portfolioItem.id + 1}`)}
                  >
                    Next Project
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PortfolioDetail; 