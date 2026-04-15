import styles from "../../styles/css/class/ClassDetailPage.module.css";
import ClassDetail from "../../components/class/ClassDetail";
import { useNavigate } from "react-router-dom";

function ClassDetailPage() {

  const navigate = useNavigate();

  const classList = [
  {
    id: 1,
    professorName: '이서연',
    branchName: '강남점',
    createdAt: '월 19:00 - 21:00',
    level: '초급',
    currentCap: 12,
    capacity: 20,
    money: '200,000원'
  },
]

  return (
    <div className={styles["class-container"]}>
      {/* 헤더 */}
      <div className={styles["class-header"]}>
        <span className={styles["class-back"]}onClick={() => navigate("/class")}>← 수업 관리로 돌아가기</span>
        <h1 className={styles["class-title"]}>수업 상세 정보</h1>
      </div>

      <div className={styles["class-list"]}>
        {classList.map((item) => (
          <ClassDetail
            key={item.id}
            professorName={item.professorName}
            branchName={item.branchName}
            createdAt={item.createdAt}
            level={item.level}
            currentCap={item.currentCap}
            capacity={item.capacity}
            money={item.money}
          />
        ))}
      </div>
    </div>
  );
}

export default ClassDetailPage;
