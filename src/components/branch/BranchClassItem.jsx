import React from 'react';
import styles from '../../styles/css/branch/BranchClassItem.module.css';
import calendarIcon from '../../assets/icon/BranchCalender.svg';
import peopleIcon from '../../assets/icon/BranchPeople.svg';
import detailIcon from '../../assets/icon/BranchDetail.svg';

function BranchClassItem({ item, onOpenModal }) {
  return (
    <div className={styles['branch-card']}>
      <div className={styles['branch-top']}>
        <div className={styles['branch-profileWrap']}>
          <img src={item.profile} alt="프로필" />

          <div className={styles['branch-profileText']}>
            <span className={styles['branch-badge']}>강사</span>
            <span className={styles['branch-name']}>{item.name}</span>
          </div>
        </div>

        <span className={styles['branch-level']}>{item.level}</span>
      </div>

      <h3 className={styles['branch-title']}>{item.title}</h3>

      <div className={styles['branch-info']}>
        <div>
          <img src={calendarIcon} alt="" />
          <span>{item.date}</span>
        </div>
        <span>{item.time}</span>
      </div>

      <div className={styles['branch-people']}>
        <img src={peopleIcon} alt="정원" />
        정원: {item.people}
      </div>

      <div className={styles['branch-bottom']}>
        <div className={styles['branch-btnWrap']}>
          <button
            className={styles['branch-detailBtn']}
            onClick={() => onOpenModal('detail', item.id)}
          >
            <img src={detailIcon} alt="" />
            상세보기
          </button>

          <button
            className={styles['branch-applyBtn']}
            onClick={() => onOpenModal('apply')}
          >
            신청하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default BranchClassItem;
