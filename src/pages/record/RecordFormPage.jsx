import RecordForm from '../../components/record/RecordForm';
import styles from '../../styles/css/record/RecordFormPage.module.css';
import headerStyles from '../../styles/css/common/PageHeader.module.css';
import backIcon from '../../assets/icon/backButton.svg';
import { useNavigate } from 'react-router-dom';

function RecordFormPage() {
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    // console.log('저장:', data);
    navigate('/record');
  };

  return (
    <div>
      <div className={headerStyles.header}>
        <h1>기록 등록하기</h1>
        <p>클라이밍 기록을 추가해보세요</p>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.topBar}>
          <button
            className={styles.backBtn}
            onClick={() => navigate('/record')}
          >
            <img src={backIcon} alt="뒤로가기" />
            기록 목록으로 돌아가기
          </button>
        </div>

        <div className={styles.container}>
          <RecordForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

export default RecordFormPage;
