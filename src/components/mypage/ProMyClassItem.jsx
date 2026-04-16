import React from 'react';
import styles from '../../styles/css/mypage/ProMyClassItem.module.css';
import calendarIcon from '../../assets/icon/calender.svg';
import rightArrow from '../../assets/icon/rightarrow.svg';

function ProMyClassItem({ item }) {
  return (
    <div className={styles['card']}>
      <div className={styles['left']}>
        <img src={calendarIcon} alt="캘린더" className={styles['icon']} />

        <div className={styles['info']}>
          <p className={styles['title']}>{item['title']}</p>
          <p className={styles['meta']}>
            {item.date} · {item.time} · {item.level}
          </p>
        </div>
      </div>

      <img src={rightArrow} alt="이동" className={styles['arrow']} />
    </div>
  );
}

export default ProMyClassItem;
