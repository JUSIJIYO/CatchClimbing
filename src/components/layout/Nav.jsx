import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLoginModal, setShowLoginModal] = useState(false);

  const isPathActive = (paths) =>
    paths.some((p) => location.pathname === p || location.pathname.startsWith(p + '/'));

  const navClass = (paths) => ({ isActive }) =>
    isActive || isPathActive(paths) ? styles['active'] : '';

  const handleUnLoginUser = (e, path) => {
    if (!currentUser) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  return (
    <nav className={styles['nav']}>
      <div className={styles['navList']}>
        <NavLink to="/" className={navClass(['/branch'])} end><img src={icon1} />센터찾기</NavLink>
        <NavLink to="/class" className={navClass(['/class', '/professor'])} onClick={(e) => handleUnLoginUser(e, '/class')}><img src={icon2} />수업</NavLink>
        <NavLink to="/commu" className={navClass(['/commu', '/community', '/review', '/post', '/postform', '/reviewdetail', '/reviewform'])} onClick={(e) => handleUnLoginUser(e, '/commu')}><img src={icon3} />커뮤니티</NavLink>
        <NavLink to="/calendar" className={navClass(['/calendar', '/schedule'])} onClick={(e) => handleUnLoginUser(e, '/calendar')}><img src={icon4} />캘린더</NavLink>
        <NavLink to="/record" className={navClass(['/record'])} onClick={(e) => handleUnLoginUser(e, '/record')}><img src={icon5} />개인기록</NavLink>
        <NavLink to="/mypage" className={navClass(['/mypage', '/edit-profile', '/profile', '/level'])} onClick={(e) => handleUnLoginUser(e, '/mypage')}><img src={icon6} />마이페이지</NavLink>
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