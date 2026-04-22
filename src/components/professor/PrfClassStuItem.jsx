import styles from '../../styles/css/professor/PrfClassStuItem.module.css';

function PrfClassStuItem({ stu, index, onUpdateStatus }) {
  const status = stu.status;

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

  const style = getLevelStyle(stu.level);

  return (
    <>
      <tr>
        <td>{index + 1}</td>
        <td>{stu.name}</td>

        {/* 레벨 */}
        <td>
          <span
            style={{
              background: style.bg,
              color: style.color,
              border: style.border || 'none',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '12px',
              display: 'inline-block',
            }}
          >
            {stu.level}
          </span>
        </td>

        <td>{stu.phone}</td>
        <td>{stu.email}</td>

        {/* 상태 */}
        <td>
          {status === 'approved' && (
            <span className={styles.approved}>승인됨</span>
          )}
          {status === 'pending' && (
            <span className={styles.pending}>대기중</span>
          )}
          {status === 'rejected' && (
            <span className={styles.reject}>거절됨</span>
          )}
        </td>

        <td>
          <div className={styles.actions}>
            {status === 'pending' && (
              <>
                <button
                  className={styles.approve}
                  onClick={() => onUpdateStatus('approve', stu)}
                >
                  승인
                </button>

                <button
                  className={styles.reject}
                  onClick={() => onUpdateStatus('reject', stu)}
                >
                  거절
                </button>
              </>
            )}

            {status === 'approved' && (
              <button
                className={styles.cancel}
                onClick={() => onUpdateStatus('cancel', stu)}
              >
                승인 취소
              </button>
            )}

            {status === 'rejected' && (
              <button
                className={styles.cancel}
                onClick={() => onUpdateStatus('rejectCancel', stu)}
              >
                거절 취소
              </button>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}

export default PrfClassStuItem;
