import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  buildPostsQuery,
  buildReviewsQuery,
  fetchBranchNames,
  deletePost,
  deleteReview,
} from "../../services/adminService";
import { useAuth } from "../../context/AuthContext";
import DataTable from "../../components/admin/DataTable";
import FileterBar from "../../components/admin/FileterBar";
import useAdminData from "../../hooks/useAdminData";
import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import styles from "../../styles/css/admin/CommuManagePage.module.css";
import deletebtn from '../../assets/icon/adminDeleteButton.svg'
import adminBranchEye from '../../assets/icon/adminBrancheye.svg'

// 한 페이지에 보이는 데이터 No. 갯수
const PAGE_SIZE = 5;

// 필터 초기값(검색, 정렬, 지점이름, 타입(게시글, 립뷰))
const FILTERS = {
  search: "",
  sortOrder: "desc",
  branchId: "",
  type: "",
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

function CommuManagePage() {
  const navigate = useNavigate();

  // 유저 정보 받기
  const { role, branchId: myBranchId } = useAuth();

  // 지점관리자인지 확인
  const isBranchAdmin = role === "branchAdmin";

  // 필터 상태 관리
  const [filters, setFilters] = useState(FILTERS);

  // 지점 목록 상태관리
  const [branches, setBranches] = useState([]);

  // 지점명 상태 관리
  const [branchNames, setBranchNames] = useState({});

  // 삭제 확인 모달 상태 관리
  const [modal, setModal] = useState(false);

  // 삭제 완료 모달 상태 관리
  const [doneModal, setDoneModal] = useState(false);

  // 삭제할 게시글 or 댓글 모달 유지되는 동안 임시 저장할 수 있게 상태관리
  const [pendingDelete, setPendingDelete] = useState(null);

  // 삭제된 항목 ID 로컬 추적 (재조회 없이 즉시 반영)
  const [deletedIds, setDeletedIds] = useState(new Set());

  // 지점 목록 조회 (최초 1회만)
  useEffect(() => {
    fetchBranchNames()
      .then((item) => {
        setBranchNames(item);
        // entires 이용해서 id, name을 배열로 반환
        setBranches(Object.entries(item).map(([id, name]) => ({ id, name })));
        // 지점관리자는 자기 지점 이름으로 필터 고정 (posts.branchId는 지점 이름 저장)
        if (isBranchAdmin && myBranchId) {
          const myName = item[myBranchId] ?? "";
          setFilters((item) => ({ ...item, branchId: myName }));
        }
      })
      .catch(() => {});
  }, []);

  // 게시글 조건
  const postsCondition = useMemo(
    () =>
      filters.type === "review"
        ? null
        : buildPostsQuery({
            branchId: filters.branchId || null,
            orderDir: filters.sortOrder,
          }),
    [filters.branchId, filters.sortOrder, filters.type],
  );

  // 리뷰 조건
  const reviewsCondition = useMemo(
    () =>
      filters.type === "post"
        ? null
        : buildReviewsQuery({
            branchId: filters.branchId || null,
            orderDir: filters.sortOrder,
          }),
    [filters.branchId, filters.sortOrder, filters.type],
  );

  const { data: postsData, loading: postsLoading } =
    useAdminData(postsCondition);
  const { data: reviewsData, loading: reviewsLoading } =
    useAdminData(reviewsCondition);

  // 화면에보여지는 데이터
  const displayData = useMemo(() => {
    // 게시글 데이터
    const posts = postsData.map((p) => ({ ...p, _type: "post" }));
    // 리뷰 데이터
    const reviews = reviewsData.map((r) => ({ ...r, _type: "review" }));
    
    // 두 개 데이터 합치기 (삭제된 항목 제외)
    let combined = [...posts, ...reviews].filter((item) => !deletedIds.has(item.id));

    // 정렬조건 설정
    combined.sort((a, b) => {
      const userTime = a.createdAt?.seconds ?? 0;
      const user2Time = b.createdAt?.seconds ?? 0;
      return filters.sortOrder === "desc" ? user2Time - userTime : userTime - user2Time;
    });

    // 검색어 필터링
    const q = filters.search.trim().toLowerCase();
    if (q) {
      combined = combined.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.authorName?.toLowerCase().includes(q),
      );
    }

    return combined.map((row, idx) => ({ ...row, index: idx }));
  }, [postsData, reviewsData, filters.search, filters.sortOrder, deletedIds]);

  const loading = postsLoading || reviewsLoading;

  const set = (key) => (val) => setFilters((prev) => ({ ...prev, [key]: val }));
  
  // 필터 초기화 관리 함수
  const handleReset = () => {
    const myName = isBranchAdmin ? (branchNames[myBranchId] ?? "") : "";
    setFilters({ ...FILTERS, branchId: myName });
  };

  // 게시글, 리뷰 상세보기 관리 함수
  const handleView = (id, type) => {
    if (type === "post") {
      navigate(`/post/${id}`);
    } else {
      navigate("/reviewdetail", { state: { reviewId: id } });
    }
  };

  // 게시글, 리뷰 삭제 버튼 클릭 함수
  const handleDelete = (id, type) => {
    setPendingDelete({ id, type });
    setModal(true);
  };

  // 삭제 확인 모달에서 확인 클릭 함수
  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    setModal(false);
    try {
      if (pendingDelete.type === "post") {
        await deletePost(pendingDelete.id);
      } else {
        await deleteReview(pendingDelete.id);
      }
      setDeletedIds((prev) => new Set([...prev, pendingDelete.id]));
      setDoneModal(true);
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 테이블에 들어갈 데이터 배열
  const columns = useMemo(
    () => [
      {
        key: "_no",
        label: "No.",
        render: (_, row) => row.index + 1,
      },
      {
        key: "_type",
        label: "유형",
        render: (val) => (
          <span
            className={`${styles["commuManagePage-type-badge"]} ${
              val === "post"
                ? styles["commuManagePage-type-post"]
                : styles["commuManagePage-type-review"]
            }`}
          >
            {val === "post" ? "게시글" : "리뷰"}
          </span>
        ),
      },
      { key: "title", label: "제목" },
      { key: "authorName", label: "작성자" },
      {
        key: "branchId",
        label: "지점",
        render: (val) => (val ? (branchNames[val] ?? val) : "통합"),
      },
      {
        key: "createdAt",
        label: "날짜",
        render: (val) => signDate(val),
      },
      {
        key: "viewer",
        label: "조회수",
        render: (val) => val ?? 0,
      },
      {
        key: "_view",
        label: "조회",
        render: (_, row) => (
          <button
            className={styles["commuManagePage-view-button"]}
            onClick={() => handleView(row.id, row._type)}
          >
            <img src={adminBranchEye}/>
            보기
          </button>
        ),
      },
      {
        key: "_delete",
        label: "",
        render: (_, row) => (
          <button
            className={styles["commuManagePage-delete-button"]}
            onClick={() => handleDelete(row.id, row._type)}
          >
            <img src={deletebtn} />
          </button>
        ),
      },
    ],
    [branchNames],
  );

  // 필터 조건 배열
  const filterBarProps = {
    searchPlaceholder: "제목, 작성자 검색...",
    selects: [
      {
        value: filters.type,
        onChange: set("type"),
        options: [
          { value: "", label: "전체" },
          { value: "post", label: "게시글" },
          { value: "review", label: "리뷰" },
        ],
      },
      ...(!isBranchAdmin
        ? [
            {
              value: filters.branchId,
              onChange: set("branchId"),
              options: [
                { value: "", label: "전체 지점" },
                ...branches.map((branch) => ({ value: branch.name, label: branch.name })),
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
    <div className={styles["commuManagePage-ct"]}>
      <div className={styles["commuManagePage-header-ct"]}>
        <h2>커뮤니티 관리</h2>
        <p>게시글과 리뷰를 관리하세요</p>
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
        error={null}
      />

      {modal && (
        <Modal
          title="삭제 확인"
          message={`해당 ${pendingDelete?.type === "post" ? "게시글" : "리뷰"}을 삭제하시겠습니까?`}
          cancelText="취소"
          confirmText="삭제"
          onCancel={() => setModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {doneModal && (
        <ConfirmModal
          message="삭제가 완료되었습니다."
          onConfirm={() => {
            setDoneModal(false);
            setPendingDelete(null);
          }}
        />
      )}
    </div>
  );
}

export default CommuManagePage;
