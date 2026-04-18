import React from 'react';
import styles from '../../styles/css/mypage/ProMyClassItem.module.css';
import calendarIcon from '../../assets/icon/calender.svg';
import rightArrow from '../../assets/icon/rightarrow.svg';

function ProMyClassItem({ item, onClick }) {
  return (
    <div className={styles['card']} onClick={() => onClick?.(item)}>
      <div className={styles['left']}>
        <img src={calendarIcon} alt="캘린더" className={styles['icon']} />

        <div className={styles['info']}>
          <p className={styles['title']}>{item?.title || '제목 없음'}</p>
          <p className={styles['meta']}>
            {item?.date || '날짜 없음'} · {item?.time || '시간 없음'} ·{' '}
            {item?.level || '레벨 없음'}
          </p>
        </div>
      </div>

      <img src={rightArrow} alt="이동" className={styles['arrow']} />
    </div>
  );
}

export default ProMyClassItem;
