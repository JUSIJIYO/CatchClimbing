import styles from "../../styles/css/community/CommentItem.module.css";

function CommentItem({ authorName, createdAt, content, isAnonymous }) {
  return (
    <div className={styles["comment-item"]}>
      <div className={styles["comment-header"]}>
        <div className={styles["comment-userinfo"]}>
          <span className={styles["comment-author"]}>
            {isAnonymous ? "익명" : authorName}
          </span>
          <span className={styles["comment-time"]}>{createdAt}</span>
        </div>

        <button className={styles["comment-menu-btn"]}>⋮</button>
      </div>

      <div className={styles["comment-content"]}>
        {content}
      </div>
    </div>
  );
}

export default CommentItem;