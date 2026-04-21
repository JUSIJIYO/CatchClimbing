import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import PrfClassStuList from '../../components/professor/PrfClassStuList';
import styles from '../../styles/css/professor/PrfClassStuListPage.module.css';
import backButton from '../../assets/icon/backButton.svg';
import headerStyles from '../../styles/css/common/PageHeader.module.css';

function PrfClassStuListPage() {
  const { id } = useParams(); // 수업 id
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const updateStudentStatus = async (studentId, newStatus) => {
    try {
      const docRef = doc(db, 'classStudents', studentId);

      await updateDoc(docRef, {
        status: newStatus,
      });

      // UI 반영
      const updated = students.map((stu) =>
        stu.id === studentId ? { ...stu, status: newStatus } : stu,
      );

      setStudents(updated);

      // 현재 검색어 기준으로 다시 필터
      const filteredData = updated.filter((stu) =>
        stu.name?.toLowerCase().includes(search.toLowerCase()),
      );

      setFiltered(filteredData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // 강의 문서에서 professorId 조회할 수 있게 설정
        const classSnap = await getDoc(doc(db, 'classes', id));
        const professorId = classSnap.exists() ? classSnap.data().professorId : null;

        const q = query(
          collection(db, 'classStudents'),
          where('classId', '==', id),
          ...(professorId ? [where('professorId', '==', professorId)] : []),
        );

        const snapshot = await getDocs(q);

        const result = snapshot.docs.map((data) => ({
          id: data.id,
          ...data.data(),
        }));

        setStudents(result);
        setFiltered(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [id]);
  //  검색
  useEffect(() => {
    const filteredData = students.filter((stu) =>
      stu.name?.toLowerCase().includes(search.toLowerCase()),
    );
    setFiltered(filteredData);
  }, [search, students]);

  if (loading) return <div>불러오는 중...</div>;

  return (
    <>
      <div className={headerStyles.header}>
        <h1>수강생 목록</h1>
        <p>내 수업을 수강하는 수강생을 조회하세요</p>
      </div>
      <div className={styles.container}>
        <div className={styles.backBtn} onClick={() => navigate(-1)}>
          <img src={backButton} alt="뒤로가기" />
          <span>뒤로</span>
        </div>

        <input
          className={styles.search}
          placeholder="이름 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <PrfClassStuList
          students={filtered}
          onUpdateStatus={updateStudentStatus}
        />

        <div className={styles.footer}>총 {students.length}명 수강생</div>
      </div>
    </>
  );
}

export default PrfClassStuListPage;
