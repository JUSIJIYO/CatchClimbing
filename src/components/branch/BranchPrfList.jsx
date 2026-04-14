import React from 'react';
import BranchPrfItem from './BranchPrfItem';
import styles from '../../styles/css/branch/BranchPrfList.module.css';

function BranchPrfList() {
  const prfList = [
    { id: 1, name: '김준호 팀장', level: 'V8' },
    { id: 2, name: '이서연 세터', level: 'V7' },
    { id: 3, name: '김민수 강사', level: 'V6' },
    { id: 4, name: '정지운 강사 & 세터', level: 'V8' },
    { id: 5, name: '이주운 강사', level: 'V7' },
    { id: 6, name: '곽시운 강사', level: 'V7' },
  ];

  return (
    <div className={styles.card}>
      <div className={styles['list']}>
        {prfList.map((prf) => (
          <BranchPrfItem key={prf.id} prf={prf} />
        ))}
      </div>
    </div>
  );
}

export default BranchPrfList;
