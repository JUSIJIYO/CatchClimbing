import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import writeIcon from '../../assets/icon/recordWirte.svg';
import RecordItem from '../../components/record/RecordItem';
import styles from '../../styles/css/record/RecordListPage.module.css';
import headerStyles from '../../styles/css/common/PageHeader.module.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function RecordListPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchRecords = async () => {
      try {
        const q = query(
          collection(db, 'records'),
          where('uid', '==', user.uid),
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRecords(data);
      } catch (e) {
        console.error('기록 불러오기 실패:', e);
      }
    };

    fetchRecords();
  }, [user]);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className={headerStyles.header}>
        <h2>나의 기록</h2>
        <p>클라이밍 기록을 확인하고 관리하세요</p>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.btnWrap}>
          <button
            className={styles.writeBtn}
            onClick={() => navigate('/record/new')}
          >
            <img src={writeIcon} alt="" />
            등록하기
          </button>
        </div>

        {records.length === 0 ? (
          <p className={styles.empty}>기록이 없습니다.</p>
        ) : (
          <div className={styles.grid}>
            {records.map((item) => (
              <RecordItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default RecordListPage;
