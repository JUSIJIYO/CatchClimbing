import { useState } from "react";
import styles from "../../styles/css/community/PostForm.module.css";

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  // 등록 눌렀을 때 제출되는 함수(아직 안됨)
  const handleSubmit = () => {
    const data = { title, content, anonymous };
    console.log("Submit:", data);
  };

  return (
    <div className={styles["form-container"]}>
      <div className={styles["form-card"]}>
        <h2 className={styles["form-title"]}>게시글 작성</h2>

        <div className={styles["form-box"]}>
          <label>제목</label>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles["form-box"]}>
          <label>내용</label>
          <textarea
            placeholder="내용을 입력하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className={styles["form-chkbox"]}>
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          <span>익명으로 작성</span>
        </div>

        <div className={styles["form-btn-group"]}>
          <button className={styles["form-cancel"]}>취소</button>
          <button className={styles["form-submit"]} onClick={handleSubmit}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
}