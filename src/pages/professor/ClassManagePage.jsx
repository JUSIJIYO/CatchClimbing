import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getAuth } from 'firebase/auth';
import headerStyles from '../../styles/css/common/PageHeader.module.css';
import PrfClassCard from '../../components/professor/PrfClassCard';
import styles from '../../styles/css/professor/ClassManagePage.module.css';
function ClassManagePage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyClasses = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, 'classes'),
          where('professorId', '==', user.uid),
        );

        const snapshot = await getDocs(q);

        const result = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setClasses(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchMyClasses();
  }, []);

  if (loading) return <p>불러오는 중...</p>;

  return (
    <>
      <div className={headerStyles.header}>
        <h1>내 강의</h1>
        <p>등록한 수업을 확인하고, 새 수업을 등록해보세요</p>
      </div>
      <div className={styles.container}>
        <div className={styles.cardWrapper}>
          <PrfClassCard classes={classes} />
        </div>

        <div className={styles.bottomBar}>
          <button className={styles.addBtn}>강의 등록</button>
        </div>
      </div>
    </>
  );
}

export default ClassManagePage;
