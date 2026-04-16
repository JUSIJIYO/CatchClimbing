import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { signUp } from "../../services/authService";
import styles from "../../styles/css/auth/StuSignUpPage.module.css";
import upload from "../../assets/icon/signup-upload.svg";
import CheckModal from "../../components/common/ChkModal";
import ConfirmModal from "../../components/common/ConfirmModal";

function StuSignUpPage() {
  // 클라이밍 레벨 조건을 위한 객체
  const LEVELS = ["VB", "V0", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8+"];

  // 2번, 3번 질문 이용해서 레벨 설정하는 함수
  const handleLevlCondition = (qestion2, qestion3) => {
    if (!qestion2 || !qestion3) {
      return "";
    }

    // 레벨 조건이 V1~V2 처럼 두개 있을 경우 조건 설정
    const isRange = qestion2.includes("~");
    if (isRange) {
      const [lower, higher] = qestion2.split("~");
      // 0~3개 일때는 낮은 레벨 다른거는 전부 높은 레벨로 설정
      return qestion3 === "0~3개" ? lower.trim() : higher.trim();
    }
    if (qestion3 === "0~3개") {
      // 위에 작성한 레벨 객체와 2번에서 선택한 레벨에 index를 찾고 이게 0보다 클때 한단계 낮은 레벨 반환하고 가장 낮은 레벨일때는 해당 레벨만 반환하도록 설정함
      const idx = LEVELS.indexOf(qestion2);
      return idx > 0 ? LEVELS[idx - 1] : LEVELS[0];
    }
    return qestion2;
  };
  const navigate = useNavigate();

  // SignUpForm.jsx 에서 받아온 첫번째 회원가입 값 변수에 저장
  const location = useLocation();

  // 변수에 넣은값 옵셔널 체이닝 연산자로 받아오기~ 없을 때 빈 객체 넘겨주기
  const signupInf = location.state?.signupInf || {};

  // 프로필 이미지 상태  관리
  const [profileImg, setProfileImg] = useState(null);

  // 약관 동의 상태 관리
  const [terms, setTerms] = useState({
    all: false,
    service: false,
    privacy: false,
    marketing: false,
  });

  // 약관동의 관리 함수
  const handleTerms = (key) => {
    // 전체 선택시 한번에 체크
    if (key === "all") {
      const newVal = !terms.all;
      setTerms({
        all: newVal,
        service: newVal,
        privacy: newVal,
        marketing: newVal,
      });
    } else {
      // 전체선택 아닐시 클릭된 부분만 체크
      const updated = { ...terms, [key]: !terms[key] };
      updated.all = updated.service && updated.privacy && updated.marketing;
      setTerms(updated);
    }
  };

  // 답변 상태 관리
  const [answers, setAnswers] = useState({
    qestion1: "",
    qestion2: "",
    qestion3: "",
    qestion4: "",
    qestion5: "",
    qestion6: "",
  });

  // 레벨 정보 담는 변수
  const levelCondition = handleLevlCondition(answers.qestion2, answers.qestion3);

  // 에러 확인 모달 상태 관리
  const [checkModalInfo, setCheckModalInfo] = useState({
    show: false,
    title: "",
    message: "",
  });

  // 확인 모달 상태관리
  const [confirmModalInfo, setConfirmModalInfo] = useState({ show: false });

  // 폼 조건 설정
  const isFormReady =
    !!profileImg &&
    !!answers.qestion1 &&
    !!answers.qestion2 &&
    !!answers.qestion3 &&
    !!answers.qestion4 &&
    !!answers.qestion5 &&
    !!answers.qestion6 &&
    terms.service &&
    terms.privacy;

  // 파일 업로드 상태 관리 함수
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader(); // 파일 읽어서 다양한 형태로 변환해주는 내장 API
    reader.onloadend = () => setProfileImg(reader.result); // 읽기 완료되면 프로필 상태 변환
    reader.readAsDataURL(file); // 파일 읽어서 사용자가 바로 볼 수 있ㄱ ㅔ하기
  };

  // 답변 상태 관리 함수
  const handleAnswer = (qestion, value) => {
    setAnswers((receiveQuestion) => ({ ...receiveQuestion, [qestion]: value }));
  };

  // 이전 버튼 클릭시 이동할 경로
  const handlePrev = () => {
    navigate("/signup");
  };

  // 다음 버튼 클릭시 발생하는 함수
  const handleNext = () => {
    // 사진 선택하지 않을시 오류 모달
    if (!profileImg) {
      setCheckModalInfo({
        show: true,
        title: "회원가입 오류",
        message: "사진을 선택해주세요",
      });
      return;
    }
    // 질문 하나라도 답하지 않을시 오류 모달
    if (
      !answers.qestion1 ||
      !answers.qestion2 ||
      !answers.qestion3 ||
      !answers.qestion4 ||
      !answers.qestion5 ||
      !answers.qestion6
    ) {
      setCheckModalInfo({
        show: true,
        title: "회원가입 오류",
        message: "모든 정보를 입력해주세요",
      });
      return;
    }
    // 약관동의 진행하지 않을시 오류 모달
    if (!terms.service || !terms.privacy) {
      setCheckModalInfo({
        show: true,
        title: "회원가입 오류",
        message: "약관동의를 진행해주세요",
      });
      return;
    }
    setConfirmModalInfo({ show: true });
  };

  // 확인 모달에서 확인 누르면 firebase로 값 넘겨주고 회원가입 완료 페이지로 이동
  const handleConfirmSubmit = () => {
    setConfirmModalInfo({ show: false });
    const submit = async () => {
      try {
        const user = await signUp(signupInf.email, signupInf.password);
        const uid = user.uid;
        await setDoc(doc(db, "users", uid), {
          userId: signupInf.userId,
          password: signupInf.password,
          name: signupInf.name,
          phone: signupInf.phone,
          email: signupInf.email,
          birthDate: signupInf.birthDate,
          role: signupInf.role,
          level: levelCondition,
          levelPoint: 0,
          question: answers,
          profileImg: profileImg,
          autoLogin: false,
          createdAt: serverTimestamp(),
        });
        navigate("/signupcomplete", { replace: true });
      } catch (err) {
        console.log(err);
      }
    };
    submit();
  };

  // 첫 번째 질문들 값
  const questions1 = [
    { id: "six-month-less", label: "6개월 미만" },
    { id: "six-month-one-year", label: "6개월 ~ 1년" },
    { id: "one-two-year", label: "1 ~ 2년" },
    { id: "two-year-up", label: "2년 이상" },
  ];

  // 두 번째 질문들 값
  const questions2 = [
    "VB",
    "V0",
    "V1",
    "V1~V2",
    "V2~V3",
    "V3~V4",
    "V4~V5",
    "V5",
    "V5~V6",
    "V6~V7",
    "V7~V8",
    "V8+",
  ];

  // 세 번째 질문들 값
  const questions3 = [
    { id: "zero-three", label: "0~3개" },
    { id: "four-six", label: "4~6개" },
    { id: "seven-up", label: "7개 이상" },
  ];

  // ㄴ[] 번째 질문들 값
  const questions4 = [
    { id: "new", label: "처음" },
    { id: "little", label: "거의 안 함" },
    { id: "week-one", label: "주 1회" },
    { id: "week-two-three", label: "주 2~3회" },
    { id: "week-four-up", label: "주4회 이상" },
  ];

  // 다섯번째 질문들 값
  const questions5 = [
    { id: "nothing", label: "전혀 모름" },
    { id: "so-little", label: "조금 앎" },
    { id: "familiar", label: "익숙함" },
  ];

  // 여섯번째 질문들 값
  const questions6 = [
    { id: "experience", label: "체험" },
    { id: "hobby", label: "취미" },
    { id: "skill-upgrade", label: "실력향상" },
    { id: "player", label: "선수 수준 도전" },
  ];
  return (
    <>
      <form className={styles["stusignup-ct"]}>
        <article>
          <label className={styles["stusign-profile-title"]}>프로필 사진</label>
          <div className={styles["stusign-profile-upload-ct"]}>
            <img src={profileImg || upload} />
            <label htmlFor="profile-upload"> 사진 선택</label>
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={handleProfileUpload}
            />
          </div>
        </article>

        <label> 레벨 진단 </label>

        <article>
          <div className={styles["stusign-question-ct"]}>
            <p> 1. 클라이밍 경력이 어떻게 되시나요? </p>
            {questions1.map(({ id, label }) => (
              <div key={id}>
                <input
                  type="radio"
                  name="personal-history"
                  id={id}
                  value={label}
                  checked={answers.qestion1 === label}
                  onChange={() => handleAnswer("qestion1", label)}
                />
                <label htmlFor={id}> {label}</label>
              </div>
            ))}
          </div>
        </article>

        <article>
          <div className={styles["stusign-question-ct"]}>
            <div className={styles["stusign-level-check-ct"]}>
              <p>
                2. 편안하게 등반 가능한 난이도는? <span>(더클라임 기준)</span>
              </p>
              <button type="button"> 난이도 확인 </button>
            </div>
            {questions2.map((level) => (
              <div key={level}>
                <input
                  type="radio"
                  name="level-check"
                  id={`level-${level}`}
                  value={level}
                  checked={answers.qestion2 === level}
                  onChange={() => handleAnswer("qestion2", level)}
                />
                <label htmlFor={`level-${level}`}> {level}</label>
              </div>
            ))}
          </div>
        </article>

        <article>
          <div className={styles["stusign-question-ct"]}>
            <p> 3. 2번째에서 선택한 난이도에 문제를 몇 개 완등할 수 있나요? </p>
            {questions3.map(({ id, label }) => (
              <div key={id}>
                <input
                  type="radio"
                  name="solve-problem"
                  id={id}
                  value={label}
                  checked={answers.qestion3 === label}
                  onChange={() => handleAnswer("qestion3", label)}
                />
                <label htmlFor={id}> {label}</label>
              </div>
            ))}
          </div>
        </article>

        <article>
          <div className={styles["stusign-question-ct"]}>
            <p> 4. 클라이밍을 얼마나 자주하나요? </p>
            {questions4.map(({ id, label }) => (
              <div key={id}>
                <input
                  type="radio"
                  name="play-climbing-count"
                  id={id}
                  value={label}
                  checked={answers.qestion4 === label}
                  onChange={() => handleAnswer("qestion4", label)}
                />
                <label htmlFor={id}> {label}</label>
              </div>
            ))}
          </div>
        </article>

        <article>
          <div className={styles["stusign-question-ct"]}>
            <p> 5. 기본 기술(토훅, 캠퍼싱 등)을 알고 있나요? </p>
            {questions5.map(({ id, label }) => (
              <div key={id}>
                <input
                  type="radio"
                  name="climbing-skill"
                  id={id}
                  value={label}
                  checked={answers.qestion5 === label}
                  onChange={() => handleAnswer("qestion5", label)}
                />
                <label htmlFor={id}> {label}</label>
              </div>
            ))}
          </div>
        </article>

        <article>
          <div className={styles["stusign-question-ct"]}>
            <p> 6. 클라이밍을 하는 목표는 무엇인가요? </p>
            {questions6.map(({ id, label }) => (
              <div key={id}>
                <input
                  type="radio"
                  name="climbing-target"
                  id={id}
                  value={label}
                  checked={answers.qestion6 === label}
                  onChange={() => handleAnswer("qestion6", label)}
                />
                <label htmlFor={id}> {label}</label>
              </div>
            ))}
          </div>
        </article>

        <article>
          <label> 약관 동의 </label>
          <div className={styles["stusign-question-ct"]}>
            <div>
              <input
                type="checkbox"
                id="stu-terms-all"
                checked={terms.all}
                onChange={() => handleTerms("all")}
              />
              <label htmlFor="stu-terms-all"> 모든 약관에 동의합니다 </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="stu-terms-service"
                checked={terms.service}
                onChange={() => handleTerms("service")}
              />
              <label htmlFor="stu-terms-service"> 이용약관에 동의합니다 </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="stu-terms-privacy"
                checked={terms.privacy}
                onChange={() => handleTerms("privacy")}
              />
              <label htmlFor="stu-terms-privacy">
                {" "}
                개인정보 처리방침에 동의합니다{" "}
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="stu-terms-marketing"
                checked={terms.marketing}
                onChange={() => handleTerms("marketing")}
              />
              <label htmlFor="stu-terms-marketing">
                {" "}
                마케팅 정보 수신에 동의합니다(선택){" "}
              </label>
            </div>
          </div>
        </article>
      </form>

      <div className={styles["stusign-btn-ct"]}>
        <button type="button" onClick={handlePrev}>
          이전
        </button>
        <button
          type="button"
          onClick={handleNext}
          className={isFormReady ? styles["stusign-btn-active"] : ""}
        >
          다음
        </button>
      </div>

      {checkModalInfo.show && (
        <CheckModal
          title={checkModalInfo.title}
          message={checkModalInfo.message}
          onConfirm={() =>
            setCheckModalInfo({ show: false, title: "", message: "" })
          }
        />
      )}

      {confirmModalInfo.show && (
        <ConfirmModal
          message="회원가입이 완료되었습니다"
          onConfirm={handleConfirmSubmit}
        />
      )}
    </>
  );
}

export default StuSignUpPage;
