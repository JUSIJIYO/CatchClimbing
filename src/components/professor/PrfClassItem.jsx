import styles from '../../styles/css/professor/PrfClassItem.module.css';
import peopleIcon from '../../assets/icon/prfClassItempeople.svg';
import calenderIcon from '../../assets/icon/prfClassItemCalender.svg';
import branchIcon from '../../assets/icon/prfClassItemBranch.svg';
import detailIcon from '../../assets/icon/prfClassItemDetail.svg';
import { useNavigate } from 'react-router-dom';

function PrfClassItem({ data, onEditClick, isProfessor }) {
  const navigate = useNavigate();

  const getLevelStyle = (level) => {
    if (!level) return {};

    if (level === 'VB') {
      return {
        bg: '#ffffff',
        color: '#2c3e50',
        border: '1px solid #ddd',
      };
    }

    if (level === 'V0') return { bg: '#ffd43b', color: '#7a5c00' };
    if (level === 'V1') return { bg: '#ff922b', color: '#7c2d00' };
    if (level === 'V2') return { bg: '#51cf66', color: '#1b5e20' };
    if (level === 'V3') return { bg: '#339af0', color: '#0b3d91' };
    if (level === 'V4') return { bg: '#ff6b6b', color: '#7f1d1d' };
    if (level === 'V5') return { bg: '#f783ac', color: '#9d174d' };
    if (level === 'V6') return { bg: '#b197fc', color: '#4b2e83' };
    if (level === 'V7') return { bg: '#adb5bd', color: '#343a40' };
    if (level === 'V8') return { bg: '#c68642', color: '#5c3d2e' };

    return {
      bg: '#212529',
      color: '#ffffff',
    };
  };
  console.log('class data:', data);

  const levelStyle = getLevelStyle(data.level);
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.profile}>
          <img
            src={data.profileImage || '/default-profile.png'}
            className={styles.avatar}
          />
          <div>
            <p className={styles.role}>강사</p>
            <p className={styles.name}>{data.professorName}</p>
          </div>
        </div>

        <div
          className={styles.level}
          style={{
            background: levelStyle.bg,
            color: levelStyle.color,
            border: levelStyle.border || 'none',
          }}
        >
          {data.level}
        </div>
      </div>

      <h3 className={styles.title}>{data.title}</h3>

      <div className={styles.info}>
        <div className={styles.infoRow}>
          <img src={calenderIcon} />
          <span>{data.openDate}</span>
        </div>

        <div className={styles.inlineRow}>
          <div className={styles.infoRow}>
            <img src={peopleIcon} />
            <span>
              정원 : {data.studentCount} / {data.capacity}
            </span>
          </div>

          <div className={styles.infoRow}>
            <img src={branchIcon} />
            <span>지점 : {data.branchName}</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.detailBtn}
          onClick={() => navigate(`/class/${data.id}`)}
        >
          <img src={detailIcon} />
          상세보기
        </button>
        <button
          className={styles.editBtn}
          onClick={() => onEditClick(data.id, data)}
        >
          수정하기
        </button>
        <button
          className={styles.subBtn}
          onClick={() => navigate(`/professor/class/${data.id}/students`)}
        >
          수강생 조회
        </button>
      </div>
    </div>
  );
}

export default PrfClassItem;
