import { useState } from 'react';
import styles from '../../styles/css/common/AuthModal.module.css';

function AuthModal({ onClose, onSuccess, userData }) {
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const handleCheck = () => {
    if (!password) {
      alert('비밀번호를 입력해주세요');
      return;
    }

    if (password === userData?.password) {
      setError('');
      onSuccess();
    } else {
      setError('비밀번호가 일치하지 않습니다');
    }
  };

  // console.log('입력:', password);
  // console.log('DB:', userData);
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>사용자인증</h2>
        <p>비밀번호를 입력해주세요</p>

        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCheck();
          }}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.btns}>
          <button onClick={onClose}>취소</button>
          <button onClick={handleCheck}>확인</button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
