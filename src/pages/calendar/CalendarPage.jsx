import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import headerStyles from '../../styles/css/common/PageHeader.module.css';
import styles from '../../styles/css/calendar/CalendarPage.module.css';
import MonthCalendar from '../../components/calendar/MonthCalendar';

function CalendarPage() {
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];
  const [recordList, setRecordList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // const q = query(
        //   collection(db, 'classes'),
        //   where('professorId', '==', user.uid)
        // );

        const classQuery = query(
          collection(db, 'classes'),
          where('professorId', '==', user.uid)
        );

        const recordQuery = query(
          collection(db, 'records'),
          where('uid', '==', user.uid)
        );

        const [classSnap, recordSnap] = await Promise.all([
          getDocs(classQuery),
          getDocs(recordQuery),
        ]);

        const classes = classSnap.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            title: d.title,
            date: d.date,
            type: 'class',
          };
        });

        const formatDate = (date) => {
          const d = new Date(date);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            '0'
          )}-${String(d.getDate()).padStart(2, '0')}`;
        };

        const records = recordSnap.docs
          .map((doc) => {
            const d = doc.data();

            if (!d.visitDate) return null;

            let formatted;

            if (d.visitDate.seconds) {
              const dateObj = new Date(d.visitDate.seconds * 1000);
              formatted = dateObj.toISOString().split('T')[0];
            } else {
              formatted = new Date(d.visitDate).toISOString().split('T')[0];
            }

            return {
              id: doc.id,
              title: d.title || d.content,
              date: formatted,
              type: 'record',
            };
          })
          .filter(Boolean);
        setClassList(classes);
        setRecordList(records);
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
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <MonthCalendar
              onDateClick={setSelectedDate}
              classList={[...classList, ...recordList]}
              selectedDate={selectedDate}
            />
          </div>

          <div className={styles.right}>
            {[...classList, ...recordList]
              .filter((item) =>
                selectedDate ? item.date === selectedDate : true
              )
              .map((item) => (
                <div key={item.id}>
                  <p>
                    {item.type === 'record' ? '📝' : '📚'} {item.title}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default CalendarPage;
