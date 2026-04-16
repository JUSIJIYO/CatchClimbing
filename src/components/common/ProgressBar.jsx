import React from 'react';
import styles from '../../styles/css/common/ProgressBar.module.css';

function ProgressBar({ percent = 0 }) {
  return (
    <div className={styles['wrapper']}>
      <div className={styles['bar']} style={{ width: `${percent}%` }} />
    </div>
  );
}

export default ProgressBar;
