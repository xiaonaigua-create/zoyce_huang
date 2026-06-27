import { useEffect, useRef, useState } from 'react'

export function TearableCloth({ color = '#7C3AED', onTorn }: { color?: string; onTorn?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [torn, setTorn] = useState(false)

  useEffect(() => {
    if (torn) return
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    // ── Tearable-Cloth.js 核心逻辑 (原始代码移植) ──
    const accuracy = 5
    const gravity = 300
    const clothY = 28
    const clothX = 54
    const spacing = 8
    const tearDist = 70
    const friction = 0.995
    const bounce = 0.55

    let W = Math.floor(wrapper.clientWidth || window.innerWidth)
    let H = Math.floor(wrapper.clientHeight || 600)
    if (W < 100) W = window.innerWidth
    if (H < 200) H = 600
    canvas.width = W
    canvas.height = H

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5

    // Point class
    class Point {
      x: number; y: number; px: number; py: number
      vx: number = 0; vy: number = 0
      pinX: number | null = null; pinY: number | null = null
      constraints: any[] = []
      constructor(x: number, y: number) { this.x = x; this.y = y; this.px = x; this.py = y }
      update(delta: number) {
        if (this.pinX !== null) return this
        const m = mouse
        if (m.down) {
          const dx = this.x - m.x, dy = this.y - m.y, dist = Math.sqrt(dx * dx + dy * dy)
          if (m.button === 1 && dist < m.influence) { this.px = this.x - (m.x - m.px); this.py = this.y - (m.y - m.py) }
          else if (dist < m.cut) { this.constraints = []; tornCount++ }
        }
        this.addForce(0, gravity)
        let nx = this.x + (this.x - this.px) * friction + this.vx * delta
        let ny = this.y + (this.y - this.py) * friction + this.vy * delta
        this.px = this.x; this.py = this.y; this.x = nx; this.y = ny; this.vx = 0; this.vy = 0
        if (this.x > W) { this.px = W + (W - this.px) * bounce; this.x = W } else if (this.x < 0) { this.px *= -bounce; this.x = 0 }
        if (this.y > H) { this.py = H + (H - this.py) * bounce; this.y = H } else if (this.y < 0) { this.py *= -bounce; this.y = 0 }

        return this
      }
      draw() { for (let i = this.constraints.length - 1; i >= 0; i--) this.constraints[i].draw() }
      resolve() { if (this.pinX !== null) { this.x = this.pinX; this.y = this.pinY; return } for (const c of this.constraints) c.resolve() }
      attach(p: Point) { this.constraints.push(new Constraint(this, p)) }
      free(c: any) { const i = this.constraints.indexOf(c); if (i >= 0) this.constraints.splice(i, 1) }
      addForce(x: number, y: number) { this.vx += x; this.vy += y }
      pin(px: number, py: number) { this.pinX = px; this.pinY = py }
    }

    // Constraint class
    class Constraint {
      constructor(public p1: Point, public p2: Point, public length: number) {}
      resolve() {
        const dx = this.p1.x - this.p2.x, dy = this.p1.y - this.p2.y, dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < this.length) return
        if (dist > tearDist) this.p1.free(this)
        const diff = (this.length - dist) / dist * 0.5 * (1 - this.length / dist)
        const px = dx * diff, py = dy * diff
        if (!this.p1.pinX) { this.p1.x += px; this.p1.y += py }
        if (!this.p2.pinX) { this.p2.x -= px; this.p2.y -= py }
      }
      draw() { ctx.moveTo(this.p1.x, this.p1.y); ctx.lineTo(this.p2.x, this.p2.y) }
    }

    // Mouse state
    const mouse = { cut: 20, influence: 35, down: false, button: 1, x: 0, y: 0, px: 0, py: 0 }
    let tornCount = 0

    // Build cloth grid — pinned at top row
    const points: Point[] = []
    const startX = W / 2 - (clothX * spacing) / 2
    for (let y = 0; y <= clothY; y++) {
      for (let x = 0; x <= clothX; x++) {
        const pt = new Point(startX + x * spacing, 10 + y * spacing)
        if (y === 0) pt.pin(pt.x, pt.y)
        if (x !== 0) pt.attach(points[points.length - 1])
        if (y !== 0) pt.attach(points[x + (y - 1) * (clothX + 1)])
        points.push(pt)
      }
    }

    let animId = 0

    const update = () => {
      ctx.clearRect(0, 0, W, H)

      // Solid background
      ctx.fillStyle = color
      ctx.fillRect(0, 0, W, H)

      // Physics iterations
      for (let i = 0; i < accuracy; i++) {
        for (const pt of points) pt.resolve()
      }

      // Update & draw lines
      ctx.beginPath()
      for (const pt of points) {
        pt.update(0.016).draw()
      }
      ctx.stroke()

      // Auto dismiss when enough torn
      if (tornCount > 8) {
        setTorn(true)
        onTorn?.()
        return
      }

      animId = requestAnimationFrame(update)
    }

    const setMouse = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.px = mouse.x; mouse.py = mouse.y
      if ('touches' in e && e.touches[0]) {
        mouse.x = e.touches[0].clientX - rect.left
        mouse.y = e.touches[0].clientY - rect.top
      } else {
        mouse.x = (e as MouseEvent).clientX - rect.left
        mouse.y = (e as MouseEvent).clientY - rect.top
      }
    }

    const onDown = (e: Event) => {
      e.preventDefault()
      mouse.down = true
      mouse.button = 'button' in e ? (e as MouseEvent).which : 1
      setMouse(e as any)
    }
    const onMove = (e: Event) => setMouse(e as any)
    const onUp = () => { mouse.down = false }

    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    canvas.addEventListener('touchstart', onDown, { passive: false })
    canvas.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
    canvas.oncontextmenu = (e: Event) => e.preventDefault()

    update()

    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('touchstart', onDown)
      canvas.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [torn, color])

  if (torn) return null

  return (
    <div ref={wrapperRef} className="absolute inset-0 w-full h-full z-20 overflow-hidden" style={{ minHeight: '70vh' }}>
      <div className="absolute top-6 left-0 right-0 text-center z-30 pointer-events-none select-none">
        <span className="inline-block text-white/90 text-sm font-bold px-5 py-2 rounded-full bg-black/25 backdrop-blur-md animate-pulse border border-white/15 shadow-lg">
          ✋ Drag to tear · Right-click to slice →
        </span>
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block cursor-crosshair" style={{ touchAction: 'none' }} />
    </div>
  )
}
