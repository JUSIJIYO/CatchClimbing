import React from 'react';
import styles from '../../styles/css/branch/BranchCard.module.css';
import locationIcon from '../../assets/icon/location.svg';

function BranchCard({ branch }) {
  return (
    <article className={styles.card}>
      <img
        className={styles.image}
        src={branch.image || '/default.jpg'}
        alt={branch.name}
      />

      <section className={styles.info}>
        <h3>{branch.name}</h3>

        <p className={styles.location}>
          <img src={locationIcon} alt="위치 아이콘" />
          <span>{branch.location}</span>
        </p>
      </section>
    </article>
  );
}

export default BranchCard;
