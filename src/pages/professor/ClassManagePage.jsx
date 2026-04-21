import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import headerStyles from '../../styles/css/common/PageHeader.module.css';
import PrfClassCard from '../../components/professor/PrfClassCard';
import styles from '../../styles/css/professor/ClassManagePage.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import backButton from '../../assets/icon/backButton.svg';

function ClassManagePage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 관리자가 선택한 강사의 Id를 받아올 수 있게 설정
  const adminGetProfessorId = searchParams.get('professorId');

  const [isProfessor, setIsProfessor] = useState(false);

  useEffect(() => {
    if (adminGetProfessorId) {
      return;
    }
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      const snap = await getDoc(doc(db, 'users', user.uid));

      if (snap.exists()) {
        const data = snap.data();

        if (data.role === 'professor') {
          setIsProfessor(true);
        }
      }
    });

    return () => unsubscribe();
  }, [adminGetProfessorId]);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const targetId = adminGetProfessorId || user?.uid;
      if (!targetId) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'classes'),
          where('professorId', '==', targetId)
        );

        const snapshot = await getDocs(q);

        const result = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const classData = docSnap.data();
            const classId = docSnap.id;

            const userSnap = await getDoc(
              doc(db, 'users', classData.professorId)
            );

            let professorName = classData.professorName;
            let profileImage = '';

            if (userSnap.exists()) {
              const userData = userSnap.data();
              professorName = userData.name;
              profileImage = userData.profileImg;
            }

            const studentQuery = query(
              collection(db, 'classStudents'),
              where('classId', '==', classId)
            );

            const studentSnap = await getDocs(studentQuery);

            return {
              id: classId,
              ...classData,
              professorName,
              profileImage,
              studentCount: studentSnap.size,
            };
          })
        );

        setClasses(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [adminGetProfessorId]);

  if (loading) return <p>불러오는 중...</p>;

  return (
    <>
      <div className={headerStyles.header}>
        <h1>내 강의</h1>
        <p>등록한 수업을 확인하고, 새 수업을 등록해보세요</p>
      </div>

      <div className={styles.container}>
        <div className={styles.backBtn} onClick={() => navigate('/class')}>
          <img src={backButton} alt="뒤로가기" />
          <span>전체 강의로 돌아가기</span>
        </div>
        <div className={styles.cardWrapper}>
          {classes.map((c) => (
            <div className={styles.cardItem} key={c.id}>
              <PrfClassCard
                classes={[c]}
                isProfessor={isProfessor}
                onEditClick={(id, card) =>
                  navigate(`/professor/edit/${id}`, {
                    state: { editData: card },
                  })
                }
              />
            </div>
          ))}
        </div>

        <div className={styles.bottomBar}>
          <button
            className={styles.addBtn}
            onClick={() => navigate('/professor/new-class')}
          >
            강의 등록
          </button>
        </div>
      </div>
    </>
  );
}

export default ClassManagePage;
