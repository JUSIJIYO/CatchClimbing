import React, { useEffect, useState } from 'react';
import styles from '../../styles/css/mypage/ProMyClassList.module.css';
import { db } from '../../firebase/config';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import StuClassItem from './StuClassItem';

function StuClassList() {
  const [classList, setClassList] = useState([]);
  const navigate = useNavigate();
  const handleCancel = async (item) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      await deleteDoc(doc(db, 'classStudents', item.id));

      await updateDoc(doc(db, 'classes', item.classId), {
        currentCap: increment(-1),
      });

      setClassList((prev) => prev.filter((c) => c.id !== item.id));

      alert('수강이 취소되었습니다.');
    } catch (e) {
      console.error('취소 실패:', e);
    }
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'classStudents'),
          where('userId', '==', user.uid),
          where('status', '==', 'pending')
        );

        const snapshot = await getDocs(q);

        const data = await Promise.all(
          snapshot.docs.map(async (docItem) => {
            const d = docItem.data();

            const classRef = doc(db, 'classes', d.classId);
            const classSnap = await getDoc(classRef);

            if (!classSnap.exists()) return null;

            const classData = classSnap.data();
            // console.log(classData);
            return {
              id: docItem.id,
              classId: d.classId,
              title: classData.title,
              openDate: classData.time
                ? `${classData.openDate} ${classData.time}`
                : classData.openDate,

              professorName: classData.professorName,
              branchName: classData.branchName,
              level: classData.level || '정보 없음',
            };
          })
        );

        setClassList(data.filter(Boolean));
      } catch (e) {
        console.error('수강 목록 불러오기 실패:', e);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>수강신청 강의</h3>
        </div>

        <div className={styles.list}>
          {classList.length === 0 ? (
            <p className={styles.empty}>신청한 수업이 없습니다.</p>
          ) : (
            classList.map((item) => (
              <StuClassItem
                key={item.id}
                item={item}
                onClick={() => navigate(`/class/${item.classId}`)}
                onCancel={() => handleCancel(item)}
                showCancel={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StuClassList;
