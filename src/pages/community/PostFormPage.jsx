import React from "react";
import headerStyles from "../../styles/css/common/PageHeader.module.css";
import PostForm from "../../components/community/PostForm";
import styles from "../../styles/css/community/PostFormPage.module.css";
import { useNavigate } from "react-router-dom";

function PostFormPage() {
   const navigate = useNavigate();
  return (
    <div>
      <div className={headerStyles.header}>
        <p onClick={() => navigate(-1)}>← 뒤로가기</p>
        <h1>커뮤니티</h1>
        <p>클라이머들과 소통해 보세요</p>
      </div>
      <div className={styles["post-form"]}>
        <PostForm />
      </div>
    </div>
  );
}

export default PostFormPage;
