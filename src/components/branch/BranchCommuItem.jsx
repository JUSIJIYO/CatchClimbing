import React from 'react';
import personIcon from '../../assets/icon/commuPerson.svg';
import eyeIcon from '../../assets/icon/commuEye.svg';
import commentIcon from '../../assets/icon/commuComment.svg';
import styles from '../../styles/css/branch/BranchCommuItem.module.css';
import { useNavigate } from 'react-router-dom';

function BranchCommuItem({ post }) {
  const navigate = useNavigate();
  return (
    <div
      className={styles['card']}
      onClick={() => navigate(`/post/${post.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles['top']}>
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

        <span>
          {post.createdAt
            ? new Date(post.createdAt.seconds * 1000).toLocaleDateString()
            : ''}
        </span>
      </div>
    </div>
  );
}

export default BranchCommuItem;
