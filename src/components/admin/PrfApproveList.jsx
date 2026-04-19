import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import PrfApproveItem from "./PrfApproveItem";
import styles from "../../styles/css/admin/PrfApproveList.module.css";

function PrfApproveList({ branchId }) {
  // 강사 목록 배열
  const [professors, setProfessors] = useState([]);

  // 로딩 상태 관리
  const [loading, setLoading] = useState(true);

  // 데이터베이스 데이터 조회
  useEffect(() => {
    const fetchProfessors = async () => {
      setLoading(true);
      try {
        // 데이터 조회 조건
        const condition = [
          // firebase에서 제공하는 조건 필터
          // 강사 & 승인되지 않은 강사 조건으로 설정
          where("role", "==", "professor"),
          where("isApproved", "==", false),
        ];

        // 지점 관리자 지점ID에 해당하는 지점만 필터
        if (branchId) {
          condition.push(where("branchId", "==", branchId));
        }

        // firebase 코드
        const snap = await getDocs(
          query(collection(db, "users"), ...condition),
        );
        setProfessors(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessors();
  }, [branchId]);

  // 승인, 거절 클릭시 목록에서 제거하는 함수
  const handleStatusChange = (id) => {
    setProfessors((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }
  if (professors.length === 0) {
    return <p>승인 대기 중인 강사가 없습니다.</p>;
  }

  return (
    <div className={styles["prfApproveList-ct"]}>
      {professors.map((professor) => (
        <PrfApproveItem
          key={professor.id}
          professor={professor}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
}

export default PrfApproveList;
