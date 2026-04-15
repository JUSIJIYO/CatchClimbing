import styles from "../../styles/css/class/ClassDetail.module.css";
import icon1 from "../../assets/icon/people.svg";
import icon2 from "../../assets/icon/location(3).svg";
import icon3 from "../../assets/icon/calender.svg";
import icon4 from "../../assets/icon/level.svg";

function ClassDetail({
  professorName,
  branchName,
  createdAt,
  level,

  currentCap, //현재신청인원
  capacity, //정원
  money,
}) {
  return (
    <div>
      <div className={styles["class-main-card"]}>
        <div className={styles["class-top"]}>
          <div className={styles["class-picture"]}></div>

          <div className={styles["class-infomation"]}>
            <h2 className={styles["class-title"]}>초급 볼더링</h2>

            <div className={styles["class-datail-information"]}>

              <div className={styles["icon-item"]}>
                  <span className={styles["icon-box"]}>
                    <img src={icon1} />
                  </span>
                  강사: {professorName}
              </div>

              <div className={styles["icon-item"]}>
                  <span className={styles["icon-box"]}>
                    <img src={icon2} />
                  </span>
                  지점: {branchName}
              </div>

                <div className={styles["icon-item"]}>
                <span className={styles["icon-box"]}>
                  <img src={icon3} />
                </span>
                일정: {createdAt}
              </div>

              <div className={styles["icon-item"]}>
                <span className={styles["icon-box"]}>
                  <img src={icon4} />
                </span>
                난이도: {level}
              </div>
            </div>
          </div>
        </div>

        <div className={styles["class-description"]}>
          <h3>수업 설명</h3>
          <p>처음 볼더링을 접하는 분들을 위한 입문 수업입니다.</p>
          <p>
            기초적인 홀드 잡는 방법부터 바디 포지션, 균형 잡는 법까지 차근차근
            배울 수 있어요.
          </p>
        </div>
      </div>

      <div className={styles["class-bigcard"]}>
        <div className={styles["class-card"]}>
          <span>수강 인원</span>
          <strong>
            {currentCap}/{capacity}
          </strong>
        </div>

        <div className={styles["class-card"]}>
          <span>수강료</span>
          <strong>{money}</strong>
        </div>
      </div>
    </div>
  );
}

export default ClassDetail;
