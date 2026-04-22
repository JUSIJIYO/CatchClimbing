import React, { useEffect, useState } from 'react';
import styles from '../../styles/css/mypage/StuCompleteList.module.css';
import { useNavigate } from 'react-router-dom';
import StuClassItem from './StuClassItem';
import { getAuth } from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../firebase/config';

function StuCompleteList() {
  const [completedClasses, setCompletedClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'classStudents'),
          where('userId', '==', user.uid),
          where('status', '==', 'approved')
        );

        const snapshot = await getDocs(q);

        const data = await Promise.all(
          snapshot.docs.map(async (docItem) => {
            const d = docItem.data();

            const classRef = doc(db, 'classes', d.classId);
            const classSnap = await getDoc(classRef);

            if (!classSnap.exists()) return null;

            const classData = classSnap.data();

            return {
              id: docItem.id,
              classId: d.classId,
              title: classData.title,
              level: classData.level,
              branchName: classData.branchName,
            };
          })
        );

        setCompletedClasses(data.filter(Boolean));
      } catch (e) {
        console.error('완료 수업 불러오기 실패:', e);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles['mypage-container']}>
      <div className={styles['mypage-card']}>
        <div className={styles.header}>
          <h3 className={styles['mypage-title']}>완료한 수업</h3>

          <button
            className={styles['move-btn']}
            onClick={() => navigate('/mypage/classlist')}
          >
            전체보기
          </button>
        </div>

        <div className={styles['mypage-recommendlist']}>
          {completedClasses.length === 0 ? (
            <p className={styles['empty']}>완료한 강의가 없습니다.</p>
          ) : (
            completedClasses.map((item) => (
              <StuClassItem
                key={item.id}
                item={item}
                onClick={() => navigate(`/class/${item.classId}`)}
                showCancel={false} //
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StuCompleteList;
