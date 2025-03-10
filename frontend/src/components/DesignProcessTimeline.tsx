import React from 'react';
import './DesignProcessTimeline.css';

const DesignProcessTimeline: React.FC = () => {
  return (
    <div className="design-process-timeline">
      <h2 className="timeline-title">Our Design Process</h2>
      <div className="timeline-container">
        <div className="timeline-line"></div>
        
        <div className="timeline-stage">
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <div className="timeline-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/2620/2620253.png" alt="Discovery" />
            </div>
            <h3 className="timeline-stage-title">Discovery</h3>
            <div className="timeline-details">
              <p>Client consultation | Brand analysis |</p>
              <p>Target audience research | Competitor analysis</p>
            </div>
          </div>
        </div>
        
        <div className="timeline-stage">
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <div className="timeline-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/3176/3176384.png" alt="Concept Development" />
            </div>
            <h3 className="timeline-stage-title">Concept Development</h3>
            <div className="timeline-details">
              <p>Sketching | Mood boards | Initial concepts |</p>
              <p>Client feedback | Concept refinement</p>
            </div>
          </div>
        </div>
        
        <div className="timeline-stage">
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <div className="timeline-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/3659/3659899.png" alt="Design Execution" />
            </div>
            <h3 className="timeline-stage-title">Design Execution</h3>
            <div className="timeline-details">
              <p>Digital design | Color refinement | Typography |</p>
              <p>Layout finalization | Client review</p>
            </div>
          </div>
        </div>
        
        <div className="timeline-stage">
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <div className="timeline-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/2875/2875438.png" alt="Delivery" />
            </div>
            <h3 className="timeline-stage-title">Delivery</h3>
            <div className="timeline-details">
              <p>Final adjustments | File preparation |</p>
              <p>Asset delivery | Implementation support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignProcessTimeline; 