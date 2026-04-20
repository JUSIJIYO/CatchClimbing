import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
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

  // 수강생 가져오기
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const q = query(
          collection(db, 'classStudents'),
          where('classId', '==', id),
        );

        const snapshot = await getDocs(q);

        const result = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 여기서 처리해야 함
        if (result.length === 0) {
          const dummy = [
            {
              id: '1',
              name: '김민지',
              level: 'V4',
              phone: '010-1234-1234',
              email: 'test1@naver.com',
              status: 'approved',
            },
            {
              id: '2',
              name: '박지훈',
              level: 'V5',
              phone: '010-5678-5678',
              email: 'test2@naver.com',
              status: 'pending',
            },
          ];

          setStudents(dummy);
          setFiltered(dummy);
        } else {
          setStudents(result);
          setFiltered(result);
        }
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

        <PrfClassStuList students={filtered} />

        <div className={styles.footer}>총 {filtered.length}명 수강생</div>
      </div>
    </>
  );
}

export default PrfClassStuListPage;
