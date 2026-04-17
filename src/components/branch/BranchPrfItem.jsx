import React from 'react';
import styles from '../../styles/css/branch/BranchPrfItem.module.css';

function BranchPrfItem({ prf, onClick }) {
  return (
    <div className={styles['item']} onClick={onClick}>
      <img
        src={prf.profile || '/default-profile.png'}
        alt="프로필"
        className={styles.profile}
        onError={(e) => {
          e.target.src = '/default-profile.png';
        }}
      />
      <div className={styles['info']}>
        <p className={styles['name']}>{prf.name}</p>
        <p className={styles['level']}>레벨: {prf.level}</p>
      </div>
    </div>
  );
}

export default BranchPrfItem;
