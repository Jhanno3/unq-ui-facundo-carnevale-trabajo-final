import styles from './BackButton.module.css'

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      className={styles.backButton}
      onClick={onClick}
      aria-label="Volver al inicio"
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
  )
}

export default BackButton
