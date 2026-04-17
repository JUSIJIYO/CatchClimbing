import React, { useState } from 'react';
import BranchCommuItem from './BranchCommuItem';
import filterIcon from '../../assets/icon/commuFilter.svg';
import styles from '../../styles/css/branch/BranchCommuList.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect } from 'react';

function BranchCommuList() {
  const [sort, setSort] = useState('latest');
  const navigate = useNavigate();
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const formatTime = (timestamp) => {
    if (!timestamp) return '';

    const now = new Date();
    const created = timestamp.toDate();
    const diff = (now - created) / 1000;

    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;

    return `${Math.floor(diff / 86400)}일 전`;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), where('branchId', '==', id));

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => {
          const d = doc.data();

          return {
            id: doc.id,
            title: d.title,
            author: d.isAnonymous ? '익명' : d.authorName,
            views: d.viewer || 0,
            comments: d.commentCount || 0,
            branch: d.branchId,
            time: formatTime(d.createdAt),
            createdAt: d.createdAt?.toDate(),
          };
        });

        setPosts(data);
      } catch (e) {
        console.error('게시글 불러오기 실패:', e);
      }
    };

    if (id) fetchPosts();
  }, [id]);

  const sortedPosts = [...posts]
    .sort((a, b) => {
      if (sort === 'latest') return b.createdAt - a.createdAt;
      if (sort === 'views') return b.views - a.views;
      if (sort === 'comments') return b.comments - a.comments;
      return 0;
    })
    .slice(0, 3);

  const handleMoveCommunity = () => {
    navigate(id ? `/community?branch=${id}` : '/community');
  };

  return (
    <div className={styles['branch-wrapper']}>
      <div className={styles['branch-header']}>
        <h2>전체 게시글</h2>
        <button
          className={styles['branch-moreBtn']}
          onClick={handleMoveCommunity}
        >
          조회하기
        </button>
      </div>

      <div className={styles['branch-filter']}>
        <img src={filterIcon} alt="" className={styles['filter-icon']} />
        <span>정렬 :</span>

        <button
          className={sort === 'views' ? styles['branch-active'] : ''}
          onClick={() => setSort('views')}
        >
          조회순
        </button>

        <button
          className={sort === 'comments' ? styles['branch-active'] : ''}
          onClick={() => setSort('comments')}
        >
          댓글순
        </button>
      </div>

      <div className={styles['branch-list']}>
        {sortedPosts.map((post) => (
          <BranchCommuItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default BranchCommuList;
