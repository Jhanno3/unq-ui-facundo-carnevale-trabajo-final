import { useEffect, useRef, useState } from 'react'
import { wordExists } from '../api/wordApi'
import BackButton from '../components/BackButton'
import UserMenu from '../components/UserMenu'
import { addScore } from '../storage/leaderboard'
import { getPlayerName } from '../storage/player'
import styles from './GameView.module.css'

const MAX_WORD_SIZE = 1.6
const MIN_WORD_SIZE = 0.9
const WORD_SIZE_STEP = 0.15
const INVALID_FEEDBACK_MS = 1600
const MAX_LIVES = 3
const TURN_SECONDS = 15

const HEART_PATH =
  'M12 21s-6.716-4.35-9.428-8.028C.665 10.2 1.4 6.5 4.5 5.1 7.03 3.96 9.5 5 12 7.5c2.5-2.5 4.97-3.54 7.5-2.4 3.1 1.4 3.835 5.1 1.928 7.872C18.716 16.65 12 21 12 21z'

function Heart({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      className={filled ? styles.heartFilled : styles.heartEmpty}
    >
      <path d={HEART_PATH} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

const ERROR_MESSAGES = {
  notFound: 'Esa palabra no existe amigo',
  chain: 'Fijate la primer letra che',
  duplicate: 'Ojooo no repitas',
}

function wordFontSize(distanceFromLast) {
  const size = MAX_WORD_SIZE - distanceFromLast * WORD_SIZE_STEP
  return `${Math.max(size, MIN_WORD_SIZE)}rem`
}

function matchesChainRule(word, chain) {
  if (chain.length === 0) return true
  const lastWord = chain[chain.length - 1]
  return word[0].toLowerCase() === lastWord.slice(-1).toLowerCase()
}

function isAlreadyUsed(word, chain) {
  return chain.some((used) => used.toLowerCase() === word.toLowerCase())
}

function calculateScore(chain) {
  return chain.reduce((total, word) => total + word.length, 0)
}

function GameView({ onBack, onShowLeaderboard }) {
  const [chain, setChain] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [invalidAttempt, setInvalidAttempt] = useState(null)
  const [invalidReason, setInvalidReason] = useState(null)
  const [shake, setShake] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [lives, setLives] = useState(MAX_LIVES)
  const [timeLeft, setTimeLeft] = useState(TURN_SECONDS)
  const chainEndRef = useRef(null)
  const invalidTimeoutRef = useRef(null)
  const hasSavedScoreRef = useRef(false)
  const hasStarted = chain.length > 0
  const outOfLives = lives <= 0
  const timeIsUp = hasStarted && timeLeft <= 0
  const gameOver = outOfLives || timeIsUp

  useEffect(() => {
    chainEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chain])

  useEffect(() => {
    return () => clearTimeout(invalidTimeoutRef.current)
  }, [])

  useEffect(() => {
    if (!hasStarted || gameOver) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [hasStarted, gameOver])

  useEffect(() => {
    if (!gameOver || hasSavedScoreRef.current) return
    hasSavedScoreRef.current = true
    addScore(getPlayerName() ?? 'Jugador', calculateScore(chain))
  }, [gameOver, chain])

  function clearInvalidFeedback() {
    clearTimeout(invalidTimeoutRef.current)
    setInvalidAttempt(null)
    setInvalidReason(null)
    setShake(false)
  }

  function triggerInvalidFeedback(word, reason) {
    clearTimeout(invalidTimeoutRef.current)
    setInvalidAttempt(word)
    setInvalidReason(reason)
    setShake(true)
    setLives((prev) => Math.max(prev - 1, 0))
    invalidTimeoutRef.current = setTimeout(clearInvalidFeedback, INVALID_FEEDBACK_MS)
  }

  function handleInputChange(event) {
    setInputValue(event.target.value)
    if (invalidAttempt) clearInvalidFeedback()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const word = inputValue.trim()
    if (!word || isVerifying || gameOver) return

    if (isAlreadyUsed(word, chain)) {
      triggerInvalidFeedback(word, 'duplicate')
      return
    }

    if (!matchesChainRule(word, chain)) {
      triggerInvalidFeedback(word, 'chain')
      return
    }

    setIsVerifying(true)
    let exists
    try {
      exists = await wordExists(word)
    } catch {
      setIsVerifying(false)
      return
    }
    setIsVerifying(false)

    if (!exists) {
      triggerInvalidFeedback(word, 'notFound')
      return
    }

    setChain((prev) => [...prev, word])
    setInputValue('')
    setTimeLeft(TURN_SECONDS)
  }

  return (
    <>
      <BackButton onClick={onBack} />
      <UserMenu />

      <div className={`${styles.game} ${shake ? styles.shake : ''}`}>
        <header className={styles.header}>
          <span className={styles.score}>Puntaje: {calculateScore(chain)}</span>
          <div className={styles.lives} aria-label={`${lives} vidas restantes`}>
            {Array.from({ length: MAX_LIVES }, (_, index) => (
              <Heart key={index} filled={index < lives} />
            ))}
          </div>
          <span className={styles.timer}>{timeLeft}s</span>
        </header>

        {invalidReason && (
          <div key={invalidAttempt} className={styles.errorPopup}>
            {ERROR_MESSAGES[invalidReason]}
          </div>
        )}

        <ol className={styles.chain}>
          {chain.map((word, index) => {
            const distanceFromLast = chain.length - 1 - index
            return (
              <li
                key={`${word}-${index}`}
                className={styles.word}
                style={{ fontSize: wordFontSize(distanceFromLast) }}
              >
                {word.slice(0, -1)}
                <span className={styles.lastLetter}>{word.slice(-1)}</span>
              </li>
            )
          })}
          <div ref={chainEndRef} />
        </ol>

        {gameOver && (
          <div className={styles.gameOverPanel}>
            <p className={styles.gameOverReason}>
              {outOfLives ? 'Te quedaste sin vidas' : 'Se acabó el tiempo'}
            </p>
            <p className={styles.wordCount}>Palabras encadenadas: {chain.length}</p>
            <p className={styles.finalScore}>Puntaje final: {calculateScore(chain)}</p>
            <div className={styles.gameOverActions}>
              <button type="button" onClick={onBack}>
                Inicio
              </button>
              <button type="button" onClick={onShowLeaderboard}>
                Leaderboard
              </button>
            </div>
          </div>
        )}

        {!gameOver && (
          <form className={styles.inputBar} onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
              {invalidAttempt && (invalidReason === 'duplicate' || invalidReason === 'notFound') && (
                <div className={styles.inputOverlay} aria-hidden="true">
                  <span className={styles.invalidWord}>{invalidAttempt}</span>
                </div>
              )}
              {invalidAttempt && invalidReason === 'chain' && (
                <div className={styles.inputOverlay} aria-hidden="true">
                  <span className={styles.invalidLetter}>{invalidAttempt[0]}</span>
                  {invalidAttempt.slice(1)}
                </div>
              )}
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Escribí una palabra..."
                autoComplete="off"
                className={invalidAttempt ? styles.inputTextHidden : undefined}
              />
            </div>
            <button type="submit" disabled={isVerifying}>
              {isVerifying ? <span className={styles.spinner} aria-label="Verificando..." /> : 'Enviar'}
            </button>
          </form>
        )}
      </div>
    </>
  )
}

export default GameView
