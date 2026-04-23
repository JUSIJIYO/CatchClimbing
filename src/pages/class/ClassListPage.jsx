import ClassCard from '../../components/class/ClassCard';
import styles from '../../styles/css/class/ClassListPage.module.css';
import icon1 from '../../assets/icon/filter.svg';
import { useState, useEffect } from 'react';
import ClassFilterButton from '../../components/class/ClassFilterButton';
import { db } from '../../firebase/config';
import { query, where } from 'firebase/firestore';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import CheckModal from '../../components/common/ChkModal';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import icon5 from '../../assets/icon/profile.svg';

const normalizeBranchName = (name) => name?.replace(/^더클라임\s+/, '') || name;

const branchKey = (name) =>
  name?.replace(/^더클라임\s+/, '').replace(/점$/, '') || name;

function ClassListPage() {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]); // 지점 전체 데이터
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('전체');

  const [isModalOpen, setIsModalOpen] = useState(false); // 확인모달
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); //완료모달
  const [selectedClass, setSelectedClass] = useState(null);
  const [isOverModalOpen, setIsOverModalOpen] = useState(false); // 초과 모달
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false); // 중복신청 방지 모달

  const [isProfessor, setIsProfessor] = useState(false); // 강사 / 학생
  const navigate = useNavigate();

  // firebase class,users 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userSnap = await getDocs(collection(db, 'users'));

        const userMap = {};
        userSnap.docs.forEach((doc) => {
          const data = doc.data();
          userMap[doc.id] = data.profileImg;
        });

        const classSnap = await getDocs(collection(db, 'classes'));

        const result = await Promise.all(
          classSnap.docs.map(async (doc) => {
            const data = doc.data();
            const classId = doc.id;

            const studentQuery = query(
              collection(db, 'classStudents'),
              where('classId', '==', classId)
            );
            const studentSnap = await getDocs(studentQuery);

            return {
              id: classId,
              ...data,
              imageUrl: userMap[data.professorId] || icon5, // fallback 필수
              studentCount: studentSnap.size,
            };
          })
        );

        const validResult = result.filter((item) => item.title);

        setAllData(validResult);
        setData(validResult);

        const branchSnap = await getDocs(collection(db, 'branches'));
        const branchNames = branchSnap.docs
          .map((doc) => normalizeBranchName(doc.data().name))
          .filter(Boolean);

        setBranchList(['전체', ...branchNames]);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  // 지점별 필터
  useEffect(() => {
    if (selectedBranch === '전체') {
      setData(allData);
    } else {
      const filtered = allData.filter(
        (item) => branchKey(item.branchName) === branchKey(selectedBranch)
      );
      setData(filtered);
    }
  }, [selectedBranch, allData]);

  //사용자 구분하는 거
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
        } else {
          setIsProfessor(false);
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
          <div>지점:</div>
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
              onRegisterClick={() => handleRegisterClick(card)}
              onEditClick={() =>
                navigate(`/professor/edit/${card.id}`, {
                  state: { editData: card },
                })
              }
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
          onConfirm={async () => {
            setIsModalOpen(false);

            try {
              const auth = getAuth();
              const user = auth.currentUser;

              if (!user) {
                alert('로그인이 필요합니다.');
                return;
              }

              const userSnap = await getDoc(doc(db, 'users', user.uid));
              const userData = userSnap.data();

              // ✅ 1. 정원 초과 먼저
              if (selectedClass.currentCap >= selectedClass.capacity) {
                setIsOverModalOpen(true);
                return;
              }

              // ✅ 2. 중복 체크
              const q = query(
                collection(db, 'classStudents'),
                where('userId', '==', user.uid),
                where('classId', '==', selectedClass.id)
              );

              const snapshot = await getDocs(q);

              if (!snapshot.empty) {
                setIsCompleteModalOpen(true); // 중복 모달
                return;
              }

              // ✅ 3. 정상 신청
              await addDoc(collection(db, 'classStudents'), {
                userId: user.uid,
                classId: selectedClass.id,
                professorId: selectedClass.professorId,

                name: userData?.name || '이름없음',
                level: userData?.level || 'VB',
                phone: userData?.phone || '',
                email: userData?.email || user.email,

                status: 'pending',
                createdAt: new Date(),
              });

              await updateDoc(doc(db, 'classes', selectedClass.id), {
                currentCap: increment(1),
              });

              setIsConfirmModalOpen(true); // 완료 모달
            } catch (e) {
              console.error('신청 실패:', e);
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
      {/* 정원초과모달 */}
      {isOverModalOpen && (
        <CheckModal
          title="정원초과"
          message="정원이 초과되었습니다."
          onConfirm={() => setIsOverModalOpen(false)}
        />
      )}

      {/* 중복신청모달 */}
      {isCompleteModalOpen && (
        <CheckModal
          message={`${selectedClass?.title}은 이미 신청한 강의입니다.`}
          onConfirm={() => setIsCompleteModalOpen(false)}
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
            onClick={() => navigate('/professor/newclass')}
          >
            강의 등록
          </button>
        </div>
      )}
    </div>
  );
}

export default ClassListPage;
