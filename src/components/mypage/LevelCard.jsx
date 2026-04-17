import React from 'react';
import styles from '../../styles/css/mypage/LevelCard.module.css';
import levelIcon from '../../assets/icon/mypageLevelup.svg';

function LevelCard({ userData }) {
  const levelNumber = parseInt(userData?.level?.replace('V', '')) || 0;

  const total = 4;
  const current = levelNumber % total;
  const remain = total - current;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>레벨업 기준</h3>

      <div className={styles.inner}>
        <img src={levelIcon} alt="레벨 아이콘" className={styles.icon} />

        <div>
          <p className={styles.big}>4포인트 달성 시 레벨업</p>
          <p className={styles.desc}>레벨업까지 {remain}포인트 남았습니다!</p>
        </div>
      </div>
    </div>
  );
}

export default LevelCard;
