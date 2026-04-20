import React, { useState, useEffect } from 'react';
import logo from '../../assets/icon/climbing_logo.png';
import loginIcon from '../../assets/icon/login.svg';
import logoutIcon from '../../assets/icon/logout.svg';
import title from '../../assets/icon/logo.png';
import styles from '../../styles/css/layout/header.module.css';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDoneModal, setShowDoneModal] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = () => {
    if (user) {
      setShowLogoutModal(true);
    } else {
      navigate('/login');
    }
  };

  const handleLogoutConfirm = async () => {
    const auth = getAuth();

    await signOut(auth);

    setShowLogoutModal(false);
    setShowDoneModal(true);
  };

  return (
    <>
      <header className={styles['header']}>
        <div className={styles['left']}>
          <img src={logo} alt="logo" className={styles['logo']} />
          <img src={title} alt="title" className={styles['title']} />
        </div>

        <Nav />

        <div>
          <button
            className={`${styles['button']} ${
              user ? styles['logout'] : styles['login']
            }`}
            onClick={handleAuth}
          >
            <img
              src={user ? logoutIcon : loginIcon}
              alt="icon"
              className={styles['icon']}
            />
            {user ? '로그아웃' : '로그인'}
          </button>
        </div>
      </header>

      {showLogoutModal && (
        <Modal
          title="로그아웃"
          message="정말 로그아웃 하시겠습니까?"
          cancelText="취소"
          confirmText="로그아웃"
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={handleLogoutConfirm}
        />
      )}

      {showDoneModal && (
        <ConfirmModal
          message="로그아웃되었습니다."
          onConfirm={() => {
            setShowDoneModal(false);
            navigate('/');
          }}
        />
      )}
    </>
  );
}

export default Header;
