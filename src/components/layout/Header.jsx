import React, { useState, useEffect } from "react";
import logo from "../../assets/icon/climbing_logo.png";
import loginIcon from "../../assets/icon/login.svg";
import logoutIcon from "../../assets/icon/logout.svg";
import title from "../../assets/icon/logo.png";
import styles from "../../styles/css/layout/header.module.css";
import Nav from "./Nav";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import { useAuth } from "../../context/AuthContext";
import { getBranchName } from "../../services/adminService";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, userData } = useAuth();
  const [user, setUser] = useState(null);
  const [branchName, setBranchName] = useState("");

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDoneModal, setShowDoneModal] = useState(false);

  // 현재 위치 확인(관리자 화면 or 수강생 화면인지)
  const isAdminPath = location.pathname.startsWith("/admin");
  // admin일 때 롤값 저장
  const isAdmin = role === "totalAdmin" || role === "branchAdmin";

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // 지점 관리자일때 브랜치명 가져오기
  useEffect(() => {
    if (role === "branchAdmin" && userData?.branchId) {
      getBranchName(userData.branchId).then(setBranchName);
    }
  }, [role, userData?.branchId]);

  const handleAuth = () => {
    if (user) {
      setShowLogoutModal(true);
    } else {
      navigate("/login");
    }
  };

  const handleLogoutConfirm = async () => {
    const auth = getAuth();
    await signOut(auth);
    setShowLogoutModal(false);
    setShowDoneModal(true);
  };

  // 사용자 화면으로 / 관리자 화면으로 관리 함수
  const handleViewToggle = () => {
    if (isAdminPath) {
      navigate("/");
    } else {
      navigate("/admin");
    }
  };

  return (
    <>
      {!isAdmin && (
        <header className={styles["header"]}>
          <div className={styles["left"]}>
            <img src={logo} alt="logo" className={styles["logo"]} />
            <img src={title} alt="title" className={styles["title"]} />
          </div>

          <Nav />

          <div>
            <button
              className={`${styles["button"]} ${
                user ? styles["logout"] : styles["login"]
              }`}
              onClick={handleAuth}
            >
              <img
                src={user ? logoutIcon : loginIcon}
                alt="icon"
                className={styles["icon"]}
              />
              {user ? "로그아웃" : "로그인"}
            </button>
          </div>
        </header>
      )}

      {isAdmin && (
        <header className={styles["header-admin-ct"]}>
          <div className={styles["header-admin-left"]}>
            {role === "totalAdmin" && <p>통합관리자</p>}
            {role === "branchAdmin" && (
              <p>
                지점관리자 <span>({branchName})</span>
              </p>
            )}
          </div>

          {!isAdminPath && <Nav />}

          <div className={styles["header-right-ct"]}>
            <p onClick={handleViewToggle}>
              {isAdminPath ? "사용자 화면으로" : "관리자 화면으로"}
            </p>
            <button
              className={`${styles["button"]} ${
                user ? styles["logout"] : styles["login"]
              }`}
              onClick={handleAuth}
            >
              <img
                src={user ? logoutIcon : loginIcon}
                alt="icon"
                className={styles["icon"]}
              />
              {user ? "로그아웃" : "로그인"}
            </button>
          </div>
        </header>
      )}

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
            navigate("/");
          }}
        />
      )}
    </>
  );
}

export default Header;
