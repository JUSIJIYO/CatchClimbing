import styles from '../../styles/css/mypage/ProfileCard.module.css';
import icon1 from '../../assets/icon/mypageProfile.svg';
import icon2 from '../../assets/icon/update.svg';

function ProfileCard() {
  return (
    <div className={styles["mypage-profilecard"]}>
      <div className={styles["mypage-top"]}>
        <div className={styles["mypage-information"]}>
          
            <img src={icon1} alt="profile" className={styles["mypage-img"]} />
         
          <div className={styles["mypage-text"]}>
            <h2 className={styles["mypage-name"]}>김학생</h2>
            <span className={styles["mypage-level"]}>레벨 V3</span>
          </div>
        </div>
        
        <div className={styles["mypage-button-group"]}>
          <button className={styles["mypage-button"]}>
            <img src={icon2} className={styles["mypage-btn"]} />
            프로필 조회
          </button>
          <button className={styles["mypage-button"]}>
            <img src={icon2} className={styles["mypage-btn"]}  />
            레벨시스템조회
          </button>
        </div>
      </div>

      <div className={styles["mypage-footer"]}>
        <div className={styles["mypage-progressbar-header"]}> {/* 이름 변경: header */}
          <span className={styles["mypage-progressbar-title"]}>V5 달성률</span>
          <span className={styles["mypage-progress-text"]}>75%</span> {/* 이름 변경: 텍스트용 */}
        </div>
        
        {/* 프로그레스 바의 전체 통(회색 배경) */}
        <div className={styles["mypage-progress-container"]}> 
          {/* 실제로 차오르는 바(검정색) */}
          <div 
            className={styles["mypage-progressbar-percent"]} 
            style={{ width: '75%' }}
          ></div>
        </div>
        
        <p className={styles["mypage-message"]}>다음 레벨까지 조금만 더! 잘하고 계세요.</p>
      </div>
      </div>
  );
}

export default ProfileCard;