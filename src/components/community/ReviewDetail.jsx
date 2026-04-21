import React, { useState, useEffect } from "react";
import styles from "../../styles/css/community/ReviewDetail.module.css";
import icon1 from "../../assets/icon/backIcon.svg";
import BranchReviewItem from "../../components/branch/BranchReviewItem";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import filterIcon from "../../assets/icon/commuFilter.svg";
import ReviewItem from "../../components/community/ReviewItem.jsx";

const branchMap = {
  all: "전체 지점",
  theclimb_hongdae: "홍대점",
  theclimb_gangnam: "강남점",
  theclimb_ilsan: "일산점",
  theclimb_isu: "이수점",
  theclimb_magok: "마곡점",
  theclimb_mullae: "문래점",
  theclimb_nonhyeon: "논현점",
  theclimb_sadang: "사당점",
  theclimb_seongsu: "성수점",
  theclimb_sillim: "신림점",
  theclimb_sinsa: "신사점",
  theclimb_yangjae: "양재점",
  theclimb_yeonnam: "연남점",
};
function ReviewDetail() {
    const [reviews, setReviews] = useState([]);
  const [sort, setSort] = useState("latest");
  const [selectedBranch, setSelectedBranch] = useState("all"); // 지점 필터 상태 추가
  const navigate = useNavigate();

  // 1. 지점 필터링 적용
  const filteredReviews = reviews.filter((review) => {
    if (selectedBranch === "all") return true;
    return review.branchId === selectedBranch;
  });

  // 2. 필터링된 결과에 정렬 적용
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sort === "latest") {
      const dateA = a.createdAt?.toDate?.() ?? new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() ?? new Date(b.createdAt);
      return dateB - dateA;
    }
    if (sort === "views") return (b.viewer || 0) - (a.viewer || 0);
    if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, "reviews"),
          orderBy("createdAt", "desc"),
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReviews(data);
      } catch (err) {
        console.error("리뷰 불러오기 실패:", err);
      }
    };

    fetchReviews();
  }, []);
  return (
    <div className={styles["commu-wrapper"]}>
      <div className={styles["post-topbar"]} onClick={() => navigate(-1)}>
        <img src={icon1} alt="back" /> 뒤로가기
      </div>
      <div className={styles["commu-header"]}>
        <h2>리뷰 전체보기</h2>
      </div>
      <div className={styles["commu-filter"]}>
        {/* 1. 정렬 버튼들을 왼쪽으로 (순서 변경) */}
        <img src={filterIcon} alt="filter" /> 
        <span>정렬:</span>
        <div className={styles["sort-buttons"]}>
          <button 
            className={sort === "latest" ? styles["active"] : ""} 
            onClick={() => setSort("latest")}
          >최신순</button>
          <button 
            className={sort === "views" ? styles["active"] : ""} 
            onClick={() => setSort("views")}
          >조회순</button>
          <button 
            className={sort === "rating" ? styles["active"] : ""} 
            onClick={() => setSort("rating")}
          >평점순</button>
        </div>

        {/* 2. 지점 드롭다운을 오른쪽으로 (순서 변경) */}
        <div className={styles["branch-filter-container"]}>
          
          <select 
            value={selectedBranch} 
            onChange={(e) => setSelectedBranch(e.target.value)}
            className={styles["branch-select"]}
          >
            {Object.entries(branchMap).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>
      </div>
      
      

      {/* 리뷰목록 */}
      <div className={styles["review-list"]}>
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))
        ) : (
          <p className={styles.noData}>해당 지점의 리뷰가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default ReviewDetail