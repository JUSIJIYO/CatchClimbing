import React from 'react'
import headerStyles from "../../styles/css/common/PageHeader.module.css";
import ReviewForm from '../../components/community/ReviewForm';
function ReviewFormPage() {
  return (
    <div>
      <div className={headerStyles.header}>
        <h1>리뷰</h1>
        <p>클라이머장에 대한 후기를 남겨주세요</p>
      </div>
      <ReviewForm />

      
    </div>
  )
}

export default ReviewFormPage
