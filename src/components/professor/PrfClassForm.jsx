import { useState, useEffect } from 'react';
import styles from '../../styles/css/professor/PrfClassForm.module.css';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getAuth } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import backButton from '../../assets/icon/backButton.svg';
import Modal from '../../components/common/Modal';
import DoneModal from '../../components/common/ConfirmModal';
import ChkModal from '../../components/common/ChkModal';

function PrfClassForm({ onSuccess, onCancle }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    branchName: '',
    level: '',
    capacity: '',
    classMoney: '',
    day: '',
    startTime: '',
    endTime: '',
    date: '',
  });

  const location = useLocation();
  const editData = location.state?.editData;

  const isEditMode = !!editData;
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDupModal, setShowDupModal] = useState(false);

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
      if (!user || editData) return;

      const snap = await getDoc(doc(db, 'users', user.uid));

      if (snap.exists()) {
        const data = snap.data();

        const branch = branchMap[data.branchId];

        if (branch) {
          setForm((prev) => ({
            ...prev,
            branchName: branch,
          }));
        }
      }
    };

    fetchUser();
  }, [editData]);

  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'date') {
      const day = getDayFromDate(value);

      setForm({
        ...form,
        date: value,
        day,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }

    setError({
      ...error,
      [name]: '',
    });
  };

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title,
        date: editData.date || '',
        description: editData.description,
        branchName: editData.branchName,
        level: editData.level,
        capacity: editData.capacity,
        classMoney: editData.classMoney,
        day: editData.date ? getDayFromDate(editData.date) : '',
        startTime: editData.openDate?.split(' ')[1] || '',
        endTime: editData.openDate?.split(' ')[3] || '',
      });
    }
  }, [editData]);

  const handleRealSubmit = async () => {
    const user = getAuth().currentUser;
    if (!user) return;

    setLoading(true);

    const openDate = `${form.day} ${form.startTime} ~ ${form.endTime}`;

    const reverseBranchMap = Object.fromEntries(
      Object.entries(branchMap).map(([k, v]) => [v, k])
    );

    const branchId = reverseBranchMap[form.branchName];

    try {
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      const userData = userSnap.data();
      if (isEditMode) {
        // 수정 모드
        await updateDoc(doc(db, 'classes', editData.id), {
          title: form.title,
          openDate,
          date: form.date,
          branchName: form.branchName,
          branchId,
          level: form.level,
          classMoney: Number(form.classMoney),
          capacity: Number(form.capacity),
          description: form.description,
        });
      } else {
        // 등록 모드
        await addDoc(collection(db, 'classes'), {
          professorId: user.uid,
          title: form.title,
          professorName: userData.name,
          openDate,
          date: form.date,
          branchName: form.branchName,
          branchId,
          level: form.level,
          classMoney: Number(form.classMoney),
          capacity: Number(form.capacity),
          currentCap: 0,
          description: form.description,
          createdAt: serverTimestamp(),
        });
      }

      setShowDoneModal(true);
    } catch (e) {
      console.error(e);
      alert(isEditMode ? '수정 실패' : '등록 실패');
    } finally {
      setLoading(false);
    }
  };

  const checkDuplicateClass = async () => {
    const user = getAuth().currentUser;
    if (!user) return false;

    const q = query(
      collection(db, 'classes'),
      where('professorId', '==', user.uid),
      where('date', '==', form.date)
    );

    const snap = await getDocs(q);

    const newStart = convertToMin(form.startTime);
    const newEnd = convertToMin(form.endTime);

    for (let docSnap of snap.docs) {
      const data = docSnap.data();

      // 수정 모드면 자기 자신 제외
      if (isEditMode && docSnap.id === editData.id) continue;

      const existStart = convertToMin(data.openDate.split(' ')[1]);
      const existEnd = convertToMin(data.openDate.split(' ')[3]);

      // 시간 겹침 체크
      if (newStart < existEnd && newEnd > existStart) {
        return true;
      }
    }

    return false;
  };

  const convertToMin = (time) => {
    const [h, m] = time.split(':');
    return Number(h) * 60 + Number(m);
  };

  const validate = () => {
    let newError = {};

    const [sh = '', sm = ''] = form.startTime.split(':');
    const [eh = '', em = ''] = form.endTime.split(':');

    if (!form.title) newError.title = '수업명을 입력해주세요';
    if (!form.description) newError.description = '수업 설명을 입력해주세요';
    if (!form.level) newError.level = '난이도를 선택해주세요';
    if (!form.capacity) newError.capacity = '수강 인원을 입력해주세요';
    if (!form.classMoney) newError.classMoney = '수강료를 입력해주세요';
    // if (!form.day) newError.day = '요일을 선택해주세요';
    if (!form.date) newError.date = '날짜를 선택해주세요';
    if (!form.branchName) {
      newError.branchName = '지점 정보를 불러오는 중입니다';
    }

    if (!sh || !sm || !eh || !em) {
      newError.time = '수업 시간을 입력해주세요';
    } else {
      const start = Number(sh) * 60 + Number(sm);
      const end = Number(eh) * 60 + Number(em);

      if (end <= start) {
        newError.time = '종료 시간이 시작 시간보다 늦어야 합니다';
      }
    }

    setError(newError);

    return Object.keys(newError).length === 0;
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, '0')
  );

  const getDayFromDate = (dateStr) => {
    const days = [
      '일요일',
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일',
    ];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  const minutes = ['00', '10', '20', '30', '40', '50'];

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <img src={backButton} alt="뒤로가기" />
        <span>수업 목록으로 돌아가기</span>
      </button>
      <div className={styles.card}>
        <div className={styles.section}>
          <h3>기본 정보</h3>

          <div className={styles.field}>
            <label className={styles.label}>수업명 *</label>
            <input
              name="title"
              placeholder="예: 초급 볼더링"
              value={form.title}
              onChange={handleChange}
            />
            {error.title && <p className={styles.error}>{error.title}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>수업 설명 *</label>
            <textarea
              name="description"
              placeholder="수업에 대한 상세한 설명을 입력하세요"
              value={form.description}
              onChange={handleChange}
            />
            {error.description && (
              <p className={styles.error}>{error.description}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>지점 *</label>

            <select
              name="branchName"
              value={form.branchName || ''}
              onChange={handleChange}
            >
              {Object.values(branchMap).map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.section}>
          <h3>수업 상세</h3>

          <div className={styles.row3}>
            <div className={styles.field}>
              <label>난이도 *</label>
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
            </div>

            <div className={styles.field}>
              <label>최대 수강 인원 *</label>
              <div className={styles.inputWithUnit}>
                <input
                  name="capacity"
                  type="number"
                  value={form.capacity}
                  onChange={handleChange}
                />
                <span>명</span>
              </div>
              {error.capacity && (
                <p className={styles.error}>{error.capacity}</p>
              )}
            </div>

            <div className={styles.field}>
              <label>수강료</label>
              <div className={styles.inputWithUnit}>
                <input
                  name="classMoney"
                  type="number"
                  value={form.classMoney}
                  onChange={handleChange}
                />
                <span>원</span>
              </div>
              {error.classMoney && (
                <p className={styles.error}>{error.classMoney}</p>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label>수업 일정 *</label>

            <div className={styles.timeBox}>
              <div className={styles.dateRow}>
                <div className={styles.dateBox}>
                  <div className={styles.dateLeft}>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.dateRight}>
                    <span className={styles.dayPreview}>{form.day}</span>
                  </div>
                </div>
                {error.date && <p className={styles.error}>{error.date}</p>}
              </div>

              <div className={styles.timeRow}>
                <div className={styles.timeGroup}>
                  <select
                    value={form.startTime.split(':')[0] || ''}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        startTime: `${e.target.value}:${
                          prev.startTime.split(':')[1] || '00'
                        }`,
                      }))
                    }
                  >
                    <option value="">시</option>
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <span>시</span>

                  <select
                    value={form.startTime.split(':')[1] || ''}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        startTime: `${prev.startTime.split(':')[0] || '00'}:${
                          e.target.value
                        }`,
                      }))
                    }
                  >
                    <option value="">분</option>
                    {minutes.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <span>분</span>
                </div>

                <span className={styles.tilde}>~</span>

                <div className={styles.timeGroup}>
                  <select
                    value={form.endTime.split(':')[0] || ''}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        endTime: `${e.target.value}:${
                          prev.endTime.split(':')[1] || '00'
                        }`,
                      }))
                    }
                  >
                    <option value="">시</option>
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <span>시</span>

                  <select
                    value={form.endTime.split(':')[1] || ''}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        endTime: `${prev.endTime.split(':')[0] || '00'}:${
                          e.target.value
                        }`,
                      }))
                    }
                  >
                    <option value="">분</option>
                    {minutes.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <span>분</span>
                </div>
              </div>
            </div>
            {error.time && <p className={styles.error}>{error.time}</p>}
          </div>
        </div>
      </div>
      <div className={styles.buttonGroup}>
        <button
          className={styles.cancleBtn}
          disabled={loading}
          onClick={() => setShowCancelModal(true)}
        >
          취소
        </button>
        <button
          className={styles.saveBtn}
          disabled={loading}
          onClick={async () => {
            if (!validate()) return;

            const isDup = await checkDuplicateClass();

            if (isDup) {
              setShowDupModal(true);
              return;
            }

            setShowSubmitModal(true);
          }}
        >
          {isEditMode ? '수정 완료' : '수업 등록'}
        </button>
      </div>
      {loading && (
        <Modal
          title={isEditMode ? '수정 중' : '등록 중'}
          message={
            isEditMode
              ? '수업을 수정하는 중입니다...'
              : '수업을 등록하는 중입니다...'
          }
        />
      )}
      {showSubmitModal && (
        <Modal
          title={isEditMode ? '수업 수정' : '수업 등록'}
          message={
            isEditMode ? '정말 수정하시겠습니까?' : '정말 등록하시겠습니까?'
          }
          cancelText="취소"
          confirmText="확인"
          onCancel={() => setShowSubmitModal(false)}
          onConfirm={() => {
            setShowSubmitModal(false);
            handleRealSubmit();
          }}
        />
      )}
      {showCancelModal && (
        <Modal
          title={isEditMode ? '수정 취소' : '등록 취소'}
          message={
            isEditMode
              ? '수정 내용을 취소하시겠습니까?'
              : '등록을 취소하시겠습니까?'
          }
          cancelText="아니오"
          confirmText="예"
          onCancel={() => setShowCancelModal(false)}
          onConfirm={() => navigate(-1)}
        />
      )}
      {showDoneModal && (
        <DoneModal
          message={
            isEditMode
              ? '수업이 성공적으로 수정되었습니다.'
              : '수업이 성공적으로 등록되었습니다.'
          }
          onConfirm={() => {
            setShowDoneModal(false);
            navigate('/professor/manage');
          }}
        />
      )}

      {showDupModal && (
        <ChkModal
          title={'등록 오류'}
          message="해당 날짜와 시간에 이미 등록된 수업이 있습니다."
          onConfirm={() => setShowDupModal(false)}
        />
      )}
    </div>
  );
}

export default PrfClassForm;
