import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/css/admin/BranchItem.module.css";
import adminBranchEye from '../../../assets/icon/adminBrancheye.svg'

// 상태값 (운영중, 승인대기, 비활성화)에 따른 스타일 적용 배열
const STATUS_MAP = {
  approved: { label: "운영중", class: styles["branchItem-status-approved"] },
  pending: { label: "승인대기", class: styles["branchItem-status-pending"] },
  disabled: { label: "비활성화", class: styles["branchItem-status-disabled"] },
};

// 받아온 가입일 xxxx-xx-xx 형식으로 바꾸기
const signDate = (time) => {
  if (!time) {
    return "승인대기중";
  }
  const date = time.toDate ? time.toDate() : new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 브랜치 정보, 강사 수 
function BranchItem({ branch, professorCount = 0 }) {
  const navigate = useNavigate();

  // 기본값은 pending(승인대기) 상태로 설정 값이 있으면 받아온 branch 정보에 상태값 받아와서 저장
  const status = STATUS_MAP[branch.status] ?? STATUS_MAP.pending;

  return (
    <div className={styles["branchItem-ct"]}>
      <div className={styles["branchItem-top-ct"]}>
        <p>{branch.name}</p>
        {/* status 이용해 ㅌ받아온 상태에 따라 글자, 색깔 바뀌게 설정 */}
        <p className={`${styles["branchItem-status"]} ${status.class}`}>
          {status.label}
        </p>
      </div>
      <p className={styles["branchItem-address"]}>{branch.address}</p>
      <div className={styles["branchItem-middle-ct"]}>
        <p>연락처</p>
        <p>{branch.phone ?? "-"}</p>
      </div>
      <div className={styles["branchItem-middle-ct"]}>
        <p>강사</p>
        <p>{professorCount}명</p>
      </div>
      <div className={styles["branchItem-middle-ct"]}>
        <p>오픈일</p>
        <p>{signDate(branch.joinAt)}</p>
      </div>
      <button
        className={styles["branchItem-detail-view-button"]}
        onClick={() => navigate(`/admin/branchmanage/${branch.id}`)}
      >
        <img src={adminBranchEye}/>
        <p>상세보기 </p>
      </button>
    </div>
  );
}

export default BranchItem;
