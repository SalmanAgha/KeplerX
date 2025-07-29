import React from 'react';
import './ui-ux-design.css';
import Breadcrumb from '../components/Breadcrumb';


const UIUXDesign: React.FC = () => {
  // Create array of technology logos
 

  return (
    <>
      <Breadcrumb 
        title="UI/UX Design" 
        path={['Home', 'Services', 'UI/UX Design']} 
      />
      
      <section className="uiux-section">
        <div className="">
          <div className="uiux-intro">
            <h2>UI/UX Design</h2>
            <p>
              Our UI/UX design services focus on creating intuitive, engaging, and user-centered digital experiences. We combine beautiful visual design with thoughtful interaction patterns to create interfaces that not only look stunning but also provide seamless user experiences. Our design process is heavily research-driven, ensuring that every decision we make is informed by user needs, behaviors, and preferences.
            </p>
          </div>
          
          <div className="uiux-services-grid">
            <div className="uiux-card">
              <img src="/images/user-research.webp" alt="User Research" />
              <h3>User Research</h3>
              <p>Comprehensive research to understand your users' needs, behaviors, and pain points through interviews, surveys, and analytics analysis.</p>
            </div>
            
            <div className="uiux-card">
              <img src="/images/persona-development.webp" alt="Persona Development" />
              <h3>Persona Development</h3>
              <p>Creation of detailed user personas that represent your target audience, their goals, frustrations, and motivations.</p>
            </div>
            
            <div className="uiux-card">
              <img src="/images/information-architecture.webp" alt="Information Architecture" />
              <h3>Information Architecture</h3>
              <p>Strategic organization of content and functionality to create intuitive navigation systems and user flows.</p>
            </div>
            
            <div className="uiux-card">
              <img src="/images/wireframing.webp" alt="Wireframing" />
              <h3>Wireframing</h3>
              <p>Low-fidelity blueprints that establish the skeletal framework of your digital product, focusing on layout and structure.</p>
            </div>
            
            <div className="uiux-card">
              <img src="/images/prototyping.webp" alt="Prototyping" />
              <h3>Prototyping</h3>
              <p>Interactive models that simulate user interactions and allow for testing before full development begins.</p>
            </div>
            
            <div className="uiux-card">
              <img src="/images/visual-design.webp" alt="Visual Design" />
              <h3>Visual Design</h3>
              <p>Creation of the aesthetic style, including color schemes, typography, imagery, and overall visual language.</p>
            </div>
            
            <div className="uiux-card">
              <img src="/images/interaction-design.webp" alt="Interaction Design" />
              <h3>Interaction Design</h3>
              <p>Design of how users interact with your product, including animations, transitions, and responsive behaviors.</p>
            </div>
            
            <div className="uiux-card">
              <img src="/images/design-systems.webp" alt="Design Systems" />
              <h3>Design Systems</h3>
              <p>Development of consistent and reusable components, patterns, and guidelines to ensure coherent product experiences.</p>
            </div>
            
            <div className="uiux-card">
              <img src="/images/responsive-design.webp" alt="Responsive Design" />
              <h3>Responsive Design</h3>
              <p>Creation of designs that adapt perfectly to various screen sizes and devices, ensuring optimal user experience everywhere.</p>
            </div>
            
            <div className="uiux-card">
              <img src="/images/usability-testing.webp" alt="Usability Testing" />
              <h3>Usability Testing</h3>
              <p>Evaluation of your product with real users to identify issues, gather feedback, and validate design decisions.</p>
            </div>
            
            <div className="uiux-card">
              <img src="/images/app-design.webp" alt="Mobile App Design" />
              <h3>Mobile App Design</h3>
              <p>Specialized design for iOS and Android applications that follows platform-specific guidelines while maintaining brand consistency.</p>
            </div>
            
            <div className="uiux-card">
              <img src="/images/web-design.webp" alt="Web Design" />
              <h3>Web Design</h3>
              <p>Creation of visually compelling and functionally optimized websites that deliver exceptional user experiences.</p>
            </div>
            
            <div className="uiux-card">
              <img src="/images/accessibility-design.webp" alt="Accessibility Design" />
              <h3>Accessibility Design</h3>
              <p>Implementation of inclusive design practices to ensure your digital products are usable by people of all abilities.</p>
            </div>
            
            <div className="uiux-card">
              <img src="/images/ui-animation.webp" alt="UI Animation" />
              <h3>UI Animation</h3>
              <p>Creation of thoughtful motion design that enhances user experience, provides feedback, and brings interfaces to life.</p>
            </div>
            
            <div className="uiux-card">
              <img src="/images/conversion-optimization.webp" alt="Conversion Optimization" />
              <h3>Conversion Optimization</h3>
              <p>Strategic design improvements focused on increasing conversion rates and achieving business goals.</p>
            </div>
            
            <div className="uiux-card">
              <img src="/images/ux-audit.webp" alt="UX Audit" />
              <h3>UX Audit</h3>
              <p>Comprehensive evaluation of your existing digital product to identify usability issues and opportunities for improvement.</p>
            </div>
          </div>
          
          
        </div>
      </section>
    </>
  );
};

export default UIUXDesign; 