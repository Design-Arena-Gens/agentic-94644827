'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GameMode } from './Game'

interface ObstaclesProps {
  gameMode: GameMode
  carPosition: THREE.Vector3
}

export default function Obstacles({ gameMode, carPosition }: ObstaclesProps) {
  const obstaclesRef = useRef<THREE.Mesh[]>([])
  const coinsRef = useRef<THREE.Mesh[]>([])

  // Generate obstacles based on game mode
  const obstacles = useMemo(() => {
    if (gameMode === 'free-drive') return []

    const obs = []
    for (let i = 0; i < 30; i++) {
      obs.push({
        position: [
          (Math.random() - 0.5) * 10,
          0.5,
          i * 20 + 50
        ] as [number, number, number],
        type: Math.random() > 0.5 ? 'cone' : 'barrier',
        key: i
      })
    }
    return obs
  }, [gameMode])

  // Generate collectible coins for championship mode
  const coins = useMemo(() => {
    if (gameMode !== 'championship' && gameMode !== 'time-trial') return []

    const coinArray = []
    for (let i = 0; i < 50; i++) {
      coinArray.push({
        position: [
          (Math.random() - 0.5) * 8,
          1,
          i * 15 + 30
        ] as [number, number, number],
        collected: false,
        key: i
      })
    }
    return coinArray
  }, [gameMode])

  // Rotate coins
  useFrame((state) => {
    coinsRef.current.forEach(coin => {
      if (coin) {
        coin.rotation.y += 0.05
      }
    })
  })

  return (
    <group>
      {/* Obstacles */}
      {obstacles.map((obstacle, index) => (
        <group key={`obstacle-${obstacle.key}`} position={obstacle.position}>
          {obstacle.type === 'cone' ? (
            <mesh ref={(el) => el && (obstaclesRef.current[index] = el)} castShadow>
              <coneGeometry args={[0.4, 1, 8]} />
              <meshStandardMaterial
                color="#ff6600"
                emissive="#ff3300"
                emissiveIntensity={0.3}
              />
            </mesh>
          ) : (
            <mesh ref={(el) => el && (obstaclesRef.current[index] = el)} castShadow>
              <boxGeometry args={[2, 0.8, 0.3]} />
              <meshStandardMaterial
                color="#ffff00"
                emissive="#ffaa00"
                emissiveIntensity={0.2}
                roughness={0.7}
                metalness={0.3}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Collectible coins */}
      {coins.map((coin, index) => (
        <group key={`coin-${coin.key}`} position={coin.position}>
          <mesh
            ref={(el) => el && (coinsRef.current[index] = el)}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
            <meshStandardMaterial
              color="#ffd700"
              emissive="#ffd700"
              emissiveIntensity={0.8}
              metalness={1}
              roughness={0.2}
            />
          </mesh>
          <pointLight
            color="#ffd700"
            intensity={1}
            distance={5}
          />
        </group>
      ))}

      {/* Checkpoints for time trial */}
      {gameMode === 'time-trial' && [10, 30, 50, 70, 90].map((z, index) => (
        <group key={`checkpoint-${index}`} position={[0, 0, z]}>
          {/* Left post */}
          <mesh position={[-6, 2, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 4, 8]} />
            <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
          </mesh>
          {/* Right post */}
          <mesh position={[6, 2, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 4, 8]} />
            <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
          </mesh>
          {/* Banner */}
          <mesh position={[0, 4, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[12, 0.8, 0.1]} />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={0.3}
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      ))}

      {/* Drift zones for drift mode */}
      {gameMode === 'drift' && [20, 50, 80].map((z, index) => (
        <group key={`drift-zone-${index}`} position={[0, 0.05, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 15]} />
            <meshStandardMaterial
              color="#ff00ff"
              emissive="#ff00ff"
              emissiveIntensity={0.3}
              transparent
              opacity={0.4}
            />
          </mesh>
          {/* Zone markers */}
          <mesh position={[-5, 0.5, 0]}>
            <boxGeometry args={[0.3, 1, 15]} />
            <meshStandardMaterial
              color="#ff00ff"
              emissive="#ff00ff"
              emissiveIntensity={0.8}
            />
          </mesh>
          <mesh position={[5, 0.5, 0]}>
            <boxGeometry args={[0.3, 1, 15]} />
            <meshStandardMaterial
              color="#ff00ff"
              emissive="#ff00ff"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Buildings in background */}
      {[0, 1, 2, 3, 4].map((index) => (
        <group key={`buildings-${index}`}>
          {/* Left side buildings */}
          <mesh
            position={[-30 - Math.random() * 10, Math.random() * 5 + 5, index * 40 - 40]}
            castShadow
          >
            <boxGeometry args={[
              5 + Math.random() * 5,
              10 + Math.random() * 10,
              5 + Math.random() * 5
            ]} />
            <meshStandardMaterial
              color={`hsl(${Math.random() * 60 + 180}, 30%, ${Math.random() * 20 + 20}%)`}
              emissive={`hsl(${Math.random() * 60 + 180}, 50%, 20%)`}
              emissiveIntensity={0.2}
            />
          </mesh>
          {/* Right side buildings */}
          <mesh
            position={[30 + Math.random() * 10, Math.random() * 5 + 5, index * 40 - 40]}
            castShadow
          >
            <boxGeometry args={[
              5 + Math.random() * 5,
              10 + Math.random() * 10,
              5 + Math.random() * 5
            ]} />
            <meshStandardMaterial
              color={`hsl(${Math.random() * 60 + 180}, 30%, ${Math.random() * 20 + 20}%)`}
              emissive={`hsl(${Math.random() * 60 + 180}, 50%, 20%)`}
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* Neon signs on buildings */}
      {[0, 2, 4].map((index) => (
        <group key={`neon-${index}`}>
          <mesh position={[-35, 8, index * 40 - 40]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[3, 1]} />
            <meshStandardMaterial
              color="#ff0080"
              emissive="#ff0080"
              emissiveIntensity={2}
            />
          </mesh>
          <mesh position={[35, 8, index * 40 - 20]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[3, 1]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={2}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
