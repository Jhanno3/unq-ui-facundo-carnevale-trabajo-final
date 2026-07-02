import { useEffect, useRef, useState } from 'react'
import { wordExists } from '../api/wordApi'
import styles from './GameView.module.css'

const MAX_WORD_SIZE = 1.6
const MIN_WORD_SIZE = 0.9
const WORD_SIZE_STEP = 0.15
const INVALID_FEEDBACK_MS = 1600

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

function GameView() {
  const [chain, setChain] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [invalidAttempt, setInvalidAttempt] = useState(null)
  const [invalidReason, setInvalidReason] = useState(null)
  const [shake, setShake] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const chainEndRef = useRef(null)
  const invalidTimeoutRef = useRef(null)

  useEffect(() => {
    chainEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chain])

  useEffect(() => {
    return () => clearTimeout(invalidTimeoutRef.current)
  }, [])

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
    invalidTimeoutRef.current = setTimeout(clearInvalidFeedback, INVALID_FEEDBACK_MS)
  }

  function handleInputChange(event) {
    setInputValue(event.target.value)
    if (invalidAttempt) clearInvalidFeedback()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const word = inputValue.trim()
    if (!word || isVerifying) return

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
  }

  return (
    <div className={`${styles.game} ${shake ? styles.shake : ''}`}>
      <header className={styles.header}>
        <span className={styles.score}>Puntaje: 0</span>
        <span className={styles.timer}>15s</span>
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
    </div>
  )
}

export default GameView
