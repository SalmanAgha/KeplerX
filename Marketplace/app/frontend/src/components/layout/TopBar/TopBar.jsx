import React, { useState } from 'react';
import { FaBars, FaSearch, FaChevronDown } from 'react-icons/fa';
import styles from './TopBar.module.css';
import { useEffect } from 'react';
import api from '../../../utils/api';
import NotificationBell from '../../common/Notification/NotificationBell';
import { useNavigate } from 'react-router-dom';
import { logout as logoutApi } from '../../../utils/api';

function TopBar({ onMenuClick }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications,setNotifications]=useState([]);
  const [notifOpen,setNotifOpen]=useState(false);
  useEffect(()=>{api.getNotifications().then(setNotifications);},[]);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (_) {/* ignore network issues */}
    localStorage.removeItem('jwt');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.left} onClick={onMenuClick} role="button" tabIndex={0}>
        <FaBars className={styles.menuIcon} />
      </div>
      {/* search removed */}
      <div className={styles.right}>
        <NotificationBell />
        <div className={styles.user} onClick={() => setDropdownOpen(o => !o)}>
          <img className={styles.userImg} src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&auto=format&fit=crop" alt="User" />
          <span>{localStorage.getItem('userName') || 'User'}</span>
          <FaChevronDown />
          {dropdownOpen && (
            <div className={styles.dropdown}>
              <a href="#profile" className={styles.dropdownLink}>Profile</a>
              <button type="button" onClick={handleLogout} className={styles.dropdownLink} style={{border:'none',background:'none',padding:0,cursor:'pointer'}}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
