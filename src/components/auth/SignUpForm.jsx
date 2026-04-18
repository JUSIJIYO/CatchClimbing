import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import openEye from '../../assets/icon/openEye.svg';
import closeEye from '../../assets/icon/closeEye.svg';
import calender from '../../assets/icon/calender.png';
import styles from '../../styles/css/auth/SignUpForm.module.css';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../services/authService';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import CheckModal from '../common/ChkModal';

function SignUpForm() {
  const navigate = useNavigate();

  // 회원 유형 선택 상태 관리
  const [roleSelect, setRoleSelect] = useState('');

  // 아이디 상태 관리 (에러메시지)
  const [idStatus, setIdStatus] = useState({
    message: '',
    inputclass: '',
    pharse: '',
    state: false,
  });

  // 비밀번호 상태 관리 (에러메시지)
  const [passwordStatus, setPasswordStatus] = useState({
    message: '',
    inputclass: '',
    pharse: '',
    state: false,
  });

  // 비밀번호 확인 상태 (에러메시지)
  const [passwordCheck, setPasswordCheck] = useState({
    message: '',
    inputclass: '',
    pharse: '',
    state: false,
  });

  // 비밀번호, 비밀번호 확인 type 상태
  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    passwordCheck: false,
  });

  // 휴대폰 번호 상태 관리
  const [phone, setPhone] = useState({
    message: '',
    inputclass: '',
    pharse: '',
    state: false,
  });

  // 이메일 상태 관리
  const [emailStatus, setEmailStatus] = useState({
    message: '',
    inputclass: '',
    pharse: '',
    state: false,
  });

  // 이메일 선택 상태
  const [emailSelect, setEmailSelect] = useState('직접 입력');

  // 달력 선택 날짜 상태
  const [selectedDate, setSelectedDate] = useState(null);

  // 회원 유형별로 넘겨줄 데이터 form
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    name: '',
    birthDate: '',
    phone: '',
    email: '',
    role: roleSelect,
  });

  // 모달 상태 관리
  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: '',
    message: '',
  });
  const handleConfirm = () => {
    setModalInfo({ ...modalInfo, show: false });
  };

  // 아이디 상태 관리 함수
  const handleIdStatus = (e) => {
    if (e.target.value.length === 0) {
      setIdStatus({
        ...idStatus,
        inputclass: '',
        pharse: '',
        state: false,
      });
    } else if (e.target.value.length < 4) {
      setIdStatus({
        ...idStatus,
        inputclass: 'signup-error',
        pharse: 'signup-pharse',
        state: false,
      });
    } else {
      setIdStatus({
        ...idStatus,
        inputclass: '',
        pharse: '',
        state: true,
      });
    }
    setFormData({
      ...formData,
      userId: e.target.value,
    });
  };

  // 비밀번호 상태 관리 함수
  const handlePasswordStatus = (e) => {
    if (e.target.value.length === 0) {
      setPasswordStatus({
        ...passwordStatus,
        message: '영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요',
        inputclass: '',
        pharse: '',
        state: false,
      });
    } else if (e.target.value.length < 8) {
      setPasswordStatus({
        ...passwordStatus,
        message: '영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요',
        inputclass: 'signup-error',
        pharse: 'signup-pharse',
        state: false,
      });
    } else if (e.target.value.length >= 8) {
      setPasswordStatus({
        ...passwordStatus,
        message: '사용가능한 비밀번호 입니다',
        inputclass: 'signup-complete',
        pharse: 'signup-pharse-complete',
        state: true,
      });
    }
    setFormData({
      ...formData,
      password: e.target.value,
    });
  };

  // 비밀번호 확인 상태 관리 함수
  const handlePasswordReCheck = (e) => {
    if (e.target.value !== formData.password) {
      setPasswordCheck({
        ...passwordCheck,
        message: '비밀번호가 일치하지 않습니다',
        inputclass: 'signup-error',
        pharse: 'signup-pharse',
        state: false,
      });
    } else if (e.target.value === formData.password) {
      setPasswordCheck({
        ...passwordCheck,
        message: '비밀번호가 일치합니다',
        inputclass: 'signup-complete',
        pharse: 'signup-pharse-complete',
        state: true,
      });
    }
  };

  // 비밀번호, 비밀번호 확인 type 상태 관리 함수
  const handlePasswordVisible = (e) => {
    setPasswordVisible({
      ...passwordVisible,
      [e.target.name]: !passwordVisible[e.target.name],
    });
  };

  // 휴대폰 번호 상태 관리 함수 (자동 하이픈, 최대 13자)
  const handlePhone = (e) => {
    // 숫자 제외 모두 제거하는 정규식
    const phonNumber = e.target.value.replace(/\D/g, '').slice(0, 11);

    // 휴대폰 번호 사이에 "-" 강제로 넣기
    let numberReset = '';
    if (phonNumber.length <= 3) {
      numberReset = phonNumber;
    } else if (phonNumber.length <= 7) {
      numberReset = `${phonNumber.slice(0, 3)}-${phonNumber.slice(3)}`;
    } else {
      numberReset = `${phonNumber.slice(0, 3)}-${phonNumber.slice(3, 7)}-${phonNumber.slice(7)}`;
    }

    if (numberReset.length < 13) {
      setPhone({
        ...phone,
        message: '휴대폰번호 11자리를 입력해주세요',
        inputclass: 'signup-error',
        pharse: 'signup-pharse',
        state: false,
      });
    } else {
      setPhone({
        ...phone,
        message: '',
        inputclass: '',
        pharse: '',
        state: true,
      });
    }
    setFormData({ ...formData, phone: numberReset });
  };

  // 이메일 입력 상태 관리 함수
  const handleEmailInput = (e) => {
    const emailValue = e.target.value;
    setFormData({ ...formData, email: emailValue });

    // 직접 입력 할때만 @ 관련 오류 작성
    if (
      emailSelect === '직접 입력' &&
      emailValue.length > 0 &&
      !emailValue.includes('@')
    ) {
      setEmailStatus({
        message: '올바르지 않은 이메일 형식입니다',
        inputclass: 'signup-error',
        pharse: 'signup-pharse',
        state: false,
      });
    } else {
      setEmailStatus({
        message: '',
        inputclass: '',
        pharse: '',
        state: true,
      });
    }
  };

  // 이메일 선택 변경 함수
  const handleEmailSelect = (e) => {
    setEmailSelect(e.target.value);
    if (e.target.value !== '직접 입력') {
      setEmailStatus({
        message: '',
        inputclass: '',
        pharse: '',
        state: true,
      });
    }
  };

  // 날짜 선택 함수
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // padStart 통해서 한자리 월도 두자리로 (ex) 01, 02 ..)
      const day = String(date.getDate()).padStart(2, '0');
      setFormData({ ...formData, birthDate: `${year}-${month}-${day}` });
    }
  };

  // 모든 조건 충족 여부 확인 변수 ( 다음 버튼 색깔 바꾸려고)
  const isFormReady =
    !!formData.userId &&
    !!formData.password &&
    !!formData.name &&
    !!formData.birthDate &&
    !!formData.phone &&
    !!formData.email &&
    !!roleSelect &&
    idStatus.state &&
    passwordStatus.state &&
    passwordCheck.state &&
    phone.state &&
    emailStatus.state;

  // 제출 함수 (다음 클릭시 회원 유형 선택에 따라 경로 이동)
  const handleSubmit = () => {
    // 모든 값 입력되야 넘어갈 수 있게 설정
    const allFilled =
      formData.userId &&
      formData.password &&
      formData.name &&
      formData.birthDate &&
      formData.phone &&
      formData.email &&
      roleSelect;

    // 조건 미 충족시 모달 창 출력
    if (!allFilled) {
      setModalInfo({
        show: true,
        title: '회원가입 오류',
        message: '모든 정보를 입력해주세요',
      });
      return;
    }

    // 모든 값은 입력 되었는데 오류 있을 때
    const allValid =
      idStatus.state &&
      passwordStatus.state &&
      passwordCheck.state &&
      phone.state &&
      emailStatus.state;

    // 오류가 하나라도 있으면 모달 창 출력
    if (!allValid) {
      setModalInfo({
        show: true,
        title: '회원가입 오류',
        message: '입력하신 정보를 확인해주세요',
      });
      return;
    }

    // 직접입력일 경우 / 아닐 경우 구분 (오류폭발한 원인)
    const fullEmail =
      emailSelect !== '직접 입력'
        ? formData.email + emailSelect
        : formData.email;

    const signupInf = {
      userId: formData.userId,
      password: formData.password,
      name: formData.name,
      birthDate: formData.birthDate,
      phone: formData.phone,
      email: fullEmail,
      role: roleSelect,
    };

    roleSelect === 'student'
      ? navigate(`stu`, { state: { signupInf } })
      : navigate('prf', { state: { signupInf } });
  };

  return (
    <>
      <form id="signupForm" className={styles['signupForm-ct']}>
        <article>
          <label> 아이디</label>
          <div className={styles['signup-id-ct']}>
            <input
              type="text"
              placeholder="아이디 입력"
              value={formData.userId}
              onChange={handleIdStatus}
              className={styles[idStatus.inputclass]}
            />
            <button> 중복확인 </button>
          </div>
          <p className={styles[idStatus.pharse]}>
            {idStatus.message || '영문 숫자를 포함하여 4자 이상 입력해주세요'}
          </p>
        </article>

        <article>
          <label> 비밀번호 </label>
          <div className={styles['signup-password-ct']}>
            <input
              type={passwordVisible.password ? 'type' : 'password'}
              placeholder="비밀번호 입력"
              value={formData.password}
              onChange={handlePasswordStatus}
              className={styles[passwordStatus.inputclass]}
              name="password"
            />
            <img
              src={passwordVisible.password ? openEye : closeEye}
              onClick={handlePasswordVisible}
              name="password"
            />
          </div>
          <p className={styles[passwordStatus.pharse]}>
            {passwordStatus.message ||
              '영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요'}
          </p>
        </article>

        <article>
          <label> 비밀번호 확인 </label>
          <div className={styles['signup-password-ct']}>
            <input
              type={passwordVisible.passwordCheck ? 'type' : 'password'}
              placeholder="비밀번호 재입력"
              onChange={handlePasswordReCheck}
              className={styles[passwordCheck.inputclass]}
            />
            <img
              src={passwordVisible.passwordCheck ? openEye : closeEye}
              onClick={handlePasswordVisible}
              name="passwordCheck"
            />
          </div>
          <p className={styles[passwordCheck.pharse]}>
            {passwordCheck.message || ''}
          </p>
        </article>

        <article>
          <label> 이름 </label>
          <input
            type="text"
            placeholder="이름 입력"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </article>

        <article>
          <label> 생년월일 </label>
          <div className={styles['signup-birthday-ct']}>
            <input
              type="text"
              placeholder="YYYY-MM-DD"
              value={formData.birthDate}
              readOnly
            />
            <DatePicker
              selected={selectedDate}
              onChange={handleDateSelect}
              locale={ko} // 지역
              dateFormat="yyyy-MM-dd" // 날짜 출력 형식
              maxDate={new Date()} // 최대 일수 설정
              showYearDropdown // 년도 드롭다운 표시 가능하게
              showMonthDropdown // 월 드롭다운 표시 가능하게
              dropdownMode="select" // 드롭다운 방식
              popperPlacement="left" // 열었을 때 위치
              customInput={
                <img src={calender} className={styles['signup-birthday-img']} />
              }
              wrapperClassName={styles['datepicker-ct']} // 개별 CSS
              calendarClassName="signup-datepicker-calendar" // 전역 css
            />
          </div>
        </article>

        <article>
          <label> 휴대폰 번호 </label>
          <input
            type="text"
            placeholder="010-1234-5678"
            value={formData.phone}
            onChange={handlePhone}
            className={styles[phone.inputclass]}
          />
          <p className={styles[phone.pharse]}> {phone.message} </p>
        </article>

        <article>
          <label> 이메일 </label>
          <div className={styles['signup-email-ct']}>
            <input
              type="text"
              placeholder="이메일 입력"
              value={formData.email}
              onChange={handleEmailInput}
              className={styles[emailStatus.inputclass]}
            />
            <select value={emailSelect} onChange={handleEmailSelect}>
              <option>직접 입력</option>
              <option>@naver.com</option>
              <option>@gamil.com</option>
              <option>@daum.net</option>
            </select>
          </div>
          <p className={styles[emailStatus.pharse]}> {emailStatus.message} </p>
        </article>

        <article>
          <label> 회원 유형</label>
          <div className={styles['signup-user-category-ct']}>
            <div
              className={roleSelect === 'student' ? styles['active'] : ''}
              onClick={() => setRoleSelect('student')}
            >
              <p> 🧗 </p>
              <p> 수강생 </p>
            </div>
            <div
              className={roleSelect === 'professor' ? styles['active'] : ''}
              onClick={() => setRoleSelect('professor')}
            >
              <p> 👨‍🏫 </p>
              <p> 강사 </p>
            </div>
          </div>
        </article>
      </form>
      <button
        type="button"
        onClick={handleSubmit}
        className={`${styles['signup-nextbtn']} ${isFormReady ? styles['signup-nextbtn-active'] : ''}`}
      >
        다음
      </button>

      {modalInfo.show && (
        <CheckModal
          title={modalInfo.title}
          message={modalInfo.message}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}

export default SignUpForm;
