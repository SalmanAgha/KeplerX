import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import TopBar from '../TopBar';
import './AppShell.css';

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(o => !o);

  const rootClass = `greyd-dashboard-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`;
  return (
    <div className={rootClass}>
      <Sidebar className={sidebarOpen ? '' : 'closed'} />
      <div className="app-shell-content">
        <TopBar onMenuClick={toggleSidebar} />
        <main className="app-shell-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppShell;
