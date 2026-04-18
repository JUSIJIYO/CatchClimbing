import React, { useState, useEffect } from "react";
import styles from "../../styles/css/admin/DataTable.module.css";

// 페이지네이션 코드
function getPageWindow(current, total) {
  const windowSize = 5;
  const start = Math.max(1, Math.min(current - 1, total - windowSize + 1));
  const end = Math.min(total, start + windowSize - 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

// columns = 테이블 행 배열, data = 테이블에 표시할 데이터 배열, pageSize = 페이지네이션 한번에 몇개까지 할건지, loading = 로딩상태
function DataTable({ columns = [], data = [], pageSize = 5, loading = false }) {
  // 페이지네이션 페이지 관리
  const [page, setPage] = useState(1);

  // data 상태가 바뀌면 페에지가 1에 위치할 수 있게 설정
  useEffect(() => {
    setPage(1);
  }, [data]);

  // 전체페이지 관리
  const totalPages = Math.ceil(data.length / pageSize);

  // 페이지네이션에 따른 현재 페이지 데이터 관리
  const localData = data.slice((page - 1) * pageSize, page * pageSize);

  // 페이지 변경 관리 (1이상 또는 마지막 페이지일때만 페이지 변경되도록)
  const handlePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
    }
  };

  return (
    <div className={styles["dataTable-ct"]}>
      <table className={styles["dataTable-table-ct"]}>
        <thead>
          <tr>
            {columns.map((colum) => (
              <th key={colum.key} className={styles["dataTable-table-th"]}>
                {colum.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className={styles["dataTable-error-ct"]}
              >
                불러오는 중...
              </td>
            </tr>
          ) : (
            localData.map((row, rowIndex) => (
              <tr key={row.id} className={styles["dataTable-table-tr"]}>
                {columns.map((col) => (
                  <td key={col.key} className={styles["dataTable-table-td"]}>
                    {col.render
                      ? col.render(row[col.key], row, rowIndex)
                      : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles["dataTable-pagination-ct"]}>
          <button
            className={styles["dataTable-page-button"]}
            onClick={() => handlePage(page - 1)}
            disabled={page === 1}
          >
            {"<"}
          </button>
          {getPageWindow(page, totalPages).map((item) => (
            <button
              key={item}
              className={`${styles["dataTable-page-button"]} ${page === item ? styles["dataTable-page-button-actvie"] : ""}`}
              onClick={() => handlePage(item)}
            >
              {item}
            </button>
          ))}
          <button
            className={styles["dataTable-page-button"]}
            onClick={() => handlePage(page + 1)}
            disabled={page === totalPages}
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
}

export default DataTable;
