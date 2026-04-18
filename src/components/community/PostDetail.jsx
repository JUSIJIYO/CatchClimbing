import React, { useState, useEffect } from "react";
import styles from "../../styles/css/community/PostDetail.module.css";
import icon1 from "../../assets/icon/people2.svg";
import icon2 from "../../assets/icon/eyeicon.svg";
import icon3 from "../../assets/icon/comment.svg";
import { db } from "../../firebase/config"; // 파이어베이스 설정 임포트
import { doc, getDoc } from "firebase/firestore";

function PostDetail({ postId }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        setLoading(true);
        // posts 컬렉션에서 해당 ID의 문서 참조
        const docRef = doc(db, "posts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("게시글이 존재하지 않습니다.");
        }
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) return <div className={styles["post-container"]}>로딩 중...</div>;
  if (!post) return <div className={styles["post-container"]}>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className={styles["post-container"]}>
      <div className={styles["post-card"]}>
        
        <div className={styles["post-header"]}>
          <h2 className={styles["post-title"]}>{post.title}</h2>
          <button className={styles["post-reportBtn"]}>신고하기</button>
        </div>

        <div className={styles["post-infomation"]}>
          <span><img src={icon1} alt="user" />{post.authorName || "익명"}</span>
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
          <span><img src={icon2} alt="views"/>조회 {post.viewer || 0}</span>
          <span><img src={icon3} alt="comments"/>댓글 {post.commentCount || 0}</span>
        </div>
        <div className={styles["post-line"]} />
        <div className={styles["post-content"]}>
          {post.content}
        </div>

      </div>
    </div>
  );
}

export default PostDetail;