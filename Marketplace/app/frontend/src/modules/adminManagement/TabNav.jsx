import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './TabNav.module.css';

const tabs = [
  { path: 'create', label: 'Create Admin' },
  { path: 'profile', label: 'Profile' },
  { path: 'roles', label: 'Roles & Rights' },
  { path: 'list', label: 'Admin Table' },
];

function TabNav() {
  return (
    <div className={styles.navWrapper}>
      {tabs.map((t) => (
        <NavLink
          key={t.path}
          to={t.path}
          className={({ isActive }) =>
            isActive ? `${styles.tab} ${styles.active}` : styles.tab
          }
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  );
}

export default TabNav;
