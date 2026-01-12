'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GameMode } from './Game'

interface TrackProps {
  gameMode: GameMode
  carPosition: THREE.Vector3
}

export default function Track({ gameMode, carPosition }: TrackProps) {
  const roadSegmentsRef = useRef<THREE.Mesh[]>([])
  const terrainRef = useRef<THREE.Mesh[]>([])

  // Generate track segments
  const trackSegments = useMemo(() => {
    const segments = []
    for (let i = -10; i < 50; i++) {
      segments.push(i)
    }
    return segments
  }, [])

  // Scroll track segments based on car position
  useFrame(() => {
    roadSegmentsRef.current.forEach((segment, index) => {
      if (segment) {
        const baseZ = (index - 10) * 10
        const offset = Math.floor(carPosition.z / 10) * 10
        segment.position.z = baseZ + offset
      }
    })

    terrainRef.current.forEach((terrain, index) => {
      if (terrain) {
        const baseZ = (index - 5) * 40
        const offset = Math.floor(carPosition.z / 40) * 40
        terrain.position.z = baseZ + offset
      }
    })
  })

  // Track markings
  const roadMarkings = useMemo(() => {
    const markings = []
    for (let i = 0; i < 100; i++) {
      markings.push({
        position: [0, 0.01, i * 2 - 100] as [number, number, number],
        key: i
      })
    }
    return markings
  }, [])

  return (
    <group>
      {/* Main road segments */}
      {trackSegments.map((segment, index) => (
        <mesh
          key={`road-${segment}`}
          ref={(el) => el && (roadSegmentsRef.current[index] = el)}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[12, 10]} />
          <meshStandardMaterial
            color="#2a2a2a"
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      ))}

      {/* Road markings - center line */}
      {roadMarkings.map((marking) => (
        <mesh
          key={`marking-${marking.key}`}
          position={marking.position}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.3, 1.5]} />
          <meshStandardMaterial
            color="#ffff00"
            emissive="#ffff00"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Road edges */}
      {trackSegments.map((segment, index) => (
        <group key={`edge-${segment}`}>
          {/* Left edge */}
          <mesh
            position={[-6, 0.05, segment * 10]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.5, 10]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Right edge */}
          <mesh
            position={[6, 0.05, segment * 10]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.5, 10]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}

      {/* Terrain/Ground around the track */}
      {[-2, -1, 0, 1, 2].map((offset, index) => (
        <group key={`terrain-group-${offset}`}>
          {/* Left terrain */}
          <mesh
            ref={(el) => el && (terrainRef.current[index * 2] = el)}
            position={[-25, -0.1, offset * 40]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[40, 40]} />
            <meshStandardMaterial
              color="#1a4d1a"
              roughness={0.9}
              metalness={0}
            />
          </mesh>
          {/* Right terrain */}
          <mesh
            ref={(el) => el && (terrainRef.current[index * 2 + 1] = el)}
            position={[25, -0.1, offset * 40]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[40, 40]} />
            <meshStandardMaterial
              color="#1a4d1a"
              roughness={0.9}
              metalness={0}
            />
          </mesh>
        </group>
      ))}

      {/* Barriers */}
      {trackSegments.map((segment) => (
        <group key={`barrier-${segment}`}>
          {/* Left barrier */}
          <mesh
            position={[-7, 0.5, segment * 10]}
            castShadow
          >
            <boxGeometry args={[0.3, 1, 10]} />
            <meshStandardMaterial
              color="#ff3333"
              metalness={0.5}
              roughness={0.5}
            />
          </mesh>
          {/* Right barrier */}
          <mesh
            position={[7, 0.5, segment * 10]}
            castShadow
          >
            <boxGeometry args={[0.3, 1, 10]} />
            <meshStandardMaterial
              color="#ff3333"
              metalness={0.5}
              roughness={0.5}
            />
          </mesh>
        </group>
      ))}

      {/* Decorative elements */}
      {/* Light poles */}
      {trackSegments.filter((_, i) => i % 3 === 0).map((segment) => (
        <group key={`pole-${segment}`}>
          {/* Left pole */}
          <group position={[-9, 0, segment * 10]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
              <meshStandardMaterial color="#333333" metalness={0.8} />
            </mesh>
            <mesh position={[0, 2.5, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial
                color="#ffaa00"
                emissive="#ffaa00"
                emissiveIntensity={1.5}
              />
            </mesh>
            <pointLight
              position={[0, 2.5, 0]}
              color="#ffaa00"
              intensity={2}
              distance={15}
            />
          </group>
          {/* Right pole */}
          <group position={[9, 0, segment * 10]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
              <meshStandardMaterial color="#333333" metalness={0.8} />
            </mesh>
            <mesh position={[0, 2.5, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial
                color="#ffaa00"
                emissive="#ffaa00"
                emissiveIntensity={1.5}
              />
            </mesh>
            <pointLight
              position={[0, 2.5, 0]}
              color="#ffaa00"
              intensity={2}
              distance={15}
            />
          </group>
        </group>
      ))}

      {/* Trees */}
      {trackSegments.filter((_, i) => i % 4 === 0).map((segment) => (
        <group key={`trees-${segment}`}>
          {/* Left trees */}
          <group position={[-15, 0, segment * 10 + Math.random() * 3]}>
            <mesh castShadow position={[0, 1.5, 0]}>
              <coneGeometry args={[1.5, 3, 8]} />
              <meshStandardMaterial color="#0a5a0a" />
            </mesh>
            <mesh castShadow position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 1, 8]} />
              <meshStandardMaterial color="#3d2817" />
            </mesh>
          </group>
          {/* Right trees */}
          <group position={[15, 0, segment * 10 + Math.random() * 3]}>
            <mesh castShadow position={[0, 1.5, 0]}>
              <coneGeometry args={[1.5, 3, 8]} />
              <meshStandardMaterial color="#0a5a0a" />
            </mesh>
            <mesh castShadow position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 1, 8]} />
              <meshStandardMaterial color="#3d2817" />
            </mesh>
          </group>
        </group>
      ))}

      {/* Mountains in background */}
      {[-1, 0, 1].map((offset) => (
        <group key={`mountains-${offset}`}>
          <mesh position={[-50, 5, offset * 100]} castShadow>
            <coneGeometry args={[20, 30, 4]} />
            <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
          </mesh>
          <mesh position={[50, 5, offset * 100 + 50]} castShadow>
            <coneGeometry args={[25, 35, 4]} />
            <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
