import React from 'react';
import styles from '../../styles/css/branch/BranchReviewItem.module.css';
import star from '../../assets/icon/reviewstar.svg';

function ReviewItem({ review }) {
  if (!review) return null;

  const branchMap = {
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

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.rating}>
          <img src={star} alt="별점" />
          <span>{review.rating ?? 0}</span>
        </div>

        <span className={styles.branch}>
          {branchMap[review.branchId] || review.branchId}
        </span>
      </div>

      <h3 className={styles.title}>{review.title}</h3>
      <p className={styles.content}>{review.content}</p>

      <div className={styles.bottom}>
        <span>{review.isAnonymous ? "익명" : review.authorName}</span>
        <span>
          {review.createdAt?.toDate
            ? review.createdAt.toDate().toLocaleDateString()
            : ""}
        </span>
      </div>
    </div>
  );
}
export default ReviewItem;
