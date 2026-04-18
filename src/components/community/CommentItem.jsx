import React, { useState } from "react";
import styles from "../../styles/css/community/CommentItem.module.css";
import CommentDropdown from "./CommentDropdown";

function CommentItem({ authorName, createdAt, content, isAnonymous }) {
  const [open, setOpen] = useState(false);

  // 댓글 수정 함수(추후 모달창과 함께 구현)
  const handleEdit = () => {
    alert("수정 기능");
  };

  // 댓글 삭제 함수(추후 모달창과 함께 구현)
  const handleDelete = () => {
    alert("삭제 기능");
  };

  return (
    <div className={styles["comment-item"]}>
      <div className={styles["comment-header"]}>
        <div className={styles["comment-userinfo"]}>
          <span className={styles["comment-author"]}>
            {isAnonymous ? "익명" : (authorName || "이름 없음")}
          </span>
          <span className={styles["comment-time"]}>
            {typeof createdAt === "string" ? createdAt : "방금 전"}
          </span>
        </div>

        {/* 메뉴 버튼 */}
        <div className={styles["menu-wrapper"]}>
          <button
            className={styles["comment-menu-btn"]}
            onClick={() => setOpen(!open)}
          >
            ⋮
          </button>

          {/* 드롭다운 */}
          {open && (
            <CommentDropdown
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      <div className={styles["comment-content"]}>
        {content || "내용이 없습니다."}
      </div>
    </div>
  );
}

export default CommentItem;