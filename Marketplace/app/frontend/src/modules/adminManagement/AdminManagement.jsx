import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import TabNav from './TabNav';

function AdminManagement() {
  return (
    <div className="admin-mgmt-wrapper">
      <h2>Admin Management</h2>
      <TabNav />
      <Outlet />
    </div>
  );
}

export default AdminManagement;
