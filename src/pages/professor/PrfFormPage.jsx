import styles from '../../styles/css/professor/PrfClassFormPage.module.css';
import PrfClassForm from '../../components/professor/PrfClassForm';
import { useNavigate } from 'react-router-dom';
import headerStyles from '../../styles/css/common/PageHeader.module.css';

function PrfFormPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className={headerStyles.header}>
        <h1>수업 등록</h1>
        <p>새로운 클라이밍 수업을 만들어보세요</p>
      </div>

      <div className={styles.container}>
        <PrfClassForm onSuccess={() => navigate('/professor')} />
      </div>
    </>
  );
}

export default PrfFormPage;
