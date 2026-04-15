import React from 'react';
import BranchClassItem from './BranchClassItem';
import styles from '../../styles/css/branch/BranchClassCard.module.css';
import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';

function BranchClassCard({ onOpenModal, branchId }) {
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const q = query(
          collection(db, 'classes'),
          where('branchId', '==', branchId),
        );

        const querySnapshot = await getDocs(q);

        const data = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
            const d = docSnap.data();

            // 🔥 강사 정보 가져오기
            const userRef = doc(db, 'users', d.professorId);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.exists() ? userSnap.data() : null;

            return {
              id: docSnap.id,
              name: d.professorName,
              profile: userData?.profileImg || '/default.jpg',
              level: d.level,
              title: d.title,
              date: d.openDate,
              time: d.time || '시간 미정',
              people: `${d.currentCap}/${d.capacity}`,
            };
          }),
        );

        setClassList(data);
      } catch (e) {
        console.error('수업 불러오기 실패:', e);
      }
    };

    if (branchId) {
      fetchClasses();
    }
  }, [branchId]);

  return (
    <div className={styles['branch-wrapper']}>
      <h2 className={styles['branch-title']}>수업</h2>
      <p className={styles['branch-sub']}>다음 클라이밍 수업을 예약하세요</p>

      <div className={styles['branch-gridWrap']}>
        <div className={styles['branch-grid']}>
          {classList.map((item) => (
            <BranchClassItem
              key={item.id}
              item={item}
              onOpenModal={onOpenModal}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BranchClassCard;
