import styles from "../../styles/css/class/ClassFilterButton.module.css";

function ClassFilterButton({ label, isActive, onClick }) {
  return (
    <button
      className={`${styles.button} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default ClassFilterButton;