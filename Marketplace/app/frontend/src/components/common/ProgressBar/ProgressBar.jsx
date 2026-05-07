import React from 'react';
import './ProgressBar.css';

function ProgressBar({ value = 0 }) {
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  );
}
export default ProgressBar;
