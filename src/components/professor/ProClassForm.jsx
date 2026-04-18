import { useState, useEffect } from 'react';
import styles from '../../styles/css/professor/PrfClassForm.module.css';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/css/professor/ProClassForm.module.css';

function PrfClassForm({ onSuccess, onCancle }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    branchName: '강남점',
    level: '',
    capacity: '',
    classMoney: '',
    day: '',
    startHour: '',
    startMin: '',
    endHour: '',
    endMin: '',
  });

  const navigate = useNavigate();

  const branchMap = {
    theclimb_hongdae: '홍대점',
    theclimb_gangnam: '강남점',
    theclimb_ilsan: '일산점',
    theclimb_isu: '이수점',
    theclimb_magok: '마곡점',
    theclimb_mullae: '문래점',
    theclimb_nonhyeon: '논현점',
    theclimb_sadang: '사당점',
    theclimb_seongsu: '성수점',
    theclimb_sillim: '신림점',
    theclimb_sinsa: '신사점',
    theclimb_yangjae: '양재점',
    theclimb_yeonnam: '연남점',
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, 'users', user.uid));

      if (snap.exists()) {
        const data = snap.data();

        setForm((prev) => ({
          ...prev,
          branchName: branchMap[data.branchId],
        }));
      }
    };

    fetchUser();
  }, []);

  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    setError({
      ...error,
      [name]: '',
    });
  };

  const validate = () => {
    let newError = {};

    if (!form.title) newError.title = '수업명을 입력해주세요';
    if (!form.description) newError.description = '수업 설명을 입력해주세요';
    if (!form.level) newError.level = '난이도를 선택해주세요';
    if (!form.capacity) newError.capacity = '수강 인원을 입력해주세요';
    if (!form.classMoney) newError.classMoney = '수강료를 입력해주세요';
    if (!form.day) newError.day = '요일을 선택해주세요';

    if (!form.startHour || !form.startMin || !form.endHour || !form.endMin) {
      newError.time = '수업 시간을 입력해주세요';
    }
    if (
      `${form.startHour}:${form.startMin}` >= `${form.endHour}:${form.endMin}`
    ) {
      newError.time = '종료 시간이 시작 시간보다 늦어야 합니다';
    }

    setError(newError);

    return Object.keys(newError).length === 0;
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, '0'),
  );

  const minutes = ['00', '10', '20', '30', '40', '50'];

  const handleSubmit = async () => {
    if (!validate()) return;

    const user = getAuth().currentUser;
    if (!user) return;

    const openDate = `${form.day} ${form.startHour}:${form.startMin} ~ ${form.endHour}:${form.endMin}`;

    // branchName → branchId 변환
    const reverseBranchMap = Object.fromEntries(
      Object.entries(branchMap).map(([k, v]) => [v, k]),
    );

    const branchId = reverseBranchMap[form.branchName];

    try {
      await addDoc(collection(db, 'classes'), {
        professorId: user.uid,
        title: form.title,
        professorName: user.email,
        openDate,
        branchName: form.branchName,
        branchId: branchId,
        level: form.level,
        classMoney: Number(form.classMoney),
        capacity: Number(form.capacity),
        currentCap: 0,
        description: form.description,
        createdAt: serverTimestamp(),
      });

      alert('수업 등록 완료');
      onSuccess && onSuccess();
    } catch (e) {
      console.error(e);
      alert('등록 실패');
    }
  };

  return (
    <div className={styles.container}>
      <h2>새 수업 등록</h2>

      <input
        name="title"
        placeholder="수업명"
        value={form.title}
        onChange={handleChange}
      />
      {error.title && <p className={styles.error}>{error.title}</p>}

      <textarea
        name="description"
        placeholder="수업 설명"
        value={form.description}
        onChange={handleChange}
      />
      {error.description && <p className={styles.error}>{error.description}</p>}

      <select name="branchName" value={form.branchName} onChange={handleChange}>
        {Object.values(branchMap).map((branch) => (
          <option key={branch} value={branch}>
            {branch}
          </option>
        ))}
      </select>

      <select name="level" value={form.level} onChange={handleChange}>
        <option value="">난이도 선택</option>
        <option value="VB">VB</option>
        <option value="V0">V0</option>
        <option value="V1">V1</option>
        <option value="V2">V2</option>
        <option value="V3">V3</option>
        <option value="V4">V4</option>
        <option value="V5">V5</option>
        <option value="V6">V6</option>
        <option value="V7">V7</option>
        <option value="V8">V8</option>
        <option value="V8+">V8+</option>
      </select>
      {error.level && <p className={styles.error}>{error.level}</p>}

      <input
        name="capacity"
        type="number"
        placeholder="최대 인원"
        value={form.capacity}
        onChange={handleChange}
      />
      {error.capacity && <p className={styles.error}>{error.capacity}</p>}

      <input
        name="classMoney"
        type="number"
        placeholder="수강료"
        value={form.classMoney}
        onChange={handleChange}
      />
      {error.classMoney && <p className={styles.error}>{error.classMoney}</p>}

      <select name="day" value={form.day} onChange={handleChange}>
        <option value="">요일 선택</option>
        <option value="월">월</option>
        <option value="화">화</option>
        <option value="수">수</option>
        <option value="목">목</option>
        <option value="금">금</option>
      </select>
      {error.day && <p className={styles.error}>{error.day}</p>}

      <div className={styles.time}>
        <select name="startHour" value={form.startHour} onChange={handleChange}>
          <option value="">시</option>
          {hours.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <select name="startMin" value={form.startMin} onChange={handleChange}>
          <option value="">분</option>
          {minutes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        ~
        <select name="endHour" value={form.endHour} onChange={handleChange}>
          <option value="">시</option>
          {hours.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <select name="endMin" value={form.endMin} onChange={handleChange}>
          <option value="">분</option>
          {minutes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      {error.time && <p className={styles.error}>{error.time}</p>}

      <div className={styles.buttonGroup}>
        <button className={styles.cancleBtn} onClick={() => navigate(-1)}>
          취소
        </button>

        <button className={styles.saveBtn} onClick={handleSubmit}>
          수업 등록
        </button>
      </div>
    </div>
  );
}

export default PrfClassForm;
