import { useState } from 'react'
import MenuView from './views/MenuView'
import GameView from './views/GameView'
import LeaderboardView from './views/LeaderboardView'

function App() {
  const [view, setView] = useState('menu')

  if (view === 'game') {
    return <GameView />
  }

  if (view === 'leaderboard') {
    return <LeaderboardView onBack={() => setView('menu')} />
  }

  return (
    <MenuView
      onStartGame={() => setView('game')}
      onShowLeaderboard={() => setView('leaderboard')}
    />
  )
}

export default App
