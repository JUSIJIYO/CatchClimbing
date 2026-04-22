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
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import Modal from "../../components/common/Modal";
import CheckModal from "../common/ChkModal";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
// 부모 컴포넌트로부터 postId를 넘겨받는다고 가정합니다.
function CommentForm({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { currentUser, role } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  // 1. 댓글 데이터 불러오기 (Fetch)
  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;

      try {
        setLoading(true);
        const q = query(
          collection(db, "comments"),
          where("postId", "==", postId),
          orderBy("createdAt", "asc"),
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
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      let name = "이름 없음";

      if (!isAnonymous && currentUser?.uid) {
        const q = query(
          collection(db, "users"),
          where("uid", "==", currentUser.uid),
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          name = snapshot.docs[0].data().name;
        }
      }

      const newComment = {
        postId,
        authorId: currentUser?.uid,
        authorName: isAnonymous ? "익명" : name,
        authorRole: role,
        isAnonymous,
        content: text,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "comments"), newComment);
await updateDoc(doc(db, "posts", postId), {
  commentCount: increment(1),
});

      setComments((prev) => [
        ...prev,
        { id: docRef.id, ...newComment, createdAt: "방금 전" },
      ]);

      setText("");
      setIsConfirmModalOpen(true);
    } catch (e) {
      console.error("댓글 등록 실패:", e);
    }finally {
    setIsSubmitting(false); 
    }
  };

  // 댓글 등록 버튼 클릭 시 모달열기
  const handleOpenModal = () => {
    if (!text.trim()) return;
    setIsModalOpen(true);
  };

  return (
    <div className={styles["comment-container"]}>
      {/* 확인모달 */}
      {isModalOpen && (
        <Modal
          title="등록 확인"
          message="댓글을 등록하시겠습니까?"
          cancelText="취소"
          confirmText="확인"
          onCancel={() => setIsModalOpen(false)}
          onConfirm={async () => {
            await handleSubmit();
            setIsModalOpen(false);
          }}
        />
      )}
      {/* 완료 모달 */}
      {isConfirmModalOpen && (
        <CheckModal
          title="등록 완료"
          message="댓글 등록이 완료되었습니다."
          onConfirm={() => setIsConfirmModalOpen(false)}
        />
      )}
      <h3 className={styles["comment-title"]}>댓글 {comments.length}</h3>
      <div className={styles["comment-list"]}>
        {loading ? (
          <p>댓글을 불러오는 중...</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              id={comment.id}
              postId={postId}
              authorName={comment.authorName}
              authorId={comment.authorId}
              createdAt={comment.createdAt}
              content={comment.content}
              isAnonymous={comment.isAnonymous}
              authorRole={comment.authorRole}
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

        <button
          className={styles["comment-submitbtn"]}
          onClick={handleOpenModal}
        >
          작성하기
        </button>
      </div>
    </div>
  );
}

export default CommentForm;
