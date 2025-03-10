import React from 'react';
import './GraphicDesigning.css';
import Breadcrumb from '../components/Breadcrumb';
import GraphicDesignToolsSlider from '../components/GraphicDesignToolsSlider';
import DesignProcessTimeline from '../components/DesignProcessTimeline';

const GraphicDesigning: React.FC = () => {
  return (
    <>
      <Breadcrumb 
        title="Graphic Designing" 
        path={['Home', 'Services', 'Graphic Designing']} 
      />
      
      <section className="graphic-design-section">
        <div className="container">
          <div className="graphic-design-intro">
            <h2>Creative Graphic Design Solutions</h2>
            <p>
              We provide end-to-end graphic design services tailored to your business needs. 
              Our team of experienced designers creates eye-catching, impactful, and brand-aligned 
              visual content using the latest design trends and best practices.
            </p>
          </div>
          
          <div className="graphic-design-services-grid">
            <div className="graphic-design-card">
              <img src="/path/to/logo-design-icon.png" alt="Logo Design" />
              <h3>Logo Design</h3>
              <p>Create a memorable brand identity with our custom logo design services that capture your brand's essence and values.</p>
            </div>
            
            <div className="graphic-design-card">
              <img src="/path/to/branding-icon.png" alt="Branding" />
              <h3>Branding</h3>
              <p>Develop a cohesive brand identity with our comprehensive branding services, including logo, color palette, typography, and brand guidelines.</p>
            </div>
            
            <div className="graphic-design-card">
              <img src="/path/to/print-design-icon.png" alt="Print Design" />
              <h3>Print Design</h3>
              <p>Create professional print materials including business cards, brochures, flyers, posters, and other marketing collateral.</p>
            </div>
            
            <div className="graphic-design-card">
              <img src="/path/to/packaging-icon.png" alt="Packaging Design" />
              <h3>Packaging Design</h3>
              <p>Design attractive and functional packaging that stands out on shelves and effectively communicates your product's value.</p>
            </div>
            
            <div className="graphic-design-card">
              <img src="/path/to/social-media-icon.png" alt="Social Media Graphics" />
              <h3>Social Media Graphics</h3>
              <p>Create engaging visual content for social media platforms that increases engagement and strengthens your brand presence.</p>
            </div>
            
            <div className="graphic-design-card">
              <img src="/path/to/illustration-icon.png" alt="Illustration" />
              <h3>Illustration</h3>
              <p>Custom illustrations that bring your ideas to life and add a unique visual element to your brand communications.</p>
            </div>
            
            <div className="graphic-design-card">
              <img src="/path/to/infographic-icon.png" alt="Infographics" />
              <h3>Infographics</h3>
              <p>Transform complex information into visually appealing and easy-to-understand infographics that engage your audience.</p>
            </div>
            
            <div className="graphic-design-card">
              <img src="/path/to/ui-design-icon.png" alt="UI Design" />
              <h3>UI Design</h3>
              <p>Create intuitive and visually appealing user interfaces for websites, applications, and digital products.</p>
            </div>
            
            <div className="graphic-design-card">
              <img src="/path/to/banner-icon.png" alt="Banner Design" />
              <h3>Banner Design</h3>
              <p>Eye-catching banner designs for websites, social media, and digital advertising campaigns that drive engagement.</p>
            </div>
            
            <div className="graphic-design-card">
              <img src="/path/to/email-design-icon.png" alt="Email Design" />
              <h3>Email Design</h3>
              <p>Professional email templates and newsletter designs that enhance your email marketing campaigns.</p>
            </div>
            
            <div className="graphic-design-card">
              <img src="/path/to/motion-graphics-icon.png" alt="Motion Graphics" />
              <h3>Motion Graphics</h3>
              <p>Engaging animated graphics and visual effects that bring your brand story to life and capture audience attention.</p>
            </div>
            
            <div className="graphic-design-card">
              <img src="/path/to/photo-editing-icon.png" alt="Photo Editing" />
              <h3>Photo Editing</h3>
              <p>Professional photo editing services to enhance images for marketing materials, websites, and social media.</p>
            </div>
            
            <div className="graphic-design-card">
              <img src="/path/to/typography-icon.png" alt="Typography" />
              <h3>Typography</h3>
              <p>Custom typography solutions that enhance your brand's visual identity and improve readability across all platforms.</p>
            </div>
            
            <div className="graphic-design-card">
              <img src="/path/to/presentation-icon.png" alt="Presentation Design" />
              <h3>Presentation Design</h3>
              <p>Professional presentation designs that effectively communicate your message and engage your audience.</p>
            </div>
            
            <div className="graphic-design-card">
              <img src="/path/to/brand-guidelines-icon.png" alt="Brand Guidelines" />
              <h3>Brand Guidelines</h3>
              <p>Comprehensive brand guidelines that ensure consistency across all your brand communications and touchpoints.</p>
            </div>
            
            <div className="graphic-design-card">
              <img src="/path/to/advertising-icon.png" alt="Advertising Design" />
              <h3>Advertising Design</h3>
              <p>Creative advertising designs for print and digital media that capture attention and drive conversions.</p>
            </div>
          </div>
          
          <GraphicDesignToolsSlider />
          
          <DesignProcessTimeline />
        </div>
      </section>
    </>
  );
};

export default GraphicDesigning; 