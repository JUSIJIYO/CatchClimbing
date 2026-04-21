import React, { useState, useEffect } from "react";
import styles from "../../styles/css/community/PostDetail.module.css";
import icon1 from "../../assets/icon/people2.svg";
import icon2 from "../../assets/icon/eyeicon.svg";
import icon3 from "../../assets/icon/comment.svg";
import { db } from "../../firebase/config"; // 파이어베이스 설정 임포트
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import Modal from "../common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function PostDetail({ postId }) {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isReportModal, setIsReportModal] = useState(false); //신고 확인 모달
  const [isReportModalComplete, setIsReportModalComplete] = useState(false); //신고 완료
  const [isDeleteModal, setIsDeleteModal] = useState(false); // 게시글 삭제 확인 모달
  const [isDeleteCompleteModal, setIsDeleteCompleteModal] = useState(false); // 게시글 삭제 완료 모달

  const auth = getAuth(); // Firebase 인증 객체 가져오기
  const currentUserId = auth.currentUser?.uid; // 현재 로그인한 사용자의 uid (로그인 안 했으면 undefined)

  
  useEffect(() => {
    // 게시글 데이터를 가져오는 함수
    const fetchPost = async () => {
      if (!postId) return;

      setLoading(true);

      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      } else {
        setPost(null);
      }

      setLoading(false);
    };

    fetchPost();
  }, [postId]);

  if (loading) return <div>로딩 중...</div>;
  if (!post) return <div>게시글 없음</div>;

  const isMyPost = post?.authorId === currentUserId;
  // console.log("post:", post);

  //신고 함수
  const handleReport = async () => {
    try {
      setIsReportModalComplete(true);
    } catch (e) {
      console.error("신고 실패:", e);
    }
  };

  // 삭제 함수
  const handleDelete = async () => {
    try {
      const docRef = doc(db, "posts", postId);
      await deleteDoc(docRef);

      setIsDeleteCompleteModal(true);
    } catch (e) {
      console.error("삭제 실패:", e);
    }
  };
  return (
    <div className={styles["post-container"]}>
      {/* 신고 확인 모달 */}
      {isReportModal && (
        <Modal
          title="신고 확인"
          message="정말 신고하시겠습니까?"
          cancelText="취소"
          confirmText="신고"
          onCancel={() => setIsReportModal(false)}
          onConfirm={async () => {
            setIsReportModal(false);
            await handleReport();
          }}
        />
      )}

      {/* 신고 완료 모달 */}
      {isReportModalComplete && (
        <ConfirmModal
          message="신고가 완료되었습니다."
          onConfirm={() => {
            setIsReportModalComplete(false);
          }}
        />
      )}
      {/* 삭제 확인 모달 */}
      {isDeleteModal && (
        <Modal
          title="삭제 확인"
          message="게시글을 삭제하시겠습니까?"
          cancelText="취소"
          confirmText="삭제"
          onCancel={() => setIsDeleteModal(false)}
          onConfirm={async () => {
            setIsDeleteModal(false);
            await handleDelete();
          }}
        />
      )}

      {/* 삭제 완료 모달 */}
      {isDeleteCompleteModal && (
        <ConfirmModal
          message="게시글이 삭제되었습니다."
          onConfirm={() => {
            setIsDeleteCompleteModal(false);
            navigate("/community");
          }}
        />
      )}

      <div className={styles["post-card"]}>
        <div className={styles["post-header"]}>
          <h2 className={styles["post-title"]}>{post.title}</h2>

          {isMyPost ? (
            <div className={styles["post-btnGroup"]}>
              <button
                className={styles["post-reportBtn"]}
                onClick={() => navigate(`/post/edit/${post.id}`)}
              >
                수정하기
              </button>
              <button
                className={styles["post-reportBtn"]}
                onClick={() => setIsDeleteModal(true)}
              >
                삭제하기
              </button>
            </div>
          ) : (
            <button
              className={styles["post-reportBtn"]}
              onClick={() => setIsReportModal(true)}
            >
              신고하기
            </button>
          )}
        </div>

        <div className={styles["post-infomation"]}>
          <span>
            <img src={icon1} alt="user" />
            {post.authorName || "익명"}
          </span>
          <span>•</span>
          <span>
            {post.createdAt?.toDate
              ? post.createdAt.toDate().toLocaleString()
              : "방금 전"}
          </span>
          <span>•</span>
          <span>{post.branch || "전체 지점"}</span>
        </div>

        <div className={styles["post-click"]}>
          <span>
            <img src={icon2} alt="views" />
            조회 {post.viewer || 0}
          </span>
          <span>
            <img src={icon3} alt="comments" />
            댓글 {post.commentCount || 0}
          </span>
        </div>
        <div className={styles["post-line"]} />
        <div className={styles["post-content"]}>{post.content}</div>
      </div>
    </div>
  );
}

export default PostDetail;
