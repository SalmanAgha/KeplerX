import React from 'react';
import './SocialMediaMarketing.css';
import Breadcrumb from '../components/Breadcrumb';


const SocialMediaMarketing: React.FC = () => {
  // Create array of technology logos


  return (
    <>
      <Breadcrumb 
        title="Social Media Marketing" 
        path={['Home', 'Services', 'Social Media Marketing']} 
      />
      
      <section className="smm-section">
        <div className="">
          <div className="smm-intro">
            <h2>Social Media Marketing</h2>
            <p>
              Social media marketing involves creating and sharing content on social media platforms to achieve your marketing and branding goals. From increasing website traffic to building conversions, we create strategies tailored to your business objectives. We also provide integrated digital marketing services including content marketing and SEO services to ensure comprehensive online presence.
            </p>
          </div>
          
          <div className="smm-services-grid">
            <div className="smm-card">
              <img src="/images/social-strategy.webp" alt="Social Strategy" />
              <h3>Strategy Development</h3>
              <p>Custom social media strategies aligned with your business goals, target audience, and industry trends for maximum impact.</p>
            </div>
            
            <div className="smm-card">
              <img src="/images/content-creation.webp" alt="Content Creation" />
              <h3>Content Creation</h3>
              <p>Engaging, platform-specific content that resonates with your audience and drives meaningful interactions with your brand.</p>
            </div>
            
            <div className="smm-card">
              <img src="/images/community-management.webp" alt="Community Management" />
              <h3>Community Management</h3>
              <p>Proactive engagement with your audience to build relationships, resolve issues, and foster brand loyalty and trust.</p>
            </div>
            
            <div className="smm-card">
              <img src="/images/paid-social.webp" alt="Paid Social Advertising" />
              <h3>Paid Social Advertising</h3>
              <p>Targeted ad campaigns that maximize your budget and deliver measurable ROI across all social media platforms.</p>
            </div>
            
            <div className="smm-card">
              <img src="/images/analytics.webp" alt="Analytics & Reporting" />
              <h3>Analytics & Reporting</h3>
              <p>Comprehensive performance tracking and insights to continuously optimize your social media marketing efforts.</p>
            </div>
            
            <div className="smm-card">
              <img src="/images/influencer.webp" alt="Influencer Marketing" />
              <h3>Influencer Marketing</h3>
              <p>Strategic partnerships with relevant influencers to expand your reach, build credibility, and connect with new audiences.</p>
            </div>
            
            <div className="smm-card">
              <img src="/images/campaign-planning.webp" alt="Campaign Planning" />
              <h3>Campaign Planning</h3>
              <p>Strategic planning and execution of targeted social media campaigns aligned with your business objectives and brand messaging.</p>
            </div>
            
            <div className="smm-card">
              <img src="/images/social-listening.webp" alt="Social Listening" />
              <h3>Social Listening</h3>
              <p>Monitor conversations about your brand, competitors, and industry to gain valuable insights and respond appropriately.</p>
            </div>
            
            <div className="smm-card">
              <img src="/images/crisis-management.webp" alt="Crisis Management" />
              <h3>Crisis Management</h3>
              <p>Quick and effective responses to negative situations on social media to protect and maintain your brand reputation.</p>
            </div>
            
            <div className="smm-card">
              <img src="/images/content-calendar.webp" alt="Content Calendar" />
              <h3>Content Calendar</h3>
              <p>Strategic planning of your social media content to ensure consistent posting and cohesive brand messaging across platforms.</p>
            </div>
            
            <div className="smm-card">
              <img src="/images/competitive-analysis.webp" alt="Competitive Analysis" />
              <h3>Competitive Analysis</h3>
              <p>Research and analysis of your competitors' social media presence to identify opportunities and improve your strategy.</p>
            </div>
            
            <div className="smm-card">
              <img src="/images/platform-optimization.webp" alt="Platform Optimization" />
              <h3>Platform Optimization</h3>
              <p>Optimize your profiles and content for each social platform to maximize visibility and engagement with your target audience.</p>
            </div>
            
            <div className="smm-card">
              <img src="/images/social-seo.webp" alt="Social SEO" />
              <h3>Social SEO</h3>
              <p>Enhance your search engine visibility through strategic social media activities that complement your SEO efforts.</p>
            </div>
            
            <div className="smm-card">
              <img src="/images/audience-targeting.webp" alt="Audience Targeting" />
              <h3>Audience Targeting</h3>
              <p>Identify and reach your ideal customers through sophisticated targeting options available on social media platforms.</p>
            </div>
            
            <div className="smm-card">
              <img src="/images/performance-tracking.webp" alt="Performance Tracking" />
              <h3>Performance Tracking</h3>
              <p>Monitor and analyze your social media metrics to continuously improve your strategy and demonstrate ROI.</p>
            </div>
            
            <div className="smm-card">
              <img src="/images/consultation.webp" alt="Consultation & Training" />
              <h3>Consultation & Training</h3>
              <p>Expert guidance and training for your team to enhance your in-house social media marketing capabilities and knowledge.</p>
            </div>
          </div>
          
          
        </div>
      </section>
    </>
  );
};

export default SocialMediaMarketing; 