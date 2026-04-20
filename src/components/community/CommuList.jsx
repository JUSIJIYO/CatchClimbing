import React, { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import styles from "../../styles/css/community/CommuList.module.css";
import filterIcon from "../../assets/icon/commuFilter.svg";
import PostItem from "./PostItem";
import { useNavigate } from "react-router-dom";
import icon1 from "../../assets/icon/backIcon.svg"
function CommuList({ branchId }) {
  const branchNameMap = {
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
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const created = timestamp.toDate();
    const diff = (now - created) / 1000;

    if (diff < 60) return "방금 전";
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;

    return `${Math.floor(diff / 86400)}일 전`;
  };

  useEffect(() => {
    let q;

    if (branchId) {
      q = query(collection(db, "posts"), where("branchId", "==", branchId));
    } else {
      q = collection(db, "posts");
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();

        return {
          id: doc.id,
          title: d.title,
          authorName: d.isAnonymous ? "익명" : d.authorName,
          viewer: d.viewer || 0,
          commentCount: d.commentCount || 0,
          branchId: d.branchId,
          createdAt: d.createdAt,
        };
      });

      setPosts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [branchId]);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sort === "latest") return b.createdAt - a.createdAt;
    if (sort === "views") return b.views - a.views;
    if (sort === "comments") return b.comments - a.comments;
    return 0;
  });

  return (
    <div className={styles["commu-wrapper"]}>
      <div className={styles["post-topbar"]} onClick={() => navigate(-1)}>
        <img src={icon1} alt="back" /> 뒤로가기
      </div>
      <div className={styles["commu-header"]}>
        <h2>전체 게시글</h2>
        <button
          className={styles["commu-writebtn"]}
          onClick={() => navigate("/postform")}
        >
          작성하기
        </button>
      </div>

      <div className={styles["commu-filter"]}>
        <img src={filterIcon} alt="" />

        <span>정렬 :</span>

        <button
          className={sort === "latest" ? styles["active"] : ""}
          onClick={() => setSort("latest")}
        >
          최신순
        </button>

        <button
          className={sort === "views" ? styles["active"] : ""}
          onClick={() => setSort("views")}
        >
          조회순
        </button>

        <button
          className={sort === "comments" ? styles["active"] : ""}
          onClick={() => setSort("comments")}
        >
          댓글순
        </button>
      </div>

      <div className={styles["commu-list"]}>
        {loading ? (
          <p>불러오는 중...</p>
        ) : sortedPosts.length === 0 ? (
          <p>게시글이 없습니다.</p>
        ) : (
          sortedPosts.map((post) => <PostItem key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}

export default CommuList;
