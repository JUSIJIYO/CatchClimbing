import ProfileCard from '../../components/mypage/ProfileCard';
import LevelCard from '../../components/mypage/LevelCard';
import LevelGuide from '../../components/mypage/LevelGuide';
import styles from '../../styles/css/mypage/MyLevelSystemPage.module.css';

function MyLevelSystemPage() {
  return (
    <div className={styles.container}>
      <ProfileCard showButtons={false} />

      <div className={styles.row}>
        <LevelGuide />
        <LevelCard />
      </div>
    </div>
  );
}

export default MyLevelSystemPage;
