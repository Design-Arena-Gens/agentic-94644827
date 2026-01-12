'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Game = dynamic(() => import('../components/Game'), { ssr: false })

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <Suspense fallback={
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontSize: '24px',
          color: '#fff'
        }}>
          Loading 3D Racing Game...
        </div>
      }>
        <Game />
      </Suspense>
    </main>
  )
}
