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
  onSnapshot,
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
        stu.id === studentId ? { ...stu, status: newStatus } : stu
      );

      setStudents(updated);

      // 현재 검색어 기준으로 다시 필터
      const filteredData = updated.filter((stu) =>
        stu.name?.toLowerCase().includes(search.toLowerCase())
      );

      setFiltered(filteredData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, 'classStudents'),
      where('classId', '==', id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStudents(data);
      setFiltered(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  //  검색
  useEffect(() => {
    const filteredData = students.filter((stu) =>
      stu.name?.toLowerCase().includes(search.toLowerCase())
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
