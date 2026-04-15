import styles from "../../styles/css/class/ClassCard.module.css";
import icon1 from "../../assets/icon/openDate.svg"
import icon2 from "../../assets/icon/capacity.svg"
import icon3 from "../../assets/icon/branch.svg"
import icon4 from "../../assets/icon/detailsee.svg"

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
    <div className={styles['container']}>
    <div className={styles['classcard-item']}>
      <div className={styles['header']}>
        <div className={styles['left']}>
            <p>강사</p>
            <p className={styles['classcard-professorName']}>{professorName}</p>
        </div>
          <span className={styles['classcard-level']}>{level}</span>
      </div>
      <div className={styles['content']}>
        <div className={styles['classcard-title']}>{title}</div>
        <div>
           <p className={styles['classcard-openDate']}><img src={icon1}/> {openDate}</p>
          <span className={styles['classcard-currentCap']}><img src={icon2}/> {currentCap}/</span>
          <span className={styles['classcard-capacity']}>{capacity}</span>
          <span className={styles['classcard-branchName']}><img src={icon3}/> {branchName}</span>
        </div>
      </div>

      <div className={styles['footer']}>
        <button className={styles['classcard-detail-button']}><img src={icon4}/>상세보기</button>
      <button className={styles['classcard-register-button']}>신청하기</button>
      </div>
    </div>
    </div>

  );
}

export default ClassCard;
