'use client'

import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import RacingScene from './RacingScene'
import UI from './UI'
import Menu from './Menu'

export type GameMode = 'time-trial' | 'free-drive' | 'championship' | 'drift'
export type CarType = 'sports' | 'muscle' | 'super' | 'drift'

export interface GameSettings {
  difficulty: 'easy' | 'medium' | 'hard'
  sound: boolean
  music: boolean
  shadows: boolean
  particles: boolean
}

export interface GameState {
  isPlaying: boolean
  isPaused: boolean
  showMenu: boolean
  showSettings: boolean
  gameMode: GameMode
  selectedCar: CarType
  speed: number
  score: number
  time: number
  settings: GameSettings
}

export default function Game() {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    showMenu: true,
    showSettings: false,
    gameMode: 'free-drive',
    selectedCar: 'sports',
    speed: 0,
    score: 0,
    time: 0,
    settings: {
      difficulty: 'medium',
      sound: true,
      music: true,
      shadows: true,
      particles: true
    }
  })

  const startGame = (mode: GameMode, car: CarType) => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      showMenu: false,
      gameMode: mode,
      selectedCar: car,
      speed: 0,
      score: 0,
      time: 0
    }))
  }

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))
  }

  const returnToMenu = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      showMenu: true,
      isPaused: false
    }))
  }

  const updateSpeed = (speed: number) => {
    setGameState(prev => ({ ...prev, speed }))
  }

  const updateScore = (score: number) => {
    setGameState(prev => ({ ...prev, score: prev.score + score }))
  }

  const updateSettings = (settings: Partial<GameSettings>) => {
    setGameState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings }
    }))
  }

  const toggleSettings = () => {
    setGameState(prev => ({ ...prev, showSettings: !prev.showSettings }))
  }

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      const timer = setInterval(() => {
        setGameState(prev => ({ ...prev, time: prev.time + 0.1 }))
      }, 100)
      return () => clearInterval(timer)
    }
  }, [gameState.isPlaying, gameState.isPaused])

  return (
    <>
      <Canvas
        shadows={gameState.settings.shadows}
        camera={{ position: [0, 5, 10], fov: 75 }}
        style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%)' }}
      >
        <RacingScene
          gameState={gameState}
          onSpeedChange={updateSpeed}
          onScoreChange={updateScore}
        />
      </Canvas>

      {gameState.showMenu && (
        <Menu
          onStartGame={startGame}
          onToggleSettings={toggleSettings}
          showSettings={gameState.showSettings}
          settings={gameState.settings}
          onUpdateSettings={updateSettings}
        />
      )}

      {gameState.isPlaying && (
        <UI
          gameState={gameState}
          onPause={pauseGame}
          onReturnToMenu={returnToMenu}
        />
      )}
    </>
  )
}
