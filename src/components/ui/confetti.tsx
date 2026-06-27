"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  scale: number
  delay: number
  duration: number
}

const COLORS = [
  '#9E7AFF', // purple
  '#FE8BBB', // pink
  '#7C3AED', // deep purple
  '#FCD34D', // yellow
  '#60A5FA', // blue
  '#34D399', // green
  '#F87171', // red
]

interface ConfettiProps {
  active: boolean
  /** Number of pieces, default 80 */
  count?: number
  /** Container width for spread calculation */
  containerWidth?: number
}

export function Confetti({ active, count = 80, containerWidth = 1440 }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [show, setShow] = useState(false)

  const generatePieces = useCallback(() => {
    const newPieces: ConfettiPiece[] = []
    for (let i = 0; i < count; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * containerWidth,
        y: -20 - Math.random() * 100,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        scale: 0.5 + Math.random() * 0.8,
        delay: Math.random() * 1.2,
        duration: 2 + Math.random() * 2.5,
      })
    }
    setPieces(newPieces)
    setShow(true)

    // Auto hide after animation completes
    setTimeout(() => setShow(false), 4500)
  }, [count, containerWidth])

  useEffect(() => {
    if (active) {
      generatePieces()
    }
  }, [active, generatePieces])

  if (!show || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: piece.x,
            y: piece.y,
            rotateZ: piece.rotation,
            scale: 0,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 100,
            rotateZ: piece.rotation + 720 * (Math.random() > 0.5 ? 1 : -1),
            x: piece.x + (Math.random() - 0.5) * 200,
            scale: piece.scale,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeOut",
          }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '12px',
            height: '20px',
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}
