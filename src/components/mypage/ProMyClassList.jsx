import React from 'react';
import ProMyClassItem from './ProMyClassItem';
import styles from '../../styles/css/mypage/ProMyClassList.module.css';
import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function ProMyClassList() {
  const [classList, setClassList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      const q = query(
        collection(db, 'classes'),
        where('instructorId', '==', user.uid),
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => {
        const d = doc.data();

        return {
          id: doc.id,
          title: d.title,
          date: d.date,
          time: d.time,
          level: d.level,
        };
      });

      setClassList(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h3 className={styles.title}>등록된 수업</h3>

        <div className={styles.list}>
          {classList.length === 0 ? (
            <p className={styles.empty}>등록된 수업이 없습니다.</p>
          ) : (
            classList.map((item) => (
              <ProMyClassItem
                key={item.id}
                item={item}
                onClick={(item) => navigate(`/class/${item.id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProMyClassList;
