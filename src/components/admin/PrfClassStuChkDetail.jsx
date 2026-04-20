import React from 'react';
import calenIcon from '../../assets/icon/calendarIcon.svg';
import styles from '../../styles/css/calendar/ScheduleDetail.module.css';

function ScheduleDetail({ selectedDate, scheduleList = [], onDelete }) {
  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.left}>
          <span className={styles.icon}>📅</span>
          <h3>{selectedDate} 일정</h3>
        </div>

        <button className={styles.detailBtn}>자세히보기</button>
      </div>

      <div className={styles.list}>
        {scheduleList.length === 0 && (
          <p className={styles.empty}>일정이 없습니다</p>
        )}

        {scheduleList.map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.time}>{item.startTime || '시간없음'}</div>

            <div className={styles.info}>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.type}>
                {item.type === 'record' ? '개인 기록' : '수업'}
              </p>
            </div>

            <button
              className={styles.deleteBtn}
              onClick={() => onDelete && onDelete(item)}
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScheduleDetail;
