import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from '../components/layout/Header';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/common/ConfirmModal';

// 비활성화 유저 함수 (시간되면 컴포넌트로 뺴서 사용하기)
function DeactivateUser() {
  // 유저 정보 가져오기
  const { userData } = useAuth();
  const location = useLocation();

  // 모달 상태 관리
  const [showModal, setShowModal] = useState(false);

  // 유저가 비활성화 일 때 모달 출력 
  useEffect(() => {
    if (userData && userData.isactivate === false) {
      setShowModal(true);
    }
    // (페이지가 바뀔때, 유저 정보가 바뀔때)
  }, [location.pathname, userData]);

  // 비활성화 아닐때 그대로 작동하게
  if (!showModal) {
    return null;
  }
  // 비활성화 되었을 때 모달 뜨게
  return (
    <ConfirmModal
      message="비활성화된 계정입니다. 관리자에게 문의하세요."
      onConfirm={() => setShowModal(false)}
    />
  );
}

function MainLayout() {
  return (
    <>
      <Header />
      <DeactivateUser />
      <Outlet />
    </>
  );
}

export default MainLayout;
