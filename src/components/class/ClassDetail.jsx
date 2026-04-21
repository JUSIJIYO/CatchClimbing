import styles from '../../styles/css/class/ClassDetail.module.css';
import icon1 from '../../assets/icon/people.svg';
import icon2 from '../../assets/icon/location(3).svg';
import icon3 from '../../assets/icon/calender.svg';
import icon4 from '../../assets/icon/level.svg';

function ClassDetail({
  professorName,
  branchName,
  createdAt,
  level,
  title,
  currentCap, //현재신청인원
  capacity, //정원
  money,
  imageUrl,
  description,
}) {
  return (
    <div>
      <div className={styles['class-main-card']}>
        <div className={styles['class-top']}>
          <div className={styles['class-top-right']}>
            <h2 className={styles['class-title']}>{title}</h2>
            <div className={styles['class-picture']}>
              <img src={imageUrl} alt="강사 이미지" />
            </div>
          </div>

          <div className={styles['class-infomation']}>
            <div className={styles['class-datail-information']}>
              <div className={styles['icon-item']}>
                <span className={styles['icon-box']}>
                  <img src={icon1} alt="강사" />
                </span>
                강사: {professorName}
              </div>

              <div className={styles['icon-item']}>
                <span className={styles['icon-box']}>
                  <img src={icon2} alt="지점" />
                </span>
                지점: {branchName}
              </div>

              <div className={styles['icon-item']}>
                <span className={styles['icon-box']}>
                  <img src={icon3} alt="달력"/>
                </span>
                일정: {createdAt}
              </div>

              <div className={styles['icon-item']}>
                <span className={styles['icon-box']}>
                  <img src={icon4} alt="난이도" />
                </span>
                난이도: {level}
              </div>
            </div>
          </div>
        </div>

        <div className={styles['class-description']}>
          <h3>수업 설명</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className={styles['class-bigcard']}>
        <div className={styles['class-card']}>
          <span>수강 인원</span>
          <strong>
            {currentCap}/{capacity}
          </strong>
        </div>

        <div className={styles['class-card']}>
          <span>수강료</span>
          <strong>{money}</strong>
        </div>
      </div>
    </div>
  );
}

export default ClassDetail;
