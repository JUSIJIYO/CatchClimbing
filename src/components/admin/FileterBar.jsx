import React from 'react'
import styles from '../../styles/css/admin/FilterBar.module.css'
import searchIcon from '../../assets/icon/adminSearchBar.svg'

// searchPlaceholder = 검색바 placeholder 설정 , searchValue = 검색어, onSearchChange = 검색어 상태 변경 감지 함수
// selects = 선택 목록, statusFilter = 토글 버튼 목록, actionButton = { label, onClick, variant }, onReset = 필터 초기화 함수
function FileterBar({ searchPlaceholder = '검색', searchValue = '', onSearchChange, selects = [],
   statusFilters = [],  actionButton = null, onReset}) {
  return (
    <article className={styles["fileterbar-ct"]}>
      <div className={styles["fileterbar-search-ct"]}>
        <div className={styles["fileterbar-input-ct"]}>
          <img src={searchIcon} />
          <input
            type="text"
            className={styles["fileterbar-input"]}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {actionButton && (
          <button
            className={actionButton.variant === 'register'
              ? styles["fileterbar-register-button"]
              : styles["fileterbar-approve-button"]}
            onClick={actionButton.onClick}
          >
            {actionButton.label}
          </button>
        )}
      </div>

      <div className={styles["fileterbar-fileter-ct"]}>
        <div className={styles["fileterbar-select-ct"]}>
          {selects.map((item, i) => (
            <select
              key={i}
              className={styles["fileter-select"]}
              value={item.value}
              onChange={(e) => item.onChange(e.target.value)}
            >
              {item.options.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          ))}

          {statusFilters.map((item) => (
            <button
              key={item.value}
              className={`${styles["fileter-statusBtn"]} ${item.active ? styles["fileter-statusBtn-active"] : ''}`}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button className={styles["fileter-resetbtn"]} onClick={onReset}>
          필터 초기화
        </button>
      </div>
    </article>
  )
}

export default FileterBar
