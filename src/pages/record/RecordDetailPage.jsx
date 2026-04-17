import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import backButton from '../../assets/icon/backButton.svg';
import RecordDetail from '../../components/record/RecordDetail';
import styles from '../../styles/css/record/RecordDetailPage.module.css';
import { deleteDoc } from 'firebase/firestore';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';

function RecordDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const handleEdit = () => {
    navigate(`/record/edit/${id}`);
  };

  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const confirmDelete = async () => {
    try {
      setShowDeleteModal(false);
      setLoading(true);

      await deleteDoc(doc(db, 'records', id));

      setLoading(false);
      setShowSuccessModal(true);
    } catch (e) {
      setLoading(false);
      console.error(e);
      alert('삭제 실패');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'records', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setItem(docSnap.data());
        } else {
          console.log('데이터 없음');
        }
      } catch (e) {
        console.error('상세 불러오기 실패:', e);
      }
    };

    fetchData();
  }, [id]);

  if (!item) return <div>로딩중...</div>;

  return (
    <>
      <div className={styles.backWrapper}>
        <div className={styles.back} onClick={() => navigate('/record')}>
          <img src={backButton} alt="" />
          <span>목록으로</span>
        </div>
      </div>

      <div className={styles.wrapper}>
        <RecordDetail item={item} onDelete={handleDelete} onEdit={handleEdit} />
      </div>

      {showDeleteModal && (
        <Modal
          title="기록 삭제"
          message="정말 삭제하시겠습니까?"
          cancelText="취소"
          confirmText="확인"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {showSuccessModal && (
        <ConfirmModal
          message="기록이 삭제되었습니다."
          onConfirm={() => {
            setShowSuccessModal(false);
            navigate('/record');
          }}
        />
      )}

      {loading && <Modal title="처리중" message="잠시만 기다려주세요..." />}
    </>
  );
}

export default RecordDetailPage;
