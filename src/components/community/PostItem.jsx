import React from "react";
import { useNavigate } from "react-router-dom";
import personIcon from "../../assets/icon/commuPerson.svg";
import eyeIcon from "../../assets/icon/commuEye.svg";
import commentIcon from "../../assets/icon/commuComment.svg";
import styles from "../../styles/css/branch/BranchCommuItem.module.css";
import { doc, updateDoc, increment, onSnapshot, query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useState, useEffect } from "react";

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

function PostItem({ post }) {
  const navigate = useNavigate();
  const [commentCount, setCommentCount] = useState(0);

  //댓글 개수 가져오기
  useEffect(() => {
  const q = query(
    collection(db, "comments"),
    where("postId", "==", post.id)
  );

  const unsub = onSnapshot(q, (snap) => {
    setCommentCount(snap.size);
  });

  return () => unsub();
}, [post.id]);

  //눌렀을 때 조회수 증가
  const handleClick = async () => {
    try {
      const postRef = doc(db, "posts", post.id);

      await updateDoc(postRef, {
        viewer: increment(1),
      });

      navigate(`/post/${post.id}`);
    } catch (e) {
      console.error("조회수 증가 실패:", e);
    }
  };

  const [postData, setPostData] = useState(post);


  useEffect(() => {
    const ref = doc(db, "posts", post.id);

    const unsub = onSnapshot(ref, (snap) => {
      setPostData(snap.data());
    });

    return () => unsub();
  }, [post.id]);

  const handleDetailNav = () => {
    navigate(`/post/${post.id}`);
  };

  const displayBranchName =
    branchNameMap[post.branchId] || post.branchId || "전체";

  return (
    <div
      className={styles["card"]}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className={styles["top"]}>
        <h3>{postData?.title}</h3>
        <span className={styles["branch"]}>{displayBranchName}</span>
      </div>

      <div className={styles["author"]}>
        <img src={personIcon} alt="사람아이콘" />
        <span>{postData?.authorName || "익명"}</span>
      </div>

      <div className={styles["meta"]}>
        <div>
          <img src={eyeIcon} alt="조회수" />
          <span>{postData.viewer || 0}</span>
        </div>

        <div>
          <img src={commentIcon} alt="댓글" />
          <span>{commentCount}</span>
        </div>

        <span>
          {" "}
          {postData?.createdAt
            ? new Date(postData.createdAt.seconds * 1000).toLocaleDateString()
            : ""}
        </span>
      </div>
    </div>
  );
}

export default PostItem;
