import React from 'react';
import styles from '../../styles/css/branch/BranchReviewItem.module.css';
import star from '../../assets/icon/reviewstar.svg';

function BranchReviewItem({ review }) {
  return (
    <div className={styles['branch-card']}>
      <div className={styles['branch-top']}>
        <div className={styles['branch-rating']}>
          <img src={star} alt="별점" />
          <span>{review.rating}</span>
        </div>
        <span className={styles['branch-branch']}>{review.branch}</span>
      </div>

      <p className={styles['branch-content']}>{review.content}</p>

      <div className={styles['branch-bottom']}>
        <span>{review.author}</span>
        <span>{review.date}</span>
      </div>
    </div>
  );
}

export default BranchReviewItem;
