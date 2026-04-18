import styles from '../../styles/css/record/RecordItem.module.css';
import dateIcon from '../../assets/icon/recordDate.svg';
import locationIcon from '../../assets/icon/recordLocation.svg';
import { useNavigate } from 'react-router-dom';

function RecordItem({ item }) {
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

    if (level === 'V0') return { bg: '#ffd43b', color: '#7a5c00' }; // 노랑
    if (level === 'V1') return { bg: '#ff922b', color: '#7c2d00' }; // 주황
    if (level === 'V2') return { bg: '#51cf66', color: '#1b5e20' }; // 초록
    if (level === 'V3') return { bg: '#339af0', color: '#0b3d91' }; // 파랑
    if (level === 'V4') return { bg: '#ff6b6b', color: '#7f1d1d' }; // 빨강
    if (level === 'V5') return { bg: '#f783ac', color: '#9d174d' }; // 핑크
    if (level === 'V6') return { bg: '#b197fc', color: '#4b2e83' }; // 보라
    if (level === 'V7') return { bg: '#adb5bd', color: '#343a40' }; // 회색
    if (level === 'V8') return { bg: '#c68642', color: '#5c3d2e' }; // 갈색

    // V8+ 이상
    return {
      bg: '#212529',
      color: '#ffffff',
    };
  };
  const style = getLevelStyle(item.level);

  return (
    <div
      className={styles['card']}
      onClick={() => navigate(`/record/${item.id}`)}
    >
      <img
        src={
          Array.isArray(item.image)
            ? item.image[0]
            : item.image || 'https://via.placeholder.com/150'
        }
        alt="기록 이미지"
        className={styles['image']}
      />

      <div className={styles['content']}>
        <h3 className={styles['title']}>{item.title}</h3>

        <div className={styles['infoRow']}>
          <img src={locationIcon} alt="" />
          <span>{item.branchName}</span>
        </div>

        <div className={styles['infoRow']}>
          <img src={dateIcon} alt="" />
          <span>{item.visitDate}</span>
        </div>
        <p className={styles['time']}>
          작성일:{' '}
          {item.createdAt
            ? new Date(item.createdAt.seconds * 1000).toLocaleTimeString()
            : ''}
        </p>
      </div>

      <div
        className={styles['level']}
        style={{
          backgroundColor: style.bg,
          color: style.color,
          border: style.border || 'none',
        }}
      >
        {item.level}
      </div>
    </div>
  );
}

export default RecordItem;
