import React, { useEffect, useState } from "react";
import styles from "../../styles/css/mypage/StuCompleteList.module.css";
import { useNavigate } from "react-router-dom";
import StuClassItem from "./StuClassItem";

function StuCompleteList() {
  const [completedClasses, setCompletedClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const mockData = [
      {
        id: "1",
        classId: "class1",
        title: "클라이밍 입문",
        level: "V3",
        branchId: "theclimb_gangnam",
        branchName: "강남점",
      },
      {
        id: "2",
        classId: "class2",
        title: "중급 테크닉",
        level: "V5",
        branchId: "theclimb_hongdae",
        branchName: "홍대점",
      },
    ];

    setCompletedClasses(mockData);
  }, []);

  return (
    <div className={styles["mypage-container"]}>
      <div className={styles["mypage-card"]}>
        <div className={styles.header}>
          <h3 className={styles["mypage-title"]}>완료한 수업</h3>

          <button
            className={styles["move-btn"]}
            onClick={() => navigate("/mypage/classlist")}
          >
            전체보기
          </button>
        </div>

        <div className={styles["mypage-recommendlist"]}>
          {completedClasses.length === 0 ? (
            <p className={styles["empty"]}>완료한 강의가 없습니다.</p>
          ) : (
            completedClasses.map((item) => (
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

export default StuCompleteList;
