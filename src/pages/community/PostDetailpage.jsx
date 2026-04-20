import React from "react";
import { useNavigate, useParams } from "react-router-dom"; // useParams 임포트 확인
import styles from "../../styles/css/community/PostDetailpage.module.css";
import PostDetail from "../../components/community/PostDetail";
import CommentForm from "../../components/community/CommentForm";

function PostDetailpage() {
  const navigate = useNavigate();
  
  const { id } = useParams(); 

  console.log("현재 페이지의 ID:", id);

  return (
    <div className={styles["post-bigcontainer"]}>
      <div className={styles["post-topbar"]} onClick={() => navigate(-1)}>
        ← 목록으로
      </div>
      
      <PostDetail postId={id} /> 
      <CommentForm postId={id} />
    </div>
  );
}

export default PostDetailpage;  