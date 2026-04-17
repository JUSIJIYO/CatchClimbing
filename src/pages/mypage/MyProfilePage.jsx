import { useEffect, useState } from 'react';
import styles from '../../styles/css/mypage/MyProfilePage.module.css';
import headerStyles from '../../styles/css/common/PageHeader.module.css';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import backIcon from '../../assets/icon/backButton.svg';
import editProfileIcon from '../../assets/icon/mypageEditProfile.svg';
import editEmailIcon from '../../assets/icon/mypageEditEmail.svg';
import editPhoneIcon from '../../assets/icon/mypageEditPhone.svg';

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, 'users', user.uid));

      if (snap.exists()) {
        setUserData(snap.data());
      }
    };

    fetchUser();
  }, []);

  if (!userData) return <div>로딩중...</div>;

  return (
    <div>
      <div className={headerStyles.header}>
        <h1>프로필 조회</h1>
        <p>내 정보를 확인할 수 있습니다</p>
      </div>

      <div className={styles.container}>
        <div className={styles.topBar}>
          <button
            className={styles.backBtn}
            onClick={() => navigate('/mypage')}
          >
            <img src={backIcon} alt="뒤로가기" />
            <span>마이페이지로 돌아가기</span>
          </button>

          <button
            className={styles.editBtnTop}
            onClick={() => navigate('/edit-profile')}
          >
            프로필 수정하기
          </button>
        </div>

        <div className={styles.profileImgWrap}>
          <img
            src={userData.profileImg || '/default-profile.png'}
            className={styles.profileImg}
          />
        </div>

        <div className={styles.section}>
          <h3>기본 정보</h3>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <img src={editProfileIcon} alt="이름" />
              <label>이름</label>
            </div>

            <input value={userData.name} disabled />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <img src={editEmailIcon} alt="이메일" />
              <label>이메일</label>
            </div>
            <input value={userData.email} disabled />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <img src={editPhoneIcon} alt="전화번호" />
              <label>전화번호</label>
            </div>
            <input value={userData.phone} disabled />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label>아이디</label>
            </div>
            <input value={userData.userId} disabled />
          </div>
        </div>

        <div className={styles.section}>
          <h3>클라이밍 정보</h3>

          <div className={styles.field}>
            <label>현재 레벨</label>
            <input value={userData.level} disabled />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
