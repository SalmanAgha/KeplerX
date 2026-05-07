import React, { useState } from 'react';
import {
  FaTachometerAlt,
  FaAngleRight,
  FaChartLine,
  FaCog,
  FaUsers,
  FaFileAlt,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

const navLinks = [
  { icon: FaTachometerAlt, text: 'Dashboard', external: '/dashboard' },
  { icon: FaChartLine, text: 'Analytics', children: [
    { text: 'Sales Reports', external: '/analytics/sales' },
    { text: 'User Analytics', external: '/analytics/users' },
    { text: 'Revenue Stats', external: '/analytics/revenue' }
  ]},
  { icon: FaCog, text: 'Settings', children: [
    { text: 'General', external: '/settings/general' },
    { text: 'Security', external: '/settings/security' },
    { text: 'Preferences', external: '/settings/preferences' }
  ]},
  { icon: FaUsers, text: 'Users', children: [
    { text: 'All Users', external: '/users/all' },
    { text: 'User Roles', external: '/users/roles' },
    { text: 'Permissions', external: '/users/permissions' }
  ]},
  { icon: FaFileAlt, text: 'Content', children: [
    { text: 'Pages', external: '/content/pages' },
    { text: 'Posts', external: '/content/posts' },
    { text: 'Media', external: '/content/media' }
  ]}
];

function Sidebar({ className = '' }) {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});

  const handleNavClick = (e, link) => {
    e.preventDefault();
    if (link.children) {
 setOpenMenus(prev => ({ ...prev, [link.text]: !prev[link.text] }));
    } else if (link.external) {
      navigate(link.external);
    }
  };

  return (
    <aside className={`${styles['greyd-sidebar']} ${className}`}>
      <div className={styles['greyd-sidebar-logo']}>
        <img src="https://greyd.io/wp-content/uploads/sites/3/2023/11/Greyd_Logo_black-300x59.png" alt="Greyd" style={{width:'140px',height:'auto'}} />
      </div>
      <nav className={styles['greyd-sidebar-nav']}>
        {navLinks.map((link, index) => (
          <div key={index}>
            <a href="#" onClick={e => handleNavClick(e, link)} className={styles.link}>
              <link.icon className={`${styles['nav-icon']}`} />
              <span>{link.text}</span>
              {link.children && (
                <FaAngleRight className={`${styles['nav-arrow']} ${openMenus[link.text] ? styles.open : ''}`} />
              )}
            </a>
            {link.children && openMenus[link.text] && (
              <div className={styles['greyd-sidebar-submenu']}>
                {link.children.map((child, childIndex) => (
                  <a key={childIndex} href="#" onClick={e => { e.preventDefault(); navigate(child.external); }} className={styles['greyd-sidebar-submenu-item']}>
                    <span>{child.text}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
