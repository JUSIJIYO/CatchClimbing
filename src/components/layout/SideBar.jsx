import React from "react";
import { NavLink } from "react-router-dom";
import styles from '../../styles/css/layout/SideBar.module.css';
import dashboard from '../../assets/icon/adminDashboard.svg';
import prfManage from '../../assets/icon/adminPrfManage.svg';
import branchManage from '../../assets/icon/adminBranchManage.svg';
import classManage from '../../assets/icon/adminClassManage.svg';
import commuManage from '../../assets/icon/commuManage.svg';
import systemManage from '../../assets/icon/systemManage.svg';
import operationsetting from '../../assets/icon/operationSetting.svg';
import dashboardActive from '../../assets/icon/adminDashboardActive.svg';
import prfManageActive from '../../assets/icon/adminPrfManageActive.svg';
import branchManageActive from '../../assets/icon/adminBranchManageActive.svg';
import classManageActive from '../../assets/icon/adminClassManageActive.svg';
import commuManageActive from '../../assets/icon/commuManageActive.svg';
import systemManageActive from '../../assets/icon/systemManageActive.svg';
import operationsettingActive from '../../assets/icon/operationSettingActive.svg';

// to = 경로, label = 텍스트, 이미지 alt, icon = 기본 아이콘, activeIcon = 활성시 아이콘, end = 정확히 /admin일때만 활성화 
const menuItems = [
  { to: '/admin',              label: '대시보드',     icon: dashboard,        activeIcon: dashboardActive,        end: true },
  { to: '/admin/prfmanage',   label: '강사 관리',    icon: prfManage,        activeIcon: prfManageActive },
  { to: '/admin/branchmanage',label: '지점 관리',    icon: branchManage,     activeIcon: branchManageActive },
  { to: '/admin/classmanage', label: '강의 관리',    icon: classManage,      activeIcon: classManageActive },
  { to: '/admin/community',   label: '커뮤니티 관리', icon: commuManage,     activeIcon: commuManageActive },
  { to: '/admin/system',      label: '시스템 관리',   icon: systemManage,    activeIcon: systemManageActive },
  { to: '/admin/operation',   label: '운영 설정',     icon: operationsetting, activeIcon: operationsettingActive },
];

function SideBar() {
  return (
    <nav className={styles['sidebar-ct']}>
      {menuItems.map(({ to, label, icon, activeIcon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) =>
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
