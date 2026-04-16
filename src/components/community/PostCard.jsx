import React from 'react';
import styles from '../../styles/css/mypage/ProfileCard.module.css';

function ProfileCard({ user }) {
  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <img
          src={user?.photoURL || '/default-profile.png'}
          alt="프로필"
          className={styles.profileImg}
        />
      </div>

      <div className={styles.right}>
        <h2 className={styles.name}>{user?.displayName || '이름 없음'}</h2>
        <p className={styles.email}>{user?.email}</p>

        <div className={styles.buttons}>
          <button className={styles.btn}>정보 수정</button>
          <button className={styles.btn}>비밀번호 변경</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
