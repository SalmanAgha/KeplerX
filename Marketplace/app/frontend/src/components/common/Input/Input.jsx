import React from 'react';
import styles from './Input.module.css';

function Input({ icon: Icon, error, className = '', ...rest }) {
  return (
    <div className={`${styles.wrapper} ${error ? styles.error : ''} ${className}`.trim()}>
      {Icon && (
        <span className={styles.icon}>
          <Icon />
        </span>
      )}
      <input className={styles.input} {...rest} />
    </div>
  );
}

export default Input;
