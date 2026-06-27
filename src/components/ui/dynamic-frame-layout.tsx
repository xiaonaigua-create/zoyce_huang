import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Frame {
  id: number
  video?: string
  image?: string
  title?: string
  desc?: string
  defaultPos: { x: number; y: number; w: number; h: number }
  corner?: string
  edgeHorizontal?: string
  edgeVertical?: string
  mediaSize?: number
  borderThickness?: number
  borderSize?: number
  /** 渐变背景，用于无媒体纯文字格 */
  bg?: string
  /** 纯文字格：hover时文字不消散 */
  isTextOnly?: boolean
  /** 图片/视频裁切位置，如 'right center' 'center top' */
  objectPosition?: string
}

interface FrameComponentProps {
  video?: string
  image?: string
  title?: string
  desc?: string
  width: number | string
  height: number | string
  className?: string
  corner?: string
  edgeHorizontal?: string
  edgeVertical?: string
  mediaSize?: number
  borderThickness?: number
  borderSize?: number
  showFrame?: boolean
  isHovered?: boolean
  /** 渐变背景，用于无媒体纯文字格 */
  bg?: string
  /** 纯文字格：hover时文字不消散 */
  isTextOnly?: boolean
  /** 图片/视频裁切位置 */
  objectPosition?: string
}

/** 四角 + 四边装饰层，独立组件避免嵌套 Fragment 解析问题 */
function FrameDecoration({
  corner,
  edgeHorizontal,
  edgeVertical,
}: {
  corner?: string
  edgeHorizontal?: string
  edgeVertical?: string
}) {
  if (!corner) return null

  return (
    <div className="absolute inset-0" style={{ zIndex: 2 }}>
      <div className="absolute top-0 left-0 w-16 h-16 bg-contain bg-no-repeat" style={{ backgroundImage: `url(${corner})` }} />
      <div className="absolute top-0 right-0 w-16 h-16 bg-contain bg-no-repeat" style={{ backgroundImage: `url(${corner})`, transform: "scaleX(-1)" }} />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-contain bg-no-repeat" style={{ backgroundImage: `url(${corner})`, transform: "scaleY(-1)" }} />
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-contain bg-no-repeat" style={{ backgroundImage: `url(${corner})`, transform: "scale(-1, -1)" }} />

      {edgeHorizontal && (
        <>
          <div className="absolute top-0 left-16 right-16 h-16" style={{ backgroundImage: `url(${edgeHorizontal})`, backgroundSize: "auto 64px", backgroundRepeat: "repeat-x" }} />
          <div className="absolute bottom-0 left-16 right-16 h-16" style={{ backgroundImage: `url(${edgeHorizontal})`, backgroundSize: "auto 64px", backgroundRepeat: "repeat-x", transform: "rotate(180deg)" }} />
        </>
      )}

      {edgeVertical && (
        <>
          <div className="absolute left-0 top-16 bottom-16 w-16" style={{ backgroundImage: `url(${edgeVertical})`, backgroundSize: "64px auto", backgroundRepeat: "repeat-y" }} />
          <div className="absolute right-0 top-16 bottom-16 w-16" style={{ backgroundImage: `url(${edgeVertical})`, backgroundSize: "64px auto", backgroundRepeat: "repeat-y", transform: "scaleX(-1)" }} />
        </>
      )}
    </div>
  )
}

function FrameComponent({
  video,
  image,
  title,
  desc,
  width,
  height,
  className = "",
  corner,
  edgeHorizontal,
  edgeVertical,
  mediaSize = 1,
  borderThickness = 8,
  borderSize = 92,
  showFrame = false,
  isHovered = false,
  bg,
  isTextOnly = false,
  objectPosition,
}: FrameComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isHovered) {
      videoRef.current?.play()
    } else {
      videoRef.current?.pause()
    }
  }, [isHovered])

  return (
    <div
      className={`relative ${className}`}
      style={{
        width,
        height,
        transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
      }}
    >
      <div className="relative w-full h-full overflow-hidden">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            zIndex: 1,
            transition: "all 0.3s ease-in-out",
            padding: showFrame ? `${borderThickness}px` : "0",
            width: showFrame ? `${borderSize}%` : "100%",
            height: showFrame ? `${borderSize}%` : "100%",
            left: showFrame ? `${(100 - borderSize) / 2}%` : "0",
            top: showFrame ? `${(100 - borderSize) / 2}%` : "0",
          }}
        >
          <div
            className="w-full h-full overflow-hidden"
            style={{
              transform: `scale(${mediaSize})`,
              transformOrigin: "center",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            {image ? (
              <img
                className="w-full h-full object-cover"
                src={image}
                alt=""
                draggable={false}
                style={objectPosition ? { objectPosition } : undefined}
              />
            ) : video ? (
              <video
                className="w-full h-full object-cover"
                src={video}
                loop
                muted
                playsInline
                ref={videoRef}
                style={objectPosition ? { objectPosition } : undefined}
              />
            ) : bg ? (
              <div className="w-full h-full" style={{ background: bg }} />
            ) : null}
          </div>
        </div>

        {/* 文字层 — 默认显示，hover时消散退场露出媒体；isTextOnly则始终显示 */}
        {(title || desc) && (
          <motion.div
            className="absolute inset-0 z-[10] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md p-6"
            initial={{ opacity: 1 }}
            animate={isTextOnly ? { opacity: 1, scale: 1 } : isHovered ? { opacity: 0, scale: 1.15 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              animate={isTextOnly ? { y: 0, opacity: 1 } : isHovered ? { y: -30, opacity: 0 } : { y: 0, opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeIn" }}
            >
              {title && (
                <motion.h3
                  className="text-[#1a1a2e] text-base sm:text-xl font-bold text-center leading-tight mb-3"
                >
                  {title}
                </motion.h3>
              )}
              {desc && (
                <motion.p
                  className="text-[#1a1a2e]/60 text-xs sm:text-sm text-center leading-relaxed max-w-[220px]"
                >
                  {desc}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}

        {showFrame && (
          <FrameDecoration corner={corner} edgeHorizontal={edgeHorizontal} edgeVertical={edgeVertical} />
        )}
      </div>
    </div>
  )
}

interface DynamicFrameLayoutProps {
  frames: Frame[]
  className?: string
  style?: React.CSSProperties
  showFrames?: boolean
  hoverSize?: number
  gapSize?: number
  cols?: number
  rows?: number
}

export function DynamicFrameLayout({
  frames: initialFrames,
  className,
  style,
  showFrames = false,
  hoverSize = 5,
  gapSize = 4,
  cols = 3,
  rows = 2,
}: DynamicFrameLayoutProps) {
  const [frames] = useState<Frame[]>(initialFrames)
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null)

  const totalFr = 12
  const nonHoveredSize = (totalFr - hoverSize) / (cols === 3 ? 2 : rows === 2 ? 1 : 2)

  const getRowSizes = () => {
    if (hovered === null) return Array(rows).fill(`${totalFr / rows}fr`).join(" ")
    const { row } = hovered
    return Array(rows)
      .fill(null)
      .map((_, r) => (r === row ? `${hoverSize}fr` : `${nonHoveredSize}fr`))
      .join(" ")
  }

  const getColSizes = () => {
    if (hovered === null) return Array(cols).fill(`${totalFr / cols}fr`).join(" ")
    const { col } = hovered
    return Array(cols)
      .fill(null)
      .map((_, c) => (c === col ? `${hoverSize}fr` : `${nonHoveredSize}fr`))
      .join(" ")
  }

  const getTransformOrigin = (x: number, y: number) => {
    const vertical = y <= rows / 2 ? "top" : "bottom"
    const horizontal = x <= cols / 2 ? "left" : "right"
    return `${vertical} ${horizontal}`
  }

  return (
    <div
      className={`relative w-full ${className}`}
      style={{
        display: "grid",
        gridTemplateRows: getRowSizes(),
        gridTemplateColumns: getColSizes(),
        gap: `${gapSize}px`,
        transition: "grid-template-rows 0.4s ease, grid-template-columns 0.4s ease",
        ...style,
      }}
    >
      {frames.map((frame) => {
        const unitX = totalFr / cols
        const unitY = totalFr / rows
        const col = Math.round(frame.defaultPos.x / unitX)
        const row = Math.round(frame.defaultPos.y / unitY)
        const transformOrigin = getTransformOrigin(frame.defaultPos.x, frame.defaultPos.y)

        return (
          <motion.div
            key={frame.id}
            className="relative"
            style={{
              transformOrigin,
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={() => setHovered({ row, col })}
            onMouseLeave={() => setHovered(null)}
          >
            <FrameComponent
              video={frame.video}
              image={frame.image}
              title={frame.title}
              desc={frame.desc}
              width="100%"
              height="100%"
              className="absolute inset-0"
              corner={frame.corner}
              edgeHorizontal={frame.edgeHorizontal}
              edgeVertical={frame.edgeVertical}
              mediaSize={frame.mediaSize ?? 1}
              borderThickness={frame.borderThickness ?? 8}
              borderSize={frame.borderSize ?? 92}
              showFrame={showFrames}
              isHovered={hovered?.row === row && hovered?.col === col}
              bg={frame.bg}
              isTextOnly={frame.isTextOnly}
              objectPosition={frame.objectPosition}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
