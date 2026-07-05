import BackButton from '../components/BackButton'
import UserMenu from '../components/UserMenu'
import { getScores } from '../storage/leaderboard'
import styles from './LeaderboardView.module.css'

function LeaderboardView({ onBack }) {
  const scores = getScores()

  return (
    <div className={styles.leaderboard}>
      <BackButton onClick={onBack} />
      <UserMenu />

      <h1>Leaderboard</h1>

      {scores.length === 0 ? (
        <p className={styles.empty}>Todavía no hay puntajes registrados</p>
      ) : (
        <ol className={styles.list}>
          {scores.map((entry, index) => (
            <li key={`${entry.name}-${index}`} className={styles.entry}>
              <span className={styles.rank}>{index + 1}</span>
              <span className={styles.name}>{entry.name}</span>
              <span className={styles.score}>{entry.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default LeaderboardView
