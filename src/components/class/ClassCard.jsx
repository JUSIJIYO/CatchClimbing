import styles from "../../styles/css/class/ClassCard.module.css";
import icon1 from "../../assets/icon/openDate.svg";
import icon2 from "../../assets/icon/capacity.svg";
import icon3 from "../../assets/icon/branch.svg";
import icon4 from "../../assets/icon/detailsee.svg";
import { useNavigate } from "react-router-dom";

function ClassCard({
  id,
  title,
  professorName,
  openDate,
  currentCap,
  capacity,
  branchName,
  level,
  imageUrl,
  onRegisterClick,
  isProfessor,
  studentCount,
}) {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    navigate(`/class/${id}`);
  };

  return (
    <div className={styles["classcard-item"]}>
      <div className={styles["header"]}>
        <div className={styles["left"]}>
          <img
            src={imageUrl}
            className={styles["profile"]}
            alt="profile"
          />

          <div className={styles["information"]}>
            <span className={styles["classcard-name"]}>강사</span>
            <span className={styles["classcard-professorName"]}>
              {professorName}
            </span>
          </div>
        </div>

        <span className={styles["classcard-level"]}>{level}</span>
      </div>

      <div className={styles["content"]}>
        <div className={styles["classcard-title"]}>{title}</div>

        <div>
          <p className={styles["classcard-openDate"]}>
            <img src={icon1} alt="달력" /> {openDate}
          </p>

          <span>
            <img src={icon2} alt="정원" /> {studentCount ?? currentCap}/{capacity}
          </span>

          <span className={styles["classcard-branchName"]}>
            <img src={icon3} alt="지점" /> {branchName}
          </span>
        </div>
      </div>

      <div className={styles["footer"]}>
        <button
          onClick={handleDetailClick}
          className={styles["classcard-detail-button"]}
        >
          <img src={icon4} alt="상세보기" /> 상세보기
        </button>

        {!isProfessor && (
          <button
            onClick={onRegisterClick}
            className={styles["classcard-register-button"]}
          >
            신청하기
          </button>
        )}
      </div>
    </div>
  );
}

export default ClassCard;
