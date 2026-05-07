import React from 'react';
import styles from './NotificationPanel.module.css';
import NotificationItem from './NotificationItem';

function NotificationPanel({ items = [], onClear }) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span>Notifications</span>
        {items.length > 0 && (
          <button className={styles.clearBtn} onClick={onClear}>Clear All</button>
        )}
      </div>
      {items.length === 0 ? (
        <div className={styles.empty}>No notifications</div>
      ) : (
        items.map((n, idx) => (
          <NotificationItem
            key={n.id}
            text={n.text}
            time={n.time}
            className={idx % 2 === 1 ? styles.even : ''}
          />
        ))
      )}
    </div>
  );
}

export default NotificationPanel;
