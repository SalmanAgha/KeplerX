import React from 'react';
import styles from './Container.module.css';

function Container({ children, fluid=false, className='' }){
  return (
    <div className={`${styles.container} ${fluid?styles.fluid:''} ${className}`.trim()}>
      {children}
    </div>
  );
}
export default Container;
