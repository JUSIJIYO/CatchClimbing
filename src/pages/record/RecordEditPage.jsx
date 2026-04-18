import RecordForm from '../../components/record/RecordForm';
import styles from '../../styles/css/record/RecordFormPage.module.css';
import headerStyles from '../../styles/css/common/PageHeader.module.css';
import backIcon from '../../assets/icon/backButton.svg';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function RecordEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, 'records', id));
      if (snap.exists()) setData(snap.data());
    };
    fetch();
  }, [id]);

  const handleSubmit = (formData) => {
    setData(formData);
    setShowModal(true);
  };

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setShowModal(false);
      setLoading(true);
      let imageUrl = data.image;

      const file =
        Array.isArray(data.image) && data.image.length > 0
          ? data.image[0]
          : null;

      if (file instanceof File) {
        imageUrl = await uploadImage(file);
      }

      const { image, ...rest } = data;

      await updateDoc(doc(db, 'records', id), {
        ...rest,
        image: imageUrl,
      });

      setLoading(false);
      setShowSuccessModal(true);
    } catch (e) {
      setLoading(false);
      console.error(e);
      alert('수정 실패');
    }
  };

  const uploadImage = async (file) => {
    const safeName = encodeURIComponent(file.name);
    const fileName = `${Date.now()}_${safeName}`;
    const storageRef = ref(storage, `records/${fileName}`);

    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  if (!data) return <div>로딩중...</div>;

  return (
    <div>
      <div className={headerStyles.header}>
        <h1>기록 수정하기</h1>
        <p>클라이밍 기록을 수정해보세요</p>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.topBar}>
          <button
            className={styles.backBtn}
            onClick={() => navigate('/record')}
          >
            <img src={backIcon} alt="" />
            기록 목록으로 돌아가기
          </button>
        </div>

        <div className={styles.container}>
          <RecordForm onSubmit={handleSubmit} initialData={data} />
        </div>
      </div>

      {showModal && (
        <Modal
          title="수정 확인"
          message="정말 수정하시겠습니까?"
          cancelText="취소"
          confirmText="확인"
          onCancel={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}

      {showSuccessModal && (
        <ConfirmModal
          message="기록이 수정되었습니다."
          confirmText="확인"
          onConfirm={() => {
            setShowSuccessModal(false);
            navigate(`/record/${id}`);
          }}
        />
      )}

      {loading && <Modal title="처리중" message="수정 중입니다..." />}
    </div>
  );
}

export default RecordEditPage;
