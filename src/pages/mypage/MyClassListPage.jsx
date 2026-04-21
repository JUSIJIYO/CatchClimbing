import React, { useEffect, useState } from "react";
import headerStyles from "../../styles/css/common/PageHeader.module.css";
import styles from "../../styles/css/mypage/MyClassListPage.module.css";
import { useNavigate } from "react-router-dom";

function MyClassListPage() {
  const [list, setList] = useState([]);
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

    setList(mockData);
  }, []);

  return (
    <div>
      <div className={headerStyles.header}>
        <h1>수업상세보기</h1>
        <p>내 클라이밍 기록과 정보</p>
      </div>

      <div className={styles["mypage-container"]}>
        <div className={styles["mypage-card"]}>
          <h3 className={styles["mypage-title"]}>완료한 강의</h3>

          {list.length === 0 ? (
            <p className={styles.empty}>완료한 강의가 없습니다.</p>
          ) : (
            <div className={styles["class-list"]}>
              {list.map((item) => (
                <div key={item.id} className={styles["class-item"]}>
                  <div className={styles["class-info"]}>
                    <strong>{item.title}</strong> ({item.level})
                  </div>

                  <button
                    className={styles["review-btn"]}
                    onClick={() =>
                      navigate("/reviewform", {
                        state: {
                          classId: item.classId,
                          title: item.title,
                          branchId: item.branchId,
                          branchName: item.branchName,
                        },
                      })
                    }
                  >
                    리뷰 작성
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyClassListPage;
