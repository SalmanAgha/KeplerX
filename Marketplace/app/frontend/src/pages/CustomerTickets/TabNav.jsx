import React from 'react';
import { NavLink } from 'react-router-dom';
import './TabNav.css';

const tabs = [
  { text: 'Analytics', link: '/tickets/analytics' },
  { text: 'All Tickets', link: '/tickets/all' },
];

function TabNav() {
  return (
    <div className="tab-nav">
      {tabs.map(t => (
        <NavLink
          key={t.link}
          to={t.link}
          className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}
        >
          {t.text}
        </NavLink>
      ))}
    </div>
  );
}
export default TabNav;
