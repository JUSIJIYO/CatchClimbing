import React from "react";
import styles from "../../styles/css/community/CommentDropdown.module.css"
import icon1 from "../../assets/icon/commentUpdate.svg";
import icon2 from "../../assets/icon/commentDelete.svg";

function CommentDropdown({ onEdit, onDelete }) {
  return (
    <div className={styles["comment-dropdown"]}>
      <button onClick={onEdit} className={styles["comment-item"]}>
       <img src={icon1} /> 댓글 수정
      </button>

      <div className={styles["commment-line"]}></div>

      <button onClick={onDelete} className={styles["comment-item"]}>
         <img src={icon2} /> 댓글 삭제
      </button>
    </div>
  );
}

export default CommentDropdown;