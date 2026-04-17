import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/css/auth/SignUpCompletePage.module.css";
import signUpCompleteUser from "../../assets/icon/signUpCompleteUser.svg";
import signUpCompleteCheck from "../../assets/icon/signupCompleteCheck.svg";
import signUpCompleteCheck2 from "../../assets/icon/signupCompleteCheck2.svg";
import centerFind from "../../assets/icon/centerFind.svg";
import calender from "../../assets/icon/calenderReservation.svg";
import progressTracking from "../../assets/icon/progressTracking.svg";
import email from '../../assets/icon/email.svg'
import filecheck from '../../assets/icon/fileCheck.svg'
import prfCalender from '../../assets/icon/prfCalender.svg'
import prfAccess from '../../assets/icon/prfAccess.svg'

// 수정 필요 ( 논의 사항 )
const getLevelStyle = (level) => {
  if (level === 'VB') return { bg: '#ffffff', color: '#2c3e50', border: '1px solid rgba(44, 62, 80, 0.2)' };
  if (level === 'V0') return { bg: '#fff3bf', color: '#8a6d00' };
  if (level === 'V8+') return { bg: '#343a40', color: '#fff' };
  if (level === 'V1') return { bg: '#ffe5d0', color: '#c2410c' };
  if (level === 'V2') return { bg: '#dbeafe', color: '#1d4ed8' };
  if (level === 'V3') return { bg: '#fde2e4', color: '#c9184a' };
  if (level === 'V4') return { bg: '#e5dbff', color: '#5f3dc4' };
  if (level === 'V5') return { bg: '#e9ecef', color: '#495057' };
  if (level === 'V6') return { bg: '#ede0d4', color: '#7f5539' };
  return { bg: '#ffffff', color: '#2c3e50' };
};

function SignUpCompletePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, level, role } = location.state || {};
  const levelStyle = getLevelStyle(level);
  const isProfessor = role === 'professor';

  return (
    <div className={styles["signup-total-complete-ct"]}>
      <div className={styles["signup-complete-ct"]}>
        <article className={styles["sign-complete-user-ct"]}>
          {/* 역할에 따라 다른 이미지 나올 수 있게 설정할 예정 */}
          <img src={signUpCompleteCheck} />
          <img src={signUpCompleteUser} />
          <p> {name} </p>
          <div className={styles["sign-complete-level-ct"]}>
            <p
              // 임시작업 클래스 부여하는 형태로 바꿀 예정
              style={{
                backgroundColor: levelStyle.bg,
                color: levelStyle.color,
                border: levelStyle.border || 'none',
              }}
            >
            </p>
            <p> {level} 플레이어 </p>
          </div>
          <p>
            클라이밍의 새로운 경험을 <br />
            시작해보세요🎉
          </p>
        </article>

        <article className={styles["sign-complete-instructions-ct"]}>
          <div className={styles["sign-complete-instructions-top"]}>
            <img src={signUpCompleteCheck2} />
            <p> 회원가입 완료 </p>
          </div>

          {isProfessor ? (
            <>
              <p> 환영합니다!</p>
              <p> 잡아주시지요의 강사가 된 것을 환영합니다 </p>
              <p>
                관리자 승인 후 강사 기능을 이용하실 수 있습니다.
              </p>
              <div className={styles["sign-complete-prf-message-ct"]}>
                <div className={styles["sign-complete-prf-message-top"]}>
                  <img src={prfAccess}/>
                  <p> 승인 절차 안내</p>
                </div>

                <div className={styles["sign-complete-message-ct"]}>
                  <img src={filecheck}/>
                  <div>
                    <p> 서류 검토 </p>
                    <p> 관리자가 제출하신 자격증과 신청 내용을 검토합니다 </p>
                  </div>
                </div>

                <div className={styles["sign-complete-message-ct"]}>
                  <img src={email}/>
                  <div>
                    <p> 이메일 통보 </p>
                    <p> 승인 결과를 등록하신 이메일로 안내드립니다 </p>
                  </div>
                </div>

                <div className={styles["sign-complete-message-ct"]}>
                  <img src={prfCalender}/>
                  <div>
                    <p> 처리 기간 </p>
                    <p> 평균 1-2 영업일이 소요되며, 최대한 빠르게 처리하겠습니다 </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <p> 환영합니다!</p>
              <p> 잡아주시지요의 회원이 된 것을 환영합니다 </p>
              <p>
                이제 다양한 클라이밍 센터를 탐색하고, 수업을 예약하며, <br />{" "}
                클라이밍 커뮤니티와 소통할 수 있습니다.
              </p>
              <div>
                <div className={styles["sign-complete-message-ct"]}>
                  <img src={centerFind} />
                  <div>
                    <p> 센터 탐색</p>
                    <p> 가까운 클라이밍 센터를 찾고 시설 정보를 확인해보세요</p>
                  </div>
                </div>

                <div className={styles["sign-complete-message-ct"]}>
                  <img src={calender} />
                  <div>
                    <p> 수업 예약</p>
                    <p> 원하는 시간에 원하는 강사와 함께 수업을 예약하세요</p>
                  </div>
                </div>

                <div className={styles["sign-complete-message-ct"]}>
                  <img src={progressTracking} />
                  <div>
                    <p> 진행률 추적 </p>
                    <p> 나의 클라이밍 기록을 관리하고 설정을 확인하세요 </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </article>
      </div>

      <button
        className={styles["sign-complete-btn"]}
        onClick={() => navigate("/login")}
      >
        로그인하고 시작하기 &#8594;
      </button>
    </div>
  );
}

export default SignUpCompletePage;
