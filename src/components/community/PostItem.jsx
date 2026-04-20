import React from 'react';
import { useNavigate } from 'react-router-dom';
import personIcon from '../../assets/icon/commuPerson.svg';
import eyeIcon from '../../assets/icon/commuEye.svg';
import commentIcon from '../../assets/icon/commuComment.svg';
import styles from '../../styles/css/branch/BranchCommuItem.module.css';

const branchNameMap = {
  theclimb_hongdae: '홍대점',
  theclimb_gangnam: '강남점',
  theclimb_ilsan: '일산점',
  theclimb_isu: '이수점',
  theclimb_magok: '마곡점',
  theclimb_mullae: '문래점',
  theclimb_nonhyeon: '논현점',
  theclimb_sadang: '사당점',
  theclimb_seongsu: '성수점',
  theclimb_sillim: '신림점',
  theclimb_sinsa: '신사점',
  theclimb_yangjae: '양재점',
  theclimb_yeonnam: '연남점',
};

function PostItem({ post }) {
  const navigate = useNavigate();

  const handleDetailNav = () => {
    navigate(`/post/${post.id}`);
  };

  const displayBranchName =
    branchNameMap[post.branchId] || post.branchId || "전체";

  return (
    <div
      className={styles['card']}
      onClick={handleDetailNav}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles['top']}>
        <h3>{post.title}</h3>
        <span className={styles['branch']}>{displayBranchName}</span>
      </div>

      <div className={styles['author']}>
        <img src={personIcon} alt="" />
        <span>{post.authorName || "익명"}</span>
      </div>

      <div className={styles['meta']}>
        <div>
          <img src={eyeIcon} alt="" />
          <span>{post.viewer || 0}</span>
        </div>

        <div>
          <img src={commentIcon} alt="" />
          <span>{post.commentCount || 0}</span>
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

export default PostItem;