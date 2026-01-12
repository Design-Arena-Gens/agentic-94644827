'use client'

import { GameState } from './Game'

interface UIProps {
  gameState: GameState
  onPause: () => void
  onReturnToMenu: () => void
}

export default function UI({ gameState, onPause, onReturnToMenu }: UIProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    const milliseconds = Math.floor((time % 1) * 100)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
  }

  return (
    <>
      {/* Top HUD */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '30px',
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '15px 30px',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '5px' }}>MODE</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#40e0d0', textTransform: 'uppercase' }}>
            {gameState.gameMode.replace('-', ' ')}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '5px' }}>TIME</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>
            {formatTime(gameState.time)}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '5px' }}>SCORE</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff8c00' }}>
            {gameState.score.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Speedometer */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '200px',
        height: '200px',
        zIndex: 100
      }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="rgba(0, 0, 0, 0.8)"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="2"
          />

          {/* Speed arc */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="rgba(64, 224, 208, 0.3)"
            strokeWidth="20"
            strokeDasharray="440"
            strokeDashoffset="110"
          />

          {/* Active speed arc */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="url(#speedGradient)"
            strokeWidth="20"
            strokeDasharray="440"
            strokeDashoffset={110 + (330 - (gameState.speed / 300) * 330)}
            transform="rotate(-90 100 100)"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#40e0d0" />
              <stop offset="50%" stopColor="#ff8c00" />
              <stop offset="100%" stopColor="#ff0080" />
            </linearGradient>
          </defs>

          {/* Speed text */}
          <text
            x="100"
            y="100"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="36"
            fontWeight="bold"
            fill="#fff"
          >
            {Math.round(gameState.speed)}
          </text>
          <text
            x="100"
            y="125"
            textAnchor="middle"
            fontSize="14"
            fill="#aaa"
          >
            KM/H
          </text>
        </svg>
      </div>

      {/* Car indicator */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        left: '30px',
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '20px',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        zIndex: 100
      }}>
        <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '8px' }}>CURRENT CAR</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff8c00', textTransform: 'uppercase' }}>
          {gameState.selectedCar.replace('-', ' ')} Car
        </div>
      </div>

      {/* Pause button */}
      <button
        onClick={onPause}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '15px 25px',
          fontSize: '18px',
          fontWeight: 'bold',
          background: 'rgba(0, 0, 0, 0.7)',
          border: '2px solid #40e0d0',
          borderRadius: '8px',
          color: '#40e0d0',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          zIndex: 100
        }}
      >
        {gameState.isPaused ? 'RESUME' : 'PAUSE'}
      </button>

      {/* Pause menu */}
      {gameState.isPaused && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200
        }}>
          <div style={{
            textAlign: 'center',
            color: '#fff'
          }}>
            <h2 style={{
              fontSize: '64px',
              marginBottom: '40px',
              color: '#40e0d0'
            }}>
              PAUSED
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <button
                onClick={onPause}
                style={{
                  padding: '20px 60px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #40e0d0, #00bfa5)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                RESUME
              </button>
              <button
                onClick={onReturnToMenu}
                style={{
                  padding: '20px 60px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid #ff0080',
                  borderRadius: '12px',
                  color: '#ff0080',
                  cursor: 'pointer'
                }}
              >
                MAIN MENU
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
