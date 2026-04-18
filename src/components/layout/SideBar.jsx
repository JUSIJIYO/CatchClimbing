import React from "react";
import { NavLink } from "react-router-dom";
import styles from '../../styles/css/layout/SideBar.module.css';
import { useAuth } from '../../context/AuthContext';
import dashboard         from '../../assets/icon/adminDashboard.svg';
import prfManage         from '../../assets/icon/adminPrfManage.svg';
import branchManage      from '../../assets/icon/adminBranchManage.svg';
import classManage       from '../../assets/icon/adminClassManage.svg';
import commuManage       from '../../assets/icon/commuManage.svg';
import systemManage      from '../../assets/icon/systemManage.svg';
import operationsetting  from '../../assets/icon/operationSetting.svg';
import dashboardActive        from '../../assets/icon/adminDashboardActive.svg';
import prfManageActive        from '../../assets/icon/adminPrfManageActive.svg';
import branchManageActive     from '../../assets/icon/adminBranchManageActive.svg';
import classManageActive      from '../../assets/icon/adminClassManageActive.svg';
import commuManageActive      from '../../assets/icon/commuManageActive.svg';
import systemManageActive     from '../../assets/icon/systemManageActive.svg';
import operationsettingActive from '../../assets/icon/operationSettingActive.svg';
import userManage        from '../../assets/icon/userManage.svg';
import activeUserManage  from '../../assets/icon/activeUserManage.svg';

// to = 경로, label = 텍스트, icon=아이콘, activeIcon =활성화시 아이콘, end = 정확히 /admin일때만 활성화 , roles: 관리자에 따른 사이브다 설정 
const menuItems = [
  { to: '/admin',              label: '대시보드',      icon: dashboard,        activeIcon: dashboardActive,        end: true },
  { to: '/admin/usermanage',   label: '회원 관리',     icon: userManage,       activeIcon: activeUserManage,       roles: ['totalAdmin'] },
  { to: '/admin/prfmanage',    label: '강사 관리',     icon: prfManage,        activeIcon: prfManageActive,        roles: ['branchAdmin'] },
  { to: '/admin/branchmanage', label: '지점 관리',     icon: branchManage,     activeIcon: branchManageActive },
  { to: '/admin/classmanage',  label: '강의 관리',     icon: classManage,      activeIcon: classManageActive },
  { to: '/admin/community',    label: '커뮤니티 관리', icon: commuManage,      activeIcon: commuManageActive },
  { to: '/admin/system',       label: '시스템 관리',   icon: systemManage,     activeIcon: systemManageActive,     roles: ['totalAdmin'] },
  { to: '/admin/operation',    label: '운영 설정',     icon: operationsetting, activeIcon: operationsettingActive, roles: ['totalAdmin'] },
];

function SideBar() {
  const { role } = useAuth()

  const visibleItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  )

  return (
    <nav className={styles['sidebar-ct']}>
      {visibleItems.map(({ to, label, icon, activeIcon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `${styles['sidebar-link']} ${isActive ? ` ${styles['active']}` : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <img src={isActive ? activeIcon : icon} alt={label} />
              <p>{label}</p>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export default SideBar;
