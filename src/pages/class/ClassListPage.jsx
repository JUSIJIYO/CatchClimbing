import ClassCard from '../../components/class/ClassCard';
import styles from '../../styles/css/class/ClassListPage.module.css';
import icon1 from '../../assets/icon/filter.svg';
import { useState, useEffect } from 'react';
import ClassFilterButton from '../../components/class/ClassFilterButton';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import CheckModal from '../../components/common/ChkModal';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function ClassListPage() {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]); // 지점 전체 데이터
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('전체');

  const [isModalOpen, setIsModalOpen] = useState(false); // 확인모달
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); //완료모달
  const [selectedClass, setSelectedClass] = useState(null);
  const [isOverModalOpen, setIsOverModalOpen] = useState(false); // 초과 모달

  const [isProfessor, setIsProfessor] = useState(false); // 강사 / 학생
  const navigate = useNavigate();

  // firebase class 데이터 가져오기
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'classes'));

        const result = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllData(result);
        setData(result);

        const branches = result.map((item) => item.branchName);
        const uniqueBranches = [...new Set(branches)];

        setBranchList(['전체', ...uniqueBranches]);
      } catch (e) {
        console.error('수업 불러오기 실패:', e);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedBranch === '전체') {
      setData(allData);
    } else {
      const filtered = allData.filter(
        (item) => item.branchName === selectedBranch,
      );
      setData(filtered);
    }
  }, [selectedBranch, allData]);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      const snap = await getDoc(doc(db, 'users', user.uid));

      if (snap.exists()) {
        const data = snap.data();

        // console.log('user data:', data);

        if (data.role === 'professor') {
          setIsProfessor(true);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  //확인 및 모달 클릭 이벤트 함수
  const handleRegisterClick = (card) => {
    setSelectedClass(card);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* 헤더 */}
      <div className={styles['header']}>
        <h1>수업</h1>
        <p>다음 클라이밍 수업을 예약하세요</p>
      </div>

      {/* 필터 */}
      <div className={styles['filter']}>
        <img src={icon1} className={styles['class-filter-icon']} />
        <div className={styles['container']}>
          지점:
          {branchList.map((branch) => (
            <ClassFilterButton
              key={branch}
              label={branch}
              isActive={selectedBranch === branch}
              onClick={() => setSelectedBranch(branch)}
            />
          ))}
        </div>
      </div>

      {/* 리스트 */}
      <div className={styles['class-list-page']}>
        {data.length === 0 ? (
          <p>수업이 없습니다.</p>
        ) : (
          data.map((card) => (
            <ClassCard
              key={card.id}
              {...card}
              isProfessor={isProfessor}
              onRegisterClick={() => handleRegisterClick(card)} // 이걸로 ClassCard에 이벤트보낼거야
            />
          ))
        )}
      </div>

      {/* 확인모달 */}
      {isModalOpen && (
        <Modal
          title="수업 신청"
          message={`${selectedClass?.title} 수업을 신청하시겠습니까?`}
          cancelText="취소"
          confirmText="신청하기"
          onCancel={() => setIsModalOpen(false)}
          onConfirm={() => {
            // console.log("신청 완료:", selectedClass);
            setIsModalOpen(false);

            if (selectedClass.currentCap >= selectedClass.capacity) {
              setIsOverModalOpen(true); // 정원 초과
            } else {
              setIsConfirmModalOpen(true); // 정상 신청
            }
          }}
        />
      )}

      {/* 완료모달  */}
      {isConfirmModalOpen && (
        <ConfirmModal
          message={`${selectedClass?.title} 신청이 완료되었습니다.`}
          onConfirm={() => setIsConfirmModalOpen(false)}
        />
      )}

      {isOverModalOpen && (
        <CheckModal
          title="정원초과"
          message="정원이 초과되었습니다."
          onConfirm={() => setIsOverModalOpen(false)}
        />
      )}

      {isProfessor && (
        <div className={styles.floatingBtnGroup}>
          <button
            className={styles.outlineBtn}
            onClick={() => navigate('/professor/manage')}
          >
            내 강의 조회
          </button>

          <button
            className={styles.mainBtn}
            onClick={() => navigate('/professor/new-class')}
          >
            강의 등록
          </button>
        </div>
      )}
    </div>
  );
}

export default ClassListPage;
