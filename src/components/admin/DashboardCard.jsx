import React from "react";
import styles from "../../styles/css/admin/DashboardCard.module.css";

// 순서대로 아이콘, 카드 제목, 증가값(한달전, 하루전), 카드 숫자(전체 사용자 : 50명 할때 50명)
function DashboardCard({ icon, title, increase, count }) {
  return (
    <article className={styles["dashboard-card-ct"]}>
      <div className={styles["dashboard-card-top"]}>
        <img src={icon} />
        <p> +{increase}</p>
      </div>
      <p className={styles["dashboard-card-count"]}> {count}</p>
      <p className={styles["dashboard-card-title"]}> {title} </p>
    </article>
  );
}

export default DashboardCard;
