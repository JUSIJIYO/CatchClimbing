import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { db } from "../../firebase/config";
import Modal from "../../components/common/Modal";
import DoneModal from "../../components/common/ConfirmModal";
import adminBranchPhone from "../../assets/icon/adminBranchPhone.svg";
import adminBranchInsta from "../../assets/icon/adminBranchInsta.svg";
import adminBranchClock from "../../assets/icon/adminBranchClock.svg";
import adminBranchSign from "../../assets/icon/adminBranchSign.svg";
import adminBranchLocation from "../../assets/icon/adminBranchLocation.svg";
import adminDeactivate from "../../assets/icon/adminDeactivate.svg";
import styles from "../../styles/css/admin/AdminBranchDetailPage.module.css";

// 지점 상태(운영중, 승인대기, 비활성화)에 따른 스타일 설정 배열
const STATUS_MAP = {
  approved: {
    label: "운영중",
    class: styles["adminBranchDetail-heder-status-approved"],
  },
  pending: {
    label: "승인대기",
    class: styles["adminBranchDetail-heder-status-pending"],
  },
  disabled: {
    label: "비활성화",
    class: styles["adminBranchDetail-heder-status-disabled"],
  },
};

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

function AdminBranchDetailPage() {
  // 넘겨받은 id 가져오기
  const { id } = useParams();
  const navigate = useNavigate();

  // 지점 데이터 상태 관리
  const [branch, setBranch] = useState(null);

  // 지점에 소속된 강사 목록 상태 관리
  const [professors, setProfessors] = useState([]);

  // 로딩 상태 관리
  const [loading, setLoading] = useState(true);

  // 모달 상태관리
  const [modal, setModal] = useState(null); // "delete" | "deactivate"

  // 확인 모달 상태관리
  const [doneModal, setDoneModal] = useState(null); // "delete" | "deactivate"

  // 모달버튼 로딩상태 관리
  const [modalLoading, setModalLoading] = useState(false);

  // firebase 연동
  useEffect(() => {
    const fetchData = async () => {
      // 넘겨받은 id값에 해당하는 지점 목록 가져오기
      const branchSnap = await getDoc(doc(db, "branches", id));
      // 해당 id의 지점 존재하지 않을시 이전 페이지로 이동
      if (!branchSnap.exists()) {
        navigate("/admin/branchmanage");
        return;
      }
      // 받아온 문서 저장
      const branchData = { id: branchSnap.id, ...branchSnap.data() };
      setBranch(branchData);

      // 지점에 소속된 강사 정보 가져오기
      const prfAffiliation = await getDocs(
        query(
          collection(db, "users"),
          // 역할이 강사
          where("role", "==", "professor"),
          // 지점 id가 현재 지점 id와 같은 경우
          where("branchId", "==", id),
        ),
      );
      // 강사 정보 뿌리기
      setProfessors(
        prfAffiliation.docs.map((data) => ({ id: data.id, ...data.data() })),
      );
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // 삭제하기, 비활성화, 활성화 버튼 클릭시 발생하는 함수
  const handleConfirm = async () => {
    setModalLoading(true);
    try {
      // 삭제하기일 경우
      if (modal === "delete") {
        // 데이터베이스에서 해당 지점 삭제
        await deleteDoc(doc(db, "branches", id));
        // 비활성화일 경우
      } else if (modal === "deactivate") {
        // 지점 상태값 비활성화(disabled)로 바꾸기
        await updateDoc(doc(db, "branches", id), { status: "disabled" });
        setBranch((item) => ({ ...item, status: "disabled" }));
        // 활성화일 경우
      } else if (modal === "activate") {
        // 지점 상태값 활성화(approved)로 바꾸기
        await updateDoc(doc(db, "branches", id), { status: "approved" });
        setBranch((item) => ({ ...item, status: "approved" }));
      }
      const type = modal;
      setModal(null);
      setDoneModal(type);
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  // 모달에서 취소확인 버튼 클릭시 발동하는 함수
  const handleDoneClose = () => {
    // 삭제일 경우
    if (doneModal === "delete") {
      navigate("/admin/branchmanage");
    }
    setDoneModal(null);
  };

  // 수정하기 버튼 클릭시 발동하는 함수
  const handleEdit = () => {
    navigate("/admin/branch-form", { state: { branch } });
  };

  if (loading) {
    return (
      <p className={styles["adminBranchDetail-loading"]}>불러오는 중...</p>
    );
  }

  // 기본은 승인대기 값을 받아오면 해당 값에 맞는 상태 저장
  const status = STATUS_MAP[branch.status] ?? STATUS_MAP.pending;

  // 위도 경도 존재 확인
  const hasCoords = branch.latitude && branch.longtitude;

  // 위도 경도가 있다면 카카오맵에 넘길 위치정보 반환 없을 시 null 반환
  const coords = hasCoords
    ? { lat: branch.latitude, lng: branch.longtitude }
    : null;

  return (
    <div className={styles["adminBranchDetail-ct"]}>
      <p
        className={styles["adminBranchDetail-back-button"]}
        onClick={() => navigate("/admin/branchmanage")}
      >
        {"<"}- 지점 관리로 돌아가기
      </p>

      <div className={styles["adminBranchDetail-heder-ct"]}>
        <div className={styles["adminBranchDetail-heder-title-ct"]}>
          <h2 className={styles["adminBranchDetail-heder-title"]}>
            {branch.name}
          </h2>
          <span
            className={`${styles["adminBranchDetail-heder-status"]} ${status.class}`}
          >
            {status.label}
          </span>
        </div>
        <div className={styles["adminBranchDetail-button-ct"]}>
          <button
            className={styles["adminBranchDetail-delete-button"]}
            onClick={() => setModal("delete")}
          >
            삭제하기
          </button>
          <button
            className={styles["adminBranchDetail-edit-button"]}
            onClick={handleEdit}
          >
            수정하기
          </button>
          {branch.status === "disabled" ? (
            <button
              className={styles["adminBranchDetail-activate-button"]}
              onClick={() => setModal("activate")}
            >
              <img src={adminDeactivate} />
              <p>활성화</p>
            </button>
          ) : (
            <button
              className={styles["adminBranchDetail-deactivate-button"]}
              onClick={() => setModal("deactivate")}
            >
              <img src={adminDeactivate} />
              <p>비활성화</p>
            </button>
          )}
        </div>
      </div>

      <div className={styles["adminBranchDetail-middle-ct"]}>
        <div className={styles["adminBranchDetail-middle-left-ct"]}>
          <div className={styles["adminBranchDetail-middle-content-ct"]}>
            <p className={styles["adminBranchDetail-middle-content-title"]}>
              지도
            </p>
            <div className={styles["adminBranchDetail-img-ct"]}>
              {branch.image ? (
                <img
                  src={branch.image}
                  className={styles["adminBranchDetail-img"]}
                />
              ) : (
                <div className={styles["adminBranchDetail-img-none"]}>
                  <img src={adminBranchSign} />
                  <p>클릭하여 이미지를 업로드하세요</p>
                  <p>PNG, JPG, WEBP (최대 10MB)</p>
                </div>
              )}
            </div>
            {branch.address && (
              <p className={styles["adminBranchDetail-address"]}>
                <img src={adminBranchLocation} />
                {branch.address}
              </p>
            )}
          </div>

          {/* 소속 강사 카드 */}
          <div className={styles["adminBranchDetail-middle-content-ct"]}>
            <p className={styles["adminBranchDetail-middle-content-title"]}>
              소속 강사
            </p>
            {professors.length === 0 ? (
              <p className={styles["adminBranchDetail-none-professor"]}>
                소속 강사가 없습니다.
              </p>
            ) : (
              <div className={styles["adminBranchDetail-prf-ct"]}>
                {professors.map((prf) => (
                  <p
                    key={prf.id}
                    className={styles["adminBranchDetail-prf-content-ct"]}
                  >
                    <div>
                      <p className={styles["adminBranchDetail-prf-title"]}>
                        {prf.name}
                      </p>
                      <p className={styles["adminBranchDetail-prf-level"]}>
                        레벨 {prf.level ?? "-"}
                      </p>
                    </div>
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles["adminBranchDetail-middle-right-ct"]}>
          <div className={styles["adminBranchDetail-middle-content-ct"]}>
            <p className={styles["adminBranchDetail-middle-content-title"]}>
              위치
            </p>
            <div className={styles["adminBranchDetail-map-ct"]}>
              {coords ? (
                <Map
                  center={coords}
                  style={{ width: "100%", height: "100%" }}
                  level={4}
                >
                  <MapMarker position={coords} />
                </Map>
              ) : (
                <div className={styles["adminBranchDetail-map-none"]}>
                  <img src={adminBranchLocation} />
                </div>
              )}
            </div>
          </div>

          <div className={styles["adminBranchDetail-middle-content-ct"]}>
            <p className={styles["adminBranchDetail-middle-content-title"]}>
              연락처 정보
            </p>
            <div className={styles["adminBranchDetail-number-ct"]}>
              <img src={adminBranchPhone} />
              <div>
                <p className={styles["adminBranchDetail-number-title"]}>
                  전화번호
                </p>
                <p className={styles["adminBranchDetail-number"]}>
                  {branch.phone ?? "-"}
                </p>
              </div>
            </div>
            {branch.instagram && (
              <div className={styles["adminBranchDetail-number-ct"]}>
                <img src={adminBranchInsta} />
                <div>
                  <p className={styles["adminBranchDetail-number-title"]}>
                    Instagram
                  </p>
                  <p className={styles["adminBranchDetail-number"]}>
                    {branch.instagram}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className={styles["adminBranchDetail-middle-content-ct"]}>
            <p className={styles["adminBranchDetail-middle-content-title"]}>
              영업시간
            </p>
            <div className={styles["adminBranchDetail-opentime-ct"]}>
              <img src={adminBranchClock} />
              <p className={styles["adminBranchDetail-opentime"]}>
                {branch.openHours ?? "-"}
              </p>
            </div>
          </div>

          <div className={styles["adminBranchDetail-middle-content-ct"]}>
            <p className={styles["adminBranchDetail-middle-content-title"]}>
              통계
            </p>
            <div className={styles["adminBranchDetail-statistics-ct"]}>
              <p className={styles["adminBranchDetail-statistics-title"]}>
                강사
              </p>
              <p className={styles["adminBranchDetail-statistics"]}>
                {professors.length}명
              </p>
            </div>
            <div className={styles["adminBranchDetail-statistics-ct"]}>
              <p className={styles["adminBranchDetail-statistics-title"]}>
                오픈일
              </p>
              <p className={styles["adminBranchDetail-statistics"]}>
                {signDate(branch.joinAt ?? branch.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <Modal
          title={
            modal === "delete"
              ? "삭제 확인"
              : modal === "deactivate"
                ? "비활성화 확인"
                : "활성화 확인"
          }
          message={
            modal === "delete"
              ? "지점을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
              : modal === "deactivate"
                ? "지점을 비활성화하시겠습니까?"
                : "지점을 활성화하시겠습니까?"
          }
          cancelText="취소"
          confirmText={
            modal === "delete"
              ? "삭제"
              : modal === "deactivate"
                ? "비활성화"
                : "활성화"
          }
          onCancel={() => setModal(null)}
          onConfirm={handleConfirm}
          loading={modalLoading}
        />
      )}

      {/* 완료 모달 */}
      {doneModal && (
        <DoneModal
          message={
            doneModal === "delete"
              ? "삭제가 완료되었습니다."
              : doneModal === "deactivate"
                ? "비활성화되었습니다."
                : "활성화되었습니다."
          }
          onConfirm={handleDoneClose}
        />
      )}
    </div>
  );
}

export default AdminBranchDetailPage;
