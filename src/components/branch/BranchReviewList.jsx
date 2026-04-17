import React, { useState } from 'react';
import BranchReviewItem from './BranchReviewItem';
import styles from '../../styles/css/branch/BranchReviewList.module.css';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect } from 'react';

function BranchReviewList({ branch }) {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  const latestReviews = [...reviews]
    .sort((a, b) => {
      const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
      const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
      return dateB - dateA;
    })
    .slice(0, 3);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, 'reviews'),
          where('branchId', '==', branch.id),
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => {
          const d = doc.data();

          return {
            id: doc.id,
            rating: d.rating ?? 0,
            title: d.title,
            content: d.content,
            author: d.isAnonymous ? '익명' : d.authorName,
            date: d.createdAt,
            branch: d.branchId,
          };
        });

        setReviews(data);
      } catch (e) {
        console.error('리뷰 불러오기 실패:', e);
      }
    };

    if (branch?.id) fetchReviews();
  }, [branch]);

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
