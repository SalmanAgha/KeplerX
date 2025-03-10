import React from 'react';
import './TechnologiesSlider.css';

const TechnologiesSlider: React.FC = () => {
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
    <div className="technologies-section">
      <h2 className="technologies-title">TECHNOLOGIES WE WORK IN</h2>
      <div className="title-underline"></div>
      <div className="technologies-slider-container">
        <div className="technologies-slider">
          {logoElements}
        </div>
      </div>
    </div>
  );
};

export default TechnologiesSlider; 