import React from 'react';
import styles from '../../styles/css/branch/BranchDetail.module.css';
import locationIcon from '../../assets/icon/location1.svg';
import phoneIcon from '../../assets/icon/phoneNumber.svg';
import instagramIcon from '../../assets/icon/instagram.svg';
import timeIcon from '../../assets/icon/time.svg';
import starIcon from '../../assets/icon/star.svg';

function BranchDetail({ branch }) {
  return (
    <section className={styles['card']}>
      <div className={styles['map']}></div>

      <div className={styles['infoList']}>
        <div className={styles['item']}>
          <img src={locationIcon} alt="" />
          <div>
            <p className={styles['label']}>주소</p>
            <p className={styles['address']}>{branch.address}</p>
          </div>
        </div>

        <div className={styles['item']}>
          <img src={phoneIcon} alt="" />
          <div>
            <p className={styles['label']}>전화번호</p>
            <p>{branch.phone}</p>
          </div>
        </div>

        <div className={styles['item']}>
          <img src={instagramIcon} alt="" />
          <div>
            <p className={styles['label']}>인스타그램</p>
            <p>{branch.instagram}</p>
          </div>
        </div>

        <div className={styles['item']}>
          <img src={timeIcon} alt="" />
          <div>
            <p className={styles['label']}>운영시간</p>
            <p className={styles['time']}>{branch.openHours}</p>
          </div>
        </div>

        <div className={styles['item']}>
          <img src={starIcon} alt="" />
          <div>
            <p className={styles['label']}>평점</p>
            <p>
              {branch.rating}
              <span className={styles['total']}> / 5.0</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BranchDetail;
