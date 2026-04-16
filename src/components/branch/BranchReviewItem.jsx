import React from 'react';
import styles from '../../styles/css/branch/BranchReviewItem.module.css';
import star from '../../assets/icon/reviewstar.svg';

function BranchReviewItem({ review }) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.rating}>
          <img src={star} alt="별점" />
          <span>{review.rating}</span>
        </div>
        <span className={styles.branch}>{review.branch}</span>
      </div>
      <h3 className={styles.title}>{review.title}</h3>
      <p className={styles.content}>{review.content}</p>
      <div className={styles.bottom}>
        <span>{review.author}</span>
        <span>{review.date}</span>
      </div>
    </div>
  );
}

export default BranchReviewItem;
