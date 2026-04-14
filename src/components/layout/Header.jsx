import React, { useState } from 'react';
import logo from '../../assets/icon/climbing_logo.png';
import loginIcon from '../../assets/icon/login.svg';
import logoutIcon from '../../assets/icon/logout.svg';
import title from '../../assets/icon/logo.png';
import styles from '../../styles/css/layout/header.module.css';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';

function Header() {

  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  const handleLogin = () => {
    navigate("/login");
    // setIsLogin(!isLogin);
  }

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
            className={`${styles['button']} ${isLogin ? styles['logout'] : styles['login']}`}
            onClick={handleLogin}
          >
            <img
              src={isLogin ? logoutIcon : loginIcon}
              alt="icon"
              className={styles['icon']}
            />
            {isLogin ? '로그아웃' : '로그인'}
          </button>
        </div>
      </header>
    </>
  );
}

export default Header;
