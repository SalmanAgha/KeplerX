import React, { useEffect, useState } from 'react';
import './DesignProcessTimeline.css';

const DesignProcessTimeline: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const timelineData = [
    {
      title: "Discovery",
      icon: "https://cdn-icons-png.flaticon.com/512/4727/4727419.png",
      description: [
        "Research & Analysis",
        "User Interviews",
        "Market Research",
        "Requirements Gathering"
      ]
    },
    {
      title: "Concept Development",
      icon: "https://cdn-icons-png.flaticon.com/512/9967/9967577.png",
      description: [
        "Sketching & Ideation",
        "Wireframing",
        "User Flow Design",
        "Initial Concepts"
      ]
    },
    {
      title: "Design Execution",
      icon: "https://cdn-icons-png.flaticon.com/512/3159/3159310.png",
      description: [
        "Visual Design",
        "UI Components",
        "Design System",
        "Prototyping"
      ]
    },
    {
      title: "Delivery",
      icon: "https://cdn-icons-png.flaticon.com/512/9967/9967577.png",
      description: [
        "Design Handoff",
        "Documentation",
        "Implementation Support",
        "Design QA"
      ]
    }
  ];

  return (
    <div className="design-timeline-wrapper">
      <div className="design-timeline-header">
        <h2 className="design-timeline-title">Our Design Process</h2>
        <p className="design-timeline-subtitle">A systematic approach to creating exceptional designs</p>
      </div>

      <div className="design-timeline-container">
        {timelineData.map((item, index) => (
          <div 
            key={index} 
            className="design-timeline-step"
            style={{
              animationDelay: `${index * 0.2}s`
            }}
          >
            <div className="design-timeline-card">
              <div className="design-timeline-icon-wrapper">
                <img src={item.icon} alt={item.title} className="design-timeline-icon" />
              </div>
              <h3 className="design-timeline-step-title">{item.title}</h3>
              <div className="design-timeline-details">
                {item.description.map((desc, i) => (
                  <p key={i} className="design-timeline-detail-item">
                    {desc}
                  </p>
                ))}
              </div>
            </div>
            <div className="design-timeline-point"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesignProcessTimeline; 