import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import headerStyles from '../../styles/css/common/PageHeader.module.css';
import styles from '../../styles/css/calendar/CalendarPage.module.css';
function CalendarPage() {
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'classes'),
          where('professorId', '==', user.uid),
        );

        const snapshot = await getDocs(q);

        const result = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            title: data.title,
            openDate: data.openDate,
            level: data.level,
          };
        });

        console.log('캘린더 데이터:', result);

        setClassList(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>불러오는 중...</div>;

  return (
    <>
      <div className={headerStyles.header}>
        <h1>캘린더</h1>
        <p>내 클라이밍 일정</p>
      </div>

      <div className={styles.container}>
        {classList.map((item) => (
          <div key={item.id}>
            <p>{item.title}</p>
            <p>{item.openDate}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default CalendarPage;
