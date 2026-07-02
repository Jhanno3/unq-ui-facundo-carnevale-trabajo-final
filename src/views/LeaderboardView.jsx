import styles from './LeaderboardView.module.css'

function LeaderboardView({ onBack }) {
  return (
    <div className={styles.leaderboard}>
      <h1>Leaderboard</h1>
      <button type="button" onClick={onBack}>
        Volver
      </button>
    </div>
  )
}

export default LeaderboardView
