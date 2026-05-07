import React from 'react';
import styles from './HeroBackground.module.css';

const HeroBackground = () => {
  return (
    <div className={styles.backgroundContainer}>
      {/* Gradient Round Flares */}
      <div className={styles.flare1}></div>
      <div className={styles.flare2}></div>
      
      {/* Smoke Effects */}
      <div className={styles.smoke1}></div>
      <div className={styles.smoke2}></div>
      <div className={styles.smoke3}></div>
      <div className={styles.smoke4}></div>
    </div>
  );
};

export default HeroBackground;