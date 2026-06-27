import { useEffect, useRef } from 'react'

interface FogOverlayProps {
  color?: string
}

export function FogOverlay({ color = '#e8e4f0' }: FogOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    let w = 0, h = 0
    let imageData: ImageData | null = null

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect()
      w = canvas.width = Math.floor(rect.width)
      h = canvas.height = Math.floor(rect.height)
      // Fill with fog
      ctx.fillStyle = color
      ctx.fillRect(0, 0, w, h)
      // Add noise texture for fog look
      for (let i = 0; i < w * h * 0.15; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        const alpha = 0.1 + Math.random() * 0.2
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.fillRect(x, y, 2 + Math.random() * 3, 2 + Math.random() * 3)
      }
      imageData = ctx.getImageData(0, 0, w, h)
    }

    resize()

    const brushRadius = 35

    const erase = (x: number, y: number) => {
      if (!imageData) return
      const data = imageData.data
      // Clear circular area around cursor (make transparent)
      for (let dy = -brushRadius; dy <= brushRadius; dy++) {
        for (let dx = -brushRadius; dx <= brushRadius; dx++) {
          if (dx * dx + dy * dy <= brushRadius * brushRadius) {
            const px = Math.floor(x + dx)
            const py = Math.floor(y + dy)
            if (px >= 0 && px < w && py >= 0 && py < h) {
              const idx = (py * w + px) * 4
              data[idx + 3] = 0 // alpha = 0
            }
          }
        }
      }
      ctx.putImageData(imageData, 0, 0)
    }

    let lastX = 0, lastY = 0
    let isDrawing = false

    const handleMove = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      if (isDrawing && lastX && lastY) {
        // Interpolate between points for smooth erasing
        const dist = Math.sqrt((x - lastX) ** 2 + (y - lastY) ** 2)
        const steps = Math.max(1, Math.ceil(dist / 5))
        for (let i = 1; i <= steps; i++) {
          const t = i / steps
          erase(lastX + (x - lastX) * t, lastY + (y - lastY) * t)
        }
      }

      lastX = x
      lastY = y
    }

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDrawing = true
      const rect = canvas.getBoundingClientRect()
      if ('touches' in e && e.touches[0]) {
        lastX = e.touches[0].clientX - rect.left
        lastY = e.touches[0].clientY - rect.top
      } else {
        lastX = (e as MouseEvent).clientX - rect.left
        lastY = (e as MouseEvent).clientY - rect.top
      }
      erase(lastX, lastY)
    }

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return
      if ('touches' in e && e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      } else {
        handleMove((e as MouseEvent).clientX, (e as MouseEvent).clientY)
      }
    }

    const onUp = () => { isDrawing = false }

    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    canvas.addEventListener('touchstart', onDown, { passive: false })
    canvas.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
    window.addEventListener('resize', resize)

    return () => {
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('touchstart', onDown)
      canvas.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
      window.removeEventListener('resize', resize)
    }
  }, [color])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10"
        style={{ touchAction: 'none', mixBlendMode: 'multiply' }}
      />
      {/* Hint */}
      <div className="absolute bottom-3 left-0 right-0 text-center z-20 pointer-events-none select-none">
        <span className="inline-block text-[10px] sm:text-xs text-[#7C3AED]/50 font-medium px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm border border-[#7C3AED]/10">
          👆 Wipe to reveal
        </span>
      </div>
    </>
  )
}
