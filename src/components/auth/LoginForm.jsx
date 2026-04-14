import React from "react";
import styles from '../../styles/css/auth/LoginForm.module.css';

function LoginForm() {
  return (
    <>
      <form className={styles["loginForm-ct"]}>
        <div className={styles["login-input-ct"]}>
          <label> 아이디 </label>
          <input type="text" placeholder="이메일을 입력하세요" />
        </div>

        <div className={styles["login-input-ct"]}>
          <label> 비밀번호 </label>
          <input type="password" placeholder="비밀번호를 입력하세요" />
        </div>

        <div className={styles["login-checkbox-ct"]}>
          <input type="checkbox" />
          <label> 자동 로그인</label>
        </div>

        <button type="submit"> 로그인 </button>
        <button> 회원가입 </button>
      </form>
    </>
  );
}

export default LoginForm;
