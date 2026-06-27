import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { cn } from '@/lib/utils'
import ElectricBorder from '@/components/ui/ElectricBorder'
import { useI18n } from '@/lib/i18n'

/**
 * DamageMask — 可拖拽破坏的遮罩面板
 * 基于 BreakableCard 改造：保留 damage/shatter 动画，移除自动恢复和重生
 * 破碎后保持状态不变，直到页面刷新
 */

interface FallState {
  active: boolean
  velocityX: number
  velocityY: number
  rotation: number
}

interface DebrisData {
  id: number
  x: number
  y: number
  rot: number
  path: string
}

const PHYSICS = {
  MAX_RANGE: 45,
  DAMAGE_THRESHOLD: 2.5,
  DAMAGE_INCREMENT: 0.08,
  DEBRIS_DISAPPEAR_MS: 3000,
} as const

const CHUNK_PATHS = [
  'M 0 0 L 20 5 L 15 25 L 5 20 Z',
  'M 5 0 L 25 10 L 15 30 L 0 25 Z',
  'M 10 5 L 30 0 L 25 25 L 5 30 Z',
  'M 0 10 L 20 0 L 30 20 L 10 30 Z',
]

const DEBRIS_THRESHOLDS = [0.3, 0.5, 0.7, 0.9]

export interface DamageMaskProps {
  onReveal?: () => void
  title?: string
  subtitle?: string
  enSubtitle?: string
  className?: string
}

// ─── Debris Chunk ──────────────────────────────────────────────
const DebrisChunk = ({ x, y, rot, path }: { x: number; y: number; rot: number; path: string }) => {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), PHYSICS.DEBRIS_DISAPPEAR_MS)
    return () => clearTimeout(timer)
  }, [])
  if (!visible) return null
  return (
    <svg
      className="absolute w-8 h-8 pointer-events-none z-30 overflow-visible"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `rotate(${rot}deg)`,
        animation: 'debris-fall 0.8s cubic-bezier(0.55, 0, 1, 0.45) 0s forwards',
      }}
    >
      <path d={path} fill="white" stroke="#7C3AED" strokeWidth="2" />
    </svg>
  )
}

// ─── Crack Lines ──────────────────────────────────────────────
const CrackLines = ({ level }: { level: number }) => {
  if (level < 0.1) return null
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
      {level >= 0.1 && (
        <path
          d="M0 20 L15 25 L8 40 L20 50"
          fill="none"
          stroke="#7C3AED"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: Math.min(1, level * 2) }}
        />
      )}
      {level >= 0.5 && (
        <path
          d="M50 100 L55 80 L45 70 L60 55"
          fill="none"
          stroke="#7C3AED"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: Math.min(1, (level - 0.4) * 2) }}
        />
      )}
      {level >= 0.9 && (
        <path
          d="M20 0 L25 20 L40 25 L35 45 L50 50"
          fill="none"
          stroke="#7C3AED"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
          strokeDasharray="4 2"
        />
      )}
    </svg>
  )
}

// ─── Main Component ───────────────────────────────────────────
export function DamageMask({ onReveal, title, subtitle, enSubtitle, className }: DamageMaskProps) {
  const { t } = useI18n()
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [crackLevel, setCrackLevel] = useState(0)
  const [isBroken, setIsBroken] = useState(false)
  const [shouldUnmount, setShouldUnmount] = useState(false)
  const [fallState, setFallState] = useState<FallState>({
    active: false,
    velocityX: 0,
    velocityY: 0,
    rotation: 0,
  })
  const [debrisChunks, setDebrisChunks] = useState<DebrisData[]>([])
  const [isFlashing, setIsFlashing] = useState(false)

  const lastPos = useRef({ x: 0, y: 0 })
  const startPos = useRef({ x: 0, y: 0 })
  const lastTime = useRef(Date.now())
  const shakeIntensity = useRef(0)
  const velocityRef = useRef({ x: 0, y: 0 })
  const crackLevelRef = useRef(0)
  const isBrokenRef = useRef(false)

  // ─── Trigger Break ───────────────────────────────────────
  const triggerBreak = useCallback(() => {
    if (isBrokenRef.current) return
    isBrokenRef.current = true
    setIsBroken(true)
    setIsDragging(false)
    const vx = velocityRef.current.x
    const baseRotation = Math.max(-60, Math.min(60, vx))
    setFallState({
      active: true,
      velocityX: vx * 0.3,
      velocityY: 5,
      rotation: baseRotation,
    })
    // Don't call onReveal here — let fall animation play first
  }, [onReveal])

  // ─── After break: wait for fall animation to finish, then reveal ──
  useEffect(() => {
    if (isBroken && !shouldUnmount) {
      // Reveal photo immediately after break — no delay
      onReveal?.()
      setShouldUnmount(true)
    }
  }, [isBroken, shouldUnmount, onReveal])

  // ─── Spawn Debris ────────────────────────────────────────
  const spawnDebris = useCallback((level: number) => {
    const newChunks: DebrisData[] = []
    DEBRIS_THRESHOLDS.forEach((threshold, i) => {
      if (level >= threshold && debrisChunks.length <= i) {
        newChunks.push({
          id: Date.now() + i,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          rot: Math.random() * 360,
          delay: 0,
          path: CHUNK_PATHS[Math.floor(Math.random() * CHUNK_PATHS.length)],
        })
      }
    })
    if (newChunks.length > 0) {
      setDebrisChunks((prev) => [...prev, ...newChunks])
    }
  }, [debrisChunks.length])

  // ─── Drag Start ──────────────────────────────────────────
  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (isBrokenRef.current) return
      setIsDragging(true)
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY
      startPos.current = { x: clientX - position.x, y: clientY - position.y }
      lastPos.current = { x: clientX, y: clientY }
      lastTime.current = Date.now()
      shakeIntensity.current = 0
    },
    [position.x, position.y],
  )

  // ─── Drag Move ───────────────────────────────────────────
  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || isBrokenRef.current) return
      const now = Date.now()
      const dt = Math.max(1, now - lastTime.current)

      const dx = clientX - lastPos.current.x
      const dy = clientY - lastPos.current.y
      const vx = dx / dt
      const vy = dy / dt

      velocityRef.current = { x: vx * 100, y: vy * 100 }

      const newX = clientX - startPos.current.x
      const newY = clientY - startPos.current.y
      const clampedX = Math.max(-PHYSICS.MAX_RANGE, Math.min(PHYSICS.MAX_RANGE, newX))
      const clampedY = Math.max(-PHYSICS.MAX_RANGE, Math.min(PHYSICS.MAX_RANGE, newY))
      setPosition({ x: clampedX, y: clampedY })

      // Damage Calculation
      const distFromCenter = Math.sqrt(clampedX * clampedX + clampedY * clampedY)
      const intensity = distFromCenter / PHYSICS.MAX_RANGE

      if (distFromCenter > PHYSICS.MAX_RANGE * 0.4) {
        const damageMult = intensity > 0.85 ? 2.0 : 1.0
        shakeIntensity.current += PHYSICS.DAMAGE_INCREMENT * intensity * damageMult
        setIsFlashing(true)
        setTimeout(() => setIsFlashing(false), 100)
      } else {
        shakeIntensity.current = Math.max(0, shakeIntensity.current - 0.015)
      }

      setCrackLevel((prev) => {
        const newLevel = Math.min(1, prev + shakeIntensity.current * 0.08)
        crackLevelRef.current = newLevel
        spawnDebris(newLevel)
        if (newLevel >= 1) {
          setTimeout(() => triggerBreak(), 0)
        }
        return newLevel
      })

      lastPos.current = { x: clientX, y: clientY }
      lastTime.current = now
    },
    [isDragging, spawnDebris, triggerBreak],
  )

  // ─── Drag End ────────────────────────────────────────────
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    setPosition({ x: 0, y: 0 })
    shakeIntensity.current = 0
  }, [isDragging])

  // ─── Global Event Listeners ─────────────────────────────
  useEffect(() => {
    if (!isDragging) return
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY
      handleDragMove(clientX, clientY)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', handleDragEnd)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', handleDragEnd)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', handleDragEnd)
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  // ─── Computed Values ─────────────────────────────────────
  const cardId = useMemo(() => `dmask-${Math.random().toString(36).substr(2, 9)}`, [])

  const fallTransform = useMemo(() => {
    if (!fallState.active) return ''
    const horizontalDrift = fallState.velocityX * 5
    const rotation = fallState.rotation + (fallState.velocityX > 0 ? 45 : -45)
    return `translate(${horizontalDrift}px, 120vh) rotate(${rotation}deg)`
  }, [fallState])

  // ─── Render ──────────────────────────────────────────────
  if (shouldUnmount) return null

  return (
    <div className={cn('relative w-full h-full', className)} style={{ width: '180px' }}>
      {/* Layer 1: Debris Chunks */}
      <div
        className="pointer-events-none absolute inset-0 z-50 overflow-visible"
        style={{
          transform: isBroken
            ? fallTransform
            : `translate(${position.x}px, ${position.y}px) rotate(${position.x * 0.15}deg)`,
        }}
      >
        {debrisChunks.map((chunk: DebrisData) => (
          <DebrisChunk key={chunk.id} x={chunk.x} y={chunk.y} rot={chunk.rot} path={chunk.path} />
        ))}
      </div>

      {/* Layer 2: Interactive Mask Card with Electric Border */}
      <ElectricBorder
        color="#7C3AED"
        speed={1.5}
        chaos={0.08}
        borderRadius={16}
        style={{
          width: '180px',
          minHeight: '380px',
          transform: isBroken
            ? fallTransform
            : `translate(${position.x}px, ${position.y}px) rotate(${position.x * 0.15}deg)`,
          transition: isDragging
            ? 'none'
            : isBroken
              ? 'transform 1s cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity 1s ease-out'
              : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          opacity: isBroken ? 0 : 1,
        }}
      >
        <div
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          className={cn(
            'relative z-10 bg-white shadow-lg cursor-grab active:cursor-grabbing select-none flex flex-col items-center overflow-hidden transition-[background-color] rounded-2xl pb-[4px]',
            !isDragging && !isBroken && 'hover:animate-[hover-wiggle_0.8s_ease-in-out_infinite]',
            isFlashing && 'bg-purple-50',
          )}
          style={{
            minHeight: '380px',
            maskImage: debrisChunks.length > 0 ? `url(#mask-${cardId})` : 'none',
            WebkitMaskImage: debrisChunks.length > 0 ? `url(#mask-${cardId})` : 'none',
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
          }}
        >
        {/* Title — top */}
        <h3 className="font-semibold text-2xl uppercase tracking-tight leading-none text-[#7C3AED] mb-2 mt-5">
          {title}
        </h3>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Subtitles — center of card */}
        {(enSubtitle || subtitle) && (
          <p className="text-sm font-medium text-[#1a1a2e] leading-tight text-center">
            {enSubtitle || subtitle}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Breathing hint */}
        <p
          className="text-sm font-semibold text-[#7C3AED] mb-5"
          style={{ animation: 'breathe 2s ease-in-out infinite' }}
        >
          {t('Drag', '拖拽')}
        </p>

        {/* Damage indicator — centered, no MASK label, at bottom */}
        <div className="flex justify-center text-[10px] font-mono uppercase w-full">
          <span className={cn(crackLevel > 0.7 && 'text-[#7C3AED] font-bold')}>
            {crackLevel > 0 ? `${Math.round(crackLevel * 100)}% ${t('DMG', '损坏')}` : t('INTACT', '完好')}
          </span>
        </div>

        {/* Crack Lines Overlay */}
        <CrackLines level={crackLevel} />

        {/* Purple tint overlay when damaged */}
        {crackLevel > 0.2 && (
          <div
            className="absolute inset-0 bg-[#7C3AED] mix-blend-multiply pointer-events-none"
            style={{ opacity: crackLevel * 0.15 }}
          />
        )}
      </div>
      </ElectricBorder>

      {/* SVG Mask Definitions */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <mask id={`mask-${cardId}`} maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <rect x="0" y="0" width="1" height="1" fill="white" />
            {debrisChunks.map((chunk: DebrisData) => (
              <g key={`hole-${chunk.id}`} transform={`translate(${chunk.x / 100}, ${chunk.y / 100}) rotate(${chunk.rot}) scale(0.003)`}>
                <path d={chunk.path} fill="#7C3AED" />
              </g>
            ))}
          </mask>
        </defs>
      </svg>
    </div>
  )
}
