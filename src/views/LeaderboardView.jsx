import BackButton from '../components/BackButton'
import UserMenu from '../components/UserMenu'
import styles from './LeaderboardView.module.css'

const MOCK_SCORES = [
  { name: 'Facundo', score: 87 },
  { name: 'Juan', score: 74 },
  { name: 'Julia', score: 65 },
  { name: 'Pablo', score: 58 },
  { name: 'Tomás', score: 52 },
]

function LeaderboardView({ onBack }) {
  return (
    <div className={styles.leaderboard}>
      <BackButton onClick={onBack} />
      <UserMenu />

      <h1>Leaderboard</h1>

      <ol className={styles.list}>
        {MOCK_SCORES.map((entry, index) => (
          <li key={`${entry.name}-${index}`} className={styles.entry}>
            <span className={styles.rank}>{index + 1}</span>
            <span className={styles.name}>{entry.name}</span>
            <span className={styles.score}>{entry.score}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default LeaderboardView
