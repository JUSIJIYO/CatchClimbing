import React from 'react';
import personIcon from '../../assets/icon/commuPerson.svg';
import eyeIcon from '../../assets/icon/commuEye.svg';
import commentIcon from '../../assets/icon/commuComment.svg';
import styles from '../../styles/css/branch/BranchCommuItem.module.css';

function BranchCommuItem({ post }) {
  return (
    <div className={styles['card']}>
      <div className={stylestop}>
        <h3>{post.title}</h3>
        <span className={styles.branch}>{post.branch}</span>
      </div>

      <div className={styles.author}>
        <img src={personIcon} alt="" />
        <span>{post.author}</span>
      </div>

      <div className={styles.meta}>
        <div>
          <img src={eyeIcon} alt="" />
          <span>{post.views}</span>
        </div>

        <div>
          <img src={commentIcon} alt="" />
          <span>{post.comments}</span>
        </div>

        <span>{post.time}</span>
      </div>
    </div>
  );
}

export default BranchCommuItem;
