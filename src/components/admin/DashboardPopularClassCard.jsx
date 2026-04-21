import React from 'react';
import styles from '../../styles/css/admin/DashboardPopularClassCard.module.css';

// 인기 강의 순위에 따른 색갈 설정 배열(피그마 기준으로 가져왔습니다)
const NUMBER_COLORS = ['#F59E0B', '#2C3E50', '#00A63E', '#3B82F6', '#8B5CF6', '#EC4899'];

// 넘버링, 강의제목, 강사이름, 지점이름, 강의시작 날짜, 현재신청인원, 정원
function DashboardPopularClassCard({ number, title, professorName, branchName, openDate, currentCap, capacity }) {
  
  // 인기강의 순위에 따라 색깔 달라지게
  const color = NUMBER_COLORS[(number - 1) % NUMBER_COLORS.length];
  
  // 정원과 비교해서 현재 인원에 따라 퍼센트바 채울 수 있게 
  const fillPercent = capacity > 0 ? Math.min(Math.round((currentCap / capacity) * 100), 100) : 0;
  
  // 정원이랑 신청인원이랑 같아지면 마감, 모집중 선택하게 (인원말고 날짜로 해야할 경우 수정 필요 이야기 해보기)
  const state = currentCap >= capacity ? '마감' : '모집중';

  return (
    <article className={styles["dashboard-popular-class-card-ct"]}>
      <div className={styles["popular-class-card-top-ct"]}>
        <p className={styles["popular-class-card-number"]} style={{ backgroundColor: color }}>{number}</p>
        <div className={styles["popular-class-card-top-left"]}>
          <div>
            <p className={styles["popular-class-card-class-title"]}>{title}</p>
            <p className={`${styles["popular-class-card-class-state"]}${state === '마감' ? ` ${styles["popular-class-card-class-dealine-state"]}` : ""}`}>{state}</p>
          </div>
          <p className={styles["popular-class-card-prf-name"]}>{professorName}</p>
        </div>
      </div>
      <div className={styles["popular-class-card-middle-ct"]}>
        <p className={styles["popular-class-card-branch-name"]}>{branchName}</p>
        <p>·</p>
        <p className={styles["popular-class-card-class-time"]}>{openDate}</p>
      </div>
      <div className={styles["popular-class-card-bottom-ct"]}>
        <p className={styles["popular-class-card-enrolled-students"]}>수강 인원</p>
        <p className={styles["popular-class-card-enrolled-number"]}>{currentCap}/{capacity}명</p>
      </div>
      <div className={styles["popular-class-card-progress-bar"]}>
        <div style={{ width: `${fillPercent}%`, backgroundColor: color, height: '100%' }} />
      </div>
    </article>
  );
}

export default DashboardPopularClassCard;
