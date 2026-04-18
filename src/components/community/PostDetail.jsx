import React from "react";
import styles from "../../styles/css/community/PostDetail.module.css";
import icon1 from "../../assets/icon/people2.svg"
import icon2 from "../../assets/icon/eyeicon.svg"
import icon3 from "../../assets/icon/comment.svg"

function PostDetail() {

  
  return (
    <div className={styles["post-container"]}>
      <div className={styles["post-card"]}>
        
        <div className={styles["post-header"]}>
          <h2 className={styles["post-title"]}>V3 클라이머를 위한 팁?</h2>
          <button className={styles["post-reportBtn"]}>신고하기</button>
        </div>

        <div className={styles["post-infomation"]}>
          <span><img src={icon1} />climber_123</span>
          <span>•</span>
          <span>2시간 전</span>
          <span>•</span>
          <span>강남점</span>
        </div>

        <div className={styles["post-click"]}>
          <span><img src={icon2}/>조회 234</span>
          <span><img src={icon3}/>댓글 12</span>
        </div>

        <div className={styles["post-line"]} />

        <div className={styles["post-content"]}>
          안녕하세요! V3에서 좀처럼 진전이 없네요. V4로 넘어가려면 어떤
          연습이 필요할까요? 기술적인 부분이 부족한 것 같아요...
        </div>

      </div>
    </div>
  );
}

export default PostDetail;