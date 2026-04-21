import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import adminPrfReject from "../../assets/icon/adminPrfReject.svg";
import adminPrfApprove from "../../assets/icon/adminPrfApprove.svg";
import Modal from "../common/Modal";
import DoneModal from "../common/ConfirmModal";
import styles from "../../styles/css/admin/PrfApproveItem.module.css";

// 받아온 가입일 xxxx-xx-xx 형식으로 바꾸기
const signDate = (time) => {
  if (!time) {
    return "-";
  }
  const date = time.toDate ? time.toDate() : new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function PrfApproveItem({ professor, onStatusChange }) {
  // 모달 상태 관리
  const [modal, setModal] = useState(null); 

  // 완료 모달 상태 관리
  const [doneModal, setDoneModal] = useState(null); 

  
  const [processing, setProcessing] = useState(false);

  // 승인 상태에 따라 다른값 반환되도록
  const statusLabel = professor.isApproved === "reject" ? "거부됨" : "대기중";

  // 모달에서 확인 버튼 클릭시 firebase 업데이트
  const handleConfirm = async () => {
    setProcessing(true);
    try {
      const isApproved = modal === "approve" ? true : "reject";
      await updateDoc(doc(db, "users", professor.id), { isApproved });
      const type = modal;
      setModal(null);
      setDoneModal(type);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  // 모달 닫기 관리 함수
  const handleDoneClose = () => {
    onStatusChange(professor.id);
    setDoneModal(null);
  };

  return (
    <article className={styles["prfApporveItem-ct"]}>
      <div className={styles["prfApproveItem-content-ct"]}>
        <p className={styles["prfApproveItem-prf-name"]}>{professor.name}</p>
        <p className={`${styles["prfApproveItem-prf-status"]}${professor.isApproved === "reject" ? ` ${styles["prfApproveItem-prf-reject-status"]}` : ""}`}>{statusLabel}</p>
      </div>

      <div className={styles["prfApproveItem-content-ct"]}>
        <p className={styles["prfApproveItem-prf-date-title"]}>가입일</p>
        <p className={styles["prfApproveItem-prf-date"]}>
          {signDate(professor.createdAt)}
        </p>
      </div>

      <div className={styles["prfApproveItem-content-ct"]}>
        <p className={styles["prfApproveItem-prf-number-title"]}>연락처</p>
        <p className={styles["prfApproveItem-prf-number"]}>
          {professor.phone ?? "-"}
        </p>
      </div>

      <div className={styles["prfApproveItem-content-ct"]}>
        <p className={styles["prfApproveItem-prf-email-title"]}>이메일</p>
        <p className={styles["prfApproveItem-prf-email"]}>
          {professor.email ?? "-"}
        </p>
      </div>

      <div className={styles["prfApproveItem-content-ct"]}>
        <p className={styles["prfApproveItem-prf-level-title"]}>레벨</p>
        <p className={styles["prfApproveItem-prf-level"]}>
          {professor.level ?? "-"}
        </p>
      </div>

      <div className={styles["prfApproveItem-approve-button-ct"]}>
        <button
          className={styles["prfApproveItem-approve-button"]}
          onClick={() => setModal("approve")}
        >
          <img src={adminPrfApprove} />
          <p>승인</p>
        </button>

        <button
          className={styles["prfApproveItem-reject-button"]}
          onClick={() => setModal("reject")}
        >
          <img src={adminPrfReject} />
          <p>거절</p>
        </button>
      </div>

      {modal && (
        <Modal
          title={modal === "approve" ? "승인확인" : "승인거절"}
          message={
            modal === "approve"
              ? "승인하시겠습니까?"
              : "승인을 거절하시겠습니까?"
          }
          cancelText="취소"
          confirmText="확인"
          onCancel={() => setModal(null)}
          onConfirm={handleConfirm}
          loading={processing}
        />
      )}

      {doneModal && (
        <DoneModal
          message={
            doneModal === "approve"
              ? "승인이 완료되었습니다."
              : "거절이 완료되었습니다."
          }
          onConfirm={handleDoneClose}
        />
      )}
    </article>
  );
}

export default PrfApproveItem;
