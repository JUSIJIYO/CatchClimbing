import React from "react";
import styles from "../../styles/css/auth/LoginForm.module.css";
import { useNavigate } from "react-router-dom";
import closeEye from "../../assets/icon/closeEye.svg";
import openEye from "../../assets/icon/openEye.svg";

function LoginForm() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/signup");
  };

  return (
    <>
      <form className={styles["loginForm-ct"]}>
        <div className={styles["login-input-ct"]}>
          <label> 아이디 </label>
            <input type="text" placeholder="이메일을 입력하세요" />
        </div>

        <div className={styles["login-input-ct"]}>
          <label> 비밀번호 </label>
          <div className={styles["login-paswword-visible"]}>
            <input type="password" placeholder="비밀번호를 입력하세요" />
            <img src={closeEye} />
          </div>
        </div>

        <div className={styles["login-checkbox-ct"]}>
          <input type="checkbox" />
          <label> 자동 로그인</label>
        </div>

        <button type="submit"> 로그인 </button>
        <button onClick={handleClick}> 회원가입 </button>
      </form>
    </>
  );
}

export default LoginForm;
