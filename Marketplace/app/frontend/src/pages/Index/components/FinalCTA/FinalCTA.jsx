import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLightbulb, FaArrowRight } from 'react-icons/fa';
import styles from './FinalCTA.module.css';

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaContent}>
        <div className={styles.ctaBadge}>
          <FaLightbulb />
          <span>Ready to Transform?</span>
        </div>
        <h2 className={styles.ctaTitle}>
          Join the AI Revolution Today
        </h2>
        <p className={styles.ctaDescription}>
          Don't let your competitors get ahead. Start your AI journey now and unlock unlimited potential.
        </p>
        <button className={styles.ctaButton} onClick={() => navigate('/login')}>
          Get Started Free
          <FaArrowRight className={styles.ctaButtonIcon} />
        </button>
      </div>
    </section>
  );
};

export default FinalCTA;

