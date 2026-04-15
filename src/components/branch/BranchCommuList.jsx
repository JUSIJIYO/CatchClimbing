import React, { useState } from 'react';
import BranchCommuItem from './BranchCommuItem';
import filterIcon from '../../assets/icon/commuFilter.svg';
import styles from '../../styles/css/branch/BranchCommuList.module.css';
import { useNavigate, useParams } from 'react-router-dom';

function BranchCommuList() {
  const [sort, setSort] = useState('views');
  const navigate = useNavigate();
  const { id } = useParams();

  const posts = [
    {
      id: 1,
      title: 'V3 클라이머를 위한 팁?',
      author: 'climber_123',
      views: 234,
      comments: 12,
      time: '2시간 전',
      branch: '강남점',
    },
    {
      id: 2,
      title: '초보자 질문있어요',
      author: '익명',
      views: 178,
      comments: 15,
      time: '2시간 전',
      branch: '강남점',
    },
    {
      id: 3,
      title: '멀까여',
      author: '익명',
      views: 157,
      comments: 30,
      time: '4시간 전',
      branch: '강남점',
    },
    {
      id: 4,
      title: '멀까여',
      author: '익명',
      views: 157,
      comments: 30,
      time: '6시간 전',
      branch: '강남점',
    },
    {
      id: 5,
      title: '멀까여',
      author: '익명',
      views: 157,
      comments: 30,
      time: '3시간 전',
      branch: '강남점',
    },
  ];

  const sortedPosts = [...posts]
    .sort((a, b) => {
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
