import { useState } from 'react';
import styles from '../../styles/css/professor/PrfClassStuItem.module.css';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import CheckModal from '../../components/common/ChkModal';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/config';

function PrfClassStuItem({ stu, index, onUpdateStatus }) {
  const [showModal, setShowModal] = useState(false); // 확인 모달
  const [showLoading, setShowLoading] = useState(false); // 로딩
  const [showDone, setShowDone] = useState(false); // 승인 완료
  const [showRejectDone, setShowRejectDone] = useState(false); // 거절 완료
  const [showCancelDone, setShowCancelDone] = useState(false);
  const [actionType, setActionType] = useState(null);
  const status = stu.status;
  const [showRejectCancelDone, setShowRejectCancelDone] = useState(false);

  const getLevelStyle = (level) => {
    if (!level) return {};

    if (level === 'VB') {
      return {
        bg: '#ffffff',
        color: '#2c3e50',
        border: '1px solid #ddd',
      };
    }

    if (level === 'V0') return { bg: '#ffd43b', color: '#7a5c00' };
    if (level === 'V1') return { bg: '#ff922b', color: '#7c2d00' };
    if (level === 'V2') return { bg: '#51cf66', color: '#1b5e20' };
    if (level === 'V3') return { bg: '#339af0', color: '#0b3d91' };
    if (level === 'V4') return { bg: '#ff6b6b', color: '#7f1d1d' };
    if (level === 'V5') return { bg: '#f783ac', color: '#9d174d' };
    if (level === 'V6') return { bg: '#b197fc', color: '#4b2e83' };
    if (level === 'V7') return { bg: '#adb5bd', color: '#343a40' };
    if (level === 'V8') return { bg: '#c68642', color: '#5c3d2e' };

    return {
      bg: '#212529',
      color: '#ffffff',
    };
  };

  const style = getLevelStyle(stu.level);

  const handleConfirm = async () => {
    setShowModal(false);

    if (actionType === 'approve') {
      setShowLoading(true);

      await onUpdateStatus(stu.id, 'approved');

      await addDoc(collection(db, 'classStudents'), {
        userId: stu.userId || stu.id,
        classId: stu.classId || '',
        name: stu.name,
        level: stu.level,
        phone: stu.phone,
        email: stu.email,
      });

      setShowLoading(false);
      setShowDone(true);
    }

    if (actionType === 'reject') {
      await onUpdateStatus(stu.id, 'rejected');
      setShowRejectDone(true);
    }

    if (actionType === 'cancel') {
      await onUpdateStatus(stu.id, 'pending');
      setShowCancelDone(true);
    }

    if (actionType === 'rejectCancel') {
      await onUpdateStatus(stu.id, 'pending');
      setShowRejectCancelDone(true);
    }
  };

  return (
    <>
      <tr>
        <td>{index + 1}</td>
        <td>{stu.name}</td>

        {/* 레벨 */}
        <td>
          <span
            style={{
              background: style.bg,
              color: style.color,
              border: style.border || 'none',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '12px',
              display: 'inline-block',
            }}
          >
            {stu.level}
          </span>
        </td>

        <td>{stu.phone}</td>
        <td>{stu.email}</td>

        {/* 상태 */}
        <td>
          {status === 'approved' && (
            <span className={styles.approved}>승인됨</span>
          )}
          {status === 'pending' && (
            <span className={styles.pending}>대기중</span>
          )}
          {status === 'rejected' && (
            <span className={styles.reject}>거절됨</span>
          )}
        </td>

        {/* 관리 */}
        <td>
          <div className={styles.actions}>
            {status === 'pending' && (
              <>
                <button
                  className={styles.approve}
                  onClick={() => {
                    setActionType('approve');
                    setShowModal(true);
                  }}
                >
                  승인
                </button>

                <button
                  className={styles.reject}
                  onClick={() => {
                    setActionType('reject');
                    setShowModal(true);
                  }}
                >
                  거절
                </button>
              </>
            )}
            {status === 'approved' && (
              <button
                className={styles.cancel}
                onClick={() => {
                  setActionType('cancel');
                  setShowModal(true);
                }}
              >
                승인 취소
              </button>
            )}
            {status === 'rejected' && (
              <button
                className={styles.cancel}
                onClick={() => {
                  setActionType('rejectCancel');
                  setShowModal(true);
                }}
              >
                거절 취소
              </button>
            )}
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan="7">
          {showModal && (
            <Modal
              title={
                actionType === 'approve'
                  ? '승인 확인'
                  : actionType === 'reject'
                  ? '거절 확인'
                  : actionType === 'cancel'
                  ? '승인 취소'
                  : '거절 취소'
              }
              message={
                actionType === 'approve'
                  ? '정말 승인하시겠습니까?'
                  : actionType === 'reject'
                  ? '정말 거절하시겠습니까?'
                  : actionType === 'cancel'
                  ? '승인을 취소하시겠습니까?'
                  : '거절을 취소하시겠습니까?'
              }
              cancelText="취소"
              confirmText="확인"
              onCancel={() => setShowModal(false)}
              onConfirm={handleConfirm}
            />
          )}

          {showLoading && (
            <Modal title="처리 중" message="승인 처리 중입니다..." />
          )}

          {showDone && (
            <ConfirmModal
              message="승인이 완료되었습니다."
              onConfirm={() => setShowDone(false)}
            />
          )}

          {showRejectDone && (
            <ConfirmModal
              message="거절되었습니다."
              onConfirm={() => setShowRejectDone(false)}
            />
          )}

          {showCancelDone && (
            <ConfirmModal
              message="승인이 취소되었습니다."
              onConfirm={() => setShowCancelDone(false)}
            />
          )}

          {showRejectCancelDone && (
            <ConfirmModal
              message="거절이 취소되었습니다."
              onConfirm={() => setShowRejectCancelDone(false)}
            />
          )}
        </td>
      </tr>
    </>
  );
}

export default PrfClassStuItem;
