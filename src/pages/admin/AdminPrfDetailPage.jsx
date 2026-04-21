import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getUserDoc,
  fetchBranchNames,
  getClassesByProfessor,
  updateUserDoc,
} from "../../services/adminService";
import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import styles from "../../styles/css/admin/AdminPrfDetailPage.module.css";
import adminPrfDetailStudents from "../../assets/icon/adminPrfDetailStudents.svg";

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

function AdminPrfDetailPage() {
  // 강사 id값 받아오기
  const { id } = useParams();
  const navigate = useNavigate();

  // 강사 기본 객체 상태 관리
  const [professor, setProfessor] = useState(null);

  // 지점 이름 상태 관리
  const [branchName, setBranchName] = useState("-");

  // 담당 강의 배열 상태 관리
  const [classes, setClasses] = useState([]);

  // 로딩 상태 관리
  const [loading, setLoading] = useState(true);

  // 수정 모드 상태 관리
  const [isEditing, setIsEditing] = useState(false);

  // 수정 폼 상태 관리 (전화번호, 경력)
  const [editForm, setEditForm] = useState({ phone: "", career: "" });

  // 수정확인 모달 상태 관리
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 저장완료 모달 상태 관리
  const [showDoneModal, setShowDoneModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    // 데이터 불러오기
    const load = async () => {
      try {
        // Promise.all 이용해서 하나라도 실패하면 reject 되도록 설정
        const [userData, branchMap, classData] = await Promise.all([
          getUserDoc(id),
          fetchBranchNames(),
          getClassesByProfessor(id),
        ]);
        setProfessor(userData);
        if (userData?.branchId)
          setBranchName(branchMap[userData.branchId] ?? "-");
        setClasses(classData);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // 수정하기 버튼 클릭 - 수정 모드 진입, 기존 값으로 폼 초기화
  const handleEditStart = () => {
    setEditForm({
      phone: professor.phone ?? "",
      career: Array.from(professor.career ? [professor.career].flat() : []).join("\n"),
    });
    setIsEditing(true);
  };

  // 취소 버튼 클릭 - 수정 모드 종료
  const handleEditCancel = () => {
    setIsEditing(false);
  };

  // 저장 버튼 클릭 - 수정확인 모달 표시
  const handleSaveClick = () => {
    setShowConfirmModal(true);
  };

  // 수정확인 모달에서 취소
  const handleConfirmCancel = () => {
    setShowConfirmModal(false);
  };

  // 수정확인 모달에서 확인 → 저장완료 모달 표시
  const handleConfirmOk = () => {
    setShowConfirmModal(false);
    setShowDoneModal(true);
  };

  // 저장완료 모달에서 확인 → DB 저장 후 모드 종료
  const handleDoneOk = async () => {
    const careerArray = editForm.career
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);

    await updateUserDoc(id, {
      phone: editForm.phone,
      career: careerArray,
    });

    setProfessor((prev) => ({
      ...prev,
      phone: editForm.phone,
      career: careerArray,
    }));

    setShowDoneModal(false);
    setIsEditing(false);
  };

  // 로딩중일 때 출력
  if (loading) {
    return <div className={styles["adminPrfDetailPage-ct"]}>불러오는 중...</div>;
  }

  // 강사 정보가 없을 때 출력
  if (!professor) {
    return (
      <div className={styles["adminPrfDetailPage-ct"]}>
        강사 정보를 찾을 수 없습니다.
      </div>
    );
  }

  // 경력 리스트
  const careerList = Array.from(
    professor.career ? [professor.career].flat() : [],
  );

  // 자격증 리스트
  const qualificationList = Array.from(professor.qualifications ?? []);

  return (
    <div className={styles["adminPrfDetailPage-ct"]}>
      <div className={styles["adminPrfDetailPage-header-ct"]}>
        <div className={styles["adminPrfDetailPage-header"]}>
          <div
            className={styles["adminPrfDetailPage-back-button"]}
            onClick={() => navigate(-1)}
          >
            {"<"}- 목록으로 돌아가기
          </div>
          <div className={styles["adminPrfDetailPage-header-btn-ct"]}>
            {isEditing ? (
              <>
                <button
                  className={styles["adminPrfDetailPage-cancel-button"]}
                  onClick={handleEditCancel}
                >
                  취소
                </button>
                <button
                  className={styles["adminPrfDetailPage-save-button"]}
                  onClick={handleSaveClick}
                >
                  저장
                </button>
              </>
            ) : (
              <button
                className={styles["adminPrfDetailPage-edit-button"]}
                onClick={handleEditStart}
              >
                수정하기
              </button>
            )}
          </div>
        </div>
        <h2>강사 상세 정보</h2>
        <p>강사의 상세 정보를 확인하고 관리하세요</p>
      </div>

      <div className={styles["adminPrfDetailPage-body-ct"]}>
        <div className={styles["adminPrfDetailPage-profile-ct"]}>
          <div className={styles["adminPrfDetailPage-profile-img-ct"]}>
            <img
              className={styles["adminPrfDetailPage-profile-img"]}
              src={professor.profileImg}
              alt="프로필 사진"
            />
          </div>
          <p className={styles["adminPrfDetailPage-professor-name"]}>
            {professor.name}
          </p>
          <p
            className={`${styles["adminPrfDetailPage-status"]} ${professor.isApproved ? styles["adminPrfDetailPage-status-approved"] : styles["adminPrfDetailPage-status-pending"]}`}
          >
            {professor.isApproved ? "승인됨" : "대기중"}
          </p>

          <div className={styles["adminPrfDetailPage-professor-info-ct"]}>
            <div className={styles["adminPrfDetailPage-professor-info"]}>
              <p>이메일</p>
              <p>{professor.email ?? "-"}</p>
            </div>
            <div className={styles["adminPrfDetailPage-professor-info"]}>
              <p>레벨</p>
              <p>{professor.level ?? "-"}</p>
            </div>
            <div className={styles["adminPrfDetailPage-professor-info"]}>
              <p>지점</p>
              <p>{branchName}</p>
            </div>
            <div className={styles["adminPrfDetailPage-professor-info"]}>
              <p>가입일</p>
              <p>{signDate(professor.createdAt)}</p>
            </div>
            {qualificationList.length > 0 && (
              <div className={styles["adminPrfDetailPage-professor-info"]}>
                <p className={styles["adminPrfDetailPage-professor-qualification"]}>자격증 다운로드</p>
                {qualificationList.map((q, i) => (
                  <div key={i} className={styles["prf-qualification-item"]}>
                    {q.url ? (
                      <a
                        className={styles["prf-qualification-download"]}
                        href={q.url}
                        target="_blank"
                        rel="noreferrer"
                        download={q.name}
                      >
                        {q.name}
                      </a>
                    ) : (
                      <span>{q.name}</span>
                    )}
                    {q.date && (
                      <span className={styles["prf-qualification-date"]}>
                        {q.date}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles["adminPrfDetailPage-right-ct"]}>
          <div className={styles["adminPrfDetailPage-right-content-ct"]}>
            <p className={styles["adminPrfDetailPage-right-content"]}>
              연락처 정보
            </p>
            <span className={styles["adminPrfDetailPage-right-content-title"]}>
              전화번호
            </span>
            {isEditing ? (
              <input
                className={styles["adminPrfDetailPage-edit-input"]}
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm((item) => ({ ...item, phone: e.target.value }))
                }
                placeholder="전화번호를 입력하세요"
              />
            ) : (
              <p className={styles["adminPrfDetailPage-right-inf"]}>
                {professor.phone ?? "-"}
              </p>
            )}
          </div>

          <div className={styles["adminPrfDetailPage-right-content-ct"]}>
            <p className={styles["adminPrfDetailPage-right-content"]}>
              경력 정보
            </p>
            <span className={styles["adminPrfDetailPage-right-content-title"]}>
              경력 사항
            </span>
            {isEditing ? (
              <textarea
                className={styles["adminPrfDetailPage-edit-textarea"]}
                value={editForm.career}
                onChange={(e) =>
                  setEditForm((item) => ({ ...item, career: e.target.value }))
                }
                placeholder="경력 사항을 입력하세요"
                rows={4}
              />
            ) : careerList.length > 0 ? (
              careerList.map((carrer, index) => (
                <p key={index} className={styles["adminPrfDetailPage-right-inf"]}>
                  {carrer}
                </p>
              ))
            ) : (
              <p className={styles["adminPrfDetailPage-right-inf"]}>-</p>
            )}
          </div>

          <div className={styles["adminPrfDetailPage-right-content-ct"]}>
            <p className={styles["adminPrfDetailPage-right-content"]}>
              담당 강의 목록
            </p>
            {classes.length > 0 ? (
              <div className={styles["adminPrfDetailPage-class-list-ct"]}>
                {classes.map((classes) => (
                  <div
                    key={classes.id}
                    className={styles["adminPrfDetailPage-class-list"]}
                    onClick={() => navigate(`/class/${classes.id}`)}
                  >
                    <div className={styles["adminPrfDetailPage-class-info"]}>
                      <p className={styles["adminPrfDetailPage-class-title"]}>
                        {classes.title}
                      </p>
                      <p className={styles["adminPrfDetailPage-class-time"]}>
                        {[classes.openDate, classes.time].filter((item) => item).join(" ")}
                      </p>
                    </div>
                    <div
                      className={styles["adminPrfDetailPage-class-students"]}
                    >
                      <img src={adminPrfDetailStudents} />
                      <p>{classes.currentCap ?? 0}명</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles["adminPrfDetailPage-right-inf"]}>
                담당 강의가 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <Modal
          title="수정확인"
          message="수정하시겠습니까?"
          cancelText="취소"
          confirmText="확인"
          onCancel={handleConfirmCancel}
          onConfirm={handleConfirmOk}
        />
      )}

      {showDoneModal && (
        <ConfirmModal
          message="수정이 완료되었습니다"
          onConfirm={handleDoneOk}
        />
      )}
    </div>
  );
}

export default AdminPrfDetailPage;