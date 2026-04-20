import React, { useState } from "react";
import styles from "../../styles/css/auth/LoginForm.module.css";
import { useNavigate } from "react-router-dom";
import closeEye from "../../assets/icon/closeEye.svg";
import openEye from "../../assets/icon/openEye.svg";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from "../../firebase/config";
import CheckModal from "../common/ChkModal";

function LoginForm() {
  const navigate = useNavigate();

  // 에러시 이메일 상태 관리
  const [email, setEmail] = useState("");

  // 에러시 패스워드 상태 관리
  const [password, setPassword] = useState("");

  // 비밀번호 보이기 (눈 친구 클릭)
  const [showPassword, setShowPassword] = useState(false);


  const [autoLogin, setAutoLogin] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "이메일을 입력해 주세요.";
    if (!password.trim()) newErrors.password = "비밀번호를 입력해 주세요.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      // 자동로그인 체크에 따른 로그인 정보 로컬, 세션 선택
      const autoLoginStatus = autoLogin ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, autoLoginStatus);
      await signInWithEmailAndPassword(auth, email, password);
      setShowModal(true);
    } catch (error) {
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        setErrors({ auth: "아이디 또는 비밀번호가 일치하지 않습니다." });
      } else {
        setErrors({ auth: "로그인 중 오류가 발생했습니다. 다시 시도해 주세요." });
      }
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <>
      {showModal && (
        <CheckModal
          title="로그인 성공"
          message="환영합니다! 로그인되었습니다."
          onConfirm={handleModalConfirm}
        />
      )}

      <form className={styles["loginForm-ct"]} onSubmit={handleSubmit}>
        <div className={styles["login-input-ct"]}>
          <label>이메일</label>
          <input
            type="text"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className={styles["login-error"]}>{errors.email}</p>
          )}
        </div>

        <div className={styles["login-input-ct"]}>
          <label>비밀번호</label>
          <div className={styles["login-paswword-visible"]}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              src={showPassword ? openEye : closeEye}
              onClick={() => setShowPassword((prev) => !prev)}
              style={{ cursor: "pointer" }}
            />
          </div>
          {errors.password && (
            <p className={styles["login-error"]}>{errors.password}</p>
          )}
        </div>

        {errors.auth && (
          <p className={styles["login-error"]}>{errors.auth}</p>
        )}

        <div className={styles["login-checkbox-ct"]}>
          <input
            type="checkbox"
            id="auto-login"
            checked={autoLogin}
            onChange={(e) => setAutoLogin(e.target.checked)}
          />
          <label htmlFor="auto-login">자동 로그인</label>
        </div>

        <button type="submit" className={styles[`${email && password ? "login-btn-active": ""}`]}>로그인</button>
        <button type="button" onClick={() => navigate("/signup")}>
          회원가입
        </button>
      </form>
    </>
  );
}

export default LoginForm;