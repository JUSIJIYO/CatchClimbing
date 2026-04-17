import RecordForm from '../../components/record/RecordForm';
import styles from '../../styles/css/record/RecordFormPage.module.css';
import headerStyles from '../../styles/css/common/PageHeader.module.css';
import backIcon from '../../assets/icon/backButton.svg';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import CheckModal from '../../components/common/ChkModal';
import { storage } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function RecordFormPage() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (data) => {
    // 필수값 체크
    if (
      !data.title ||
      !data.branchId ||
      !data.visitDate ||
      !data.level ||
      !data.tryCount ||
      !data.description ||
      !data.memo ||
      !data.image
    ) {
      setShowErrorModal(true);
      return;
    }

    // 정상일 때만
    setPendingData(data);
    setShowModal(true);
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleConfirm = async () => {
    try {
      setShowModal(false);
      setLoading(true);

      const files = Array.isArray(pendingData.image) ? pendingData.image : [];

      const imageUrls = [];

      for (const file of files) {
        const url = await uploadImage(file);
        imageUrls.push(url);
      }

      const { image, ...rest } = pendingData;

      await addDoc(collection(db, 'records'), {
        ...rest,
        image: imageUrls,
        uid: user?.uid,
        createdAt: serverTimestamp(),
      });

      setLoading(false);
      setShowConfirmModal(true);
    } catch (e) {
      setLoading(false);
      console.error(e);
      alert('저장 실패');
    }
  };

  const uploadImage = async (file) => {
    if (!file) {
      console.error('파일 없음');
      return null;
    }

    console.log('파일 확인:', file); // 디버깅

    const safeName = file.name ? encodeURIComponent(file.name) : 'image.jpg';

    const fileName = `${Date.now()}_${safeName}`;
    const storageRef = ref(storage, `records/${fileName}`);

    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  if (!user) return <div>로딩중...</div>;

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

      {showErrorModal && (
        <CheckModal
          title="등록 오류"
          message="내용을 모두 입력해주세요"
          onConfirm={() => setShowErrorModal(false)}
        />
      )}
      {loading && (
        <Modal title="처리중" message="기록을 저장하는 중입니다..." />
      )}
    </div>
  );
}

export default RecordFormPage;
