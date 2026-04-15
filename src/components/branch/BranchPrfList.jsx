import React from 'react';
import BranchPrfItem from './BranchPrfItem';
import styles from '../../styles/css/branch/BranchPrfList.module.css';

function BranchPrfList({ prfList, onSelect }) {
  return (
    <div className={styles.card}>
      <div className={styles['list']}>
        {prfList.map((prf, index) => (
          <BranchPrfItem
            key={prf.id}
            prf={prf}
            onClick={() => onSelect(prf, index)}
          />
        ))}
      </div>
    </div>
  );
}

export default BranchPrfList;
