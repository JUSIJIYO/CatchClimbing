import React from "react";
import styles from "../../styles/css/auth/StuSignUpPage.module.css";
import upload from '../../assets/icon/signup-upload.svg'

function StuSignUpPage() {
  return (
    <>
      <form className={styles["stusignup-ct"]}>
        <article>
          <label className={styles["stusign-profile"]}> 프로필 사진 </label>
          <div>
            <img src={upload}/>
            <input type="file" />
          </div>
        </article>
        <label> 레벨 진단 </label>
        <article>
          <div>
            <p> 1. 클라이밍 경력이 어떻게 되시나요? </p>
            <div>
              <input type="radio" />
              <label> 6개월 미만</label>
            </div>

            <div>
              <input type="radio" />
              <label> 6개월 ~ 1년 </label>
            </div>
            <div>
              <input type="radio" />
              <label> 1 ~ 2년 </label>
            </div>
            <div>
              <input type="radio" />
              <label> 2년 이상 </label>
            </div>
          </div>
        </article>
        <article>
          <label> 레벨 진단 </label>
          <div>
            <div>
              <p> 2. 편안하게 등반 가능한 난이도는? </p>
              <button> 난이도 확인 </button>
            </div>
            <div>
              <input type="radio" />
              <label> VB</label>
            </div>

            <div>
              <input type="radio" />
              <label> V0 </label>
            </div>
            <div>
              <input type="radio" />
              <label> V1 </label>
            </div>
            <div>
              <input type="radio" />
              <label> V1~V2 </label>
            </div>
            <div>
              <input type="radio" />
              <label> V2~V3 </label>
            </div>
            <div>
              <input type="radio" />
              <label> V3~V4 </label>
            </div>
            <div>
              <input type="radio" />
              <label> V4~V5 </label>
            </div>
            <div>
              <input type="radio" />
              <label> V5 </label>
            </div>
            <div>
              <input type="radio" />
              <label> V5~V6 </label>
            </div>
            <div>
              <input type="radio" />
              <label> V6~V7 </label>
            </div>
            <div>
              <input type="radio" />
              <label> V7~V8 </label>
            </div>
            <div>
              <input type="radio" />
              <label> V8+ </label>
            </div>
          </div>
        </article>

        <article>
          <div>
            <p> 3. 2번째에서 선택한 난이도에 문제를 몇 개 완등할 수 있나요? </p>

            <div>
              <input type="radio" />
              <label> 0~3개 </label>
            </div>
            <div>
              <input type="radio" />
              <label> 4~6개 </label>
            </div>
            <div>
              <input type="radio" />
              <label> 7개 이상 </label>
            </div>
          </div>
        </article>

        <article>
          <div>
            <p> 4. 클라이밍을 얼마나 자주하나요? </p>
            <div>
              <input type="radio" />
              <label> 처음 </label>
            </div>

            <div>
              <input type="radio" />
              <label> 거의 안 함</label>
            </div>

            <div>
              <input type="radio" />
              <label> 주 1회 </label>
            </div>
            <div>
              <input type="radio" />
              <label> 주 2~3회 </label>
            </div>
            <div>
              <input type="radio" />
              <label> 주4회 이상</label>
            </div>
          </div>
        </article>
        <article>
          <div>
            <p> 5. 기본 기술(토훅, 캠퍼싱 등)을 알고 있나요? </p>
            <div>
              <input type="radio" />
              <label> 전혀 모름 </label>
            </div>

            <div>
              <input type="radio" />
              <label> 조금 앎 </label>
            </div>
            <div>
              <input type="radio" />
              <label> 익숙함 </label>
            </div>
          </div>
        </article>

        <article>
          <div>
            <p> 6. 클라이밍을 하는 목표는 무엇인가요? </p>
            <div>
              <input type="radio" />
              <label> 체험 </label>
            </div>

            <div>
              <input type="radio" />
              <label> 취미 </label>
            </div>
            <div>
              <input type="radio" />
              <label> 실력향상 </label>
            </div>
            <div>
              <input type="radio" />
              <label> 선수 수준 도전 </label>
            </div>
          </div>
        </article>

        <article>
          <label> 약관 동의 </label>
          <div>
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
    </>
  );
}

export default StuSignUpPage;
