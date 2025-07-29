import React from 'react';
import './SocialMediaDesign.css';
import Breadcrumb from '../components/Breadcrumb';


const SocialMediaDesign: React.FC = () => {
  // Create array of technology logos
 

  return (
    <>
      <Breadcrumb 
        title="Social Media Design" 
        path={['Home', 'Services', 'Social Media Design']} 
      />
      
      <section className="smd-section">
        <div className="">
          <div className="smd-intro">
            <h2>Social Media Design</h2>
            <p>
              Social media design encompasses creating visually appealing content optimized for various social platforms. From eye-catching posts to engaging stories, our designs help brands stand out in crowded feeds and make lasting impressions. We combine graphic design expertise with social media best practices to create content that captures attention and drives engagement.
            </p>
          </div>
          
          <div className="smd-services-grid">
            <div className="smd-card">
              <img src="/images/post-design.webp" alt="Post Design" />
              <h3>Social Media Post Design</h3>
              <p>Eye-catching and engaging post designs optimized for each social platform's specifications and audience preferences.</p>
            </div>
            
            <div className="smd-card">
              <img src="/images/story-design.webp" alt="Story Design" />
              <h3>Story & Reel Design</h3>
              <p>Captivating story and reel templates that maintain brand consistency while enabling quick content creation and engagement.</p>
            </div>
            
            <div className="smd-card">
              <img src="/images/profile-design.webp" alt="Profile Design" />
              <h3>Profile Optimization</h3>
              <p>Professional profile pictures, covers, and highlights that create strong first impressions and reinforce brand identity.</p>
            </div>
            
            <div className="smd-card">
              <img src="/images/ad-design.webp" alt="Ad Creative Design" />
              <h3>Ad Creative Design</h3>
              <p>Scroll-stopping ad designs optimized for engagement and conversions, tailored to each platform's advertising formats.</p>
            </div>
            
            <div className="smd-card">
              <img src="/images/content-calendar.webp" alt="Content Calendar" />
              <h3>Visual Content Calendar</h3>
              <p>Strategic planning and design of visual content aligned with your marketing goals and campaign timelines.</p>
            </div>
            
            <div className="smd-card">
              <img src="/images/brand-style-guide.webp" alt="Brand Style Guide" />
              <h3>Brand Style Guides</h3>
              <p>Comprehensive guidelines ensuring visual consistency across all social media channels and content types.</p>
            </div>
            
            <div className="smd-card">
              <img src="/images/infographics.webp" alt="Infographics" />
              <h3>Infographics</h3>
              <p>Visual representations of data and information that simplify complex concepts and improve content shareability.</p>
            </div>
            
            <div className="smd-card">
              <img src="/images/carousel-design.webp" alt="Carousel Posts" />
              <h3>Carousel Posts</h3>
              <p>Multi-slide posts designed to tell stories, showcase products, or explain concepts in an engaging, swipeable format.</p>
            </div>
            
            <div className="smd-card">
              <img src="/images/gif-animation.webp" alt="GIFs & Animations" />
              <h3>GIFs & Animations</h3>
              <p>Simple animations and GIFs that capture attention in feeds and convey messages in dynamic, engaging ways.</p>
            </div>
            
            <div className="smd-card">
              <img src="/images/quote-graphics.webp" alt="Quote Graphics" />
              <h3>Quote Graphics</h3>
              <p>Visually appealing quote designs that highlight testimonials, thought leadership, or inspiring statements.</p>
            </div>
            
            <div className="smd-card">
              <img src="/images/video-thumbnails.webp" alt="Video Thumbnails" />
              <h3>Video Thumbnails</h3>
              <p>Compelling thumbnails that increase click-through rates and views for your social media video content.</p>
            </div>
            
            <div className="smd-card">
              <img src="/images/event-graphics.webp" alt="Event Graphics" />
              <h3>Event Graphics</h3>
              <p>Promotional materials for virtual or in-person events, designed to drive registrations and attendance.</p>
            </div>
            
            <div className="smd-card">
              <img src="/images/product-showcases.webp" alt="Product Showcases" />
              <h3>Product Showcases</h3>
              <p>Visually appealing product highlights designed to showcase features, benefits, and drive purchase interest.</p>
            </div>
            
            <div className="smd-card">
              <img src="/images/custom-illustrations.webp" alt="Custom Illustrations" />
              <h3>Custom Illustrations</h3>
              <p>Unique illustrations that express your brand personality and create distinctive, recognizable content.</p>
            </div>
            
            <div className="smd-card">
              <img src="/images/platform-specific.webp" alt="Platform-Specific Design" />
              <h3>Platform-Specific Design</h3>
              <p>Tailored designs optimized for the unique requirements and audience expectations of each social platform.</p>
            </div>
            
            <div className="smd-card">
              <img src="/images/social-media-templates.webp" alt="Template Creation" />
              <h3>Template Creation</h3>
              <p>Custom templates that maintain brand consistency while enabling quick and efficient content creation.</p>
            </div>
          </div>
          
          
        </div>
      </section>
    </>
  );
};

export default SocialMediaDesign; 