import React from 'react';
import styles from '../../styles/css/branch/BranchPrfItem.module.css';
import { useNavigate } from 'react-router-dom';

function BranchPrfItem({ prf, onClick }) {
  const navigate = useNavigate();

  return (
    <div className={styles['item']} onClick={onClick}>
      <img src="/default-profile.png" alt="프로필" className={styles.profile} />

      <div className={styles['info']}>
        <p className={styles['name']}>{prf.name}</p>
        <p className={styles['level']}>레벨: {prf.level}</p>
      </div>
    </div>
  );
}

export default BranchPrfItem;
