import React from "react";
import styles from "../../styles/css/community/PostDetailpage.module.css"
import PostDetail from "../../components/community/PostDetail"
import CommentForm from "../../components/community/CommentForm";
import { useNavigate } from "react-router-dom";


function PostDetailpage() {

  const navigate = useNavigate();

  return (
    <div className={styles["post-bigcontainer"]}>
      
      <div className={styles["post-topbar"]}
      onClick={() => navigate("/commu")}>
        ← 목록으로
      </div>
      <PostDetail />
      <CommentForm />
    </div>
  );
}

export default PostDetailpage;