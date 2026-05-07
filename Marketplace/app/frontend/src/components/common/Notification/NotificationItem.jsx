import React from 'react';
import styles from './NotificationItem.module.css';

function NotificationItem({ text, time, className='' }) {
  return (
    <div className={`${styles.notifItem} ${className}`.trim()}>
      <span>{text}</span>
      <span className={styles.time}>{time}</span>
    </div>
  );
}

export default NotificationItem;
