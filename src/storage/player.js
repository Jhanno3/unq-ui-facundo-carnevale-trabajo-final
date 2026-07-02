const PLAYER_NAME_KEY = 'palabras-encadenadas:player-name'

export function getPlayerName() {
  return localStorage.getItem(PLAYER_NAME_KEY)
}

export function setPlayerName(name) {
  localStorage.setItem(PLAYER_NAME_KEY, name)
}
