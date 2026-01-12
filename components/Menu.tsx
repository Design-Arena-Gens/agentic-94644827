'use client'

import { useState } from 'react'
import { GameMode, CarType, GameSettings } from './Game'

interface MenuProps {
  onStartGame: (mode: GameMode, car: CarType) => void
  onToggleSettings: () => void
  showSettings: boolean
  settings: GameSettings
  onUpdateSettings: (settings: Partial<GameSettings>) => void
}

export default function Menu({ onStartGame, onToggleSettings, showSettings, settings, onUpdateSettings }: MenuProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('free-drive')
  const [selectedCar, setSelectedCar] = useState<CarType>('sports')

  const modes = [
    { id: 'time-trial' as GameMode, name: 'Time Trial', desc: 'Race against the clock' },
    { id: 'free-drive' as GameMode, name: 'Free Drive', desc: 'Explore without limits' },
    { id: 'championship' as GameMode, name: 'Championship', desc: 'Compete for the title' },
    { id: 'drift' as GameMode, name: 'Drift Mode', desc: 'Master the art of drifting' }
  ]

  const cars = [
    { id: 'sports' as CarType, name: 'Sports Car', speed: '240 km/h', color: '#ff0000' },
    { id: 'muscle' as CarType, name: 'Muscle Car', speed: '220 km/h', color: '#ffa500' },
    { id: 'super' as CarType, name: 'Super Car', speed: '300 km/h', color: '#ffff00' },
    { id: 'drift' as CarType, name: 'Drift Car', speed: '200 km/h', color: '#00ff00' }
  ]

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      {!showSettings ? (
        <div style={{
          maxWidth: '1200px',
          width: '90%',
          padding: '40px',
          color: '#fff'
        }}>
          <h1 style={{
            fontSize: '64px',
            textAlign: 'center',
            marginBottom: '50px',
            background: 'linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            3D CAR RACING
          </h1>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#40e0d0' }}>Select Game Mode</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {modes.map(mode => (
                <div
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  style={{
                    padding: '20px',
                    border: selectedMode === mode.id ? '3px solid #40e0d0' : '2px solid #333',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: selectedMode === mode.id ? 'rgba(64, 224, 208, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s',
                    transform: selectedMode === mode.id ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{mode.name}</h3>
                  <p style={{ fontSize: '14px', color: '#aaa' }}>{mode.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#ff8c00' }}>Select Your Car</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              {cars.map(car => (
                <div
                  key={car.id}
                  onClick={() => setSelectedCar(car.id)}
                  style={{
                    padding: '20px',
                    border: selectedCar === car.id ? '3px solid #ff8c00' : '2px solid #333',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: selectedCar === car.id ? 'rgba(255, 140, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s',
                    transform: selectedCar === car.id ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <div style={{
                    width: '60px',
                    height: '30px',
                    background: car.color,
                    borderRadius: '8px',
                    marginBottom: '12px',
                    boxShadow: `0 0 20px ${car.color}`
                  }} />
                  <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>{car.name}</h3>
                  <p style={{ fontSize: '14px', color: '#aaa' }}>Max: {car.speed}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => onStartGame(selectedMode, selectedCar)}
              style={{
                padding: '20px 60px',
                fontSize: '24px',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #ff0080, #ff8c00)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 20px rgba(255, 0, 128, 0.5)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              START RACE
            </button>

            <button
              onClick={onToggleSettings}
              style={{
                padding: '20px 40px',
                fontSize: '20px',
                fontWeight: 'bold',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid #40e0d0',
                borderRadius: '12px',
                color: '#40e0d0',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(64, 224, 208, 0.2)'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              SETTINGS
            </button>
          </div>

          <div style={{
            marginTop: '40px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            fontSize: '14px',
            color: '#aaa'
          }}>
            <h3 style={{ marginBottom: '10px', color: '#fff' }}>Controls:</h3>
            <p>↑ / W - Accelerate | ↓ / S - Brake/Reverse | ← / A - Turn Left | → / D - Turn Right | SPACE - Handbrake | ESC - Pause</p>
          </div>
        </div>
      ) : (
        <div style={{
          maxWidth: '800px',
          width: '90%',
          padding: '40px',
          color: '#fff'
        }}>
          <h2 style={{
            fontSize: '48px',
            textAlign: 'center',
            marginBottom: '40px',
            color: '#40e0d0'
          }}>
            Settings
          </h2>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Difficulty</h3>
            <div style={{ display: 'flex', gap: '15px' }}>
              {(['easy', 'medium', 'hard'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => onUpdateSettings({ difficulty: diff })}
                  style={{
                    flex: 1,
                    padding: '15px',
                    fontSize: '18px',
                    background: settings.difficulty === diff ? '#40e0d0' : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    color: settings.difficulty === diff ? '#000' : '#fff',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Audio</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '18px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.sound}
                  onChange={(e) => onUpdateSettings({ sound: e.target.checked })}
                  style={{ width: '24px', height: '24px', marginRight: '12px', cursor: 'pointer' }}
                />
                Sound Effects
              </label>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '18px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.music}
                  onChange={(e) => onUpdateSettings({ music: e.target.checked })}
                  style={{ width: '24px', height: '24px', marginRight: '12px', cursor: 'pointer' }}
                />
                Background Music
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Graphics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '18px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.shadows}
                  onChange={(e) => onUpdateSettings({ shadows: e.target.checked })}
                  style={{ width: '24px', height: '24px', marginRight: '12px', cursor: 'pointer' }}
                />
                Dynamic Shadows
              </label>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '18px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.particles}
                  onChange={(e) => onUpdateSettings({ particles: e.target.checked })}
                  style={{ width: '24px', height: '24px', marginRight: '12px', cursor: 'pointer' }}
                />
                Particle Effects
              </label>
            </div>
          </div>

          <button
            onClick={onToggleSettings}
            style={{
              width: '100%',
              padding: '20px',
              fontSize: '24px',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #ff0080, #ff8c00)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            BACK TO MENU
          </button>
        </div>
      )}
    </div>
  )
}
