import ClassCard from "../../components/class/ClassCard";
import styles from "../../styles/css/class/ClassListPage.module.css";
import icon1 from "../../assets/icon/filter.svg";
import { useState } from "react";
import ClassFilterButton from "../../components/class/ClassFilterButton";

function ClassListPage() {
  const data = [//firebase에서 가져올 부분1
    {
      id: 1,
      title: "중급 볼더링 클래스",
      professorName: "김준호",
      openDate: "2026년 4월 8일",
      currentCap: 8,
      capacity: 12,
      branchName: "강남점",
      level: "V3-V5",
    },
    {
      id: 2,
      title: "초급 기초 클래스",
      professorName: "이서연",
      openDate: "2026년 4월 9일",
      currentCap: 5,
      capacity: 10,
      branchName: "홍대점",
      level: "VB-V2",
    },
    {
      id: 3,
      title: "초급 기초 클래스",
      professorName: "이서연",
      openDate: "2026년 4월 9일",
      currentCap: 5,
      capacity: 10,
      branchName: "홍대점",
      level: "VB-V2",
    },
    {
      id: 4,
      title: "초급 기초 클래스",
      professorName: "이서연",
      openDate: "2026년 4월 9일",
      currentCap: 5,
      capacity: 10,
      branchName: "홍대점",
      level: "VB-V2",
    },
  ];

  const branchList = [//firebase에서 가져올 부분2
    "전체",
    "양재점",
    "홍대점",
    "일산점",
    "신사점",
    "마곡점",
    "연남점",
    "문래점",
    "성수점",
    "이수점",
    "신림점",
    "강남점",
    "사당점",
    "논현점",
  ];

  const [selectedBranch, setSelectedBranch] = useState("전체");
  

    const filteredData =
    selectedBranch === "전체"
        ? data
        : data.filter((item) => item.branchName === selectedBranch);

  return (
    <div>
      <div className={styles["header"]}>
        <h1>수업</h1>
        <p>다음 클라이밍 수업을 예약하세요</p>
      </div>

      <div className={styles["filter"]}>
            <img src={icon1} className={styles["class-filter-icon"]}/> 
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

      <div className={styles["class-list-page"]}>
        {data.map((card) => {
          console.log(card);
          return <ClassCard key={card.id} {...card} />;
        })}
      </div>
    </div>
  );
}

export default ClassListPage;
