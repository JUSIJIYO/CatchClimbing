import styles from '../../styles/css/class/ClassDetailPage.module.css'

function ClassDetailPage() {
  return (
    <div className={styles.container}>
      
      {/* 헤더 */}
      <div className={styles.header}>
        <span className={styles.back}>← 수업 관리로 돌아가기</span>
        <h1 className={styles.title}>수업 상세 정보</h1>
      </div>

      {/* 메인 카드 */}
      <div className={styles['class-container']}>
        
        {/* 상단 영역 */}
        <div className={styles['class-header']}>
          
          {/* 썸네일 */}
          <div className={styles['class-picture']}></div>

          {/* 정보 */}
          <div className={styles['class-description']}>
            <h2 className={styles['class-titler']}>초급 볼더링</h2>

            <div className={styles['class-description']}>
              <div>강사: {professorName}</div>
              <div>지점: {branchName}</div>
              <div>일정: {createdAt}</div>
              <div>난이도: {level}</div>
            </div>
          </div>

        </div>

        {/* 설명 */}
        <div className={styles['class-detail-description']}>
          <h3>수업 설명</h3>
          <p>
            처음 볼더링을 접하는 분들을 위한 입문 수업입니다.
          </p>
          <p>
            기초적인 홀드 잡는 방법부터 바디 포지션, 균형 잡는 법까지 차근차근 배울 수 있어요.
          </p>
        </div>

      </div>

      {/* 하단 카드 */}
      <div className={styles.class-bigcard}>
        <div className={styles.class-card}>
          <span>수강 인원</span>
          <strong>12/20</strong>
        </div>

        <div className={styles.class-card}>
          <span>수강료</span>
          <strong>200,000원</strong>
        </div>
      </div>

    </div>
  )
}

export default ClassDetailPage