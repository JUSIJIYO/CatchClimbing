import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { signUp } from "../../services/authService";
import styles from "../../styles/css/auth/PrfSignUpPage.module.css";
import profileupload from "../../assets/icon/signup-upload.svg";
import qualificationsupload from "../../assets/icon/signUpUpload.svg";
import qualificationCheck from "../../assets/icon/qualificationCheck.svg";
import CheckModal from "../../components/common/ChkModal";
import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";

function PrfSignUpPage() {
  // 클라이밍 레벨 객체
  const LEVELS = [
    "VB",
    "V0",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
    "V7",
    "V8",
    "V8+",
  ];

  const navigate = useNavigate();

  // SignUpForm.jsx에서 받아온 첫번째 회원가입 값 변수에 저장
  const location = useLocation();

  // 변수에 넣은값 옵셔널 체이닝 연산자로 받고 없을 땐 빈 객체 넘기기
  const signupInf = location.state?.signupInf || {};

  const qualificationInputRef = useRef(null);

  // 프로필 이미지 상태 관리
  const [profileImg, setProfileImg] = useState(null);

  // 지점선택 상태 관리
  const [branchId, setBranchId] = useState("");

  // 레벨선택 상태 관리
  const [selectedLevel, setSelectedLevel] = useState("");

  // 자격증 선택 사진 관리
  const [qualifications, setQualifications] = useState([]);

  // 약과동의 상태관리
  const [terms, setTerms] = useState({
    all: false,
    service: false,
    privacy: false,
    marketing: false,
  });

  // 에러 확인 모달 상태 관리
  const [checkModalInfo, setCheckModalInfo] = useState({
    show: false,
    title: "",
    message: "",
  });

  // 모달 삭제 상태관리
  const [deleteModalInfo, setDeleteModalInfo] = useState({
    show: false,
    targetIndex: null,
  });

  // 확인 모달 상태관리
  const [confirmModalInfo, setConfirmModalInfo] = useState({ show: false });

  // 프로필 업로드 관리 함수
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader(); // 파일 읽어서 다양한 형태로 변환해주는 내장 API
    reader.onloadend = () => setProfileImg(reader.result); // 읽기 완료되면 프로필 상태 변환
    reader.readAsDataURL(file); // 파일 읽어서 사용자가 바로 볼 수 있ㄱ ㅔ하기
  };

  const handleQualificationUpload = (e) => {
    const file = e.target.files[0];
    if (!file || qualifications.length >= 2) return;
    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
    setQualifications([...qualifications, { name: file.name, date: dateStr }]);
    e.target.value = "";
  };

  // 업로드한 파일 삭제 관리 함수
  const handleDeleteQualification = (index) => {
    setDeleteModalInfo({ show: true, targetIndex: index });
  };

  // 
  const handleConfirmDelete = () => {
    setQualifications(
      qualifications.filter((_, i) => i !== deleteModalInfo.targetIndex),
    );
    setDeleteModalInfo({ show: false, targetIndex: null });
  };

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

  // 버튼 활성화 조건
  const isFormReady =
    !!profileImg &&
    !!branchId &&
    !!selectedLevel &&
    qualifications.length >= 1 &&
    terms.service &&
    terms.privacy;

  // 이전 버튼 클릭시 이동경로
  const handlePrev = () => {
    navigate("/signup");
  };

  // 다음 버튼 클릭시 발생하는 함수
  const handleNext = () => {
    // 사진 비어 있을시 경고 모달 
    if (!profileImg) {
      setCheckModalInfo({
        show: true,
        title: "회원가입 오류",
        message: "사진을 선택해주세요",
      });
      return;
    }
    // 지점선택, 레벨, 자격증 중 입력하지 않으면 경고 모달 
    if (!branchId || !selectedLevel || qualifications.length < 1) {
      setCheckModalInfo({
        show: true,
        title: "회원가입 오류",
        message: "모든 정보를 입력해주세요",
      });
      return;
    }
    // 약관동의 체크안할시 경고 모달
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

  // 조건 충족된 상황에서 모달이 뜨고 모달애소 확인 누르면 firebase로 값 넘겨주고 회원가입 완료 페이지로 이동
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
          role: "professor",
          level: selectedLevel,
          branchId,
          career: [],
          qualifications: qualifications.map((qualifi) => ({
            name: qualifi.name,
            date: qualifi.date,
          })),
          isApproved: false,
          profileImg,
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

  return (
    <>
      <form className={styles["prfsignup-ct"]}>
        <article>
          <label className={styles["prfsign-title"]}>프로필 사진</label>
          <div className={styles["prfsign-profile-upload-ct"]}>
            <img src={profileImg || profileupload} />
            <label htmlFor="profile-upload">사진 선택</label>
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={handleProfileUpload}
            />
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
            >
              <option value="">지점선택</option>
              <option value="양재점">양재점</option>
              <option value="홍대점">홍대점</option>
              <option value="일산점">일산점</option>
              <option value="신사점">신사점</option>
              <option value="마곡점">마곡점</option>
              <option value="연남점">연남점</option>
              <option value="문래점">문래점</option>
              <option value="성수점">성수점</option>
              <option value="이수점">이수점</option>
              <option value="신림점">신림점</option>
              <option value="강남점">강남점</option>
              <option value="사당점">사당점</option>
              <option value="논현점">논현점</option>
            </select>
          </div>
        </article>

        <article>
          <label className={styles["prfsign-title"]}>
            클라이밍 레벨
            <div className={styles["prfsign-level-ct"]}>
              {LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  className={
                    selectedLevel === level
                      ? styles["prfsign-level-active"]
                      : ""
                  }
                  onClick={() => setSelectedLevel(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </label>
        </article>

        <article>
          <label className={styles["prfsign-title"]}>자격증 (최대 2개)</label>
          <div className={styles["prfsign-qualification-upload-ct"]}>
            {qualifications.length === 0 ? (
              <label htmlFor="qualification-upload">
                <img src={qualificationsupload} />
                <p>자격증 업로드</p>
              </label>
            ) : (
              <div className={styles["prfsign-add-qualification-ct"]}>
                {qualifications.map((q, i) => (
                  <div key={i} className={styles["prfsign-add-qualification"]}>
                    <img src={qualificationCheck} />
                    <div
                      className={styles["prfsign-add-qualification-content-ct"]}
                    >
                      <p>{q.name}</p>
                      <p>{q.date}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteQualification(i)}
                    >
                      X
                    </button>
                  </div>
                ))}
                {qualifications.length < 2 && (
                  <button
                    type="button"
                    onClick={() => qualificationInputRef.current?.click()}
                  >
                    +
                  </button>
                )}
              </div>
            )}
            <input
              type="file"
              id="qualification-upload"
              ref={qualificationInputRef}
              onChange={handleQualificationUpload}
            />
          </div>
        </article>

        <article>
          <label className={styles["prfsign-title"]}>약관 동의</label>
          <div className={styles["prfsign-question-ct"]}>
            <div>
              <input
                type="checkbox"
                id="terms-all"
                checked={terms.all}
                onChange={() => handleTerms("all")}
              />
              <label htmlFor="terms-all">모든 약관에 동의합니다</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="terms-service"
                checked={terms.service}
                onChange={() => handleTerms("service")}
              />
              <label htmlFor="terms-service">이용약관에 동의합니다</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="terms-privacy"
                checked={terms.privacy}
                onChange={() => handleTerms("privacy")}
              />
              <label htmlFor="terms-privacy">
                개인정보 처리방침에 동의합니다
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="terms-marketing"
                checked={terms.marketing}
                onChange={() => handleTerms("marketing")}
              />
              <label htmlFor="terms-marketing">
                마케팅 정보 수신에 동의합니다(선택)
              </label>
            </div>
          </div>
        </article>
      </form>

      <div className={styles["prfsign-btn-ct"]}>
        <button type="button" onClick={handlePrev}>
          이전
        </button>
        <button
          type="button"
          onClick={handleNext}
          className={isFormReady ? styles["prfsign-btn-active"] : ""}
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

      {deleteModalInfo.show && (
        <Modal
          title="파일 삭제"
          message="선택된 파일을 삭제하시겠습니까?"
          cancelText="취소"
          confirmText="확인"
          onCancel={() =>
            setDeleteModalInfo({ show: false, targetIndex: null })
          }
          onConfirm={handleConfirmDelete}
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

export default PrfSignUpPage;
