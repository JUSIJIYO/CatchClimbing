import React from 'react';
import styles from '../../styles/css/mypage/ProProfileCard.module.css';
import mypageIcon from '../../assets/icon/mypageIcon.svg';
import ProgressBar from '../common/ProgressBar';
import { useNavigate } from 'react-router-dom';

function ProfileCard({ user, showButtons = true }) {
  // 임시 데이터 (나중에 Firebase 연결)
  const name = user?.displayName || '곽시윤';
  const branch = '강남점';
  const level = 'V7';
  const progress = 75;
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.profileSection}>
          <div className={styles.profileImg} />

          <div className={styles.info}>
            <p className={styles.name}>
              {name} ({branch})
            </p>
            <span className={styles.level}>레벨 {level}</span>
          </div>
        </div>

        {showButtons && (
          <div className={styles.buttons}>
            <button className={styles.btn}>
              <img src={mypageIcon} alt="" />
              프로필 조회
            </button>
            <button className={styles.btn} onClick={() => navigate('/level')}>
              <img src={mypageIcon} alt="" />
              레벨시스템조회
            </button>
          </div>
        )}
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span>V8 달성률</span>
          <span>{progress}%</span>
        </div>

        <ProgressBar percent={progress} />

        <p className={styles.desc}>다음 레벨까지 조금만 더! 잘하고 계세요.</p>
      </div>
    </div>
  );
}

export default ProfileCard;
