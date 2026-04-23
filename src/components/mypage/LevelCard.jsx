import React from 'react';
import styles from '../../styles/css/mypage/LevelCard.module.css';
import levelIcon from '../../assets/icon/mypageLevelup.svg';

function LevelCard({ userData, attemptCount = 0 }) {
  const total = 4;

  // 7회 = 1포인트
  const point = Math.floor(attemptCount / 7);

  // 남은 포인트 계산 (ProfileCard랑 동일)
  const remain =
    point % total === 0 && point !== 0 ? 0 : total - (point % total);

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
