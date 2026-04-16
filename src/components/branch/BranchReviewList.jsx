import React, { useState } from 'react';
import BranchReviewItem from './BranchReviewItem';
import styles from '../../styles/css/branch/BranchReviewList.module.css';
import { useNavigate } from 'react-router-dom';

function BranchReviewList({ branch }) {
  const navigate = useNavigate();

  const reviews = [
    {
      id: 1,
      rating: 5,
      title: '강사님이 정말 좋아요!',
      content:
        '처음 시작할 때 너무 친절하게 가르쳐주셔서 금방 적응할 수 있었습니다. 시설도 깨끗하고 좋아요!',
      author: '익명',
      date: '2026-04-01',
      branch: '강남점',
    },
    {
      id: 2,
      rating: 4,
      title: '시설이 깨끗하고 좋아요',
      content: '가나다라',
      author: '익명',
      date: '2026-03-25',
      branch: '강남점',
    },
    {
      id: 3,
      rating: 4.5,
      title: '시설이 깨끗하고 좋아요',
      content: '가나다라',
      author: '익명',
      date: '2026-03-26',
      branch: '강남점',
    },
    {
      id: 4,
      rating: 3,
      title: '그럭저럭',
      content: '가나다라',
      author: '익명',
      date: '2026-03-26',
      branch: '강남점',
    },
  ];

  const latestReviews = [...reviews]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return (
    <div className={styles['branch-wrapper']}>
      <div className={styles['branch-header']}>
        <h2>전체 리뷰</h2>
        <button
          className={styles['branch-moreBtn']}
          onClick={() => navigate('/community/review')}
        >
          조회하기
        </button>
      </div>

      <div className={styles['branch-box']}>
        <span className={styles['label']}>지점 : </span>
        <span className={styles['branch-name']}>{branch?.name}</span>
      </div>

      <div className={styles['branch-list']}>
        {latestReviews.map((review) => (
          <BranchReviewItem key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}

export default BranchReviewList;
