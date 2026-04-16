import { auth } from '../../firebase/config';
import ProfileCard from '../../components/mypage/ProfileCard';
import ProMyClassList from '../../components/mypage/ProMyClassList';
import styles from '../../styles/css/mypage/Mypage.module.css';
import headerStyles from '../../styles/css/common/PageHeader.module.css';

function Mypage() {
  const user = auth.currentUser;

  return (
    <div className={styles.container}>
      <div className={headerStyles.header}>
        <h1>마이페이지</h1>
        <p>내 클라이밍 기록과 정보</p>
      </div>

      <ProfileCard user={user} />
      <ProMyClassList />
    </div>
  );
}

export default Mypage;
