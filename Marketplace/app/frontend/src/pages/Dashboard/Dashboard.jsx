import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { FaUsers, FaUserShield, FaFileAlt, FaIndustry, FaBell, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import styles from './Dashboard.module.css';

const stats = {
  users: { total: 1247, growth: 12.5, icon: FaUsers },
  admins: { total: 23, growth: 8.3, icon: FaUserShield },
  rag: { total: 156, growth: 25.8, icon: FaFileAlt },
  customers: { total: 892, growth: 18.2, icon: FaUsers },
  models: { total: 67, growth: 15.4, icon: FaIndustry },
  notifications: { total: 234, growth: -5.2, icon: FaBell },
};

export default function Dashboard(){
  const navigate = useNavigate();
  useEffect(()=>{
    const token = localStorage.getItem('jwt');
    if(!token){ navigate('/login'); }
  },[navigate]);

  return (
    <div>
      <div className={styles.banner}>
        <div>
          <h2 className={styles.bannerTitle}>Dashboard Overview</h2>
          <p className={styles.bannerDesc}>Key metrics at a glance</p>
        </div>
        <div className={styles.bannerDate}>{new Date().toLocaleDateString()}</div>
      </div>

      <div className={styles.statsGrid}>
        {Object.entries(stats).map(([key, s]) => (
          <div key={key} className={styles.statCard}>
            <div className={styles.statIcon}><s.icon /></div>
            <div className={styles.statContent}>
              <h3>{s.total}</h3>
              <p>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
              <div className={styles.statTrend}>
                {s.growth >= 0 ? <FaArrowUp className={styles.trendUp} /> : <FaArrowDown className={styles.trendDown} />}
                <span>{Math.abs(s.growth)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
