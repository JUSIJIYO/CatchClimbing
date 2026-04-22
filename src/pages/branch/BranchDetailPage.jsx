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
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

function BranchDetailPage() {
  const [userRole, setUserRole] = useState(null);
  const [appliedClasses, setAppliedClasses] = useState([]);
  const [user, setUser] = useState(null);
  const [prfList, setPrfList] = useState([]);
  const [branch, setBranch] = useState(null);
  const { id } = useParams();
  const [tab, setTab] = useState('info');
  const navigate = useNavigate();
  const [selectedPrf, setSelectedPrf] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleOpenModal = (type, classId) => {
    if (!user) {
      setShowModal(true);
      return;
    }

    if (type === 'detail') {
      navigate(`/class/${classId}`);
    }

    if (type === 'apply') {
      setSelectedClassId(classId);
      setModalInfo('apply');
    }
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!branch) return;

    const fetchProfessors = async () => {
      try {
        const [snapByName, snapById] = await Promise.all([
          getDocs(query(collection(db, 'users'), where('role', '==', 'professor'), where('branchId', '==', branch.name))),
          getDocs(query(collection(db, 'users'), where('role', '==', 'professor'), where('branchId', '==', id))),
        ]);

        const seen = new Set();
        const data = [...snapByName.docs, ...snapById.docs]
          .filter((doc) => {
            if (seen.has(doc.id)) return false;
            seen.add(doc.id);
            return true;
          })
          .map((doc) => {
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
  }, [branch]);

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

  useEffect(() => {
    if (!user) return;

    const fetchApplications = async () => {
      try {
        const q = query(
          collection(db, 'applications'),
          where('uid', '==', user.uid),
        );

        const snapshot = await getDocs(q);

        const classIds = snapshot.docs.map((doc) => doc.data().classId);

        setAppliedClasses(classIds);
      } catch (e) {
        console.error('신청 목록 불러오기 실패:', e);
      }
    };

    fetchApplications();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchUserRole = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          setUserRole(snap.data().role);
        }
      } catch (e) {
        console.error('유저 정보 가져오기 실패:', e);
      }
    };

    fetchUserRole();
  }, [user]);

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
          className={`${styles['button']} ${
            tab === 'community' ? styles['active'] : ''
          }`}
          onClick={() => {
            if (!user) {
              setShowModal(true);
              return;
            }
            setTab('community');
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
              branch={branch}
            />
          )}
          {tab === 'community' && user && (
            <>
              <BranchCommuList />
              <BranchReviewList branch={branch} />
            </>
          )}
          {tab === 'class' && (
            <BranchClassCard
              branchId={id}
              onOpenModal={handleOpenModal}
              appliedClasses={appliedClasses}
              userRole={userRole}
            />
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
          onConfirm={async () => {
            try {
              if (appliedClasses.includes(selectedClassId)) {
                alert('이미 신청한 수업입니다');
                return;
              }

              await addDoc(collection(db, 'applications'), {
                uid: user.uid,
                classId: selectedClassId,
                branchId: id,
                createdAt: serverTimestamp(),
              });

              setAppliedClasses((prev) => [...prev, selectedClassId]);
              setModalInfo(null);
              setConfirmOpen(true);
            } catch (e) {
              console.error(e);
              alert('신청 실패');
            }
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
