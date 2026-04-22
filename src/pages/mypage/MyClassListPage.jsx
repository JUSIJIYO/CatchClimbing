import React, { useEffect, useState } from 'react';
import headerStyles from '../../styles/css/common/PageHeader.module.css';
import styles from '../../styles/css/mypage/MyClassListPage.module.css';
import { useNavigate } from 'react-router-dom';
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
import backButton from '../../assets/icon/backButton.svg';

function MyClassListPage() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
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

            const classSnap = await getDoc(doc(db, 'classes', d.classId));
            if (!classSnap.exists()) return null;

            const c = classSnap.data();

            return {
              id: docItem.id,
              classId: d.classId,
              title: c.title,
              level: c.level,
              branchId: c.branchId,
              branchName: c.branchName,
            };
          })
        );

        setList(data.filter(Boolean));
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className={headerStyles.header}>
        <h1>수업 리뷰 작성</h1>
        <p>내 클라이밍 기록과 정보</p>
      </div>

      <div className={styles.backBtn} onClick={() => navigate(-1)}>
        <img src={backButton} alt="뒤로가기" />
        <span>뒤로</span>
      </div>

      <div className={styles['mypage-container']}>
        <div className={styles['mypage-card']}>
          <h3 className={styles['mypage-title']}>완료한 강의</h3>

          {list.length === 0 ? (
            <p className={styles.empty}>완료한 강의가 없습니다.</p>
          ) : (
            <div className={styles['class-list']}>
              {list.map((item) => (
                <div key={item.id} className={styles['class-item']}>
                  <div className={styles['class-info']}>
                    <strong>{item.title}</strong> ({item.level})
                  </div>

                  <button
                    className={styles['review-btn']}
                    onClick={() =>
                      navigate('/reviewform', {
                        state: {
                          classId: item.classId,
                          title: item.title,
                          branchId: item.branchId,
                          branchName: item.branchName,
                        },
                      })
                    }
                  >
                    리뷰 작성
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyClassListPage;
