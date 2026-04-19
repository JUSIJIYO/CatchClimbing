import React, { useState, useEffect } from "react";
import styles from "../../styles/css/community/CommentForm.module.css";
import CommentItem from "../../components/community/CommentItem";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// 부모 컴포넌트로부터 postId를 넘겨받는다고 가정합니다.
function CommentForm({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. 댓글 데이터 불러오기 (Fetch)
  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;

      try {
        setLoading(true);
        const q = query(
          collection(db, "comments"),
          where("postId", "==", postId),
          orderBy("createdAt", "asc")
        );

        const querySnapshot = await getDocs(q); 

        const fetchedComments = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          let timeString = "방금 전";

          if (data.createdAt) {
            const date = data.createdAt.toDate
              ? data.createdAt.toDate()
              : new Date(data.createdAt);
            timeString = date.toLocaleString();
          }

          return {
            id: doc.id,
            ...data,
            createdAt: timeString,
          };
        });

        setComments(fetchedComments);
      } catch (e) {
        console.error("댓글 불러오기 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // 2. 댓글 작성 함수 (Create)
  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      const newComment = {
        postId: postId,
        authorId: "current_user_id", // 실제로는 현재 로그인한 유저 ID를 넣어야 합니다.
        authorName: isAnonymous ? "익명" : "홍길동", // 실제 유저 이름
        isAnonymous: isAnonymous,
        isProfessor: false,
        content: text,
        createdAt: new Date(), // 혹은 serverTimestamp()
      };

      // 파이어베이스에 추가
      const docRef = await addDoc(collection(db, "comments"), newComment);

      // 화면 업데이트 (새로고침 없이 상태 반영)
      setComments((prev) => [
        ...prev,
        { id: docRef.id, ...newComment, createdAt: "방금 전" },
      ]);
      setText("");
      alert("댓글이 등록되었습니다.");
    } catch (e) {
      console.error("댓글 등록 실패:", e);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  return (
    <div className={styles["comment-container"]}>
      <h3 className={styles["comment-title"]}>댓글 {comments.length}</h3>

      <div className={styles["comment-list"]}>
        {loading ? (
          <p>댓글을 불러오는 중...</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              authorName={comment.authorName}
              createdAt={comment.createdAt}
              content={comment.content}
              isAnonymous={comment.isAnonymous}
            />
          ))
        )}
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
