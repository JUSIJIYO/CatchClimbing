import React, { useEffect, useState } from "react";
import styles from "../../styles/css/mypage/StuList.module.css";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom"; 
import StuClassItem from "./StuClassItem";

function StuCompleteList() {
  const [completedClasses, setCompletedClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const q = query(
        collection(db, "classStudents"),
        where("studentId", "==", user.uid),
        where("status", "==", "completed")
      );

      try {
        const snap = await getDocs(q);
        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(), // 여기에 classId가 들어있어야 합니다.
        }));
        setCompletedClasses(list);
      } catch (error) {
        console.error("완료 목록 조회 실패:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles['mypage-container']}>
      <div className={styles['mypage-card']}>
        <h3 className={styles['mypage-title']}>완료한 수업</h3>

        <div className={styles['mypage-recommendlist']}>
          {completedClasses.length === 0 ? (
            <p className={styles['empty']}>완료한 강의가 없습니다.</p>
          ) : (
            completedClasses.map((item) => (
              <StuClassItem
                key={item.id}
                item={{
                  ...item,
                  title: item.title || "제목 없음",
                  level: item.level || "정보 없음",
                  openDate: item.openDate || "수료 완료" 
                }}
                onClick={() => navigate(`/class/${item.classId}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StuCompleteList;