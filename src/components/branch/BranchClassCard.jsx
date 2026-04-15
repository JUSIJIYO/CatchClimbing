import React from 'react';
import BranchClassItem from './BranchClassItem';
import styles from '../../styles/css/branch/BranchClassCard.module.css';

function BranchClassCard({ onOpenModal }) {
  const classList = [
    {
      id: 1,
      profile: '/default.jpg',
      name: '김준호',
      level: 'V3~V5',
      title: '중급 볼더링 클래스',
      date: '2026년 4월 8일',
      time: '18:00 - 19:30',
      people: '8/12',
    },
    {
      id: 2,
      profile: '/default.jpg',
      name: '김준호',
      level: 'V3~V5',
      title: '중급 볼더링 클래스',
      date: '2026년 4월 8일',
      time: '18:00 - 19:30',
      people: '8/12',
    },
    {
      id: 3,
      profile: '/default.jpg',
      name: '김준호',
      level: 'V3~V5',
      title: '중급 볼더링 클래스',
      date: '2026년 4월 8일',
      time: '18:00 - 19:30',
      people: '8/12',
    },
    {
      id: 4,
      profile: '/default.jpg',
      name: '김준호',
      level: 'V3~V5',
      title: '중급 볼더링 클래스',
      date: '2026년 4월 8일',
      time: '18:00 - 19:30',
      people: '8/12',
    },
  ];

  return (
    <div className={styles['branch-wrapper']}>
      <h2 className={styles['branch-title']}>수업</h2>
      <p className={styles['branch-sub']}>다음 클라이밍 수업을 예약하세요</p>

      <div className={styles['branch-gridWrap']}>
        <div className={styles['branch-grid']}>
          {classList.map((item) => (
            <BranchClassItem
              key={item.id}
              item={item}
              onOpenModal={onOpenModal}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BranchClassCard;
