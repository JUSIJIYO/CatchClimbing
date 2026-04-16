import ClassCard from "../../components/class/ClassCard";
import styles from "../../styles/css/class/ClassListPage.module.css";
import icon1 from "../../assets/icon/filter.svg";
import { useState, useEffect } from "react";
import ClassFilterButton from "../../components/class/ClassFilterButton";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

function ClassListPage() {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]); // 지점 전체 데이터
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("전체");

  // firebase class 데이터 가져오기
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "classes"));

        const result = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllData(result);
        setData(result);

        const branches = result.map((item) => item.branchName);
        const uniqueBranches = [...new Set(branches)];

        setBranchList(["전체", ...uniqueBranches]);

      } catch (e) {
        console.error("수업 불러오기 실패:", e);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedBranch === "전체") {
      setData(allData);
    } else {
      const filtered = allData.filter(
        (item) => item.branchName === selectedBranch
      );
      setData(filtered);
    }
  }, [selectedBranch, allData]);

  
  return (
    <div>
      {/* 헤더 */}
      <div className={styles["header"]}>
        <h1>수업</h1>
        <p>다음 클라이밍 수업을 예약하세요</p>
      </div>

      {/* 필터 */}
      <div className={styles["filter"]}>
        <img src={icon1} className={styles["class-filter-icon"]} />
        <div className={styles["container"]}>
          지점:
          {branchList.map((branch) => (
            <ClassFilterButton
              key={branch}
              label={branch}
              isActive={selectedBranch === branch}
              onClick={() => setSelectedBranch(branch)}
            />
          ))}
        </div>
      </div>

      {/* 리스트 */}
      <div className={styles["class-list-page"]}>
        {data.length === 0 ? (
          <p>수업이 없습니다.</p>
        ) : (
          data.map((card) => <ClassCard key={card.id} {...card} />)
        )}
      </div>
    </div>
  );
}

export default ClassListPage;