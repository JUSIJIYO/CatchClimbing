import React from 'react';
import styles from '../../styles/css/record/RecordDetail.module.css';
import branchIcon from '../../assets/icon/recordDetailBranch.svg';
import timeIcon from '../../assets/icon/recordDeatilTime.svg';
import deleteIcon from '../../assets/icon/recordDelete.svg';
import dateIcon from '../../assets/icon/recordDetailDate.svg';
import descIcon from '../../assets/icon/recordDetailDesc.svg';
import fixIcon from '../../assets/icon/recordDetailFix.svg';
import imageIcon from '../../assets/icon/recordDetailImage.svg';
import tryIcon from '../../assets/icon/recordDetailTry.svg';
import { useState } from 'react';

function RecordDetail({ item, onDelete, onEdit }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const getLevelStyle = (level) => {
    if (!level) return {};

    if (level === 'VB') {
      return {
        bg: '#ffffff',
        color: '#2c3e50',
        border: '1px solid #ddd',
      };
    }

    if (level === 'V0') return { bg: '#ffd43b', color: '#7a5c00' };
    if (level === 'V1') return { bg: '#ff922b', color: '#7c2d00' };
    if (level === 'V2') return { bg: '#51cf66', color: '#1b5e20' };
    if (level === 'V3') return { bg: '#339af0', color: '#0b3d91' };
    if (level === 'V4') return { bg: '#ff6b6b', color: '#7f1d1d' };
    if (level === 'V5') return { bg: '#f783ac', color: '#9d174d' };
    if (level === 'V6') return { bg: '#b197fc', color: '#4b2e83' };
    if (level === 'V7') return { bg: '#adb5bd', color: '#343a40' };
    if (level === 'V8') return { bg: '#c68642', color: '#5c3d2e' };

    return {
      bg: '#212529',
      color: '#ffffff',
    };
  };
  const style = getLevelStyle(item.level);

  if (!item) return null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.topRow}>
          <h2>{item.title}</h2>

          <div
            className={styles.level}
            style={{
              backgroundColor: style.bg,
              color: style.color,
              border: style.border || 'none',
            }}
          >
            {item.level}
          </div>
        </div>

        <div className={styles.actionRow}>
          <button className={styles.editBtn} onClick={onEdit}>
            <img src={fixIcon} alt="" />
            수정
          </button>

          <button className={styles.deleteBtn} onClick={onDelete}>
            <img src={deleteIcon} alt="" />
            삭제
          </button>
        </div>
      </div>
      <div className={styles.divider}></div>

      <div className={styles.info}>
        <p>
          <img src={branchIcon} alt="" />
          <span className={styles.label}>지점:</span>
          <span className={styles.value}>{item.branchName}</span>
        </p>

        <p>
          <img src={dateIcon} alt="" />
          <span className={styles.label}>날짜:</span>
          <span className={styles.value}>{item.visitDate}</span>
        </p>

        <p>
          <img src={timeIcon} alt="" />
          <span className={styles.label}>시간:</span>
          <span className={styles.value}>
            {item.startTime && item.endTime
              ? `${item.startTime} ~ ${item.endTime}`
              : '정보 없음'}
          </span>
        </p>

        <p>
          <img src={tryIcon} alt="" />
          <span className={styles.label}>시도한 문제 수:</span>
          <span className={styles.value}>{item.tryCount}회</span>
        </p>
      </div>
      <div className={styles.divider}></div>

      <div className={styles.section}>
        <p>
          <img src={descIcon} alt="" />
          문제 설명
        </p>
        <p>{item.description}</p>
      </div>
      <div className={styles.divider}></div>

      <div className={styles.section}>
        <p>
          <img src={descIcon} alt="" />
          메모
        </p>
        <p>{item.memo}</p>
      </div>
      <div className={styles.divider}></div>

      <div className={styles.section}>
        <p>
          <img src={imageIcon} alt="" />
          사진
        </p>
        <div className={styles.imageList}>
          {Array.isArray(item.image) ? (
            item.image.map((img, idx) => (
              <img
                key={idx}
                src={img}
                className={styles.image}
                onClick={() => setSelectedImage(img)}
              />
            ))
          ) : item.image ? (
            <img
              src={item.image}
              className={styles.image}
              onClick={() => setSelectedImage(item.image)}
            />
          ) : null}
        </div>
      </div>

      {selectedImage && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className={styles.modalImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default RecordDetail;
