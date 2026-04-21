import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase/config";
import { useAuth } from "../../../context/AuthContext";
import styles from "../../../styles/css/admin/BranchAdminBranchManage.module.css";

function BranchadminBranchManage() {
  // 로그인 유저 확인
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  // 지점 상태 관리
  const [branch, setBranch] = useState(null);
  //   로딩 상태 관리
  const [loading, setLoading] = useState(true);

  //   지점 관리자의 지점만 조회할 수 있게 설정
  useEffect(() => {
    // 인증되지 않은 사용자면 return을 종료
    if (!currentUser) {
      return;
    }

    // 로그인한 지점관리자와 일치하는 정보 찾기
    const searchBranch = async () => {
      const q = query(
        // 지점목록 컬렉션에서
        collection(db, "branches"),
        // id가 일치하는 정보만 가져오기
        where("adminId", "==", currentUser.uid),
      );
      // 위에서 저장한 지점목록 정보얻어서 저장
      const snap = await getDocs(q);
      // 정보 있으면 문서 꺼내서 저장
      if (!snap.empty) {
        const docSnap = snap.docs[0];
        setBranch({ id: docSnap.id, ...docSnap.data() });
      }
      // 정보 없으면 상태 그대로 유ㅈ
      setLoading(false);
    };
    searchBranch();
  }, [currentUser]);

  if (loading) {
    return null
  };

  //   승인 상태 확인
  const isApproved = branch?.status === "approved";
  const isDisabled = branch?.status === "disabled";

  return (
    <div className={styles["b-branchManage-ct"]}>
      <div className={styles["b-branchManage-header-ct"]}>
        <h2>지점 관리</h2>
        <p>지점 정보를 등록하고 수정하세요</p>
      </div>

      {!branch ? (
        <div className={styles["b-branchManage-unEroll-ct"]}>
          <div className={styles["b-branchManage-unEroll-top-ct"]}>
            <p>지점 미등록</p>
            <p>미등록</p>
          </div>
          <p>아직 등록된 지점이 없습니다. 새로운 지점을 신청해주세요.</p>
          <button
            className={styles["b-branchManage-eroll-button"]}
            onClick={() => navigate("/admin/branch-form")}
          >
            + 신청하기
          </button>
        </div>
      ) : (
        <div className={styles["b-branchManage-Eroll-ct"]}>
          <div className={styles["b-branchManage-Eroll-top-ct"]}>
            <p>
              {isApproved ? "지점 운영중" : isDisabled ? "지점 거절됨" : "지점 신청 완료"}
            </p>
            <p
              className={
                isApproved
                  ? styles["b-branchManage-badge-approved"]
                  : isDisabled
                    ? styles["b-branchManage-badge-disabled"]
                    : ""
              }
            >
              {isApproved ? "운영중" : isDisabled ? "거절됨" : "승인 대기"}
            </p>
          </div>

          <p>
            {isApproved
              ? "현재 지점이 정상적으로 운영되고 있습니다."
              : isDisabled
                ? "지점 신청이 거절되었습니다. 관리자에게 문의해주세요."
                : "지점 신청이 완료되었습니다. 승인 대기중입니다"}
          </p>

          <hr />

          <div className={styles["b-branchManage-branch-inf-ct"]}>
            <div className={styles["b-branchManage-branch-inf"]}>
              <div className={styles["b-branchManage-branch-content-inf-ct"]}>
                <p>지점명</p>
                <p>{branch.name}</p>
              </div>
              <div className={styles["b-branchManage-branch-content-inf-ct"]}>
                <p>연락처</p>
                <p>{branch.phone}</p>
              </div>
            </div>

            <div className={styles["b-branchManage-branch-content-inf-ct"]}>
              <p>주소</p>
              <p>{branch.address}</p>
            </div>

            <div className={styles["b-branchManage-branch-inf"]}>
              <div className={styles["b-branchManage-branch-content-inf-ct"]}>
                <p>영업시간</p>
                <p style={{ whiteSpace: "pre-line" }}>{branch.openHours}</p>
              </div>
              <div className={styles["b-branchManage-branch-content-inf-ct"]}>
                <p>Instagram</p>
                <p>{branch.instagram}</p>
              </div>
            </div>
          </div>

          <button
            className={styles["b-branchManage-branch-edit-button"]}
            onClick={() =>
              navigate("/admin/branch-form", { state: { branch } })
            }
          >
            수정하기
          </button>
        </div>
      )}
    </div>
  );
}

export default BranchadminBranchManage;
