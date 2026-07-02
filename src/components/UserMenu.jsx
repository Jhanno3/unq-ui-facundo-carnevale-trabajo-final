import { useEffect, useRef, useState } from 'react'
import { getPlayerName, setPlayerName } from '../storage/player'
import styles from './UserMenu.module.css'

function UserMenu() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false)
        setEditing(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function handleToggle() {
    setOpen((prev) => !prev)
    setEditing(false)
  }

  function handleEditClick() {
    setNameInput(getPlayerName() ?? '')
    setEditing(true)
  }

  function handleSave(event) {
    event.preventDefault()
    const name = nameInput.trim()
    if (!name) return

    setPlayerName(name)
    setEditing(false)
    setOpen(false)
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.userButton}
        onClick={handleToggle}
        aria-label="Usuario"
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      </button>

      {open && (
        <div className={styles.menu}>
          {editing ? (
            <form className={styles.editForm} onSubmit={handleSave}>
              <input
                type="text"
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                placeholder="Tu nombre"
                autoComplete="off"
                autoFocus
              />
              <button type="submit">Guardar</button>
            </form>
          ) : (
            <>
              <span className={styles.currentName}>
                {getPlayerName() ?? 'Sin nombre'}
              </span>
              <button type="button" onClick={handleEditClick}>
                Cambiar usuario
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default UserMenu
