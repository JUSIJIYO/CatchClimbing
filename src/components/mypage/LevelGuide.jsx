import React from 'react';
import styles from '../../styles/css/mypage/LevelGuide.module.css';

function LevelGuide() {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>레벨 산정 기준</h3>

      <div className={styles.item}>
        <span>0~3개 이하:</span>
        <span className={styles.minus}> -1포인트 하락</span>
      </div>

      <div className={styles.item}>
        <span>4~6개:</span>
        <span> 0포인트</span>
      </div>

      <div className={styles.item}>
        <span>7개 이상:</span>
        <span className={styles.plus}> +1포인트 상승</span>
      </div>
    </div>
  );
}

export default LevelGuide;
