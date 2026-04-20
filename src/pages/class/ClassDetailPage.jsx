import styles from '../../styles/css/class/ClassDetailPage.module.css';
import ClassDetail from '../../components/class/ClassDetail';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import backbutton from '../../assets/icon/backButton.svg';
import { getAuth } from 'firebase/auth';
import deleteIcon from '../../assets/icon/delete.svg';
import editIcon from '../../assets/icon/edit.svg';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';

function ClassDetailPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showDoneModal, setShowDoneModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMyClass, setIsMyClass] = useState(false);

  const handleDelete = async () => {
    try {
      setShowLoadingModal(true);

      await deleteDoc(doc(db, 'classes', id));

      setShowLoadingModal(false);
      setShowDoneModal(true);
    } catch (e) {
      console.error(e);
      alert('삭제 실패');
    }
  };
  useEffect(() => {
    const fetchClass = async () => {
      try {
        const docRef = doc(db, 'classes', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          // console.log('해당 수업 없음');
          return;
        }

        const data = docSnap.data();

        const auth = getAuth();
        const user = auth.currentUser;

        if (user && user.uid === data.professorId) {
          setIsMyClass(true);
        }

        const userSnap = await getDoc(doc(db, 'users', data.professorId));

        let professorName = data.professorName;
        let profileImage = '';

        if (userSnap.exists()) {
          const userData = userSnap.data();
          professorName = userData.name;
          profileImage = userData.profileImg;
        }

        setClassData({
          id: docSnap.id,
          ...data,
          professorName,
          imageUrl: profileImage,
        });
      } catch (e) {
        console.error('수업 상세 불러오기 실패:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [id]);

  if (loading) return <div>로딩중...</div>;

  if (!classData) return <div>수업을 찾을 수 없습니다.</div>;

  return (
    <div className={styles['class-container']}>
      <div className={styles['class-header']}>
        <span className={styles['class-back']} onClick={() => navigate(-1)}>
          <img src={backbutton} alt="뒤로가기" />
          수업 목록으로 돌아가기
        </span>
        {isMyClass && (
          <div className={styles['action-buttons']}>
            <button
              className={styles['editBtn']}
              onClick={() =>
                navigate(`/professor/edit/${id}`, {
                  state: { editData: classData },
                })
              }
            >
              <img src={editIcon} />
              수정
            </button>

            <button
              className={styles['deleteBtn']}
              onClick={() => setShowDeleteModal(true)}
            >
              <img src={deleteIcon} />
              삭제
            </button>
          </div>
        )}

        <h1 className={styles['class-title']}>수업 상세 정보</h1>
      </div>

      <div className={styles['class-list']}>
        <ClassDetail
          title={classData.title}
          professorName={classData.professorName}
          branchName={classData.branchName}
          createdAt={classData.openDate}
          level={classData.level}
          currentCap={classData.currentCap}
          capacity={classData.capacity}
          money={Number(classData.classMoney).toLocaleString()}
          description={classData.description}
          imageUrl={classData.imageUrl}
        />
      </div>

      {/* 삭제 확인 */}
      {showDeleteModal && (
        <Modal
          title="수업 삭제"
          message="정말 삭제하시겠습니까?"
          cancelText="취소"
          confirmText="삭제"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            setShowDeleteModal(false);
            handleDelete();
          }}
        />
      )}

      {showLoadingModal && (
        <Modal title="삭제 중" message="수업을 삭제하는 중입니다..." />
      )}

      {showDoneModal && (
        <ConfirmModal
          message="삭제가 완료되었습니다."
          onConfirm={() => {
            setShowDoneModal(false);
            navigate('/professor/manage');
          }}
        />
      )}
    </div>
  );
}

export default ClassDetailPage;
