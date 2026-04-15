import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../styles/css/branch/BranchDetailPage.module.css';
import BranchDetail from '../../components/branch/BranchDetail';
import BranchPrfList from '../../components/branch/BranchPrfList';
import BranchPrfDetail from '../../components/branch/BranchPrfDetail';

function BranchDetailPage() {
  const { id } = useParams();
  const [tab, setTab] = useState('info');
  const navigate = useNavigate();
  const [selectedPrf, setSelectedPrf] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

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

  const prfList = [
    {
      id: 1,
      name: '김준호 팀장',
      level: 'V8',
      branch: '서밋 클라이밍 센터',
      career: ['대회 1위', '대회 2위'],
    },
    {
      id: 2,
      name: '이서연 세터',
      level: 'V7',
      branch: '서밋 클라이밍 센터',
      career: ['대회 1위', '대회 2위'],
    },
    {
      id: 3,
      name: '김민수 강사',
      level: 'V6',
      branch: '서밋 클라이밍 센터',
      career: ['대회 1위', '대회 2위'],
    },
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
          {tab === 'teacher' && !selectedPrf && (
            <BranchPrfList
              prfList={prfList}
              onSelect={(prf, index) => {
                setSelectedPrf(prf);
                setSelectedIndex(index);
              }}
            />
          )}
          {tab === 'teacher' && selectedPrf && (
            <BranchPrfDetail
              prf={selectedPrf}
              index={selectedIndex}
              prfList={prfList}
              setSelectedIndex={setSelectedIndex}
              setSelectedPrf={setSelectedPrf}
            />
          )}
        </div>
      </main>
    </>
  );
}

export default BranchDetailPage;
