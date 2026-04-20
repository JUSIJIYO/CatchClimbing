import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import style from '../../styles/css/calendar/ScheduleDetailPage.module.css';
import backIcon from '../../assets/icon/backButton.svg';
import ScheduleDetail from '../../components/calendar/ScheduleDetail';

function ScheduleDetailPage() {
  const navigate = useNavigate();
  const { date } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classQ = query(
          collection(db, 'classes'),
          where('date', '==', date)
        );

        const classSnap = await getDocs(classQ);

        const classes = classSnap.docs.map((doc) => ({
          id: doc.id,
          type: 'class',
          ...doc.data(),
        }));

        const recordQ = query(
          collection(db, 'records'),
          where('visitDate', '==', date)
        );

        const recordSnap = await getDocs(recordQ);

        const records = recordSnap.docs.map((doc) => ({
          id: doc.id,
          type: 'record',
          ...doc.data(),
        }));

        setData([...classes, ...records]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  if (loading) return <div>불러오는 중...</div>;

  return (
    <div className={style.container}>
      <div className={style.topBar}>
        <button onClick={() => navigate(-1)}>
          <img src={backIcon} alt="뒤로가기" />
          목록으로 돌아가기
        </button>
      </div>

      <h2 className={style.title}>{date} 일정</h2>

      <ScheduleDetail data={data} />
    </div>
  );
}

export default ScheduleDetailPage;
