import React from 'react';
import { FaHeart } from 'react-icons/fa';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.footerText}>
          Built with <FaHeart className={styles.heartIcon} /> by <strong>Salman Agha</strong>
        </p>
        <p className={styles.footerSubtext}>
          Empowering Innovation Through Artificial Intelligence | Shaping Tomorrow, Today
        </p>
      </div>
    </footer>
  );
};

export default Footer;
