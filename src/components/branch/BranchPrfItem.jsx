import React from 'react';
import styles from '../../styles/css/branch/BranchPrfItem.module.css';

function BranchPrfItem({ prf }) {
  return (
    <div className={styles.item}>
      <img src="/default-profile.png" alt="프로필" className={styles.profile} />

      <div className={styles.info}>
        <p className={styles.name}>{prf.name}</p>
        <p className={styles.level}>레벨: {prf.level}</p>
      </div>
    </div>
  );
}

export default BranchPrfItem;
