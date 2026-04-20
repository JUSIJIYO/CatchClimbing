import React, { useState } from 'react';
import BranchCommuItem from './BranchCommuItem';
import filterIcon from '../../assets/icon/commuFilter.svg';
import styles from '../../styles/css/branch/BranchCommuList.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase/config';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from 'firebase/firestore';
import { useEffect } from 'react';

function BranchCommuList() {
  // 정렬 기준 상태 (latest / views / comments)
  const [sort, setSort] = useState('latest');
  const navigate = useNavigate();
  const { id } = useParams(); // 현재 지점 id

  const formatBranchName = (name) => {
    if (!name) return '';

    // "더클라임 "으로 시작하면 제거
    if (name.startsWith('더클라임 ')) {
      return name.replace('더클라임 ', '');
    }

    return name;
  };

  // 게시글 리스트 상태
  const [posts, setPosts] = useState([]);

  // 시간 포맷 함수 (timestamp → "몇분 전" 형태)
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

  // 게시글 가져오기 (해당 지점 기준)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // branchId 기준으로 posts 필터링
        const q = query(collection(db, 'posts'), where('branchId', '==', id));

        const snapshot = await getDocs(q);
        // firestore 데이터 → UI용 데이터 변환
        const data = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const d = docSnap.data();

            // branch 정보 가져오기
            const branchRef = doc(db, 'branches', d.branchId);
            const branchSnap = await getDoc(branchRef);
            const branchData = branchSnap.exists() ? branchSnap.data() : null;

            return {
              id: docSnap.id,
              title: d.title,
              author: d.isAnonymous ? '익명' : d.authorName,
              views: d.viewer || 0,
              comments: d.commentCount || 0,
              branch: formatBranchName(branchData?.name) || '지점 없음',

              time: formatTime(d.createdAt),
              createdAt: d.createdAt?.toDate(),
            };
          })
        );

        setPosts(data);
      } catch (e) {
        console.error('게시글 불러오기 실패:', e);
      }
    };

    if (id) fetchPosts();
  }, [id]);

  // 정렬 + 최신 3개만 표시
  const sortedPosts = [...posts]
    .sort((a, b) => {
      if (sort === 'latest') return b.createdAt - a.createdAt;
      if (sort === 'views') return b.views - a.views;
      if (sort === 'comments') return b.comments - a.comments;
      return 0;
    })
    .slice(0, 3);

  // 커뮤니티 페이지로 이동
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
