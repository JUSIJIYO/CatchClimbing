import styles from '../../styles/css/common/Modal.module.css';
import React from 'react';

export default function Modal({
  title,
  message,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
  loading,
}) {
  const isLoadingOnly = !cancelText && !confirmText;
  return (
    <div className={`${styles.modalBackground}`}>
      <div
        className={`${styles.modalContainer} ${
          isLoadingOnly ? styles.loadingContainer : ''
        }`}
      >
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
        </div>

        <div className={styles.modalContent}>
          <p>{message}</p>
        </div>

        {(cancelText || confirmText) && (
          <div className={styles.modalActions}>
            {cancelText && <button onClick={onCancel}>{cancelText}</button>}
            {confirmText && <button onClick={onConfirm}>{confirmText}</button>}
          </div>
        )}
      </div>
    </div>
  );
}
