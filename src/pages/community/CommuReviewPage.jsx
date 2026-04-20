import React from "react";
import ReviewDetail from "../../components/community/ReviewDetail.jsx";
import headerStyles from "../../styles/css/common/PageHeader.module.css";


function CommuReviewPage() {


  return (
    <div>
      <div className={headerStyles.header}>
        <h1>리뷰</h1>
        <p>클라이머장에 대한 후기를 남겨주세요</p>
      </div>
      <ReviewDetail />

      
    </div>
  );
}

export default CommuReviewPage;
