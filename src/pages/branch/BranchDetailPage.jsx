import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../styles/css/branch/BranchDetailPage.module.css';
import BranchDetail from '../../components/branch/BranchDetail';
import BranchPrfList from '../../components/branch/BranchPrfList';
import BranchPrfDetail from '../../components/branch/BranchPrfDetail';
import BranchCommuList from '../../components/branch/BranchCommuList';
import Modal from '../../components/common/Modal';
import BranchReviewList from '../../components/branch/BranchReviewList';
import BranchClassCard from '../../components/branch/BranchClassCard';
import ConfirmModal from '../../components/common/ConfirmModal';
import { db } from '../../firebase/config';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

function BranchDetailPage() {
  const [prfList, setPrfList] = useState([]);
  const [branch, setBranch] = useState(null);
  const { id } = useParams();
  const [tab, setTab] = useState('info');
  const navigate = useNavigate();
  const [selectedPrf, setSelectedPrf] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const isLogin = false; // 테스트용
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleOpenModal = (type) => {
    if (!isLogin) {
      setShowModal(true); // 로그인 모달
      return;
    }
    if (type === 'detail') {
      navigate(`/class/${classId}`);
    }
    if (type === 'apply') {
      setModalInfo('apply'); // 신청 모달
    }
  };

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          where('role', '==', 'professor'),
          where('branchId', '==', id),
        );

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => {
          const d = doc.data();

          return {
            id: doc.id,
            name: d.name,
            level: d.level,
            profile: d.profileImg,
            career: d.career || [],
          };
        });

        setPrfList(data);
      } catch (e) {
        console.error('강사 불러오기 실패:', e);
      }
    };

    fetchProfessors();
  }, [id]);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const docRef = doc(db, 'branches', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBranch({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('해당 지점 없음');
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchBranch();
  }, [id]);

  useEffect(() => {
    if (tab !== 'teacher') {
      setSelectedPrf(null);
      setSelectedIndex(null);
    }
  }, [tab]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showModal]);

  if (!branch) return <div>로딩중...</div>;

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
          onClick={() => {
            setTab('community');

            if (!isLogin) {
              setShowModal(true);
            }
          }}
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
          {tab === 'community' && isLogin && (
            <>
              <BranchCommuList />
              <BranchReviewList branch={branch} />
            </>
          )}
          {tab === 'class' && (
            <BranchClassCard branchId={id} onOpenModal={handleOpenModal} />
          )}
        </div>
      </main>

      {showModal && (
        <Modal
          title="로그인"
          message="로그인을 먼저 진행해주세요"
          cancelText="취소"
          confirmText="로그인하러 가기"
          onCancel={() => setShowModal(false)}
          onConfirm={() => navigate('/login')}
        />
      )}
      {modalInfo === 'apply' && (
        <Modal
          title="수업 신청"
          message="이 수업을 신청하시겠습니까?"
          cancelText="취소"
          confirmText="신청하기"
          onCancel={() => setModalInfo(null)}
          onConfirm={() => {
            setModalInfo(null); // 기존 모달 닫고
            setConfirmOpen(true); // 완료 모달 열기
          }}
        />
      )}
      {confirmOpen && (
        <ConfirmModal
          message="수업 신청이 완료되었습니다."
          onConfirm={() => setConfirmOpen(false)}
        />
      )}
    </>
  );
}

export default BranchDetailPage;
