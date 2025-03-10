import React from 'react';
import './WebDevelopment.css';
import Breadcrumb from '../components/Breadcrumb';
import TechnologiesSlider from '../components/TechnologiesSlider';
import DevelopmentTimeline from '../components/DevelopmentTimeline';

const WebDevelopment: React.FC = () => {
  // Create array of technology logos
  const technologies = [
    { name: 'LinkedIn', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg' },
    { name: 'Meta', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg' },
    { name: 'Facebook', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-plain.svg' },
    { name: 'Canva', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg' },
    { name: 'WordPress', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg' },
    { name: 'WooCommerce', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/woocommerce/woocommerce-original.svg' },
    { name: 'Shopify', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg' },
    { name: 'HTML5', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS3', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'Adobe Illustrator', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg' },
    { name: 'Pinterest', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pinterest/pinterest-original.svg' },
    { name: 'After Effects', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg' },
    { name: 'Google Ads', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg' },
    { name: 'Vue.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
    { name: 'Swift', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg' },
    { name: 'AWS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg' },
    { name: 'Lambda', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg' },
    { name: 'Java', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  ];

  // Duplicate the array to create a seamless loop
  const logoElements = [...technologies, ...technologies].map((tech, index) => (
    <div className="tech-logo" key={index}>
      <img src={tech.logo} alt={tech.name} />
    </div>
  ));

  return (
    <>
      <Breadcrumb 
        title="Web Development" 
        path={['Home', 'Services', 'Web Development']} 
      />
      
      <section className="web-dev-section">
        <div className="container">
          <div className="web-dev-intro">
            <h2>Custom Web Development Solutions</h2>
            <p>
              We provide end-to-end web development services tailored to your business needs. 
              Our team of experienced developers creates scalable, secure, and high-performance 
              web applications using the latest technologies and best practices.
            </p>
          </div>
          
          <div className="webdev-services-grid">
            <div className="webdev-card">
              <img src="/path/to/react-icon.png" alt="React Development" />
              <h3>React Development</h3>
              <p>Build dynamic, responsive user interfaces with React, the popular JavaScript library for creating interactive web applications.</p>
            </div>
            
            <div className="webdev-card">
              <img src="/path/to/angular-icon.png" alt="Angular Development" />
              <h3>Angular Development</h3>
              <p>Develop robust enterprise-grade applications with Angular, Google's powerful framework for building scalable web applications.</p>
            </div>
            
            <div className="webdev-card">
              <img src="/path/to/vue-icon.png" alt="Vue.js Development" />
              <h3>Vue.js Development</h3>
              <p>Create lightweight, progressive web applications with Vue.js, the approachable yet powerful JavaScript framework.</p>
            </div>
            
            <div className="webdev-card">
              <img src="/path/to/node-icon.png" alt="Node.js Development" />
              <h3>Node.js Development</h3>
              <p>Build fast, scalable server-side applications with Node.js, the JavaScript runtime built on Chrome's V8 JavaScript engine.</p>
            </div>
            
            <div className="webdev-card">
              <img src="/path/to/php-icon.png" alt="PHP Development" />
              <h3>PHP Development</h3>
              <p>Develop dynamic web applications with PHP, one of the most popular server-side scripting languages for web development.</p>
            </div>
            
            <div className="webdev-card">
              <img src="/path/to/laravel-icon.png" alt="Laravel Development" />
              <h3>Laravel Development</h3>
              <p>Create elegant web applications with Laravel, the PHP framework known for its expressive syntax and robust features.</p>
            </div>
            
            <div className="webdev-card">
              <img src="/path/to/wordpress-icon.png" alt="WordPress Development" />
              <h3>WordPress Development</h3>
              <p>Build custom websites and blogs with WordPress, the world's most popular content management system powering over 40% of the web.</p>
            </div>
            
            <div className="webdev-card">
              <img src="/path/to/shopify-icon.png" alt="Shopify Development" />
              <h3>Shopify Development</h3>
              <p>Create custom e-commerce stores with Shopify, the leading platform for online stores and retail point-of-sale systems.</p>
            </div>
            
            <div className="webdev-card">
              <img src="/path/to/magento-icon.png" alt="Magento Development" />
              <h3>Magento Development</h3>
              <p>Build powerful e-commerce solutions with Magento, the flexible platform designed for enterprise-level online stores.</p>
            </div>
            
            <div className="webdev-card">
              <img src="/path/to/woocommerce-icon.png" alt="WooCommerce Development" />
              <h3>WooCommerce Development</h3>
              <p>Develop customizable e-commerce websites with WooCommerce, the popular WordPress plugin for online selling.</p>
            </div>
            
            <div className="webdev-card">
              <img src="/path/to/api-icon.png" alt="API Development" />
              <h3>API Development</h3>
              <p>Create robust APIs that enable seamless integration between different software applications and services.</p>
            </div>
            
            <div className="webdev-card">
              <img src="/path/to/database-icon.png" alt="Database Design" />
              <h3>Database Design</h3>
              <p>Design efficient, scalable database structures that optimize data storage and retrieval for your web applications.</p>
            </div>
            
            <div className="webdev-card">
              <img src="/path/to/responsive-icon.png" alt="Responsive Design" />
              <h3>Responsive Design</h3>
              <p>Create websites that look and function beautifully across all devices, from desktops to smartphones and tablets.</p>
            </div>
            
            <div className="webdev-card">
              <img src="/path/to/performance-icon.png" alt="Performance Optimization" />
              <h3>Performance Optimization</h3>
              <p>Improve your website's speed and efficiency with our expert performance optimization services.</p>
            </div>
            
            <div className="webdev-card">
              <img src="/path/to/security-icon.png" alt="Security Implementation" />
              <h3>Security Implementation</h3>
              <p>Protect your web applications from threats with our comprehensive security implementation services.</p>
            </div>
            
            <div className="webdev-card">
              <img src="/path/to/maintenance-icon.png" alt="Maintenance & Support" />
              <h3>Maintenance & Support</h3>
              <p>Keep your web applications running smoothly with our ongoing maintenance and support services.</p>
            </div>
          </div>
          
          <TechnologiesSlider />
          
          <DevelopmentTimeline />
        </div>
      </section>
    </>
  );
};

export default WebDevelopment; 