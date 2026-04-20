import React from 'react';
import styles from '../../styles/css/branch/BranchClassItem.module.css';
import calendarIcon from '../../assets/icon/BranchCalender.svg';
import peopleIcon from '../../assets/icon/BranchPeople.svg';
import detailIcon from '../../assets/icon/BranchDetail.svg';

function BranchClassItem({ item, onOpenModal, isApplied, role }) {
  return (
    <div className={styles['branch-card']}>
      {/* 상단: 강사 프로필 + 레벨 */}
      <div className={styles['branch-top']}>
        <div className={styles['branch-profileWrap']}>
          {/* 강사 프로필 이미지 */}
          <img src={item.profile} alt="프로필" />

          <div className={styles['branch-profileText']}>
            {/* 강사 뱃지 */}
            <span className={styles['branch-badge']}>강사</span>
            {/* 강사 이름 */}
            <span className={styles['branch-name']}>{item.name}</span>
          </div>
        </div>

        {/* 수업 난이도 */}
        <span className={styles['branch-level']}>{item.level}</span>
      </div>

      {/* 수업 제목 */}
      <h3 className={styles['branch-title']}>{item.title}</h3>

      {/* 날짜 및 시간 정보 */}
      <div className={styles['branch-info']}>
        <div>
          <img src={calendarIcon} alt="" />
          <span>{item.date}</span>
        </div>
        <span>{item.time}</span>
      </div>

      {/* 정원 정보 */}
      <div className={styles['branch-people']}>
        <img src={peopleIcon} alt="정원" />
        정원: {item.people}
      </div>

      {/* 하단 버튼 영역 */}
      <div className={styles['branch-bottom']}>
        <div className={styles['branch-btnWrap']}>
          {/* 상세보기 버튼 */}
          <button
            className={styles['branch-detailBtn']}
            onClick={() => onOpenModal('detail', item.id)}
          >
            <img src={detailIcon} alt="" />
            상세보기
          </button>

          {/* 학생일 경우만 신청 버튼 표시 */}
          {role === 'student' && (
            <button
              className={styles['branch-applyBtn']}
              disabled={isApplied}
              onClick={() => onOpenModal('apply', item.id)}
            >
              {isApplied ? '신청완료' : '신청하기'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BranchClassItem;
