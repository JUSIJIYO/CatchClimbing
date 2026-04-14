import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../styles/css/branch/BranchDetailPage.module.css';

function BranchDetailPage() {
  const { id } = useParams();
  const [tab, setTab] = useState('info');
  const navigate = useNavigate();

  const branch = {
    name: '서밋 클라이밍 센터',
    location: '서울 강남구',
    image: '/default.jpg',
  };

  return (
    <>
      <section className={styles['banner']}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          <img src="/src/assets/icon/backButton.svg" alt="뒤로가기" />
        </button>
        <img src={branch.image} alt={branch.name} />
      </section>

      <header className={styles['detailHeader']}>
        <h2>{branch.name}</h2>
      </header>

      <nav className={styles['tab']}>
        <button
          className={`${styles.button} ${tab === 'info' ? styles.active : ''}`}
          onClick={() => setTab('info')}
        >
          정보
        </button>
        <button
          className={`${styles.button} ${tab === 'teacher' ? styles.active : ''}`}
          onClick={() => setTab('teacher')}
        >
          강사진
        </button>
        <button
          className={`${styles.button} ${tab === 'community' ? styles.active : ''}`}
          onClick={() => setTab('community')}
        >
          커뮤니티
        </button>
        <button
          className={`${styles.button} ${tab === 'class' ? styles.active : ''}`}
          onClick={() => setTab('class')}
        >
          수업
        </button>
      </nav>

      {/* <main className={styles['content']}>
        {tab == 'info' && <section>정보</section>}
        {tab == 'teacher' && <section>강사진</section>}
        {tab == 'community' && <section>커뮤니티</section>}
        {tab == 'class' && <section>수업</section>}
      </main> */}
    </>
  );
}

export default BranchDetailPage;
