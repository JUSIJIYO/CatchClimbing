import styles from '../../styles/css/class/ClassDetailPage.module.css'

function ClassDetailPage() {

  return (
    <div className={styles['class-container']}>
      
      {/* 헤더 */}
      <div className={styles['class-header']}>
        <span className={styles['class-back']}>← 수업 관리로 돌아가기</span>
        <h1 className={styles['class-title']}>수업 상세 정보</h1>
      </div>

     
    </div>
  )
}

export default ClassDetailPage