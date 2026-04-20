import React from "react";
import { useNavigate } from "react-router-dom";
import BranchApproveList from "../../components/admin/total/BranchApproveList";
import styles from "../../styles/css/admin/BranchApprovePage.module.css";

function BranchApprovePage() {
  const navigate = useNavigate();

  return (
    <div className={styles["branchApprovePage-ct"]}>
      <button
        className={styles["branchApprovePage-back-btn"]}
        onClick={() => navigate("/admin/branchmanage")}
      >
        ← 지점 관리로 돌아가기
      </button>
      <div className={styles["branchApprovePage-top-ct"]}>
        <h2>지점 승인 관리</h2>
      </div>
      <BranchApproveList />
    </div>
  );
}

export default BranchApprovePage;
