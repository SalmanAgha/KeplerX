import React from 'react';
import './Services.css';


const Services: React.FC = () => {
  return (
    <section className="services" style={{ backgroundImage: 'url(../assets/images/line-vector-sec.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <h2 className="services-title">Dive Into Our Services</h2>
      <p className="services-description">Kepler-X provides professional Web Development, App Development, and AI services that empower your brand to thrive in today's digital landscape.</p>
      <div className="services-grid">
        <a href='/services/web-development'>
        <div className="service-card">
          <img src="/images/web-1.png" alt="Web Development" />
          <h3>Web Development</h3>
          <p>Our expert web developers craft dynamic websites that engage users, ensuring seamless functionality and design to grow your online presence.</p>
        </div>
        </a>
        <a href='/services/app-development'>
        <div className="service-card">
          <img src="/images/react.webp" alt="App Development" />
          <h3>App Development</h3>
          <p>We build high-performance mobile and web applications tailored to your business goals, delivering exceptional user experiences across all devices.</p>
        </div>
        </a>
        <a href='/services/ai-services'>
        <div className="service-card">
          <img src="/images/database.png" alt="AI Services" />
          <h3>AI Services</h3>
          <p>Transform your business with cutting-edge AI solutions including machine learning, automation, chatbots, and intelligent analytics for enhanced efficiency.</p>
        </div>
        </a>
      </div>
    </section>
  );
};

export default Services; 