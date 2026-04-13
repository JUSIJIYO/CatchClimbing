import React from 'react';
import styles from '../../styles/css/common/ChkModal.module.css';

export default function CheckModal({ title, message, onConfirm }) {
  return (
    <section className={styles['modalBackground']}>
      <article className={styles['modalContainer']}>
        <header className={styles['modalHeader']}>
          <h2>{title}</h2>
          {/* <h2>제목</h2> */}
        </header>

        <main className={styles['modalContent']}>
          <p>{message}</p>
        </main>

        <footer className={styles['modalActions']}>
          <button onClick={onConfirm}>확인</button>
        </footer>
      </article>
    </section>
  );
}
