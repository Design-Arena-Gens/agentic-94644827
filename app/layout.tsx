import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '3D Car Racing Game',
  description: 'Experience thrilling 3D car racing with multiple game modes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
