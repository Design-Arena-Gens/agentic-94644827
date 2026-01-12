'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { GameState } from './Game'
import Car from './Car'
import Track from './Track'
import Obstacles from './Obstacles'

interface RacingSceneProps {
  gameState: GameState
  onSpeedChange: (speed: number) => void
  onScoreChange: (score: number) => void
}

export default function RacingScene({ gameState, onSpeedChange, onScoreChange }: RacingSceneProps) {
  const carRef = useRef<THREE.Group>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  const [carState, setCarState] = useState({
    position: new THREE.Vector3(0, 0.5, 0),
    rotation: 0,
    velocity: new THREE.Vector3(0, 0, 0),
    speed: 0,
    acceleration: 0,
    steering: 0,
    drifting: false
  })

  const keysPressed = useRef<Set<string>>(new Set())

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase())
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase())
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((state, delta) => {
    if (!gameState.isPlaying || gameState.isPaused) return

    const keys = keysPressed.current

    // Car physics parameters based on car type
    const carSpecs = {
      sports: { maxSpeed: 240, acceleration: 0.8, handling: 0.04 },
      muscle: { maxSpeed: 220, acceleration: 1.0, handling: 0.03 },
      super: { maxSpeed: 300, acceleration: 1.2, handling: 0.05 },
      drift: { maxSpeed: 200, acceleration: 0.7, handling: 0.06 }
    }

    const specs = carSpecs[gameState.selectedCar]

    let targetAcceleration = 0
    let targetSteering = 0
    let handbrake = false

    // Input handling
    if (keys.has('arrowup') || keys.has('w')) {
      targetAcceleration = specs.acceleration
    }
    if (keys.has('arrowdown') || keys.has('s')) {
      targetAcceleration = -specs.acceleration * 0.5
    }
    if (keys.has('arrowleft') || keys.has('a')) {
      targetSteering = specs.handling
    }
    if (keys.has('arrowright') || keys.has('d')) {
      targetSteering = -specs.handling
    }
    if (keys.has(' ')) {
      handbrake = true
    }

    // Update car state
    setCarState(prev => {
      const newState = { ...prev }

      // Acceleration
      newState.acceleration += (targetAcceleration - newState.acceleration) * 0.1
      newState.speed += newState.acceleration * delta * 60

      // Friction and max speed
      const friction = handbrake ? 0.95 : 0.98
      newState.speed *= friction
      newState.speed = Math.max(-specs.maxSpeed * 0.5, Math.min(specs.maxSpeed, newState.speed))

      // Steering
      const steeringFactor = Math.min(Math.abs(newState.speed) / 50, 1)
      newState.steering += (targetSteering - newState.steering) * 0.2
      newState.rotation += newState.steering * steeringFactor * delta * 60

      // Drifting
      newState.drifting = handbrake && Math.abs(newState.speed) > 20 && Math.abs(newState.steering) > 0.01

      // Update position
      const moveX = Math.sin(newState.rotation) * newState.speed * delta
      const moveZ = Math.cos(newState.rotation) * newState.speed * delta

      newState.position.x += moveX
      newState.position.z += moveZ

      // Keep car on track (simple bounds)
      newState.position.x = Math.max(-30, Math.min(30, newState.position.x))

      return newState
    })

    // Update car mesh
    if (carRef.current) {
      carRef.current.position.copy(carState.position)
      carRef.current.rotation.y = carState.rotation

      // Tilt effect
      const tiltAmount = carState.steering * 0.3
      carRef.current.rotation.z = THREE.MathUtils.lerp(carRef.current.rotation.z, tiltAmount, 0.1)
    }

    // Update camera
    if (cameraRef.current && carRef.current) {
      const cameraDistance = 8 + (carState.speed / specs.maxSpeed) * 4
      const cameraHeight = 4 + (carState.speed / specs.maxSpeed) * 2

      const idealOffset = new THREE.Vector3(
        -Math.sin(carState.rotation) * cameraDistance,
        cameraHeight,
        -Math.cos(carState.rotation) * cameraDistance
      )

      const idealLookAt = new THREE.Vector3(
        carState.position.x + Math.sin(carState.rotation) * 3,
        carState.position.y + 1,
        carState.position.z + Math.cos(carState.rotation) * 3
      )

      const cameraPos = carState.position.clone().add(idealOffset)
      cameraRef.current.position.lerp(cameraPos, 0.1)
      cameraRef.current.lookAt(idealLookAt)
    }

    // Update speed display
    onSpeedChange(Math.abs(carState.speed))

    // Score based on speed and drift
    if (carState.drifting) {
      onScoreChange(Math.abs(carState.speed) * 0.1 * delta)
    } else {
      onScoreChange(Math.abs(carState.speed) * 0.01 * delta)
    }
  })

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={75} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[50, 50, 25]}
        intensity={1.5}
        castShadow={gameState.settings.shadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <hemisphereLight args={['#87CEEB', '#684c31', 0.6]} />

      {/* Environment */}
      <Environment preset="sunset" />

      {/* Fog */}
      <fog attach="fog" args={['#1a1a2e', 50, 200]} />

      {/* Car */}
      <Car
        ref={carRef}
        carType={gameState.selectedCar}
        position={carState.position}
        rotation={carState.rotation}
        speed={carState.speed}
        drifting={carState.drifting}
        showParticles={gameState.settings.particles}
      />

      {/* Track */}
      <Track gameMode={gameState.gameMode} carPosition={carState.position} />

      {/* Obstacles */}
      <Obstacles gameMode={gameState.gameMode} carPosition={carState.position} />
    </>
  )
}
