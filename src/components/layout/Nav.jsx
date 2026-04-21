import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import icon1 from '../../assets/icon/navIcon1.svg';
import icon2 from '../../assets/icon/navIcon2.svg';
import icon3 from '../../assets/icon/navIcon3.svg';
import icon4 from '../../assets/icon/navIcon4.svg';
import icon5 from '../../assets/icon/navIcon5.svg';
import icon6 from '../../assets/icon/navIcon6.svg';
import styles from '../../styles/css/layout/Nav.module.css';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';

function Nav() {
  // 현재 유저 정보
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // 로그인하지 않고 로그인시 뜨는 모달 상태 관리
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navSelect = ({ isActive }) => {
    return isActive ? styles['active'] : "";
  }

  // 로그인 하지 않은 유저 관리 함수
  const handleUnLoginUser = (e, path) => {
    if (!currentUser) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  return (
    <nav className={styles['nav']}>
      <div className={styles['navList']}>
        <NavLink to="/" className={navSelect}><img src={icon1} />센터찾기</NavLink>
        <NavLink to="/class" className={navSelect}><img src={icon2} />수업</NavLink>
        <NavLink to="/commu" className={navSelect}><img src={icon3} />커뮤니티</NavLink>
        <NavLink to="/calendar" className={navSelect} onClick={(e) => handleUnLoginUser(e, '/calendar')}><img src={icon4} />캘린더</NavLink>
        <NavLink to="/record" className={navSelect} onClick={(e) => handleUnLoginUser(e, '/record')}><img src={icon5} />개인기록</NavLink>
        <NavLink to="/mypage" className={navSelect} onClick={(e) => handleUnLoginUser(e, '/mypage')}><img src={icon6} />마이페이지</NavLink>
      </div>

      {showLoginModal && (
        <Modal
          title="로그인 필요"
          message="로그인이 필요한 서비스입니다. 로그인 하시겠습니까?"
          cancelText="취소"
          confirmText="로그인"
          onCancel={() => setShowLoginModal(false)}
          onConfirm={() => { setShowLoginModal(false); navigate('/login'); }}
        />
      )}
    </nav>
  );
}

export default Nav