import React, { useEffect, useState } from 'react';
import styles from '../../styles/css/mypage/StuList.module.css';
import {
  collection,
  getDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import StuClassItem from './StuClassItem';

function StuRecommendList() {
  const [recommendList, setRecommendList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const userSnap = await getDoc(doc(db, 'users', user.uid));
      const userData = userSnap.data();
      const userLevel = parseInt(userData.level.replace('V', ''));

      const enrollSnap = await getDocs(
        query(collection(db, 'classStudents'), where('userId', '==', user.uid))
      );

      const enrolledIds = enrollSnap.docs.map((d) => d.data().classId);

      const classSnap = await getDocs(collection(db, 'classes'));

      const list = classSnap.docs.map((docItem) => {
        const c = docItem.data();

        return {
          id: docItem.id,
          classId: docItem.id,
          title: c.title,
          professorName: c.professorName,
          branchName: c.branchName,
          level: c.level,
          openDate: c.time ? `${c.openDate} ${c.time}` : c.openDate,
        };
      });

      const filtered = list.filter((item) => {
        const classLevel = parseInt(item.level.replace('V', ''));

        return (
          Math.abs(classLevel - userLevel) <= 1 &&
          !enrolledIds.includes(item.classId)
        );
      });

      setRecommendList(filtered.slice(0, 3));
    };

    fetchData();
  }, []);

  return (
    <div className={styles['mypage-container']}>
      <div className={styles['mypage-card']}>
        <h3 className={styles['mypage-title']}>추천 수업</h3>

        <div className={styles['mypage-recommendlist']}>
          {recommendList.length === 0 ? (
            <p className={styles['empty']}>추천할 수업이 없습니다.</p>
          ) : (
            recommendList.map((item) => (
              <StuClassItem
                key={item.id}
                item={{
                  ...item,
                  openDate: item.openDate || '상시 개강',
                }}
                // id 대신 item.classId를 사용하여 상세페이지로 이동
                onClick={() => navigate(`/class/${item.classId}`)}
                showCancel={false}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StuRecommendList;
