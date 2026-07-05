import { useState } from 'react'
import { getPlayerName, setPlayerName } from '../storage/player'
import styles from './MenuView.module.css'

function MenuView({ onStartGame, onShowLeaderboard }) {
  const [askingName, setAskingName] = useState(false)
  const [nameInput, setNameInput] = useState('')

  function handleStartGame() {
    if (getPlayerName()) {
      onStartGame()
      return
    }
    setAskingName(true)
  }

  function handleNameSubmit(event) {
    event.preventDefault()
    const name = nameInput.trim()
    if (!name) return

    setPlayerName(name)
    setAskingName(false)
    onStartGame()
  }

  return (
    <div className={styles.menu}>
      <h1>Palabras Encadenadas</h1>
      <nav className={styles.options}>
        <button type="button" onClick={handleStartGame}>
          Iniciar Juego
        </button>
        <button type="button" onClick={onShowLeaderboard}>
          Leaderboard
        </button>
      </nav>

      {askingName && (
        <div className={styles.overlay}>
          <form className={styles.dialog} onSubmit={handleNameSubmit}>
            <h2>¿Cómo te llamás?</h2>
            <input
              type="text"
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="Tu nombre"
              autoComplete="off"
              autoFocus
            />
            <button type="submit">Continuar</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default MenuView
