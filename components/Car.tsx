'use client'

import { forwardRef, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CarType } from './Game'

interface CarProps {
  carType: CarType
  position: THREE.Vector3
  rotation: number
  speed: number
  drifting: boolean
  showParticles: boolean
}

const Car = forwardRef<THREE.Group, CarProps>(
  ({ carType, position, rotation, speed, drifting, showParticles }, ref) => {
    const wheelRefs = useRef<THREE.Mesh[]>([])
    const particlesRef = useRef<THREE.Points[]>([])

    // Car colors based on type
    const carColors = {
      sports: '#ff0000',
      muscle: '#ffa500',
      super: '#ffff00',
      drift: '#00ff00'
    }

    const carColor = carColors[carType]

    // Wheel rotation
    useFrame((state, delta) => {
      wheelRefs.current.forEach(wheel => {
        if (wheel) {
          wheel.rotation.x += (speed * delta) / 2
        }
      })

      // Particle effects for drift
      if (showParticles && drifting) {
        particlesRef.current.forEach(particles => {
          if (particles && particles.geometry.attributes.position) {
            const positions = particles.geometry.attributes.position.array as Float32Array
            for (let i = 0; i < positions.length; i += 3) {
              positions[i + 1] += Math.random() * 0.1
              if (positions[i + 1] > 2) {
                positions[i] = (Math.random() - 0.5) * 0.5
                positions[i + 1] = 0
                positions[i + 2] = (Math.random() - 0.5) * 0.5
              }
            }
            particles.geometry.attributes.position.needsUpdate = true
          }
        })
      }
    })

    // Particle system
    const particleGeometry = useMemo(() => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(300)
      for (let i = 0; i < 100; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 0.5
        positions[i * 3 + 1] = Math.random() * 0.5
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      return geometry
    }, [])

    return (
      <group ref={ref}>
        {/* Main car body */}
        <group>
          {/* Body base */}
          <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
            <boxGeometry args={[1.8, 0.6, 3.5]} />
            <meshStandardMaterial
              color={carColor}
              metalness={0.8}
              roughness={0.2}
              emissive={carColor}
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Cabin */}
          <mesh castShadow receiveShadow position={[0, 0.9, -0.3]}>
            <boxGeometry args={[1.5, 0.7, 1.8]} />
            <meshStandardMaterial
              color={carColor}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>

          {/* Windshield */}
          <mesh castShadow position={[0, 0.9, 0.5]}>
            <boxGeometry args={[1.5, 0.6, 0.1]} />
            <meshStandardMaterial
              color="#88ccff"
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.6}
            />
          </mesh>

          {/* Hood */}
          <mesh castShadow receiveShadow position={[0, 0.4, 1.5]}>
            <boxGeometry args={[1.6, 0.3, 1]} />
            <meshStandardMaterial
              color={carColor}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Spoiler (for sports and super cars) */}
          {(carType === 'sports' || carType === 'super') && (
            <mesh castShadow position={[0, 1.2, -1.7]}>
              <boxGeometry args={[1.8, 0.1, 0.4]} />
              <meshStandardMaterial color="#222222" metalness={0.9} />
            </mesh>
          )}

          {/* Wheels */}
          {/* Front Left */}
          <mesh
            ref={(el) => el && (wheelRefs.current[0] = el)}
            castShadow
            position={[-1, 0, 1.2]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
            <meshStandardMaterial color="#111111" metalness={0.8} />
          </mesh>

          {/* Front Right */}
          <mesh
            ref={(el) => el && (wheelRefs.current[1] = el)}
            castShadow
            position={[1, 0, 1.2]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
            <meshStandardMaterial color="#111111" metalness={0.8} />
          </mesh>

          {/* Rear Left */}
          <mesh
            ref={(el) => el && (wheelRefs.current[2] = el)}
            castShadow
            position={[-1, 0, -1.2]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
            <meshStandardMaterial color="#111111" metalness={0.8} />
          </mesh>

          {/* Rear Right */}
          <mesh
            ref={(el) => el && (wheelRefs.current[3] = el)}
            castShadow
            position={[1, 0, -1.2]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
            <meshStandardMaterial color="#111111" metalness={0.8} />
          </mesh>

          {/* Headlights */}
          <mesh position={[-0.6, 0.3, 2]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={2}
            />
          </mesh>
          <mesh position={[0.6, 0.3, 2]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={2}
            />
          </mesh>

          {/* Taillights */}
          <mesh position={[-0.7, 0.4, -1.75]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color="#ff0000"
              emissive="#ff0000"
              emissiveIntensity={speed < 0 ? 3 : 1}
            />
          </mesh>
          <mesh position={[0.7, 0.4, -1.75]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color="#ff0000"
              emissive="#ff0000"
              emissiveIntensity={speed < 0 ? 3 : 1}
            />
          </mesh>
        </group>

        {/* Drift particles */}
        {showParticles && drifting && (
          <>
            <points
              ref={(el) => el && (particlesRef.current[0] = el)}
              position={[-0.8, 0, -1.2]}
            >
              <bufferGeometry attach="geometry" {...particleGeometry} />
              <pointsMaterial
                attach="material"
                size={0.15}
                color="#666666"
                transparent
                opacity={0.6}
                sizeAttenuation
              />
            </points>
            <points
              ref={(el) => el && (particlesRef.current[1] = el)}
              position={[0.8, 0, -1.2]}
            >
              <bufferGeometry attach="geometry" {...particleGeometry} />
              <pointsMaterial
                attach="material"
                size={0.15}
                color="#666666"
                transparent
                opacity={0.6}
                sizeAttenuation
              />
            </points>
          </>
        )}

        {/* Headlight beams */}
        <spotLight
          position={[-0.6, 0.3, 2]}
          angle={0.5}
          penumbra={0.5}
          intensity={speed > 0 ? 1 : 0}
          distance={20}
          color="#ffffff"
        />
        <spotLight
          position={[0.6, 0.3, 2]}
          angle={0.5}
          penumbra={0.5}
          intensity={speed > 0 ? 1 : 0}
          distance={20}
          color="#ffffff"
        />
      </group>
    )
  }
)

Car.displayName = 'Car'

export default Car
