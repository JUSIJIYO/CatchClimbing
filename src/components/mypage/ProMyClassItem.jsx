import React from 'react';
import styles from '../../styles/css/mypage/ProMyClassItem.module.css';
import calendarIcon from '../../assets/icon/calender.svg';
import rightArrow from '../../assets/icon/rightarrow.svg';

function ProMyClassItem({ item, onClick }) {
  const [day, time] = item.openDate.split(' ');

  return (
    <div className={styles['card']} onClick={() => onClick?.(item)}>
      <div className={styles['left']}>
        <img src={calendarIcon} alt="캘린더" className={styles['icon']} />

        <div className={styles['info']}>
          <p className={styles['title']}>{item?.title || '제목 없음'}</p>
          <p className={styles['meta']}>
            {item.professorName} · {item.branchName} · {item.date} ·{' '}
            {item.openDate} · {item.level} · ({item.currentCap} /{' '}
            {item.capacity})
          </p>
        </div>
      </div>

      <img src={rightArrow} alt="이동" className={styles['arrow']} />
    </div>
  );
}

export default ProMyClassItem;
