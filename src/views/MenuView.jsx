import styles from './MenuView.module.css'

function MenuView({ onStartGame, onShowLeaderboard }) {
  return (
    <div className={styles.menu}>
      <h1>Palabras Encadenadas</h1>
      <nav className={styles.options}>
        <button type="button" onClick={onStartGame}>
          Iniciar Juego
        </button>
        <button type="button" onClick={onShowLeaderboard}>
          Leaderboard
        </button>
      </nav>
    </div>
  )
}

export default MenuView
