import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  buildUsersQuery,
  fetchBranchNames,
  updateUserDoc,
} from "../../../services/adminService";
import { useAuth } from "../../../context/AuthContext";
import DataTable from "../../../components/admin/DataTable";
import FileterBar from "../../../components/admin/FileterBar";
import useAdminData from "../../../hooks/useAdminData";
import Modal from "../../../components/common/Modal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import styles from "../../../styles/css/admin/PrfManagePage.module.css";
import adminBranchEye from "../../../assets/icon/adminBrancheye.svg";


// 한 페이지에 보이는 No. 갯수
const PAGE_SIZE = 5;

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

// 필터 초기값 (검색, 최신순, 승인)
const FILTERS = {
  search: "",
  sortOrder: "desc",
  approval: null,
};

function PrfManagePage() {
  const navigate = useNavigate();

  // 지점관리자 지점ID
  const { branchId } = useAuth();

  // 필터 상태 관리
  const [filters, setFilters] = useState(FILTERS);

  // 지점명 관리
  const [branchNames, setBranchNames] = useState({});

  // 모달 상태 관리
  const [modal, setModal] = useState(null);

  // 완료 모달 상태 관리
  const [doneModal, setDoneModal] = useState(false);

  // Firestore 업데이트 후 로컬 상태 반영용 오버라이드 맵
  const [previews, setPreviews] = useState({});

  // 지점 목록 조회 (최초 1회만)
  useEffect(() => {
    fetchBranchNames()
      .then(setBranchNames)
      .catch(() => {});
  }, []);

  // 연동된 조건 관련
  const baseCondition = useMemo(() => {
    if (!branchId) {
      return null;
    }

    // 조건 넘겨서 해당하는 데이터 가져오기
    return buildUsersQuery("professor", {
      // 정렬 조건
      orderDir: filters.sortOrder,

      // 지점 조건
      branchId,

      // 승인, 미승인 조건
      isApproved: filters.approval,
    });
  }, [branchId, filters.sortOrder, filters.approval]);

  const { data, loading, error } = useAdminData(baseCondition);

  // 화면에 보여지는 데이터 관리
  const displayData = useMemo(() => {
    // 클라이언트 정렬
    let users = [...data].sort((a, b) => {
      const userTime = a.createdAt?.seconds ?? 0;
      const user2Time = b.createdAt?.seconds ?? 0;
      return filters.sortOrder === "desc"
        ? user2Time - userTime
        : userTime - user2Time;
    });

    // 검색어 필터링
    const q = filters.search.trim().toLowerCase();
    if (q) {
      users = users.filter(
        (row) =>
          row.name?.toLowerCase().includes(q) ||
          row.email?.toLowerCase().includes(q),
      );
    }

    return users.map((row, idx) => ({
      ...row,
      index: idx,
      isactivate: row.id in previews ? previews[row.id] : row.isactivate,
    }));
  }, [data, filters.search, filters.sortOrder, previews]);

  const set = (key) => (val) => setFilters((prev) => ({ ...prev, [key]: val }));

  // 대기중, 승인된 강사 관리
  const toggleApproval = (val) =>
    setFilters((prev) => ({
      ...prev,
      approval: prev.approval === val ? null : val,
    }));

  // 필터 초기화 관리 함수
  const handleReset = () => setFilters(FILTERS);

  // 비활성화/활성화 버튼 클릭 → 1차 확인 모달 열기
  const handleDeactivate = (row) => {
    setModal({ id: row.id, name: row.name, isactivate: row.isactivate });
  };

  // 모달에서 확인 버튼 클릭시 firebase 업데이트
  const handleConfirm = async () => {
    if (!modal) {
      return;
    }
    const currentIsActive = modal.isactivate !== false;
    await updateUserDoc(modal.id, { isactivate: !currentIsActive });
    setPreviews((prev) => ({
      ...prev,
      [modal.id]: !currentIsActive,
    }));
    setDoneModal(true);
  };

  // 모달 닫기 함수
  const handleDoneClose = () => {
    setModal(null);
    setDoneModal(false);
  };

  // 유저 상세조회 (보기버튼 클릭) 관리 함수
  const handleView = (userId) => navigate(`/admin/professor/${userId}`);

  // 승인대기목록 관리 함수
  const handlePendingList = () =>
    navigate(
      `/admin/prfmanage/prfapporve${branchId ? `?branchId=${branchId}` : ""}`,
    );

  const columns = useMemo(() => {
    // 넘버링
    const no = {
      key: "_no",
      label: "No.",
      render: (_, row) => row.index + 1,
    };

    // 이름
    const name = { key: "name", label: "이름" };

    // 연락처
    const phone = { key: "phone", label: "연락처" };

    // 가입일
    const joinedAt = {
      key: "createdAt",
      label: "가입일",
      render: (val) => signDate(val),
    };

    // 이메일
    const email = { key: "email", label: "이메일" };

    // 상태값
    const status = {
      key: "isApproved",
      label: "상태",
      render: (val) => (
        <span
          className={`${styles["prfManagePage-status"]} ${val ? styles["prfManagePage-status-approve"] : styles["prfManagePage-status-pending"]}`}
        >
          {val ? "승인됨" : "대기중"}
        </span>
      ),
    };

    // 조회하기 버튼
    const viewBtn = {
      key: "_view",
      label: "조회",
      render: (_, row) => (
        <button
          className={styles["prfManagePage-view-button"]}
          onClick={() => handleView(row.id)}
        >
          <img src={adminBranchEye} alt="눈 이미지" />
          보기
        </button>
      ),
    };

    // 비활성화/활성화 버튼
    const deactivateBtn = {
      key: "_action",
      label: "",
      render: (_, row) => {
        const isActive = row.isactivate !== false;
        return (
          <button
            className={
              isActive
                ? styles["prfManagePage-deactivate-button"]
                : styles["prfManagePage-activate-button"]
            }
            onClick={() => handleDeactivate(row)}
          >
            {isActive ? "비활성화" : "활성화"}
          </button>
        );
      },
    };

    return [no, name, phone, joinedAt, email, status, viewBtn, deactivateBtn];
  }, [previews]);

  // 필터 관리 함수
  const filterBarProps = useMemo(
    () => ({
      searchPlaceholder: "이름, 이메일 검색",
      actionButton: { label: "승인 대기 목록", onClick: handlePendingList },
      selects: [
        {
          value: filters.sortOrder,
          onChange: set("sortOrder"),
          options: [
            { value: "desc", label: "최신순" },
            { value: "asc", label: "오래된순" },
          ],
        },
      ],
      statusFilters: [
        {
          label: "대기중",
          value: false,
          active: filters.approval === false,
          onClick: () => toggleApproval(false),
        },
        {
          label: "승인됨",
          value: true,
          active: filters.approval === true,
          onClick: () => toggleApproval(true),
        },
      ],
    }),
    [filters],
  );

  return (
    <div className={styles["prfManagePage-ct"]}>
      <div className={styles["prfManagePage-header-ct"]}>
        <h2>강사 관리</h2>
        <p>소속 지점의 강사 정보를 조회하고 관리하세요</p>
      </div>

      <FileterBar
        searchValue={filters.search}
        onSearchChange={set("search")}
        onReset={handleReset}
        {...filterBarProps}
      />

      <DataTable
        columns={columns}
        data={displayData}
        pageSize={PAGE_SIZE}
        loading={loading}
        error={error}
      />

      {modal && !doneModal && (
        <Modal
          title={modal.isactivate !== false ? "비활성화" : "활성화"}
          message={
            modal.isactivate !== false
              ? `${modal.name}님을 비활성화하시겠습니까?`
              : `${modal.name}님을 활성화하시겠습니까?`
          }
          cancelText="취소"
          confirmText="확인"
          onCancel={() => setModal(null)}
          onConfirm={handleConfirm}
        />
      )}

      {doneModal && (
        <ConfirmModal
          message={
            modal?.isactivate !== false
              ? `${modal?.name}님이 비활성화 되었습니다.`
              : `${modal?.name}님이 활성화 되었습니다.`
          }
          onConfirm={handleDoneClose}
        />
      )}
    </div>
  );
}

export default PrfManagePage;
