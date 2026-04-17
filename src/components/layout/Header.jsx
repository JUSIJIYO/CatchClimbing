import React, { useState, useEffect } from 'react';
import logo from '../../assets/icon/climbing_logo.png';
import loginIcon from '../../assets/icon/login.svg';
import logoutIcon from '../../assets/icon/logout.svg';
import title from '../../assets/icon/logo.png';
import styles from '../../styles/css/layout/header.module.css';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = async () => {
    const auth = getAuth();

    if (user) {
      await signOut(auth);
      navigate('/');
    } else {
      navigate('/login');
    }
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
    </>
  );
}

export default Header;
