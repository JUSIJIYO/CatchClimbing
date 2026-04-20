import { useEffect, useState } from 'react';
import styles from '../../styles/css/mypage/EditProfilePage.module.css';
import headerStyles from '../../styles/css/common/PageHeader.module.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import backIcon from '../../assets/icon/backButton.svg';
import editProfileIcon from '../../assets/icon/mypageEditProfile1.svg';
import editEmailIcon from '../../assets/icon/mypageEditEmail1.svg';
import editPhoneIcon from '../../assets/icon/mypageEditPhone1.svg';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function ProfilePage() {
  const [errorMsg, setErrorMsg] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const user = getAuth().currentUser;
    if (!user) return;

    // ✅ 1. 즉시 미리보기
    const previewUrl = URL.createObjectURL(file);
    setProfileImg(previewUrl);

    setUploading(true); // 로딩 시작

    try {
      const storage = getStorage();
      const imageRef = ref(storage, `profile/${user.uid}`);

      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);

      // ✅ 최종 URL로 교체
      setProfileImg(url);

      await updateDoc(doc(db, 'users', user.uid), {
        profileImg: url,
      });
    } catch (error) {
      console.error(error);
      alert('업로드 실패');
    } finally {
      setUploading(false); // 로딩 끝
    }
  };

  const handleRealSave = async () => {
    const user = getAuth().currentUser;
    if (!user) return;

    setShowConfirmModal(false);
    setShowLoadingModal(true);

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        oldPassword.trim(),
      );
      await reauthenticateWithCredential(user, credential);
      if (password) {
        await updatePassword(user, password);
      }

      await updateDoc(doc(db, 'users', user.uid), {
        profileImg: profileImg,
      });

      setShowLoadingModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.log(user.email);
      console.log(oldPassword);
      console.error(error);
      setShowLoadingModal(false);
      setErrorMsg('현재 비밀번호가 올바르지 않습니다');
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, 'users', user.uid));

      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setProfileImg(data.profileImg);
      }
    };

    fetchUser();
  }, []);

  if (!userData) return <div>로딩중...</div>;

  return (
    <div>
      <div className={headerStyles.header}>
        <h1>프로필 수정</h1>
        <p>내 정보를 수정할 수 있습니다</p>
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
        </div>

        <div className={styles.card}>
          <div className={styles.profileImgWrap}>
            <label className={styles.profileLabel}>
              <img
                src={profileImg || '/default-profile.png'}
                className={styles.profileImg}
              />

              {uploading && (
                <div className={styles.loadingOverlay}>업로드 중...</div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>

            <p className={styles.profileText}>클릭하여 프로필 사진 변경</p>
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

            <div className={styles.field}>
              <div className={styles.passwordLabel}>
                <label>현재 비밀번호</label>
              </div>

              <input
                type="password"
                placeholder="현재 비밀번호 입력"
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                  setErrorMsg('');
                }}
              />

              {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}
            </div>

            <div className={styles.field}>
              <div className={styles.passwordLabel}>
                <label>새 비밀번호</label>
              </div>

              <input
                type="password"
                placeholder="새 비밀번호 입력"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3>클라이밍 정보</h3>

            <div className={styles.field}>
              <label>현재 레벨</label>
              <input value={userData.level} disabled />
            </div>

            <div className={styles.buttonGroup}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowCancelModal(true)}
              >
                취소하기
              </button>

              <button
                className={styles.saveBtn}
                onClick={() => setShowConfirmModal(true)}
              >
                수정완료하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCancelModal && (
        <Modal
          title="취소 확인"
          message="정말 수정사항을 저장하지 않고 나가시겠습니까?"
          cancelText="취소"
          confirmText="확인"
          onCancel={() => setShowCancelModal(false)}
          onConfirm={() => {
            setShowCancelModal(false);
            navigate(-1);
          }}
          onClose={() => setShowCancelModal(false)}
        />
      )}

      {showConfirmModal && (
        <Modal
          title="수정 확인"
          message="정말 수정하시겠습니까?"
          cancelText="취소"
          confirmText="확인"
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={handleRealSave}
        />
      )}

      {showLoadingModal && <Modal message="수정 중입니다..." />}

      {showSuccessModal && (
        <ConfirmModal
          message="수정이 완료되었습니다."
          onConfirm={() => {
            setShowSuccessModal(false);
            navigate('/mypage');
          }}
        />
      )}
    </div>
  );
}

export default ProfilePage;
