import React, { useState } from 'react';
import calendarIcon from '../../assets/icon/calendarIcon.svg';
import styles from '../../styles/css/calendar/ScheduleList.module.css';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';

function ScheduleList({ selectedDate, scheduleList = [], onDelete }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [target, setTarget] = useState(null);

  const handleDelete = async () => {
    if (!target) return;

    try {
      if (target.type === 'record') {
        await deleteDoc(doc(db, 'records', target.id));
      } else if (target.type === 'class') {
        await deleteDoc(doc(db, 'classes', target.id));
      }

      setShowConfirmModal(false);
      setShowSuccess(true);

      onDelete && onDelete(target.id, target.type);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.detailContainer}>
      <div className={styles.header}>
        <div className={styles.left}>
          <img src={calendarIcon} alt="calendar" className={styles.icon} />
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
              onClick={() => {
                setTarget(item);
                setShowConfirmModal(true);
              }}
            >
              삭제
            </button>
          </div>
        ))}
      </div>

      {showConfirmModal && (
        <Modal
          title="삭제 확인"
          message="정말 삭제하시겠습니까?"
          cancelText="취소"
          confirmText="삭제"
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={handleDelete}
          onClose={() => setShowConfirmModal(false)}
        />
      )}

      {showSuccess && (
        <ConfirmModal
          message="삭제되었습니다."
          onConfirm={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}

export default ScheduleList;
