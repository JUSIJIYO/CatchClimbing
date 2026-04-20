import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase/config";
import BranchItem from "./BranchItem";
import styles from "../../../styles/css/admin/BranchList.module.css";
import adminSearchBar from '../../../assets/icon/adminSearchBar.svg'

// 지점 관리 nav바 설정
const FILTERS = [
  { key: "all", label: "전체" },
  { key: "approved", label: "운영중" },
  { key: "pending", label: "승인대기" },
  { key: "disabled", label: "비활성화" },
];

function BranchList() {
  const navigate = useNavigate();
  // 지점 정보 목록 상태 관리
  const [branches, setBranches] = useState([]);

  // 강사 수 상태 관리
  const [prfCount, setPrfCount] = useState({});

  // 검색 상태 관리
  const [search, setSearch] = useState("");

  // 필터 (nav바) 상태 관리
  const [filter, setFilter] = useState("all");

  // 로딩 상태 관리
  const [loading, setLoading] = useState(true);

  //
  useEffect(() => {
    const fetchData = async () => {
      // firebase 데이터베이스 연결
      // 요청을 동시에 보내기 위해 Promise.all 사용
      // 비동기 함수 작성을 통해 두 요청 모두 응답이 오면 다음단계로 이동
      const [branchSnap, profSnap] = await Promise.all([
        // 지점목록 가져오기
        getDocs(collection(db, "branches")),
        // 강사목록 가져오기
        getDocs(
          query(collection(db, "users"), where("role", "==", "professor")),
        ),
      ]);

      // 지점목록 뿌리기
      const branchList = branchSnap.docs.map((branch) => ({
        id: branch.id,
        ...branch.data(),
      }));

      // 강사 수 관리
      const prfCountList = {};
      // 받아온 브랜치 id를 기준으로 카운트 설정
      profSnap.forEach((branch) => {
        const { branchId } = branch.data();
        // 만약 없을 경우 0 으로 설정
        if (branchId)
          prfCountList[branchId] = (prfCountList[branchId] || 0) + 1;
      });

      setBranches(branchList);
      setPrfCount(prfCountList);
      setLoading(false);
    };
    fetchData();
  }, []);

  // 검색 기능
  const filtered = branches.filter((b) => {
    // 검색기능과 필터기능 동시 적용하게 설정
    const matchFilter = filter === "all" || b.status === filter;
    const matchSearch = b.name?.includes(search) || b.address?.includes(search);
    return matchFilter && matchSearch;
  });

  // 탭 옆에 나오는 지점 수 계산
  const countBranch = (key) =>
    key === "all"
      ? // 전체 일때는 전체 지점 수 전체가 나오게
        branches.length
      : // 탭을 선택하면 해당하느 탭에 해당하는 지점 수가 나오게
        branches.filter((brnach) => brnach.status === key).length;

  return (
    <div className={styles["branchList-ct"]}>
      <div className={styles["branchList-search-ct"]}>
        <div>
          <img src={adminSearchBar}/>
          <input
            className={styles["branchList-search-input"]}
            placeholder="지점명, 주소 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className={styles["branchList-approve-button"]}
          onClick={() => navigate("/admin/branchmanage/approve")}
        >
          지점 승인
        </button>
      </div>

      <div className={styles["branchList-nav-ct"]}>
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            className={`${styles["branchList-nav"]} ${filter === key ? styles["branchList-nav-active"] : ""}`}
            onClick={() => setFilter(key)}
          >
            {label} ({countBranch(key)})
          </button>
        ))}
      </div>

      {loading ? (
        <p className={styles["branchList-none"]}>불러오는 중...</p>
      ) : filtered.length === 0 ? (
        <p className={styles["branchList-none"]}>조회된 지점이 없습니다.</p>
      ) : (
        <div className={styles["branchList-grid"]}>
          {filtered.map((branch) => (
            <BranchItem
              key={branch.id}
              branch={branch}
              professorCount={prfCount[branch.id] ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BranchList;
