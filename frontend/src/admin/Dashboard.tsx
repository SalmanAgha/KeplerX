import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Users</h2>
          <p>Manage users and their roles.</p>
        </div>
        <div className="dashboard-card">
          <h2>Analytics</h2>
          <p>View site analytics and reports.</p>
        </div>
        <div className="dashboard-card">
          <h2>Settings</h2>
          <p>Configure application settings.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 