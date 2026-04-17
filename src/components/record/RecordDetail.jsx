import React from 'react';
import styles from '../../styles/css/record/RecordDetail.css';
import branchIcon from '../../assets/icon/recordDetailBranch.svg';
import timeIcon from '../../assets/icon/recordDetailTime.svg';
import deleteIcon from '../../assets/icon/recordDelete.svg';
import dateIcon from '../../assets/icon/recordDetailDate.svg';
import descIcon from '../../assets/icon/recordDetailDesc.svg';
import fixIcon from '../../assets/icon/recordDetailFix.svg';
import imageIcon from '../../assets/icon/recordDetailImageIcon.svg';
import tryIcon from '../../assets/icon/recordDetailTry.svg';

function RecordDetail({ item }) {
  if (!item) return null;
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>{item.title}</h2>

        <div className={styles.actions}>
          <button>
            <img src={fixIcon} alt="" />
            수정
          </button>
          <button>
            <img src={deleteIcon} alt="" />
            삭제
          </button>
        </div>

        <div className={styles.level}>{item.level}</div>
      </div>

      <div className={styles.info}>
        <p>
          <img src={branchIcon} alt="" />
          지점: {item.branchName}
        </p>
        <p>
          <img src={dateIcon} alt="" />
          날짜: {item.visitDate}
        </p>
        <p>
          <img src={timeIcon} alt="" />
          시간:{' '}
          {item.startTime && item.endTime
            ? `${item.startTime} ~ ${item.endTime}`
            : '정보 없음'}
        </p>
        <p>
          <img src={tryIcon} alt="" />
          시도한 문제 수: {item.tryCount}회
        </p>
      </div>

      <div className={styles.section}>
        <p>
          <img src={descIcon} alt="" />
          문제 설명
        </p>
        <p>{item.description}</p>
      </div>

      <div className={styles.section}>
        <p>
          <img src={descIcon} alt="" />
          메모
        </p>
        <p>{item.memo}</p>
      </div>

      <div className={styles.section}>
        <p>
          <img src={imageIcon} alt="" />
          사진
        </p>
        <div className={styles.imageList}>
          <img src={item.image} className={styles.image} />
        </div>
      </div>
    </div>
  );
}

export default RecordDetail;
