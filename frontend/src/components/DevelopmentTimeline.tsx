import React from 'react';
import './DevelopmentTimeline.css';

const DevelopmentTimeline: React.FC = () => {
  return (
    <div className="development-timeline">
      <h2 className="timeline-title">Our Development Process</h2>
      <div className="timeline-container">
        <div className="timeline-line"></div>
        
        <div className="timeline-stage">
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <div className="timeline-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/5956/5956592.png" alt="Planning" />
            </div>
            <h3 className="timeline-stage-title">Planning</h3>
            <div className="timeline-details">
              <p>Business analysis | Document specifications |</p>
              <p>Preparing wireframes | Getting client approval</p>
            </div>
          </div>
        </div>
        
        <div className="timeline-stage">
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <div className="timeline-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/2010/2010990.png" alt="Development" />
            </div>
            <h3 className="timeline-stage-title">Development</h3>
            <div className="timeline-details">
              <p>Coding | Mockup & page layout creation |</p>
              <p>Review | approval cycle</p>
            </div>
          </div>
        </div>
        
        <div className="timeline-stage">
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <div className="timeline-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/2784/2784065.png" alt="Testing" />
            </div>
            <h3 className="timeline-stage-title">Testing</h3>
            <div className="timeline-details">
              <p>Preparing test cases | Testing | Review by the</p>
              <p>QA team | Approval cycle</p>
            </div>
          </div>
        </div>
        
        <div className="timeline-stage">
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <div className="timeline-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/8687/8687487.png" alt="Deployment" />
            </div>
            <h3 className="timeline-stage-title">Deployment</h3>
            <div className="timeline-details">
              <p>launch | Opinion monitoring | Maintenance |</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentTimeline; 