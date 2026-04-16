import React from "react";
import styles from "../../styles/css/auth/PrfSignUpPage.module.css";
import profileupload from "../../assets/icon/signup-upload.svg";
import qualificationsupload from "../../assets/icon/signUpUpload.svg";

function ProfessorRegisterPage() {
  return (
    <>
      <form className={styles["prfsignup-ct"]}>
        <article>
          <label className={styles["prfsign-title"]}>프로필 사진</label>
          <div className={styles["prfsign-profile-upload-ct"]}>
            <img src={profileupload} />
            <label for="profile-upload"> 사진 선택</label>
            <input type="file" id="profile-upload" />
            <select>
              <option> 양재점 </option>
              <option> 홍대점 </option>
              <option> 일산점 </option>
              <option> 신사점 </option>
              <option> 마곡점 </option>
              <option> 연남점 </option>
              <option> 문래점 </option>
              <option> 성수점 </option>
              <option> 이수점 </option>
              <option> 신림점 </option>
              <option> 강남점 </option>
              <option> 사당점 </option>
              <option> 논현점 </option>
            </select>
          </div>
        </article>

        <article>
          <label className={styles["prfsign-title"]}>
            클라이밍 레벨
            <div className={styles["prfsign-level-ct"]}>
              <button> VB </button>
              <button> V0 </button>
              <button> V1</button>
              <button> V2 </button>
              <button> V3 </button>
              <button> V4 </button>
              <button> V5</button>
              <button> V6</button>
              <button> V7</button>
              <button> V8</button>
              <button> V8+ </button>
            </div>
          </label>
        </article>

        <article>
          <label className={styles["prfsign-title"]}> 자격증 (최대 2개) </label>
          <div className={styles["prfsign-qualification-upload-ct"]}> 
            <label for="qualification-upload">
              <img src={qualificationsupload}/>
              <p> 자격증 업로드</p>
            </label>
            <input type="file" id="qualification-upload"/>
          </div>
        </article>

        <article>
          <label className={styles["prfsign-title"]}> 약관 동의 </label>
          <div className={styles["prfsign-question-ct"]}>
            <div>
              <input type="checkbox" />
              <label> 모든 약관에 동의합니다 </label>
            </div>

            <div>
              <input type="checkbox" />
              <label> 이용약관에 동의합니다 </label>
            </div>
            <div>
              <input type="checkbox" />
              <label> 개인정보 처리방침에 동의합니다 </label>
            </div>
            <div>
              <input type="checkbox" />
              <label> 마케팅 정보 수신에 동의합니다(선택) </label>
            </div>
          </div>
        </article>
      </form>

      <div className={styles["prfsign-btn-ct"]}>
        <button> 이전 </button>
        <button> 다음 </button>
      </div>
    </>
  );
}

export default ProfessorRegisterPage;
