import { useState } from "react";
import styles from "../../styles/css/community/ReviewForm.module.css";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/common/Modal";
import ComfirmModal from "../../components/common/ConfirmModal";
import { db } from "../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useLocation } from "react-router-dom";


export default function ReviewForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [anonymous, setAnonymous] = useState(false);

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    setIsModalOpen(true);
  };

  const submitReview = async () => {
    try {
      await addDoc(collection(db, "reviews"), {
        title,
        content,
        rating,
        isAnonymous: anonymous,
        branchId,
        branchName,

        // 기본 정보 (리스트 정렬/표시용)
        viewer: 0,
        createdAt: serverTimestamp(),
      });

      setIsCompleteModalOpen(true);
    } catch (e) {
      console.error("리뷰 저장 실패:", e);
    }
  };

  const location = useLocation();
  const { classId, title: classTitle, branchId, branchName } = location.state || {};

  return (
    <div className={styles["form-container"]}>
      {isModalOpen && (
        <Modal
          title="리뷰 등록"
          message="리뷰를 등록하시겠습니까?"
          cancelText="취소"
          confirmText="등록"
          onCancel={() => setIsModalOpen(false)}
          onConfirm={async () => {
            setIsModalOpen(false);
            await submitReview();
          }}
        />
      )}

      {isCompleteModalOpen && (
        <ComfirmModal
          message="리뷰가 등록되었습니다."
          onConfirm={() => {
            setIsCompleteModalOpen(false);
            navigate(-1);
          }}
        />
      )}
      <div className={styles["form-card"]}>
        <h2 className={styles["form-title"]}>리뷰 작성</h2>

        {/* 별점 */}
        <div className={styles["form-box"]}>
          <label>평점</label>
          <div className={styles["star-box"]}>
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                className={num <= rating ? styles.starOn : styles.starOff}
                onClick={() => setRating(num)}
              >
                ★
              </span>
            ))}
            <span className={styles.ratingText}>{rating}.0</span>
          </div>
        </div>

        {/* 제목 */}
        <div className={styles["form-box"]}>
          <label>제목</label>
          <input
            type="text"
            placeholder="리뷰 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 내용 */}
        <div className={styles["form-box"]}>
          <label>내용</label>
          <textarea
            placeholder="리뷰 내용을 입력하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* 익명 */}
        <div className={styles["form-chkbox"]}>
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          <span>익명으로 작성</span>
        </div>

        {/* 버튼 */}
        <div className={styles["form-btn-group"]}>
          <button
            className={styles["form-cancel"]}
            onClick={() => navigate(-1)}
          >
            취소
          </button>

          <button className={styles["form-submit"]} onClick={handleSubmit}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
