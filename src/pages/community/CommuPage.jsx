import React from "react"; // useState 삭제 (현재 안 쓰고 계심)
import { useNavigate, useSearchParams } from "react-router-dom";
import BranchCommuItem from "../../components/branch/BranchCommuItem";
import styles from "../../styles/css/community/commuPage.module.css";
import headerStyles from "../../styles/css/common/PageHeader.module.css";
import BranchReviewItem from "../../components/branch/BranchReviewItem";

function CommuPage() {
  const [searchParams] = useSearchParams();
  const branchId = searchParams.get("branch");
  
  const posts = [
    {
      id: 1,
      title: "V3 클라이머를 위한 팁?",
      author: "climber_123",
      views: 234,
      comments: 12,
      time: "2시간 전",
      branch: "강남점",
    },
    {
      id: 2,
      title: "초보자 질문있어요",
      author: "익명",
      views: 178,
      comments: 15,
      time: "2시간 전",
      branch: "강남점",
    },
    {
      id: 3,
      title: "멀까여",
      author: "익명",
      views: 157,
      comments: 30,
      time: "4시간 전",
      branch: "강남점",
    },
  ];
  const reviews = [
    {
      id: 1,
      rating: 5,
      title: "강사님이 정말 좋아요!",
      content:
        "처음 시작할 때 너무 친절하게 가르쳐주셔서 금방 적응할 수 있었습니다. 시설도 깨끗하고 좋아요!",
      author: "익명",
      date: "2026-04-01",
      branch: "강남점",
    },
    {
      id: 2,
      rating: 4,
      title: "시설이 깨끗하고 좋아요",
      content: "가나다라",
      author: "익명",
      date: "2026-03-25",
      branch: "강남점",
    },
    {
      id: 3,
      rating: 4.5,
      title: "시설이 깨끗하고 좋아요",
      content: "가나다라",
      author: "익명",
      date: "2026-03-26",
      branch: "강남점",
    },
    {
      id: 4,
      rating: 3,
      title: "그럭저럭",
      content: "가나다라",
      author: "익명",
      date: "2026-03-26",
      branch: "강남점",
    },
  ];

  const navigate = useNavigate();

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
            <button onClick={() => navigate("/community")}className={styles["commu-btn"]}>전체보기</button>
          </div>
          <div className={styles["commu-list"]}>
            {posts.slice(0, 3).map((post) => (
              <BranchCommuItem  key={post.id} post={post} 
              
              />
        
            ))}
          </div>
        </div>

        <div className={styles["commu-box"]}>
          <div className={styles["commu-title"]}>
            리뷰
            <button onClick={() => navigate("/review")} className={styles["commu-btn"]}>전체보기</button>
          </div>
          <div className={styles["commu-list"]}>
            {reviews.slice(0, 3).map((review) => (
              <BranchReviewItem key={review.id} review={review} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommuPage;
