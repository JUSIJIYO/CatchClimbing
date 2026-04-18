import styles from '../../styles/css/class/ClassDetailPage.module.css';
import ClassDetail from '../../components/class/ClassDetail';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import backbutton from '../../assets/icon/backButton.svg';

function ClassDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const docRef = doc(db, 'classes', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          console.log('해당 수업 없음');
          return;
        }

        const classData = docSnap.data();
        const userSnap = await getDoc(doc(db, 'users', classData.professorId));

        let professorName = classData.professorName;
        let profileImage = '';

        if (userSnap.exists()) {
          const userData = userSnap.data();
          professorName = userData.name;
          profileImage = userData.profileImg;
        }

        setClassData({
          id: docSnap.id,
          ...classData,
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
      {/* 헤더 */}
      <div className={styles['class-header']}>
        <span className={styles['class-back']} onClick={() => navigate(-1)}>
          <img src={backbutton} alt="뒤로가기" />
          수업 목록으로 돌아가기
        </span>

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
    </div>
  );
}

export default ClassDetailPage;
