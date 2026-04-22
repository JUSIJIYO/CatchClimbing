import PrfClassStuItem from './PrfClassStuItem';
import styles from '../../styles/css/professor/PrfClassStuList.module.css';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useState } from 'react';

function PrfClassStuList({ students, onUpdateStatus }) {
  const [selectedStu, setSelectedStu] = useState(null);
  const [actionType, setActionType] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const [showDone, setShowDone] = useState(false);
  const [showRejectDone, setShowRejectDone] = useState(false);
  const [showCancelDone, setShowCancelDone] = useState(false);
  const [showRejectCancelDone, setShowRejectCancelDone] = useState(false);

  const handleAction = (type, stu) => {
    setSelectedStu(stu);
    setActionType(type);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedStu) return;

    setShowModal(false);
    setShowLoading(true);

    let newStatus = 'pending';

    if (actionType === 'approve') newStatus = 'approved';
    if (actionType === 'reject') newStatus = 'rejected';
    if (actionType === 'cancel') newStatus = 'pending';
    if (actionType === 'rejectCancel') newStatus = 'pending';

    await onUpdateStatus(selectedStu.id, newStatus);

    setShowLoading(false);

    if (actionType === 'approve') setShowDone(true);
    if (actionType === 'reject') setShowRejectDone(true);
    if (actionType === 'cancel') setShowCancelDone(true);
    if (actionType === 'rejectCancel') setShowRejectCancelDone(true);
  };

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No.</th>
            <th>이름</th>
            <th>레벨</th>
            <th>전화번호</th>
            <th>이메일</th>
            <th>승인 상태</th>
            <th>승인 관리</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="7">수강생이 없습니다.</td>
            </tr>
          ) : (
            students.map((stu, idx) => (
              <PrfClassStuItem
                key={stu.id || idx}
                stu={stu}
                index={idx}
                onUpdateStatus={handleAction}
              />
            ))
          )}
        </tbody>
      </table>

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

      {showLoading && <Modal title="처리 중" message="승인 처리 중입니다..." />}

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
    </>
  );
}

export default PrfClassStuList;
