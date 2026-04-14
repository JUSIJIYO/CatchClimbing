import styles from "../../styles/css/class/ClassCard.module.css";
import icon1 from "../../assets/icon/openDate.svg"
import icon2 from "../../assets/icon/capacity.svg"
import icon3 from "../../assets/icon/branch.svg"

function ClassCard(
  {
    title,
    professorName,
    openDate,
    currentCap, //현재신청인원
    capacity, //정원
    branchName,
    level,
  },
  // 제목, 강사명, 날짜, 정원, 지점, 신청하기버튼, 상세보기버튼, 레벨
) {
  return (
    <div className={styles['classcard-item']}>

      <div className={styles['header']}>
        <span className={styles['classcard-professorName']}>{professorName}강사명</span>
          <span className={styles['classcard-level']}>{level}v3-v5</span>
      </div>

      <div className={styles['content']}>
        <h3 className={styles['classcard-title']}>{title}강의명</h3>
        <span className={styles['classcard-openDate']}><img src={icon1}/>{openDate}11.11</span>
        <span className={styles['classcard-currentCap']}><img src={icon2}/>{currentCap}15/</span>
        <span className={styles['classcard-capacity']}>{capacity}30</span>
        <span className={styles['classcard-branchName']}><img src={icon3}/>{branchName}강남점</span>
      </div>

      <div className={styles['footer']}>
        <button className={styles['classcard-detail-button']}>상세보기</button>
      <button className={styles['classcard-register-button']}>신청하기</button>
      </div>

    </div>
  );
}

export default ClassCard;
