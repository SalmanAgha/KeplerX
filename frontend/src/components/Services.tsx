import React from 'react';
import './Services.css';

const Services: React.FC = () => {
  return (
    <section className="services" style={{ backgroundImage: 'url(../assets/images/line-vector-sec.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <h2 className="services-title">Dive Into Our Services</h2>
      <p className="services-description">Kepler-X provides professional and custom web development services in USA, Graphic Design services for businesses In USA, SEO, social media marketing, UI/UX design, and corporate videos for real estate, food, and education sectors, all of which can improve the growth of your brand.</p>
      <div className="services-grid">
        <div className="service-card">
          <img src="../assets/images/web-1.png" alt="Web Development" />
          <h3>Web Development</h3>
          <p>Our expert web developers craft dynamic websites that engage users, ensuring seamless functionality and design to grow your online presence.</p>
        </div>
        <div className="service-card">
          <img src="../assets/images/graphic-img.png" alt="Graphic Designing" />
          <h3>Graphic Designing</h3>
          <p>Your brand has given new life by our talented graphic designers, who produce eye-catching graphics that connect with your target market.</p>
        </div>
        <div className="service-card">
          <img src="/path/to/social-media-design-icon.png" alt="Social Media Design" />
          <h3>Social Media Design</h3>
          <p>Create visually stunning social media designs that resonate with your audience, boosting engagement and establishing a strong brand identity online.</p>
        </div>
        <div className="service-card">
          <img src="/path/to/social-media-marketing-icon.png" alt="Social Media Marketing" />
          <h3>Social Media Marketing</h3>
          <p>We boost your brand's visibility with strategic social media marketing campaigns that captivate your audience and drive meaningful engagement.</p>
        </div>
        <div className="service-card">
          <img src="/path/to/seo-icon.png" alt="SEO" />
          <h3>SEO</h3>
          <p>Achieve top search engine rankings with our tailored SEO strategies, designed to increase your visibility and drive organic traffic growth.</p>
        </div>
        <div className="service-card">
          <img src="/path/to/2d-3d-animations-icon.png" alt="2D/3D Animations" />
          <h3>2D/3D Animations</h3>
          <p>Bring your ideas to life with stunning 2D/3D animations that captivate viewers and communicate your message with creativity and impact.</p>
        </div>
        <div className="service-card">
          <img src="/path/to/ui-ux-icon.png" alt="UI/UX" />
          <h3>UI/UX</h3>
          <p>Our UI/UX designers deliver intuitive, user-friendly interfaces, ensuring your digital platforms offer seamless, enjoyable experiences for every visitor.</p>
        </div>
        <div className="service-card">
          <img src="/path/to/corporate-videos-icon.png" alt="Corporate Videos" />
          <h3>Corporate Videos</h3>
          <p>Our professional corporate videos highlight your brand's story, capturing attention and conveying key messages with compelling visuals and clear communication.</p>
        </div>
      </div>
    </section>
  );
};

export default Services; 