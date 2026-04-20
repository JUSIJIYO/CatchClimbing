import React from "react";
import BranchList from "../../components/admin/total/BranchList";
import styles from "../../styles/css/admin/BranchManagePage.module.css";

function BranchManagePage() {
  return (
    <div className={styles["branchManagePage-ct"]}>
      <div className={styles["branchManagePage-top-ct"]}>
        <h2>지점 관리</h2>
        <p>전체 지점을 조회하고 승인을 관리하세요</p>
      </div>
      <BranchList />
    </div>
  );
}

export default BranchManagePage;
