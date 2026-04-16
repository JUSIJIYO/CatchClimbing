import styles from '../../styles/css/record/RecordItem.module.css';
import dateIcon from '../../assets/icon/recordDate.svg';
import locationIcon from '../../assets/icon/recordLocation.svg';
import { useNavigate } from 'react-router-dom';

function RecordItem({ item }) {
  const navigate = useNavigate();

  const getLevelStyle = (level) => {
    if (!level) return {};

    const num = parseInt(level.replace('V', ''));

    if (level === 'VB')
      return {
        bg: '#ffffff',
        color: '#2c3e50',
        border: '1px solid rgba(44, 62, 80, 0.2)',
      };
    if (level === 'V0') return { bg: '#fff3bf', color: '#8a6d00' };
    if (num === 1 || num === 2) return { bg: '#ffe5d0', color: '#c2410c' };
    if (num === 3 || num === 4) return { bg: '#dbeafe', color: '#1d4ed8' };
    if (num === 5) return { bg: '#fde2e4', color: '#c9184a' };
    if (num === 6) return { bg: '#e5dbff', color: '#5f3dc4' };
    if (num === 7) return { bg: '#e9ecef', color: '#495057' };
    if (num === 8) return { bg: '#ede0d4', color: '#7f5539' };
    if (num >= 9) return { bg: '#343a40', color: '#fff' };
    return {};
  };
  const style = getLevelStyle(item.level);

  return (
    <div
      className={styles['card']}
      onClick={() => navigate(`/record/${item.id}`)}
    >
      <img
        src={item.image || 'https://via.placeholder.com/150'}
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
