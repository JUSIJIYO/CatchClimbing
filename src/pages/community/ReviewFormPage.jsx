import React from 'react';
import headerStyles from '../../styles/css/common/PageHeader.module.css';
import ReviewForm from '../../components/community/ReviewForm';
import backButton from '../../assets/icon/backButton.svg';
import styles from '../../styles/css/community/ReviewFormPage.module.css';

import { useNavigate } from 'react-router-dom';

function ReviewFormPage() {
  const navigate = useNavigate();
  return (
    <>
      <div>
        <div className={headerStyles.header}>
          <h1>리뷰</h1>
          <p>클라이머장에 대한 후기를 남겨주세요</p>
        </div>

        <div className={styles.backBtn} onClick={() => navigate(-1)}>
          <img src={backButton} alt="뒤로가기" />
          <span>뒤로</span>
        </div>

        <ReviewForm />
      </div>
    </>
  );
}

export default ReviewFormPage;
