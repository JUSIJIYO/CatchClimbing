import React from 'react';
import styles from '../../styles/css/common/Modal.module.css';

export default function Modal({
  title,
  message,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
}) {
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
          <button onClick={onCancel}>{cancelText}</button>
          <button onClick={onConfirm}>{confirmText}</button>
        </footer>
      </article>
    </section>
  );
}
