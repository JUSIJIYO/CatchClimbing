import React, { useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase/config";
import adminBranchApprove from "../../../assets/icon/adminPrfApprove.svg";
import adminBranchReject from "../../../assets/icon/adminPrfReject.svg";
import Modal from "../../common/Modal";
import DoneModal from "../../common/ConfirmModal";
import styles from "../../../styles/css/admin/BranchApproveItem.module.css";

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

// 지점 데이터 객체, 상위 컴포넌트에서 넘겨받은 함수
function BranchApproveItem({ branch, onStatusChange }) {
  // 모달 상태 관리
  const [modal, setModal] = useState(null);

  // 완료 모달 상태 관리
  const [doneModal, setDoneModal] = useState(null);

  // 모달 로딩 상태 관리
  const [loading, setLoading] = useState(false);

  // 지점 승인 관리 함수
  const handleConfirm = async () => {
    setLoading(true);
    try {
      // 승인시 바뀔 값 관리
      const updateData =
        modal === "approve"
          ? { status: "approved", joinAt: serverTimestamp() }
          : { status: "disabled" };
      await updateDoc(doc(db, "branches", branch.id), updateData);
      const type = modal;
      setModal(null);
      setDoneModal(type);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 모달 승인 완료후 나오는 완료 버튼 클릭 함수
  const handleDoneClose = () => {
    onStatusChange(branch.id);
    setDoneModal(null);
  };

  return (
    <div className={styles["branchApproveItem-ct"]}>
      <div className={styles["branchApproveItem-top-ct"]}>
        <p>{branch.name}</p>
        <p>승인대기</p>
      </div>
      <p>{branch.address}</p>
      <div className={styles["branchApproveItem-middle-ct"]}>
        <div className={styles["branchApproveItem-middle-content"]}>
          <p>연락처</p>
          <p>{branch.phone ?? "-"}</p>
        </div>
        <div className={styles["branchApproveItem-middle-content"]}>
          <p>강사</p>
          <p>{branch.professorCount ?? 0}명</p>
        </div>
        <div className={styles["branchApproveItem-middle-content"]}>
          <p>오픈일</p>
          <p>{signDate(branch.createdAt)}</p>
        </div>
      </div>
      <div className={styles["branchApproveItem-button-ct"]}>
        <button
          className={styles["branchApproveItem-approve-button"]}
          onClick={() => setModal("approve")}
        >
          <img src={adminBranchApprove} />
          <p>승인</p>
        </button>
        <button
          className={styles["branchApproveItem-reject-button"]}
          onClick={() => setModal("reject")}
        >
          <img src={adminBranchReject} />
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
          loading={loading}
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
    </div>
  );
}

export default BranchApproveItem;
