import React from 'react';
import styles from '../../styles/css/mypage/ProMyClassItem.module.css';
import calendarIcon from '../../assets/icon/calender.svg';
import rightArrow from '../../assets/icon/rightarrow.svg';

function StuClassItem({ item, onClick, onCancel, showCancel = false }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';

    if (dateStr.includes('요일')) return dateStr;

    if (dateStr.includes('-')) {
      const [datePart, timePart] = dateStr.split(' ');
      const date = new Date(datePart);

      if (isNaN(date)) return dateStr;

      const days = ['일', '월', '화', '수', '목', '금', '토'];
      return `${days[date.getDay()]}요일 ${timePart || ''}`;
    }

    return dateStr;
  };

  return (
    <div className={styles['card']} onClick={() => onClick?.(item)}>
      <div className={styles['left']}>
        <img src={calendarIcon} alt="" className={styles['icon']} />

        <div className={styles['info']}>
          <p className={styles['title']}>{item?.title || '제목 없음'}</p>

          <p className={styles['meta']}>
            {item?.professorName} · {item?.branchName}
          </p>

          <p className={styles['meta']}>
            {formatDate(item?.openDate)} · {item?.level}
          </p>
        </div>
      </div>

      <div className={styles['buttonGroup']}>
        {showCancel && (
          <button
            className={styles['cancel-btn']}
            onClick={(e) => {
              e.stopPropagation();
              onCancel?.(item);
            }}
          >
            수강취소
          </button>
        )}

        <button
          className={styles['detail-btn']}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(item);
          }}
        >
          자세히 보기
        </button>
      </div>
    </div>
  );
}

export default StuClassItem;
