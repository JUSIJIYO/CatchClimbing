import React, { useState } from 'react';
import styles from '../../styles/css/mypage/ProfileCard.module.css';
import mypageIcon from '../../assets/icon/mypageIcon.svg';
import ProgressBar from '../common/ProgressBar';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../common/AuthModal';
import ConfirmModal from '../common/ConfirmModal';

function ProfileCard({ userData, showButtons = true, attemptCount = 0 }) {
  const branchMap = {
    theclimb_hongdae: '홍대점',
    theclimb_gangnam: '강남점',
    theclimb_ilsan: '일산점',
    theclimb_isu: '이수점',
    theclimb_magok: '마곡점',
    theclimb_mullae: '문래점',
    theclimb_nonhyeon: '논현점',
    theclimb_sadang: '사당점',
    theclimb_seongsu: '성수점',
    theclimb_sillim: '신림점',
    theclimb_sinsa: '신사점',
    theclimb_yangjae: '양재점',
    theclimb_yeonnam: '연남점',
  };

  const navigate = useNavigate();
  const name = userData?.name || '사용자';
  const branch = branchMap[userData?.branchId] || '';
  const level = userData?.level || 'V0';
  const levelNumber = parseInt(level.replace('V', '')) || 0;
  const nextLevel = `V${levelNumber + 1}`;
  const point = Math.floor(attemptCount / 7);
  const progress = (point % 4) * 25;
  const remain = point % 4 === 0 && point !== 0 ? 0 : 4 - (point % 4);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const roleLabel =
    userData?.role === 'student'
      ? '수강생'
      : branchMap[userData?.branchId] || '';
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.profileSection}>
          <img
            src={userData?.profileImg || '/default-profile.png'}
            className={styles.profileImg}
          />

          <div className={styles.info}>
            <p className={styles.name}>
              {name} ({roleLabel})
            </p>
            <span className={styles.level}>레벨 {level}</span>
          </div>
        </div>

        {showButtons && (
          <div className={styles['mypage-buttons']}>
            <button
              className={styles['mypage-btn']}
              onClick={() => setShowAuthModal(true)}
            >
              <img src={mypageIcon} alt="" />
              <span>프로필 조회</span>
            </button>
            <button
              className={styles['mypage-btn']}
              onClick={() => navigate('/level')}
            >
              <img src={mypageIcon} alt="" />
              <span>레벨 시스템 조회</span>
            </button>
          </div>
        )}
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span>{nextLevel} 달성률</span>
          <span>{progress}%</span>
        </div>

        <ProgressBar percent={progress} />

        <p className={styles.desc}>레벨업까지 {remain}포인트 남았습니다!</p>
      </div>

      {showAuthModal && (
        <AuthModal
          userData={userData}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            setShowSuccessModal(true);
          }}
        />
      )}

      {showSuccessModal && (
        <ConfirmModal
          message="인증이 완료되었습니다."
          onConfirm={() => {
            setShowSuccessModal(false);
            navigate('/profile');
          }}
        />
      )}
    </div>
  );
}

export default ProfileCard;
