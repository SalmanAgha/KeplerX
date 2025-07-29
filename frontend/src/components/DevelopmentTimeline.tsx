import React, { useEffect, useState } from 'react';
import './DevelopmentTimeline.css';

const DevelopmentTimeline: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const timelineData = [
    {
      title: "Planning",
      icon: "https://cdn-icons-png.flaticon.com/512/5956/5956592.png",
      description: [
        "Business analysis",
        "Document specifications",
        "Preparing wireframes",
        "Client approval"
      ]
    },
    {
      title: "Development",
      icon: "https://cdn-icons-png.flaticon.com/512/2010/2010990.png",
      description: [
        "Coding",
        "Mockup & page layout creation",
        "Review",
        "Approval cycle"
      ]
    },
    {
      title: "Testing",
      icon: "https://cdn-icons-png.flaticon.com/512/2784/2784065.png",
      description: [
        "Preparing test cases",
        "Functionality testing",
        "QA team review",
        "Approval cycle"
      ]
    },
    {
      title: "Deployment",
      icon: "https://cdn-icons-png.flaticon.com/512/8687/8687487.png",
      description: [
        "Launch",
        "Monitoring",
        "Maintenance",
        "Optimization"
      ]
    }
  ];

  return (
    <div className="dev-timeline-wrapper">
      <div className="dev-timeline-header">
        <h2 className="dev-timeline-title">Our Development Process</h2>
        <p className="dev-timeline-subtitle">Our proven approach ensures quality results and satisfied clients</p>
      </div>

      <div className="dev-timeline-container">
        {timelineData.map((item, index) => (
          <div 
            key={index} 
            className="dev-timeline-step"
            style={{
              animationDelay: `${index * 0.2}s`
            }}
          >
            <div className="dev-timeline-card">
              <div className="dev-timeline-icon-wrapper">
                <img src={item.icon} alt={item.title} className="dev-timeline-icon" />
              </div>
              <h3 className="dev-timeline-step-title">{item.title}</h3>
              <div className="dev-timeline-details">
                {item.description.map((desc, i) => (
                  <p key={i} className="dev-timeline-detail-item">
                    {desc}
                  </p>
                ))}
              </div>
            </div>
            <div className="dev-timeline-point"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevelopmentTimeline; 