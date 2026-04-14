import React from 'react';
import styles from '../../styles/css/branch/BranchCard.module.css';
import locationIcon from '../../assets/icon/location.svg';
import { useNavigate } from 'react-router-dom';

function BranchCard({ branch }) {
  const navigate = useNavigate();

  return (
    <article
      className={styles.card}
      onClick={() => navigate(`/branch/${branch.id}`)}
    >
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
