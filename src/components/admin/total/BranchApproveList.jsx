import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase/config";
import BranchApproveItem from "./BranchApproveItem";
import styles from "../../../styles/css/admin/BranchApproveList.module.css";

function BranchApproveList() {
  // 지점 목록 상태 관리
  const [branches, setBranches] = useState([]);

  // 로딩 상태 관리
  const [loading, setLoading] = useState(true);

  // firebase 연동함수
  const approveBranches = async () => {
    const snap = await getDocs(
      // 상태가 pending(승인대기중)인 상탬만 선택
      query(collection(db, "branches"), where("status", "==", "pending")),
    );
    // 지점 목록에 뿌리기
    setBranches(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  // 마운트 될 떄 한번만 실행되도록 설정
  useEffect(() => {
    approveBranches();
  }, []);

  // BranchApproveItem에서 승인 또는 거절된 지점 화면에 안보이게 필터링
  const handleStatusChange = (branchId) => {
    setBranches((item) => item.filter((branch) => branch.id !== branchId));
  };

  // 로딩
  if (loading) {
    return <p className={styles["branchApproveList-none"]}>불러오는 중...</p>;
  }
  // 승인대기중인 지점 없을 때
  if (branches.length === 0) {
    return (
      <p className={styles["branchApproveList-none"]}>
        승인 대기 중인 지점이 없습니다.
      </p>
    );
  }

  return (
    <div className={styles["branchApproveList-ct"]}>
      {branches.map((branch) => (
        <BranchApproveItem
          key={branch.id}
          branch={branch}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
}

export default BranchApproveList;
