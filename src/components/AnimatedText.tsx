import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
}

export default function AnimatedText({ text, className = '', style }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  })

  const words = text.split('')

  return (
    <p ref={containerRef} className={`relative ${className}`} style={style}>
      {words.map((char, i) => {
        if (char === ' ') {
          return <span key={`space-${i}`}>&nbsp;</span>
        }
        const start = i / words.length
        const end = Math.min(start + 1 / words.length, 1)
        return (
          <span key={i} className="relative inline-block" aria-hidden="true">
            <span className="invisible">{char}</span>
            <motion.span
              className="absolute inset-0"
              style={{ opacity: useTransform(scrollYProgress, [start, end], [0.2, 1]) }}
            >
              {char}
            </motion.span>
          </span>
        )
      })}
    </p>
  )
}
