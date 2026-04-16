import ProfileCard from '../../components/mypage/ProfileCard';
import LevelCard from '../../components/mypage/LevelCard';
import LevelGuide from '../../components/mypage/LevelGuide';
import styles from '../../styles/css/mypage/MyLevelSystemPage.module.css';
import backIcon from '../../assets/icon/backButton.svg';
import { useNavigate } from 'react-router-dom';
import headerStyles from '../../styles/css/common/PageHeader.module.css';

function MyLevelSystemPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className={headerStyles.header}>
        <h1>레벨 시스템 조회</h1>
        <p>레벨 산정 기준</p>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.topBar}>
          <button
            className={styles.backBtn}
            onClick={() => navigate('/mypage')}
          >
            <img src={backIcon} alt="뒤로가기" />
            마이페이지로 돌아가기
          </button>
        </div>

        <div className={styles.container}>
          <ProfileCard showButtons={false} />

          <div className={styles.row}>
            <LevelGuide />
            <LevelCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyLevelSystemPage;
