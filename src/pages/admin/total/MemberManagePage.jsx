import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  buildUsersQuery,
  fetchBranchNames,
  updateUserDoc,
} from "../../../services/adminService";
import DataTable from "../../../components/admin/DataTable";
import FileterBar from "../../../components/admin/FileterBar";
import useAdminData from "../../../hooks/useAdminData";
import Modal from "../../../components/common/Modal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import styles from "../../../styles/css/admin/MemberManagePage.module.css";
import adminBranchEye from "../../../assets/icon/adminBrancheye.svg";

// 한 페이지에 보이는 No. 갯수
const PAGE_SIZE = 5;

// 회언관리 Nav바
const ADMIN_NAV = [
  { key: "all", label: "전체회원" },
  { key: "student", label: "수강생" },
  { key: "professor", label: "강사" },
  { key: "branchAdmin", label: "지점관리자" },
];

// 받아온 role값 변환
const ROLE_LABEL = {
  student: "수강생",
  professor: "강사",
  branchAdmin: "지점관리자",
  totalAdmin: "통합관리자",
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

// 필터 초기값 (검색, 최신순, 승인, 지점)
const FILTERS = {
  search: "",
  sortOrder: "desc",
  approval: null,
  branchId: "",
};

function MemberManagePage() {
  const navigate = useNavigate();

  // 선택된 탭(Nav) 관리
  const [activeTab, setActiveTab] = useState("all");

  // 필터 상태 관리
  const [filters, setFilters] = useState(FILTERS);

  // 지점명 관리
  const [branchNames, setBranchNames] = useState({});

  // 지점목록 관리
  const [branches, setBranches] = useState([]);

  // 모달 상태 관리
  const [modal, setModal] = useState(null);

  // 완료 모달 상태 관리
  const [doneModal, setDoneModal] = useState(false);

  // Firestore 업데이트 후 로컬 상태 반영용 오버라이드 맵
  const [previews, setPreviews] = useState({});

  // 탭(Nav) 바뀌면 초기화되게
  useEffect(() => {
    setFilters(FILTERS);
  }, [activeTab]);

  // 지점 목록 조회 (최초1회만)
  useEffect(() => {
    fetchBranchNames()
      .then((map) => {
        setBranchNames(map);
        // entries이용해서 id, name을 배열로 반환
        setBranches(Object.entries(map).map(([id, name]) => ({ id, name })));
      })
      .catch(() => {});
  }, []);

  // 연동된 조건 관련
  const baseCondition = useMemo(() => {
    // 탭(Nav)이 all 일 떄는 필터 x, 아니면 해당 역할로 필터
    const role = activeTab === "all" ? null : activeTab;

    // 조건 넘겨서 해당하는 데이터 가져오기
    return buildUsersQuery(role, {
      // 정렬조건
      orderDir: filters.sortOrder,

      // 승인, 미승인 조건
      isApproved: activeTab === "professor" ? filters.approval : null,

      // 지점 조건
      branchId: activeTab === "professor" ? filters.branchId || null : null,
    });
  }, [activeTab, filters.sortOrder, filters.approval, filters.branchId]);

  const { data, loading, error } = useAdminData(baseCondition);

  // 화면에 보여지는 데이터 관리
  const displayData = useMemo(() => {
    // 통합관리자는 회원 조회에 안보이도록 설정
    let users = data.filter((user) => user.role !== "totalAdmin");

    // all이 아닌 탭에서 유저끼리 값 비교해서 자동으로 정렬되도록 설정
    if (activeTab !== "all") {
      users = [...users].sort((a, b) => {
        const userTime = a.createdAt?.seconds ?? 0;
        const user2Time = b.createdAt?.seconds ?? 0;
        return filters.sortOrder === "desc"
          ? user2Time - userTime
          : userTime - user2Time;
      });
    }

    // 검색어 필터링
    const q = filters.search.trim().toLowerCase();
    if (q) {
      users = users.filter(
        (row) =>
          row.name?.toLowerCase().includes(q) ||
          row.email?.toLowerCase().includes(q),
      );
    }

    //
    return users.map((row, idx) => ({
      ...row,
      index: idx,
      isactivate:
        row.id in previews
          ? previews[row.id]
          : row.isactivate,
    }));
  }, [data, filters.search, activeTab, filters.sortOrder, previews]);

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
    setPreviews((item) => ({ ...item, [modal.id]: !currentIsActive }));
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
  const handlePendingList = () => navigate("/admin/usermanage/prfapporve");

  // 필터 관리 함수
  const filterBarProps = useMemo(() => {
    // 최신순, 오래된순
    const sortSelect = {
      value: filters.sortOrder,
      onChange: set("sortOrder"),
      options: [
        { value: "desc", label: "최신순" },
        { value: "asc", label: "오래된순" },
      ],
    };

    switch (activeTab) {
      // 전체회원일때
      case "all":
        return {
          searchPlaceholder: "이름, 이메일 검색",
          selects: [
            {
              value: "",
              onChange: () => {},
              options: [{ value: "", label: "전체" }],
            },
            sortSelect,
          ],
        };
      // 학생일때
      case "student":
        return {
          searchPlaceholder: "이름, 이메일 검색",
          selects: [
            {
              value: "",
              onChange: () => {},
              options: [{ value: "", label: "전체" }],
            },
            sortSelect,
          ],
        };
      // 강사일때
      case "professor":
        return {
          searchPlaceholder: "이름, 이메일, 지점 검색",
          actionButton: {
            label: "승인 대기 목록",
            onClick: handlePendingList,
            variant: "approve",
          },
          selects: [
            {
              value: "",
              onChange: () => {},
              options: [{ value: "", label: "전체" }],
            },
            {
              value: filters.branchId,
              onChange: set("branchId"),
              options: [
                { value: "", label: "전체 지점" },
                ...branches.map((branch) => ({
                  value: branch.id,
                  label: branch.name,
                })),
              ],
            },
            sortSelect,
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
        };
      // 지점관리자일 떄
      case "branchAdmin":
        return {
          searchPlaceholder: "이름, 이메일 검색",
          selects: [
            {
              value: "",
              onChange: () => {},
              options: [
                {
                  value: "",
                  label: "전체",
                },
              ],
            },
            sortSelect,
          ],
        };
      default:
        return { searchPlaceholder: "검색", selects: [sortSelect] };
    }
  }, [activeTab, filters, branches]);

  // 테이블 제목들?
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

    // 이메일
    const email = { key: "email", label: "이메일" };

    // 가입일
    const joinedAt = {
      key: "createdAt",
      label: "가입일",
      render: (val) => signDate(val),
    };

    // 소속지점
    const branch = {
      key: "branchId",
      label: "소속지점",
      render: (val) => branchNames[val] ?? val ?? "-",
    };

    // 롤값
    const role = {
      key: "role",
      label: "역할",
      render: (val) => {
        const rols =
          {
            student: styles["memberManagePage-role-student"],
            professor: styles["memberManagePage-role-professor"],
            branchAdmin: styles["memberManagePage-role-branch-admin"],
          }[val] ?? "";
        return (
          <span className={`${styles["memberManagePage-role"]} ${rols}`}>
            {ROLE_LABEL[val] ?? val}
          </span>
        );
      },
    };

    // 상태값
    const status = {
      key: "isApproved",
      label: "상태",
      render: (val) => (
        <span
          className={`${styles["memberManagePage-status"]} ${val ? styles["memberManagePage-status-approve"] : styles["memberManagePage-status-pending"]}`}
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
          className={styles["memberManagePage-view-button"]}
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
                ? styles["memberManagePage-deactivate-button"]
                : styles["memberManagePage-activate-button"]
            }
            onClick={() => handleDeactivate(row)}
          >
            {isActive ? "비활성화" : "활성화"}
          </button>
        );
      },
    };

    // 역할일떄 보여줄 테이블 제목들 설정
    switch (activeTab) {
      // 학생일 떄
      case "student":
        return [no, name, phone, joinedAt, email, deactivateBtn];
      // 강사일떄
      case "professor":
        return [
          no,
          name,
          phone,
          joinedAt,
          branch,
          email,
          status,
          viewBtn,
          deactivateBtn,
        ];
      // 지점 관리자일 떄
      case "branchAdmin":
        return [
          no,
          { ...name, label: "담당자 이름" },
          phone,
          { ...branch, label: "지점 이름" },
          deactivateBtn,
        ];
      default:
        return [no, name, phone, role, joinedAt, email];
    }
  }, [activeTab, branchNames, previews]);

  return (
    <div className={styles["memberManagePage-ct"]}>
      <div className={styles["memberManagePage-header-ct"]}>
        <h2>사용자 관리</h2>
        <p>전체 사용자 정보를 조회하고 관리하세요</p>
      </div>

      <FileterBar
        searchValue={filters.search}
        onSearchChange={set("search")}
        onReset={handleReset}
        {...filterBarProps}
      />

      <div className={styles["memberManagePage-navbar-ct"]}>
        {ADMIN_NAV.map((tab) => (
          <button
            key={tab.key}
            className={`${styles["memberManagePage-navbar-item"]} ${activeTab === tab.key ? styles["memberManagePage-navbar-item-active"] : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={displayData}
        pageSize={PAGE_SIZE}
        loading={loading}
        error={error}
      />

      {modal && !doneModal && (
        <Modal
          title={modal.isactivate !== false ? "유저 비활성화" : "유저 활성화"}
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

export default MemberManagePage;
