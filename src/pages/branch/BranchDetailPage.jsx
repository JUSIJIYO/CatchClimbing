import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../styles/css/branch/BranchDetailPage.module.css';
import BranchDetail from '../../components/branch/BranchDetail';
import BranchPrfList from '../../components/branch/BranchPrfList';

function BranchDetailPage() {
  const { id } = useParams();
  const [tab, setTab] = useState('info');
  const navigate = useNavigate();

  const branchList = [
    { id: 1, name: '서밋 클라이밍 센터', location: '서울 강남구' },
    { id: 2, name: '볼더 하우스', location: '서울 마포구' },
    { id: 3, name: '서밋 클라이밍 센터', location: '서울 강남구' },
    { id: 4, name: '볼더 하우스', location: '서울 마포구' },
    { id: 5, name: '서밋 클라이밍 센터', location: '서울 강남구' },
    { id: 6, name: '볼더 하우스', location: '서울 마포구' },
    { id: 7, name: '서밋 클라이밍 센터', location: '서울 강남구' },
    { id: 8, name: '볼더 하우스', location: '서울 마포구' },
    { id: 9, name: '서밋 클라이밍 센터', location: '서울 강남구' },
    { id: 10, name: '볼더 하우스', location: '서울 마포구' },
    { id: 11, name: '서밋 클라이밍 센터', location: '서울 강남구' },
    { id: 12, name: '볼더 하우스', location: '서울 마포구' },
    { id: 13, name: '서밋 클라이밍 센터', location: '서울 강남구' },
    { id: 14, name: '볼더 하우스', location: '서울 마포구' },
    { id: 15, name: '서밋 클라이밍 센터', location: '서울 강남구' },
    { id: 16, name: '볼더 하우스', location: '서울 마포구' },
  ];

  const branch = branchList.find((b) => b.id === Number(id));

  return (
    <>
      <section className={styles['banner']}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          <img src="/src/assets/icon/backButton.svg" alt="뒤로가기" />
        </button>
        <img src={branch?.image || '/default.jpg'} alt={branch?.name} />
      </section>

      <header className={styles['detailHeader']}>
        <h2>{branch.name}</h2>
      </header>

      <nav className={styles['tab']}>
        <button
          className={`${styles['button']} ${tab === 'info' ? styles['active'] : ''}`}
          onClick={() => setTab('info')}
        >
          정보
        </button>
        <button
          className={`${styles['button']} ${tab === 'teacher' ? styles['active'] : ''}`}
          onClick={() => setTab('teacher')}
        >
          강사진
        </button>
        <button
          className={`${styles['button']} ${tab === 'community' ? styles['active'] : ''}`}
          onClick={() => setTab('community')}
        >
          커뮤니티
        </button>
        <button
          className={`${styles['button']} ${tab === 'class' ? styles['active'] : ''}`}
          onClick={() => setTab('class')}
        >
          수업
        </button>
      </nav>

      <main className={styles['content']}>
        <div className={styles['container']}>
          {tab === 'info' && <BranchDetail branch={branch} />}
          {tab === 'teacher' && <BranchPrfList />}
        </div>
      </main>
    </>
  );
}

export default BranchDetailPage;
