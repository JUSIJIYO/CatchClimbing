import React, { useEffect, useMemo, useState } from "react";
import {
  buildClassesQuery,
  fetchBranchNames,
} from "../../services/adminService";
import DataTable from "../../components/admin/DataTable";
import FileterBar from "../../components/admin/FileterBar";
import useAdminData from "../../hooks/useAdminData";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/css/admin/classManagePage.module.css";

// 한 페이지에 보이는 No. 데이터 개수
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

// 필터 초기값 (검색, 최신순, 지점, 승인 상태)
const FILTERS = {
  search: "",
  sortOrder: "desc",
  branchId: "",
  status: null,
};

function ClassManagePage() {
  // 로그인한 사용자 역할 받아오기
  const { role, branchId: myBranchId } = useAuth();

  // 지점 관리자 롤값
  const isBranchAdmin = role === "branchAdmin";

  // 필터 상태 관리 (지점관리자는 자기 지점으로 고정)
  const [filters, setFilters] = useState(() => ({
    ...FILTERS,
    branchId: isBranchAdmin ? (myBranchId ?? "") : "",
  }));

  // 지점 목록 관리
  const [branches, setBranches] = useState([]);

  // 지점 목록 조회 (통합관리자만 필요)
  useEffect(() => {
    if (isBranchAdmin) return;
    fetchBranchNames()
      .then((map) => {
        setBranches(Object.entries(map).map(([id, name]) => ({ id, name })));
      })
      .catch(() => {});
  }, [isBranchAdmin]);

  // 조건 넘겨서 해당하는 조건 가져오기
  const baseCondition = useMemo(
    () =>
      buildClassesQuery({
        // 지점 조건
        branchId: filters.branchId || null,

        // 정렬 조건
        orderDir: filters.sortOrder,
      }),
    [filters.branchId, filters.sortOrder],
  );

  const { data, loading, error } = useAdminData(baseCondition);

  // 화면에 보여지는 데이터 관리
  const displayData = useMemo(() => {
    let classes = [...data];

    if (filters.status === "available") {
      classes = classes.filter((c) => (c.currentCap ?? 0) < (c.capacity ?? 0));
    } else if (filters.status === "full") {
      classes = classes.filter((c) => (c.currentCap ?? 0) >= (c.capacity ?? 0));
    }

    // 검색어 필터링 조건
    const q = filters.search.trim().toLowerCase();
    if (q) {
      classes = classes.filter(
        (row) =>
          // 제목, 강사이름, 지점이름
          row.title?.toLowerCase().includes(q) ||
          row.professorName?.toLowerCase().includes(q) ||
          row.branchName?.toLowerCase().includes(q),
      );
    }

    return classes.map((row, idx) => ({ ...row, index: idx }));
  }, [data, filters.search, filters.status]);

  const set = (key) => (val) => setFilters((prev) => ({ ...prev, [key]: val }));

  // 수업 정원 상태 관리
  const toggleStatus = (val) =>
    setFilters((prev) => ({
      ...prev,
      status: prev.status === val ? null : val,
    }));

    // 필터 초기화 관리 함수 (지점관리자는 지점 고정 유지)
  const handleReset = () =>
    setFilters({ ...FILTERS, branchId: isBranchAdmin ? (myBranchId ?? "") : "" });

  // 강의 등록 관리 함수
  const handleRegister = () => console.log("강의 등록");

  // 강의 상세조회 (보기버튼 클릭) 관리 함수
  const handleView = (id) => console.log("보기:", id);

  // 테이블에 들어갈 데이터
  const columns = useMemo(
    () => [
      {
        key: "_no",
        label: "No.",
        render: (_, row) => row.index + 1,
      },
      { key: "title", label: "수업명" },
      { key: "professorName", label: "강사" },
      { key: "branchName", label: "지점" },
      {
        key: "_cap",
        label: "수강인원",
        render: (_, row) => `${row.currentCap ?? 0}/${row.capacity ?? 0}`,
      },
      { key: "openDate", label: "수업일" },
      {
        key: "createdAt",
        label: "등록일",
        render: (val) => signDate(val),
      },
      {
        key: "_view",
        label: "조회",
        render: (_, row) => (
          <button
            className={styles["classManagePage-view-button"]}
            onClick={() => handleView(row.id)}
          >
            👁 보기
          </button>
        ),
      },
    ],
    [],
  );

  // 필터 관리 배열
  const filterBarProps = {
    searchPlaceholder: "수업명, 강사, 지점 검색",
    actionButton: {
      label: "+ 강의 등록",
      onClick: handleRegister,
      variant: "register",
    },
    selects: [
      {
        value: "",
        onChange: () => {},
        options: [{ value: "", label: "전체" }],
      },
      // 통합 관리자일때만 뜰 수 있게
      ...(!isBranchAdmin
        ? [
            {
              value: filters.branchId,
              onChange: set("branchId"),
              options: [
                { value: "", label: "전체 지점" },
                ...branches.map((b) => ({ value: b.id, label: b.name })),
              ],
            },
          ]
        : []),
      {
        value: filters.sortOrder,
        onChange: set("sortOrder"),
        options: [
          { value: "desc", label: "최신순" },
          { value: "asc", label: "오래된순" },
        ],
      },
    ],
  };

  return (
    <div className={styles["classManagePage-ct"]}>
      <div className={styles["classManagePage-header-ct"]}>
        <h2>강의 관리</h2>
        <p>강의 정보를 조회하고 관리하세요</p>
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
    </div>
  );
}

export default ClassManagePage;
