import React from "react";
import openEye from "../../assets/icon/openEye.svg";
import closeEye from "../../assets/icon/closeEye.svg";
import calender from "../../assets/icon/calender.png";
import styles from "../../styles/css/auth/SignUpForm.module.css";

function SignUpForm() {
  return (
    <>
    <form id="signupForm"className={styles["signupForm-ct"]}>
      <article>
        <label> 아이디</label>
        <div className={styles["signup-id-ct"]}>
          <input type="text" placeholder="아이디 입력" />
          <button> 중복확인 </button>
        </div>
        <p> 영문, 숫자를 포함해 4글자 이상 입력해주세요.</p>
      </article>

      <article>
        <label> 비밀번호 </label>
        <div className={styles["signup-password-ct"]}>
          <input type="password" placeholder="비밀번호 입력" />
          <img src={closeEye} />
        </div>
        <p> 영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요</p>
      </article>

      <article>
        <label> 비밀번호 확인 </label>
        <div className={styles["signup-password-ct"]}>
          <input type="password" placeholder="비밀번호 재입력" />
          <img src={closeEye} />
        </div>
        <p> {} </p>
      </article>

      <article>
        <label> 이름 </label>
        <input type="text" placeholder="이름 입력" />
      </article>

      <article>
        <label> 생년월일 </label>
        <div className={styles["signup-birthday-ct"]}>
          <input type="text" placeholder="비밀번호 입력" />
          <img src={calender} />
        </div>
      </article>

      <article>
        <label> 휴대폰 번호 </label>
        <input type="text" placeholder="010-1234-5678" />
        <p> {} </p>
      </article>

      <article>
        <label> 이메일 </label>
        <div className={styles["signup-email-ct"]}>
          <input type="text" placeholder="이메일 입력" />
          <select>
            <option>직접 입력</option>
            <option>@naver.com</option>
            <option>@gamil.com</option>
            <option>@daum.net</option>
          </select>
        </div>
        <p> {} </p>
      </article>

      <article>
        <label> 회원 유형</label>
        <div className={styles["signup-user-category-ct"]}>
          <div>
            <p> 🧗 </p>
            <p> 수강생 </p>
          </div>
          <div>
            <p> 👨‍🏫 </p>
            <p> 강사 </p>
          </div>
        </div>
      </article>
    </form>
    <button className={styles["signup-nextbtn"]} type="submit" form="signupForm"> 다음 </button>
  </>
  );
}

export default SignUpForm;
