import React from 'react';
import './3d-animation.css';
import Breadcrumb from '../components/Breadcrumb';


const Animation3D: React.FC = () => {
  // Create array of technology logos
 

  return (
    <>
      <Breadcrumb 
        title="2D/3D Animation" 
        path={['Home', 'Services', '2D/3D Animation']} 
      />
      
      <section className="animation-section">
        <div className="">
          <div className="animation-intro">
            <h2>2D/3D Animation</h2>
            <p>
              Our animation services bring ideas to life through compelling visual storytelling. Whether you need sleek 2D motion graphics or immersive 3D animations, our team of skilled animators creates custom animations that captivate audiences and effectively communicate your message. From concept development to final rendering, we handle all aspects of the animation process to deliver high-quality results that exceed expectations.
            </p>
          </div>
          
          <div className="animation-services-grid">
            <div className="animation-card">
              <img src="/images/character-animation.webp" alt="Character Animation" />
              <h3>Character Animation</h3>
              <p>Creation of expressive, believable characters with realistic movements and emotions that connect with viewers on a human level.</p>
            </div>
            
            <div className="animation-card">
              <img src="/images/3d-modeling.webp" alt="3D Modeling" />
              <h3>3D Modeling</h3>
              <p>Development of detailed three-dimensional digital representations of objects, environments, and characters with precision and artistry.</p>
            </div>
            
            <div className="animation-card">
              <img src="/images/motion-graphics.webp" alt="Motion Graphics" />
              <h3>Motion Graphics</h3>
              <p>Creation of animated graphic designs that bring text, logos, and visual elements to life with movement, transitions, and effects.</p>
            </div>
            
            <div className="animation-card">
              <img src="/images/architectural-visualization.webp" alt="Architectural Visualization" />
              <h3>Architectural Visualization</h3>
              <p>Photorealistic 3D renders and animations of architectural designs, bringing buildings and spaces to life before construction begins.</p>
            </div>
            
            <div className="animation-card">
              <img src="/images/product-animation.webp" alt="Product Animation" />
              <h3>Product Animation</h3>
              <p>Dynamic 3D animations that showcase product features, functionality, and benefits in an engaging and informative way.</p>
            </div>
            
            <div className="animation-card">
              <img src="/images/explainer-videos.webp" alt="Explainer Videos" />
              <h3>Explainer Videos</h3>
              <p>Concise, animated videos that break down complex ideas or processes into easily understandable and engaging visual stories.</p>
            </div>
            
            <div className="animation-card">
              <img src="/images/visual-effects.webp" alt="Visual Effects (VFX)" />
              <h3>Visual Effects (VFX)</h3>
              <p>Integration of computer-generated imagery with live-action footage to create realistic effects that would be impossible or dangerous in real life.</p>
            </div>
            
            <div className="animation-card">
              <img src="/images/3d-visualization.webp" alt="3D Visualization" />
              <h3>3D Visualization</h3>
              <p>Creation of photorealistic 3D renders and animations for products, environments, and concepts with attention to lighting and detail.</p>
            </div>
            
            <div className="animation-card">
              <img src="/images/logo-animation.webp" alt="Logo Animation" />
              <h3>Logo Animation</h3>
              <p>Dynamic animation of brand logos that creates a memorable impression and reinforces brand identity in videos and digital media.</p>
            </div>
            
            <div className="animation-card">
              <img src="/images/medical-animation.webp" alt="Medical Animation" />
              <h3>Medical Animation</h3>
              <p>Scientifically accurate animations of medical procedures, biological processes, and pharmaceutical actions for education and marketing.</p>
            </div>
            
            <div className="animation-card">
              <img src="/images/educational-animation.webp" alt="Educational Animation" />
              <h3>Educational Animation</h3>
              <p>Informative and engaging animations designed to simplify complex concepts and enhance learning retention for various educational purposes.</p>
            </div>
            
            <div className="animation-card">
              <img src="/images/ar-vr-animation.webp" alt="AR/VR Animation" />
              <h3>AR/VR Animation</h3>
              <p>Specialized animations for augmented and virtual reality experiences that create immersive and interactive environments.</p>
            </div>
            
            <div className="animation-card">
              <img src="/images/game-animation.webp" alt="Game Animation" />
              <h3>Game Animation</h3>
              <p>Creation of fluid, responsive animations for video games that enhance gameplay experience and visual storytelling.</p>
            </div>
            
            <div className="animation-card">
              <img src="/images/whiteboard-animation.webp" alt="Whiteboard Animation" />
              <h3>Whiteboard Animation</h3>
              <p>Engaging animations that simulate drawing on a whiteboard, perfect for storytelling, explanations, and educational content.</p>
            </div>
            
            <div className="animation-card">
              <img src="/images/social-media-animation.webp" alt="Social Media Animation" />
              <h3>Social Media Animation</h3>
              <p>Short, attention-grabbing animations optimized for social platforms to boost engagement and enhance brand visibility.</p>
            </div>
            
            <div className="animation-card">
              <img src="/images/rigging-skinning.webp" alt="Rigging & Skinning" />
              <h3>Rigging & Skinning</h3>
              <p>Creation of skeletal structures and skin deformation systems that allow 3D models to move in realistic and appealing ways.</p>
            </div>
          </div>
          
        
        </div>
      </section>
    </>
  );
};

export default Animation3D;
