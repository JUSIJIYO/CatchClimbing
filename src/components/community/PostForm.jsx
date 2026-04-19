import { useEffect, useState } from "react";
import styles from "../../styles/css/community/PostForm.module.css";
import Modal from "../../components/common/Modal";
import ComfirmModal from "../../components/common/ConfirmModal";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useParams } from "react-router-dom";

export default function PostForm() {
  const [title, setTitle] = useState(""); // 게시글 제목
  const [content, setContent] = useState(""); //게시글 내용
  const [anonymous, setAnonymous] = useState(false); //익명 여부
  const [isModalOpen, setIsModalOpen] = useState(false); //등록 및 수정 확인 모달
  const [isCompleteOpen, setIsCompleteOpen] = useState(false); //등록 및 수정 완료 모달
  

  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  // 내 게시글이면 수정, 삭제가 나오게 하기 위한 비교
  const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;

  // 게시글 수정모드인자 확인
  const { postId } = useParams();
  const isEditMode = !!postId;

  // 유저 이름 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUserId) return;

      const userRef = doc(db, "users", currentUserId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserName(userSnap.data().name);
      }
    };

    fetchUser();
  }, [currentUserId]);

  // 게시글 저장
  const submitPost = async () => {
    try {
      if (isEditMode) {
        // 게시글 수정
        const docRef = doc(db, "posts", postId);
        await updateDoc(docRef, {
          title,
          content,
          isAnonymous: anonymous,
        });
      } else {
        // 게시글 등록
        await addDoc(collection(db, "posts"), {
          title,
          content,
          isAnonymous: anonymous,
          authorId: currentUserId,
          authorName: userName,
          viewer: 0,
          commentCount: 0,
          createdAt: serverTimestamp(),
        });
      }

      setIsCompleteOpen(true);
    } catch (e) {
      console.error("게시글 저장 실패:", e);
    }
  };

  // 게시글 등록 함수
  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    setIsModalOpen(true);
  };
  // console.log("currentUserId:", currentUserId);

  // 수정상황일 때 기존게시글 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setContent(data.content);
        setAnonymous(data.isAnonymous);
      }
    };
    fetchPost();
  }, [postId]);

  return (
    <div className={styles["form-container"]}>
      {/* 등록 확인 모달 */}
      {isModalOpen && (
        <Modal
          title={isEditMode ? "수정 확인" : "등록 확인"}
          message={
            isEditMode
              ? "게시글을 수정하시겠습니까?"
              : "게시글을 등록하시겠습니까?"
          }
          cancelText="취소"
          confirmText={isEditMode ? "수정" : "등록"}
          onCancel={() => setIsModalOpen(false)}
          onConfirm={async () => {
            setIsModalOpen(false);
            await submitPost();
          }}
        />
      )}

      {/* 등록 완료 모달 */}
      {isCompleteOpen && (
        <ComfirmModal
          message={
            isEditMode ? "게시글이 수정되었습니다." : "게시글이 등록되었습니다."
          }
          onConfirm={() => {
            setIsCompleteOpen(false);
            navigate("/community");
          }}
        />
      )}

      <div className={styles["form-card"]}>
        <h2 className={styles["form-title"]}>
          {/* 수정모드일 때는 게시글 수정을 제목으로 아닐 때는 작성을 제목으로 */}
          {isEditMode ? "게시글 수정" : "게시글 작성"}
        </h2>

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
          <button
            className={styles["form-cancel"]}
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button className={styles["form-submit"]} onClick={handleSubmit}>
            {isEditMode ? "수정" : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
}
