import React from 'react';
import BranchClassItem from './BranchClassItem';
import styles from '../../styles/css/branch/BranchClassCard.module.css';
import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';

function BranchClassCard({ onOpenModal, branchId, appliedClasses, userRole }) {
  // 지점에 해당하는 수업 목록 상태
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    // firestore에서 수업 데이터 가져오는 함수
    const fetchClasses = async () => {
      try {
        // classes 컬렉션에서 현재 지점(branchId)에 해당하는 수업 조회
        const q = query(
          collection(db, 'classes'),
          where('branchId', '==', branchId)
        );

        const querySnapshot = await getDocs(q);

        // 각 수업 문서에 대해 필요한 데이터 가공
        const data = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
            const d = docSnap.data();

            // 강사 정보(users 컬렉션) 추가 조회
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
          })
        );

        setClassList(data);
      } catch (e) {
        console.error('수업 불러오기 실패:', e);
      }
    };

    // branchId가 있을 때만 데이터 조회 실행
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
              onOpenModal={(type) => onOpenModal(type, item.id)}
              isApplied={appliedClasses.includes(item.id)}
              role={userRole}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BranchClassCard;
