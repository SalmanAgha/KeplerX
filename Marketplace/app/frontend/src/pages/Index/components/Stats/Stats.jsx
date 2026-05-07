import React from 'react';
import styles from './Stats.module.css';
import { FaBriefcase, FaUserFriends, FaShieldAlt, FaHeadset } from 'react-icons/fa';

const stats = [
  {
    icon: FaBriefcase,
    value: '52+',
    label: 'Enterprise Deployments',
  },
  {
    icon: FaUserFriends,
    value: '10K+',
    label: 'Active Practitioners',
  },
  {
    icon: FaShieldAlt,
    value: '99.98%',
    label: 'Platform Reliability',
  },
  {
    icon: FaHeadset,
    value: '15m',
    label: 'Avg Support Response',
  },
];

const Stats = () => {
  return (
    <section className={styles.statsSection}>
      <div className={styles.statsContainer}>
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <article key={stat.label} className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={styles.statIconWrapper}>
                  <IconComponent className={styles.statIcon} aria-hidden="true" />
                </div>
              </div>
              <div className={styles.statBody}>
                <span className={styles.statValue}>{stat.value}</span>
                <h3 className={styles.statLabel}>{stat.label}</h3>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Stats;

