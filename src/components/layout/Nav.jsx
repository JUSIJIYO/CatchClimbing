import { NavLink } from 'react-router-dom'; 
import icon1 from '../../assets/icon/navIcon1.svg';
import icon2 from '../../assets/icon/navIcon2.svg';
import icon3 from '../../assets/icon/navIcon3.svg';
import icon4 from '../../assets/icon/navIcon4.svg';
import icon5 from '../../assets/icon/navIcon5.svg';
import icon6 from '../../assets/icon/navIcon6.svg';
import styles from '../../styles/css/layout/Nav.module.css';

function Nav() {
  const navSelect = ({ isActive }) => {
    return isActive ? styles['active'] : "";
  };

  return (
    <nav className={styles['nav']}>
      <div className={styles['navList']}>
        <NavLink to="/branch" className={navSelect}><img src={icon1}></img>센터찾기</NavLink>
        <NavLink to="/class" className={navSelect}><img src={icon2}></img>수업</NavLink>
        <NavLink to="/commu" className={navSelect}><img src={icon3}></img>커뮤니티</NavLink>
        <NavLink to="/calendar" className={navSelect}><img src={icon4}></img>캘린더</NavLink>
        <NavLink to="/record" className={navSelect}><img src={icon5}></img>개인기록</NavLink>
        <NavLink to="/mypage" className={navSelect}><img src={icon6}></img>마이페이지</NavLink>
      </div>
    </nav>
  )
}

export default Nav