import { useRef, useState, useCallback } from 'react'

interface MagnetProps {
  children: React.ReactNode
  padding?: number
  strength?: number
  activeTransition?: string
  inactiveTransition?: string
  className?: string
}

export default function Magnet({
  children,
  padding = 100,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className = '',
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: -20 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      const newY = Math.min(deltaY / strength, 0)
      setPosition({ x: deltaX / strength, y: newY })
    },
    [strength]
  )

  const handleMouseEnter = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transition = activeTransition
  }, [activeTransition])

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transition = inactiveTransition
    setPosition({ x: 0, y: -20 })
  }, [inactiveTransition])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        willChange: 'transform',
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
