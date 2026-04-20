import React, { useState, useEffect } from 'react';
import DashboardCard from '../../components/admin/DashboardCard';
import DashboardPopularClassCard from '../../components/admin/DashboardPopularClassCard';
import styles from '../../styles/css/admin/DashBoardPage.module.css';
import adminUserDashboard from '../../assets/icon/adminDashboardUser.svg';
import adminManageBracnh from '../../assets/icon/adminManageBracnh.svg';
import adminTodayCalender from '../../assets/icon/adminTodayCalender.svg';
import { auth, onAuthStateChanged } from '../../services/authService';
import {
  getUserDoc,
  getTotalUserCount,
  getTotalBranchCount,
  getTodayReservationStats,
  getPopularClasses,
  getBranchUtilization,
  getPendingProfessors,
} from '../../services/adminService';

// 지점별 이용률 순위에 따른 색깔 설정 (피그마 기준임돠)
const USE_COLORS = ['#F59E0B', '#2C3E50', '#00A63E', '#3B82F6', '#8B5CF6', '#EC4899'];

// 최근활동에 표시되는 시간, 분, 초, 일 관련 수식 설정
function curActTime(createtime) {
  if (!createtime) return '';
  const time = Math.floor((Date.now() / 1000) - createtime.seconds);
  if (time < 60) return `${time}초 전`;
  if (time < 3600) return `${Math.floor(time / 60)}분 전`;
  if (time < 86400) return `${Math.floor(time / 3600)}시간 전`;
  return `${Math.floor(time / 86400)}일 전`;
}

function DashBoardPage() {

  // role값 (통합관리자, 지점관리자) 관리
  const [role, setRole] = useState(null);

  // 대시보드 카드 상태 관리
  const [stats, setStats] = useState(
    { 
      userCount: 0, 
      branchCount: 0, 
      reservationCount: 0, 
      reservationIncrease: 0 
    });
    
  // 인기강의 상태관리
  const [popularClasses, setPopularClasses] = useState([]);
  
  // 지점별 이용률 상태관리
  const [branchUtilization, setBranchUtilization] = useState([]);
  
  // 대기중인 강사 상태 관리
  const [pendingProfessors, setPendingProfessors] = useState([]);
  
  // 로딩 상태관리
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // 사용자 로그인 상태 확인
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { setLoading(false); return; }
      const userData = await getUserDoc(user.uid);
      if (!userData) { setLoading(false); return; }

      const { role: userRole, branchId } = userData;
      setRole(userRole);

      // 전체관리자 일 때 조건
      if (userRole === 'totalAdmin') {
        const userCount = await getTotalUserCount();
        const branchCount = await getTotalBranchCount();
        const reservationStats = await getTodayReservationStats();
        const classes = await getPopularClasses();
        const utilization = await getBranchUtilization();
        const professors = await getPendingProfessors();
        setStats({ userCount, branchCount, reservationCount: reservationStats.count, reservationIncrease: reservationStats.increase });
        setPopularClasses(classes);
        setBranchUtilization(utilization);
        setPendingProfessors(professors);
        
        // 지점관리자 일 때 조건
      } else if (userRole === 'branchAdmin') {
        const reservationStats = await getTodayReservationStats(branchId);
        const classes = await getPopularClasses(branchId);
        setStats({ reservationCount: reservationStats.count, reservationIncrease: reservationStats.increase });
        setPopularClasses(classes);
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className={styles["dashboard-ct"]}><p>로딩 중...</p></div>;

  return (
    <div className={styles["dashboard-ct"]}>
      <div className={styles["dashboard-title-ct"]}>
        <p>대시보드</p>
        <p>시스템 전체 현황을 확인하세요</p>
      </div>

      {role === 'totalAdmin' && (
        <>
          <div className={styles["dashboard-top-card-ct"]}>
            <DashboardCard 
              icon={adminUserDashboard} 
              title="전체 사용자" 
              count={stats.userCount} 
              increase={0} 
            />
            <DashboardCard 
              icon={adminTodayCalender} 
              title="오늘 예약 수" 
              count={stats.reservationCount} 
              increase={stats.reservationIncrease} 
            />
            <DashboardCard 
              icon={adminManageBracnh} 
              title="운영 지점" 
              count={stats.branchCount} 
              increase={0}
            />
          </div>

          <div className={styles["dashboard-middle-ct"]}>
            <div className={styles["dashboard-current-activity-ct"]}>
              <p className={styles["cureent-activity-title"]}>최근 활동</p>
              {pendingProfessors.length === 0 ? (
                <p className={styles["current-activity-empty"]}>승인 대기 중인 강사가 없습니다.</p>
              ) : (
                pendingProfessors.map((item) => (
                  <div key={item.id} className={styles["current-activity-content-ct"]}>
                    <p></p>
                    <div className={styles["current-activity-content"]}>
                      <p>새로운 강사 승인 요청 : {item.name}</p>
                      <p>{curActTime(item.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className={styles["dashboard-branches-utilization-ct"]}>
              <p className={styles["branches-utilization-title"]}>지점별 이용률</p>
              {branchUtilization.map((item, index) => (
                <div key={item.branchName} className={styles["barnches-utilization-content-ct"]}>
                  <div>
                    <p className={styles["branch-utilization-name"]}>{item.branchName}</p>
                    <p className={styles["branch-utilization-percent"]}>{item.utilization}%</p>
                  </div>
                  <div className={styles["branch-utilzation-progress-bar"]}>
                    <div style={{ width: `${item.utilization}%`, backgroundColor: USE_COLORS[index], height: '100%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {role === 'branchAdmin' && (
        <div className={styles["dashboard-top-card-ct"]}>
          <DashboardCard 
            icon={adminTodayCalender} 
            title="오늘 예약 수" 
            count={stats.reservationCount} 
            increase={stats.reservationIncrease} />
        </div>
      )}

      <div className={styles["dashboard-popular-class-ct"]}>
        <p className={styles["popular-class-title"]}>인기강의</p>
        <div className={styles["popular-class-content-ct"]}>
          {popularClasses.map((item, index) => (
            <DashboardPopularClassCard
              key={item.id}
              number={index + 1}
              title={item.title}
              professorName={item.professorName}
              branchName={item.branchName}
              openDate={item.openDate}
              currentCap={item.currentCap || 0}
              capacity={item.capacity || 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashBoardPage;
