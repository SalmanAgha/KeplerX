import React from 'react';
import styles from './Grid.module.css';

function Grid({ children, cols = 1, md = 2, lg = 3, gap = '24px', className = '' }) {
  const style = { '--cols': cols, '--cols-md': md, '--cols-lg': lg, '--gap': gap };
  return (
    <div className={`${styles.grid} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
export default Grid;
