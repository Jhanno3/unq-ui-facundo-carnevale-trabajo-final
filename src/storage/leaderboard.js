const LEADERBOARD_KEY = 'palabras-encadenadas:leaderboard'
const MAX_ENTRIES = 10

export function getScores() {
  const raw = localStorage.getItem(LEADERBOARD_KEY)
  if (!raw) return []

  try {
    const scores = JSON.parse(raw)
    return scores.slice(0, MAX_ENTRIES)
  } catch {
    return []
  }
}

export function addScore(name, score) {
  const scores = getScores()
  scores.push({ name, score })
  scores.sort((a, b) => b.score - a.score)

  const topScores = scores.slice(0, MAX_ENTRIES)
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topScores))
  return topScores
}
