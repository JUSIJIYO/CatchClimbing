import RecordForm from '../../components/record/RecordForm';
import styles from '../../styles/css/record/RecordFormPage.module.css';
import headerStyles from '../../styles/css/common/PageHeader.module.css';
import backIcon from '../../assets/icon/backButton.svg';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';

function RecordFormPage() {
  const [showModal, setShowModal] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (data) => {
    setPendingData(data);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    try {
      await addDoc(collection(db, 'records'), {
        ...pendingData,
        uid: 'test_user_123',
        createdAt: serverTimestamp(),
      });

      setShowModal(false); // 확인 모달 닫기
      setShowDoneModal(true); // 완료 모달 열기
    } catch (e) {
      console.error(e);
      alert('저장 실패');
    }
  };

  return (
    <div>
      <div className={headerStyles.header}>
        <h1>기록 등록하기</h1>
        <p>클라이밍 기록을 추가해보세요</p>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.topBar}>
          <button
            className={styles.backBtn}
            onClick={() => navigate('/record')}
          >
            <img src={backIcon} alt="뒤로가기" />
            기록 목록으로 돌아가기
          </button>
        </div>

        <div className={styles.container}>
          <RecordForm onSubmit={handleSubmit} />
        </div>
      </div>

      {showModal && (
        <Modal
          title="등록확인"
          message="정말 등록하시겠습니까?"
          cancelText="취소"
          confirmText="확인"
          onCancel={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          message="기록이 성공적으로 등록되었습니다."
          onConfirm={() => {
            setShowConfirmModal(false);
            navigate('/record');
          }}
        />
      )}
    </div>
  );
}

export default RecordFormPage;
