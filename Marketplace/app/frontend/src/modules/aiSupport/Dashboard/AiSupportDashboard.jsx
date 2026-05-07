import React from 'react';
import './aiSupport.css';
import StatsMonitor from '../StatsMonitor/StatsMonitor';

function AiSupportDashboard(){
  return (
    <div className="ai-support-wrapper" style={{padding:'16px'}}>
      <h2>AI Support Dashboard</h2>
      <StatsMonitor />
    </div>
  );
}

export default AiSupportDashboard;
