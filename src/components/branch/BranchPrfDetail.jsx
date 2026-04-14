import React from 'react';
import styles from '../../styles/css/branch/BranchPrfDetail.module.css';
import leftArrow from '../../assets/icon/leftarrow.svg';
import rightArrow from '../../assets/icon/rightarrow.svg';

function BranchPrfDetail({
  prf,
  index,
  prfList,
  setSelectedIndex,
  setSelectedPrf,
}) {
  const handlePrev = () => {
    if (index > 0) {
      const newIndex = index - 1;
      setSelectedIndex(newIndex);
      setSelectedPrf(prfList[newIndex]);
    }
  };

  const handleNext = () => {
    if (index < prfList.length - 1) {
      const newIndex = index + 1;
      setSelectedIndex(newIndex);
      setSelectedPrf(prfList[newIndex]);
    }
  };
  return (
    <div className={styles['wrapper']}>
      {index > 0 && (
        <img
          src={leftArrow}
          className={styles['arrowLeft']}
          onClick={handlePrev}
        />
      )}
      <div className={styles['card']}>
        <div className={styles['top']}>
          <img
            src="/default-profile.png"
            alt="프로필"
            className={styles['profile']}
          />

          <div className={styles['info']}>
            <h2>{prf.name}</h2>
            <p>레벨: {prf.level}</p>
            <p>소속: {prf.branch}</p>
          </div>
        </div>

        <div className={styles['career']}>
          <h3>대회경력</h3>
          {prf.career?.map((c, index) => (
            <p key={index}>{c}</p>
          ))}
        </div>
      </div>
      {index < prfList.length - 1 && (
        <img
          src={rightArrow}
          className={styles['arrowRight']}
          onClick={handleNext}
        />
      )}
    </div>
  );
}

export default BranchPrfDetail;
