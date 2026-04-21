import React from "react";
import styles from "../../styles/css/community/CommentDropdown.module.css";
import icon1 from "../../assets/icon/report.svg";

function CommentReportDropdown({ onReport }) {
  return (
    <div className={styles["comment-dropdown"]}>
      <button onClick={onReport} className={styles["comment-item"]}>
        <img src={icon1} alt="댓글신고"/> 댓글 신고
      </button>
    </div>
  );
}

export default CommentReportDropdown;