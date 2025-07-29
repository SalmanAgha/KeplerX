import React from 'react';
import './seo.css';
import Breadcrumb from '../components/Breadcrumb';

const Seo: React.FC = () => {
  // Create array of technology logos
  
  return (
    <>
      <Breadcrumb 
        title="Search Engine Optimization" 
        path={['Home', 'Services', 'SEO']} 
      />
      
      <section className="seo-section">
        <div className="">
          <div className="seo-intro">
            <h2>Search Engine Optimization</h2>
            <p>
              Our comprehensive SEO services are designed to improve your website's visibility in search engine results, driving more organic traffic and qualified leads to your business. We combine technical expertise, content optimization, and strategic link building to help your website rank higher for relevant keywords and outperform competitors in search results.
            </p>
          </div>
          
          <div className="seo-services-grid">
            <div className="seo-card">
              <img src="/images/keyword-research.webp" alt="Keyword Research" />
              <h3>Keyword Research</h3>
              <p>In-depth analysis to identify high-value keywords with the right balance of search volume, competition, and conversion potential for your business.</p>
            </div>
            
            <div className="seo-card">
              <img src="/images/on-page-seo.webp" alt="On-Page SEO" />
              <h3>On-Page SEO</h3>
              <p>Optimization of your website's content, meta tags, headings, and internal linking structure to improve relevance for target keywords.</p>
            </div>
            
            <div className="seo-card">
              <img src="/images/technical-seo.webp" alt="Technical SEO" />
              <h3>Technical SEO</h3>
              <p>Comprehensive audits and optimization of your website's technical elements, including site speed, mobile-friendliness, and crawlability.</p>
            </div>
            
            <div className="seo-card">
              <img src="/images/content-optimization.webp" alt="Content Optimization" />
              <h3>Content Optimization</h3>
              <p>Creation and optimization of high-quality, relevant content that satisfies user intent and establishes your authority in your industry.</p>
            </div>
            
            <div className="seo-card">
              <img src="/images/link-building.webp" alt="Link Building" />
              <h3>Link Building</h3>
              <p>Strategic acquisition of high-quality backlinks from reputable websites to improve your domain authority and search rankings.</p>
            </div>
            
            <div className="seo-card">
              <img src="/images/local-seo.webp" alt="Local SEO" />
              <h3>Local SEO</h3>
              <p>Optimization strategies focused on improving visibility in local search results, including Google My Business optimization and local citation building.</p>
            </div>
            
            <div className="seo-card">
              <img src="/images/ecommerce-seo.webp" alt="E-commerce SEO" />
              <h3>E-commerce SEO</h3>
              <p>Specialized optimization for online stores, including product page optimization, schema markup, and shopping feed optimization.</p>
            </div>
            
            <div className="seo-card">
              <img src="/images/seo-audit.webp" alt="SEO Audit" />
              <h3>SEO Audit</h3>
              <p>Comprehensive analysis of your website to identify strengths, weaknesses, and opportunities for improvement in your SEO strategy.</p>
            </div>
            
            <div className="seo-card">
              <img src="/images/competitor-analysis.webp" alt="Competitor Analysis" />
              <h3>Competitor Analysis</h3>
              <p>In-depth research of your competitors' SEO strategies to identify opportunities and develop tactics to outrank them in search results.</p>
            </div>
            
            <div className="seo-card">
              <img src="/images/seo-strategy.webp" alt="SEO Strategy" />
              <h3>SEO Strategy</h3>
              <p>Development of customized SEO roadmaps aligned with your business goals, target audience, and competitive landscape.</p>
            </div>
            
            <div className="seo-card">
              <img src="/images/analytics-reporting.webp" alt="Analytics & Reporting" />
              <h3>Analytics & Reporting</h3>
              <p>Setup of tracking tools and regular reporting to monitor your SEO performance, keyword rankings, and return on investment.</p>
            </div>
            
            <div className="seo-card">
              <img src="/images/mobile-seo.webp" alt="Mobile SEO" />
              <h3>Mobile SEO</h3>
              <p>Optimization of your website for mobile devices to improve rankings in mobile search results and enhance user experience.</p>
            </div>
            
            <div className="seo-card">
              <img src="/images/international-seo.webp" alt="International SEO" />
              <h3>International SEO</h3>
              <p>Strategies for businesses targeting multiple countries or languages, including hreflang implementation and international targeting.</p>
            </div>
            
            <div className="seo-card">
              <img src="/images/voice-search-seo.webp" alt="Voice Search Optimization" />
              <h3>Voice Search Optimization</h3>
              <p>Optimization for the growing trend of voice-activated searches, focusing on conversational keywords and featured snippets.</p>
            </div>
            
            <div className="seo-card">
              <img src="/images/penalty-recovery.webp" alt="Penalty Recovery" />
              <h3>Penalty Recovery</h3>
              <p>Identification and resolution of issues that may have led to Google penalties, helping restore your website's search visibility.</p>
            </div>
            
            <div className="seo-card">
              <img src="/images/seo-training.webp" alt="SEO Training" />
              <h3>SEO Training</h3>
              <p>Educational sessions for your team to build internal SEO capabilities and ensure ongoing optimization of your digital presence.</p>
            </div>
          </div>
          
         
        </div>
      </section>
    </>
  );
};

export default Seo;
