const BASE_URL = 'https://word-api-hmlg.vercel.app'

export async function wordExists(word) {
  const response = await fetch(
    `${BASE_URL}/api/validate?word=${encodeURIComponent(word)}`,
  )

  if (!response.ok) {
    throw new Error('No se pudo validar la palabra')
  }

  const data = await response.json()
  return data.exists
}
