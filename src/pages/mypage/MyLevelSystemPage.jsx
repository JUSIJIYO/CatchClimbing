import ProfileCard from '../../components/mypage/ProfileCard';
import LevelCard from '../../components/mypage/LevelCard';
import LevelGuide from '../../components/mypage/LevelGuide';
import styles from '../../styles/css/mypage/MyLevelSystemPage.module.css';
import backIcon from '../../assets/icon/backButton.svg';
import { useNavigate } from 'react-router-dom';
import headerStyles from '../../styles/css/common/PageHeader.module.css';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../firebase/config';

function MyLevelSystemPage() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const q = query(collection(db, 'records'), where('uid', '==', user.uid));

      const snapshot = await getDocs(q);

      let total = 0;
      snapshot.docs.forEach((doc) => {
        total += Number(doc.data().tryCount || 0);
      });

      setAttemptCount(total);

      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        setUserData(snap.data());
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, 'users', user.uid));

      if (snap.exists()) {
        setUserData(snap.data());
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <div className={headerStyles.header}>
        <h1>레벨 시스템 조회</h1>
        <p>레벨 산정 기준</p>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.topBar}>
          <button
            className={styles.backBtn}
            onClick={() => navigate('/mypage')}
          >
            <img src={backIcon} alt="뒤로가기" />
            마이페이지로 돌아가기
          </button>
        </div>

        <div className={styles.container}>
          <ProfileCard
            userData={userData}
            showButtons={false}
            attemptCount={attemptCount}
          />

          <div className={styles.row}>
            <LevelGuide />
            <LevelCard userData={userData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyLevelSystemPage;
