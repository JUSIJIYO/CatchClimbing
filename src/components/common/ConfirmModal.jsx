import React from 'react';
import styles from '../../styles/css/common/confirmModal.module.css';
import confirmIcon from '../../assets/icon/confirm.svg';

export default function DoneModal({ message, onConfirm }) {
  return (
    <section className={styles['modalBackground']}>
      <article className={styles['modalContainer']}>
        <header className={styles['modalHeader']}>
          <div className={styles['doneIcon']}>
            <img src={confirmIcon} alt="완료 아이콘" />
          </div>
          <h2 className={styles['doneTitle']}>완료되었습니다</h2>
        </header>

        <main className={styles['modalContent']}>
          <p className={styles['doneMessage']}>{message}</p>
        </main>

        <footer className={styles['modalActions']}>
          <button onClick={onConfirm}>확인</button>
        </footer>
      </article>
    </section>
  );
}
