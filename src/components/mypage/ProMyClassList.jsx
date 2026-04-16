import React from 'react';
import ProMyClassItem from './ProMyClassItem';
import styles from '../../styles/css/mypage/ProMyClassList.module.css';

function ProMyClassList() {
  const classList = [
    {
      id: 1,
      title: '클라이밍 입문반',
      date: '2026-04-20',
      time: '18:00',
      level: 'V2',
    },
    {
      id: 2,
      title: '중급자 테크닉',
      date: '2026-04-22',
      time: '20:00',
      level: 'V4',
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h3 className={styles.title}>등록된 수업</h3>

        <div className={styles.list}>
          {classList.map((item) => (
            <ProMyClassItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProMyClassList;
