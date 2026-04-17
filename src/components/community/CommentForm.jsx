import React, { useState } from "react";
import styles from "../../styles/css/community/CommentForm.module.css";
import CommentItem from "../../components/community/CommentItem";

function CommentForm() {
  const [comments, setComments] = useState([
    {
      id: 1,
      authorName: "김클라이머",
      createdAt: "1시간 전",
      content: "저도 같은 고민이었어요. 발 기술 연습하면 도움이 많이 됩니다!",
      isAnonymous: false,
    },
    {
      id: 2,
      authorName: "익명",
      createdAt: "30분 전",
      content: "강사님께 피드백 받아보시는 것도 추천드려요.",
      isAnonymous: true,
    },
  ]);

  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // 댓글 작성 함수(아직 댓글 작성까지 구현X)
  const handleSubmit = () => {
    if (!text.trim()) return;
    setText("");
  };

  return (
    <div className={styles["comment-container"]}>
      <h3 className={styles["comment-title"]}>댓글 {comments.length}</h3>

      <div className={styles["comment-List"]}>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            authorName={comment.authorName}
            createdAt={comment.createdAt}
            content={comment.content}
            isAnonymous={comment.isAnonymous}
          />
        ))}
      </div>

      <div className={styles["comment-inputbox"]}>
        <textarea
          placeholder="댓글을 입력하세요..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className={styles["comment-footer"]}>
        <label className={styles["anonymous"]}>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={() => setIsAnonymous(!isAnonymous)}
          />
          익명으로 작성
        </label>

        <button className={styles["comment-submitbtn"]} onClick={handleSubmit}>
          작성하기
        </button>
      </div>
    </div>
  );
}

export default CommentForm;