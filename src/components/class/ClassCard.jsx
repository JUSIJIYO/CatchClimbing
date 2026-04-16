import styles from "../../styles/css/class/ClassCard.module.css";
import icon1 from "../../assets/icon/openDate.svg";
import icon2 from "../../assets/icon/capacity.svg";
import icon3 from "../../assets/icon/branch.svg";
import icon4 from "../../assets/icon/detailsee.svg";
import icon5 from "../../assets/icon/profile.svg"; 
import { useNavigate } from 'react-router-dom';

function ClassCard({
  id,
  title,
  professorName,
  openDate,
  currentCap,
  capacity,
  branchName,
  level,
  onRegisterClick // ClassCard에서 가져온 이벤트
}) {

  const navigate = useNavigate();

  const handleDetailClick = () => {
    navigate(`/class/${id}`);
  };

  return (
    <div className={styles['classcard-item']}>

      <div className={styles['header']}>

        <div className={styles['left']}>

          <img src={icon5} className={styles['profile']} alt="profile" />

          <div className={styles['information']}>
            <span className={styles['classcard-name']}>강사</span>
            <span className={styles['classcard-professorName']}>
              {professorName}
            </span>
          </div>

        </div>

        <span className={styles['classcard-level']}>{level}</span>

      </div>

      <div className={styles['content']}>
        <div className={styles['classcard-title']}>{title}</div>

        <div>
          <p className={styles['classcard-openDate']}>
            <img src={icon1} alt="" /> {openDate}
          </p>

          <span>
            <img src={icon2} alt="" /> {currentCap}/{capacity}
          </span>

          <span className={styles['classcard-branchName']}>
            <img src={icon3} alt="" /> {branchName}
          </span>
        </div>
      </div>

      <div className={styles['footer']}>
        <button
          onClick={handleDetailClick}
          className={styles['classcard-detail-button']}
        >
          <img src={icon4} alt="" /> 상세보기
        </button>

        <button 
        onClick={onRegisterClick}
        className={styles['classcard-register-button']}>
          신청하기
        </button>
      </div>

    </div>
  );
}

export default ClassCard;