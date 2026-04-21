import styles from '../../styles/css/calendar/ScheduleDetail.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

function ScheduleDetail({ data = [] }) {
  const navigate = useNavigate();
  const [target, setTarget] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [list, setList] = useState(data);

  useEffect(() => {
    setList(data);
  }, [data]);

  // 시간 정렬
  const sorted = [...list].sort((a, b) => {
    const getTime = (item) =>
      item.startTime || item.openDate?.split(' ')[1] || '00:00';

    return getTime(a).localeCompare(getTime(b));
  });

  const handleDelete = async () => {
    if (!target) return;

    try {
      setShowConfirm(false);
      setShowLoading(true);

      const col = target.type === 'class' ? 'classes' : 'records';

      await deleteDoc(doc(db, col, target.id));

      setList((prev) => prev.filter((item) => item.id !== target.id));

      setShowLoading(false);
      setShowDone(true);
    } catch (e) {
      console.error(e);
      setShowLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      {sorted.length === 0 && <p className={styles.empty}>일정이 없습니다</p>}

      {sorted.map((item) => (
        <div key={item.id} className={styles.item}>
          <div className={styles.time}>
            {item.startTime || item.openDate?.split(' ')[1]} ~
            {item.endTime || item.openDate?.split(' ')[3]}
          </div>

          <div className={styles.title}>{item.title}</div>

          <div className={styles.type}>
            {item.type === 'class' ? '수업' : '개인 기록'}
          </div>

          <div className={styles.level}>{item.level}</div>

          <div className={styles.meta}>
            {item.type === 'class'
              ? `${item.currentCap || 0}명 / ${item.capacity || 0}명`
              : item.branchName}
          </div>

          <div className={styles.actions}>
            <button
              className={styles.detailBtn}
              onClick={() => {
                if (item.type === 'class') {
                  navigate(`/class/${item.id}`);
                } else {
                  navigate(`/record/${item.id}`);
                }
              }}
            >
              자세히보기
            </button>

            <button
              className={styles.deleteBtn}
              onClick={() => {
                setTarget(item);
                setShowConfirm(true);
              }}
            >
              삭제
            </button>
          </div>
        </div>
      ))}

      {showConfirm && (
        <Modal
          title="삭제 확인"
          message="정말 삭제하시겠습니까?"
          cancelText="취소"
          confirmText="삭제"
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleDelete}
        />
      )}

      {showLoading && (
        <Modal title="삭제 중" message="일정을 삭제하는 중입니다..." />
      )}

      {showDone && (
        <ConfirmModal
          message="삭제가 완료되었습니다."
          onConfirm={() => {
            setShowDone(false);
            setTarget(null);
          }}
        />
      )}
    </div>
  );
}

export default ScheduleDetail;
