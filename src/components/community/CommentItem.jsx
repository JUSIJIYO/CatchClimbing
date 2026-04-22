import React, { useState } from "react";
import styles from "../../styles/css/community/CommentItem.module.css";
import CommentDropdown from "./CommentDropdown";
import CommentReportDropdown from "../../components/community/CommentReportDropdown";
import { doc, updateDoc, deleteDoc, increment } from "firebase/firestore";
import { db } from "../../firebase/config";
import ComfirmModal from "../../components/common/ConfirmModal";
import Modal from "../../components/common/Modal";
import { useAuth } from "../../context/AuthContext";
import deletebtn from "../../assets/icon/adminDeleteButton.svg";

function CommentItem({
  id,
  authorId,
  postId,
  authorName,
  createdAt,
  content,
  authorRole,
  isAnonymous,
}) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(content);
  const [isDeleted, setIsDeleted] = useState(false);

  /* 기존코드 혹시 몰라서 작성해놓겠습니다
  // 현재 로그인 유저 (임시)
  const currentUserId = "current_user_id";
  */

  // useAuth에서 현재 유저의 정보와, 역할 구조분해할당으로 저장
  const { currentUser, role } = useAuth();

  /* 기존코드 혹시 몰라서 작성해놓겠습니다
  const isMyComment = authorId === currentUserId;
  */

  // 내 댓글 여부
  // 옵셔널 체이닝 연산자 + useAuth에서 가져온 현재 사용자 정보랑 일치하는지 확인 (이전 방식으로 바꾸고 싶으시면 바꾸셔도 상관없습다)
  const isMyComment = String(authorId) === String(currentUser?.uid);

  // 관리자 여부
  const isAdmin = role === "totalAdmin" || role === "branchAdmin";

  // 댓글 수정 클릭
  const handleEdit = () => {
    setIsEditing(true);
    setOpen(false);
  };

  // 댓글 삭제 클릭
  const handleDelete = () => {
    setIsDeleteModalOpen(true);
    setOpen(false);
  };

  // 댓글 신고 클릭
  const handleReport = () => {
    setIsReportModalOpen(true);
    setOpen(false);
  };

  // 댓글 수정 함수
  const submitEdit = async () => {
    if (!editText.trim()) return;

    try {
      const commentUpdate = doc(db, "comments", id);

      await updateDoc(commentUpdate, {
        content: editText,
      });

      setIsEditing(false);
      setIsComfirmModelOpen(true);
    } catch (e) {
      console.error("수정 실패:", e);
    }
  };

  //댓글 삭제 함수
  const submitDelete = async () => {
    if (!id) {
      console.error("id 없음");
      return;
    }

    try {
      const commentDelete = doc(db, "comments", id);

      await deleteDoc(commentDelete);
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        commentCount: increment(-1),
      });

      setIsDeleteCompleteModalOpen(true); // 완료 모달 열기
    } catch (e) {
      console.error("삭제 실패:", e);
    }
  };

  // 댓글 신고 함수
  const submitReport = async () => {
    try {
      setIsReportCompleteOpen(true);
    } catch (e) {
      console.error("신고 실패:", e);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false); // 수정 확인 모달
  const [isComfirmModelOpen, setIsComfirmModelOpen] = useState(false); // 수정 완료 모달
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 확인
  const [isDeleteCompleteModalOpen, setIsDeleteCompleteModalOpen] =
    useState(false); // 삭제 완료
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // 신고 확인
  const [isReportCompleteOpen, setIsReportCompleteOpen] = useState(false); // 신고 완료

  const isInstructor = authorRole === "professor";

  if (isDeleted) return null;
  return (
    <div className={styles["comment-item"]}>
      {/* 수정 확인 모달 */}
      {isModalOpen && (
        <Modal
          title="수정 확인"
          message="정말로 수정하시겠습니까?"
          cancelText="취소"
          confirmText="확인"
          onCancel={() => setIsModalOpen(false)}
          onConfirm={async () => {
            setIsModalOpen(false); // 확인모달 닫고
            await submitEdit(); // 그 다음 실행
          }}
        />
      )}

      {/* 수정 완료 모달 */}
      {isComfirmModelOpen && (
        <ComfirmModal
          message="댓글이 수정되었습니다."
          onConfirm={() => setIsComfirmModelOpen(false)}
        />
      )}

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <Modal
          title="삭제 확인"
          message="정말로 삭제하시겠습니까?"
          cancelText="취소"
          confirmText="삭제"
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={async () => {
            setIsDeleteModalOpen(false); // 먼저 닫고
            await submitDelete(); // 삭제 실행
          }}
        />
      )}

      {/* 삭제 완료 모달 */}
      {isDeleteCompleteModalOpen && (
        <ComfirmModal
          message="댓글이 삭제되었습니다."
          onConfirm={() => {
            setIsDeleteCompleteModalOpen(false);
            setIsDeleted(true);
          }}
        />
      )}

      {/* 신고 확인 모달 */}
      {isReportModalOpen && (
        <Modal
          title="신고 확인"
          message="정말로 신고하시겠습니까?"
          cancelText="취소"
          confirmText="신고"
          onCancel={() => setIsReportModalOpen(false)}
          onConfirm={async () => {
            setIsReportModalOpen(false);
            await submitReport();
          }}
        />
      )}

      {/* 신고 완료 모달 */}
      {isReportCompleteOpen && (
        <ComfirmModal
          message="신고가 완료되었습니다."
          onConfirm={() => setIsReportCompleteOpen(false)}
        />
      )}

      <div className={styles["comment-header"]}>
        <div className={styles["comment-userinfo"]}>
          <span className={styles["comment-author"]}>
            {isAnonymous ? "익명" : authorName || "이름 없음"}
            {isInstructor && !isAnonymous && <span> (강사)</span>}
          </span>
        </div>

        <div className={styles["menu-wrapper"]}>
          {isAdmin ? (
            <button
              className={styles["comment-delete-btn"]}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <img src={deletebtn} />
            </button>
          ) : (
            <>
              <button
                className={styles["comment-menu-btn"]}
                onClick={() => setOpen(!open)}
              >
                ⋮
              </button>
              {open &&
                (isMyComment ? (
                  <CommentDropdown
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ) : (
                  <CommentReportDropdown onReport={handleReport} />
                ))}
            </>
          )}
        </div>
      </div>

      {/* 댓글 내용 */}
      <div className={styles["comment-content"]}>
        {isEditing ? (
          <>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <div>
              <div className={styles["comment-edit-actions"]}>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={styles["comment-save-btn"]}
                >
                  저장
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={styles["comment-cancel-btn"]}
                >
                  취소
                </button>
              </div>
            </div>
          </>
        ) : (
          content || "내용이 없습니다."
        )}
      </div>
    </div>
  );
}

export default CommentItem;
