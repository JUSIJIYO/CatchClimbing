import React, { useState, useEffect } from "react"; // useState, useEffect 추가
import { useNavigate, useSearchParams } from "react-router-dom";
import PostItem from "../../components/community/PostItem";
import styles from "../../styles/css/community/commuPage.module.css";
import headerStyles from "../../styles/css/common/PageHeader.module.css";
import BranchReviewItem from "../../components/branch/BranchReviewItem";

// 파이어베이스 관련 임포트 추가
import { db } from "../../firebase/config";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

function CommuPage() {
  const [searchParams] = useSearchParams();
  const branchId = searchParams.get("branch");
  const navigate = useNavigate();

  // 1. 파이어베이스 데이터를 담을 상태(State) 선언
  const [posts, setPosts] = useState([]); // 게시글
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]); //리뷰
  const [reviewLoading, setReviewLoading] = useState(true);

  // 2. 파이어베이스에서 데이터 가져오기 (Fetch)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // posts 컬렉션에서 작성일 역순으로 최신글 3개만 가져오기
        const q = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          limit(3),
        );

        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(fetchedPosts);
      } catch (error) {
        console.error("게시글 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewLoading(true);

        const q = query(
          collection(db, "reviews"),
          orderBy("createdAt", "desc"),
          limit(3),
        );

        const querySnapshot = await getDocs(q);

        const fetchedReviews = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReviews(fetchedReviews);
      } catch (error) {
        console.error("리뷰 로드 실패:", error);
      } finally {
        setReviewLoading(false);
      }
    };

    fetchReviews();
  }, []);
  return (
    <div>
      <div className={headerStyles.header}>
        <h1>커뮤니티</h1>
        <p>클라이머들과 소통해 보세요</p>
      </div>
      <div className={styles["commu-container"]}>
        <div className={styles["commu-box"]}>
          <div className={styles["commu-title"]}>
            게시글
            <button
              onClick={() => navigate("/community")}
              className={styles["commu-btn"]}
            >
              전체보기
            </button>
          </div>
          <div className={styles["commu-list"]}>
            {loading ? (
              <p>로딩 중...</p>
            ) : posts.length > 0 ? (
              posts.map((post) => <PostItem key={post.id} post={post} />)
            ) : (
              <p>게시글이 없습니다.</p>
            )}
          </div>
        </div>

        <div className={styles["commu-box"]}>
          <div className={styles["commu-title"]}>
            리뷰
            <button
              onClick={() => navigate("/review")}
              className={styles["commu-btn"]}
            >
              전체보기
            </button>
          </div>
          <div className={styles["commu-list"]}>
            {reviewLoading ? (
              <p>로딩 중...</p>
            ) : reviews.length > 0 ?(
                reviews.map((review) => (
                  <BranchReviewItem key={review.id} review={review} />
                ))
              ) : (
                <p> 리뷰가 없습니다.</p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommuPage;
