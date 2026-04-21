import React, { useEffect, useState } from "react";
import styles from "../../styles/css/mypage/ProMyClassList.module.css";
import { db } from "../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import StuClassItem from "./StuClassItem";
import { deleteDoc, doc, updateDoc, increment } from "firebase/firestore";

function StuClassList() {
  const handleCancel = async (item) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      // 1. enrollments 문서 삭제
      await deleteDoc(doc(db, "enrollments", item.id));

      // 2. 수강 인원 감소
      await updateDoc(doc(db, "classes", item.classId), {
        currentCap: increment(-1),
      });

      // 3. UI 업데이트
      setClassList((prev) => prev.filter((c) => c.id !== item.id));

      alert("수강이 취소되었습니다.");
    } catch (e) {
      console.error("취소 실패:", e);
    }
  };

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

          // console.log("신청 내역 데이터:", d);

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
        <div className={styles.header}>
          <h3 className={styles.title}>수강신청 강의</h3>
        </div>

        <div className={styles.list}>
          {classList.length === 0 ? (
            <p className={styles.empty}>신청한 수업이 없습니다.</p>
          ) : (
            classList.map((item) => (
              <StuClassItem
                key={item.id}
                item={item}
                onClick={() => navigate(`/class/${item.classId}`)}
                onCancel={() => handleCancel(item)}
                showCancel={true} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StuClassList;
