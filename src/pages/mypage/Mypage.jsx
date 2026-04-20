import { auth } from "../../firebase/config";
import ProfileCard from "../../components/mypage/ProfileCard";
import ProMyClassList from "../../components/mypage/ProMyClassList";
import StuClassList from "../../components/mypage/StuClassList";
import styles from "../../styles/css/mypage/Mypage.module.css";
import headerStyles from "../../styles/css/common/PageHeader.module.css";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";

function Mypage() {
  const [userData, setUserData] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setUserData(snap.data());
      }

      const q = query(collection(db, "records"), where("uid", "==", user.uid));

      const snapshot = await getDocs(q);

      let total = 0;
      snapshot.docs.forEach((doc) => {
        total += Number(doc.data().tryCount || 0);
      });

      setAttemptCount(total);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.container}>
      <div className={headerStyles.header}>
        <h1>마이페이지</h1>
        <p>내 클라이밍 기록과 정보</p>
      </div>

      <ProfileCard userData={userData} attemptCount={attemptCount} />
      {userData?.role === "professor" ? <ProMyClassList /> : <StuClassList />}
    </div>
  );
}

export default Mypage;
