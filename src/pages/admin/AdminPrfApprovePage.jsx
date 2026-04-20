import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PrfApproveList from "../../components/admin/PrfApproveList";
import styles from "../../styles/css/admin/AdminPrfAprrovePage.module.css";

function AdminProfessorApprovePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // 지점 아이디 받아서 넘기기 (지점관리자 해당 지점 파악)
  const branchId = searchParams.get("branchId");

  return (
    <div className={styles["adminPrfApprovePage-ct"]}>
      <div className={styles["adminPrfApprovePage-header-ct"]}>
        <p onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
          {"<"}- 강사 관리로 돌아가기
        </p>
        <h2> 강사 승인 대기 목록</h2>
        <p> 승인 대기중인 강사를 검토하고 승인하세요</p>
      </div>
      <PrfApproveList branchId={branchId} />
    </div>
  );
}

export default AdminProfessorApprovePage;
