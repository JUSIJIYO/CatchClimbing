import { useRef, useState } from 'react';
import styles from '../../styles/css/record/RecordForm.module.css';
import titleIcon from '../../assets/icon/recordTitle.svg';
import branchIcon from '../../assets/icon/recordBranch.svg';
import dateIcon from '../../assets/icon/recordDate.svg';
import timeIcon from '../../assets/icon/recordTime.svg';
import levelIcon from '../../assets/icon/recordLevel.svg';
import imageIcon from '../../assets/icon/recordImage.svg';
import uploadIcon from '../../assets/icon/recordFileUpload.svg';

function RecordForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    branchId: '',
    branchName: '',
    visitDate: '',
    startTime: '',
    endTime: '',
    level: '',
    tryCount: '',
    description: '',
    memo: '',
    image: null,
  });

  const fileInputRef = useRef(null);

  const branches = [
    { id: 'theclimb_hongdae', name: '홍대점' },
    { id: 'theclimb_gangnam', name: '강남점' },
    { id: 'theclimb_ilsan', name: '일산점' },
    { id: 'theclimb_isu', name: '이수점' },
    { id: 'theclimb_magok', name: '마곡점' },
    { id: 'theclimb_mullae', name: '문래점' },
    { id: 'theclimb_nonhyeon', name: '논현점' },
    { id: 'theclimb_sadang', name: '사당점' },
    { id: 'theclimb_seongsu', name: '성수점' },
    { id: 'theclimb_sillim', name: '신림점' },
    { id: 'theclimb_sinsa', name: '신사점' },
    { id: 'theclimb_yangjae', name: '양재점' },
    { id: 'theclimb_yeonnam', name: '연남점' },
  ];

  const levels = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLevel = (lv) => {
    setForm((prev) => ({ ...prev, level: lv }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(imageUrl);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, '0'),
  );

  const minutes = ['00', '10', '20', '30', '40', '50'];

  const [preview, setPreview] = useState('');

  return (
    <form className={styles['card']} onSubmit={handleSubmit}>
      <div className={styles['field']}>
        <label>
          <img src={titleIcon} alt="" />
          제목
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="예: V4 문제 클리어"
        />
      </div>

      <div className={styles['field']}>
        <label>
          <img src={branchIcon} alt="" />
          지점
        </label>

        <select
          value={form.branchId}
          onChange={(e) => {
            const selected = branches.find((b) => b.id === e.target.value);

            if (!selected) return;

            setForm((prev) => ({
              ...prev,
              branchId: selected.id,
              branchName: selected.name,
            }));
          }}
        >
          <option value="">지점을 선택하세요</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles['field']}>
        <label>
          <img src={dateIcon} alt="" />
          방문 날짜
        </label>
        <input
          type="date"
          name="visitDate"
          value={form.visitDate}
          onChange={handleChange}
        />
      </div>

      <div className={styles.field}>
        <label>
          <img src={timeIcon} alt="" />
          운동 시간
        </label>

        <div className={styles.timeWrap}>
          <select
            value={form.startTime.split(':')[0] || ''}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                startTime: `${e.target.value}:${prev.startTime.split(':')[1] || '00'}`,
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

          <select
            value={form.startTime.split(':')[1] || ''}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                startTime: `${prev.startTime.split(':')[0] || '00'}:${e.target.value}`,
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

          <span>~</span>

          <select
            value={form.endTime.split(':')[0] || ''}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                endTime: `${e.target.value}:${prev.endTime.split(':')[1] || '00'}`,
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

          <select
            value={form.endTime.split(':')[1] || ''}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                endTime: `${prev.endTime.split(':')[0] || '00'}:${e.target.value}`,
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
        </div>
      </div>

      <div className={styles['field']}>
        <label>
          <img src={levelIcon} alt="" />
          난이도
        </label>
        <div className={styles['levelWrap']}>
          {levels.map((lv) => (
            <button
              key={lv}
              type="button"
              onClick={() => handleLevel(lv)}
              className={form.level === lv ? styles.active : ''}
            >
              {lv}
            </button>
          ))}
        </div>
      </div>

      <div className={styles['field']}>
        <label>시도 횟수</label>
        <input
          type="number"
          name="tryCount"
          value={form.tryCount}
          onChange={handleChange}
          placeholder="예: 5"
        />
      </div>

      <div className={styles['field']}>
        <label>문제 설명</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="문제에 대한 설명을 입력하세요"
        />
      </div>

      <div className={styles['field']}>
        <label>메모</label>
        <textarea
          name="memo"
          value={form.memo}
          onChange={handleChange}
          placeholder="오늘 클라이밍 경험을 기록하세요"
        />
      </div>

      <div className={styles.field}>
        <label>
          <img src={imageIcon} alt="" />
          사진 업로드
        </label>

        <div
          className={styles.uploadBox}
          onClick={() => fileInputRef.current.click()}
        >
          <input type="file" ref={fileInputRef} onChange={handleImage} hidden />

          {preview ? (
            <img src={preview} className={styles.previewImg} />
          ) : (
            <div className={styles.uploadContent}>
              <img src={uploadIcon} alt="" />
              <p>클릭하여 사진을 업로드하세요</p>
              <span>JPG, PNG 파일 (최대 5MB)</span>
            </div>
          )}
        </div>
      </div>

      <button type="submit" className={styles['submit']}>
        등록하기
      </button>
    </form>
  );
}

export default RecordForm;
