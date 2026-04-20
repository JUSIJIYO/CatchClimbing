import React, { useEffect, useState } from "react";
import styles from "../../styles/css/mypage/ProMyClassList.module.css";
import { db } from "../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom"; 
import StuClassItem from "./StuClassItem";

function StuClassList() {
  const [classList, setClassList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "enrollments"),
          where("userId", "==", user.uid),
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => {
          const d = doc.data();
          
          // 데이터가 잘 오는지 확인용 로그 (콘솔에서 classId가 있는지 확인하세요!)
          console.log("신청 내역 데이터:", d); 

          return {
            id: doc.id, 
            classId: d.classId,
            title: d.title,
            openDate: d.openDate,
            startTime: d.startTime,
            endTime: d.endTime,
            level: d.level || "정보 없음",
          };
        });

        setClassList(data);
      } catch (e) {
        console.error("수강 목록 불러오기 실패:", e);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h3 className={styles.title}>신청한 수업</h3>

        <div className={styles.list}>
          {classList.length === 0 ? (
            <p className={styles.empty}>신청한 수업이 없습니다.</p>
          ) : (
            classList.map((item) => (
              <StuClassItem
                key={item.id}
                item={item}
                onClick={() => navigate(`/class/${item.classId}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StuClassList;
