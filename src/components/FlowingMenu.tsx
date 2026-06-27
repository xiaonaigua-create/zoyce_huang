import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import './FlowingMenu.css'

interface CarouselItem {
  text?: string
  image?: string
  node?: React.ReactNode
}

function MenuItem({ link, text, image, speed, textColor, marqueeBgColor, marqueeTextColor, borderColor, carouselItems }: {
  link: string
  text: string
  image: string
  speed: number
  textColor: string
  marqueeBgColor: string
  marqueeTextColor: string
  borderColor: string
  carouselItems?: CarouselItem[]
}) {
  const itemRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const marqueeInnerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)
  const [repetitions, setRepetitions] = useState(4)

  const animationDefaults = { duration: 0.6, ease: 'expo' as const }

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number) => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0)
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height)
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom'
  }

  const distMetric = (x: number, y: number, x2: number, y2: number) => {
    const xDiff = x - x2
    const yDiff = y - y2
    return xDiff * xDiff + yDiff * yDiff
  }

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee__part')
      if (!marqueeContent) return
      const contentWidth = (marqueeContent as HTMLElement).offsetWidth
      const viewportWidth = window.innerWidth
      const needed = Math.ceil(viewportWidth / contentWidth) + 2
      setRepetitions(Math.max(4, needed))
    }
    calculateRepetitions()
    window.addEventListener('resize', calculateRepetitions)
    return () => window.removeEventListener('resize', calculateRepetitions)
  }, [text, image, carouselItems])

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee__part')
      if (!marqueeContent) return
      const contentWidth = (marqueeContent as HTMLElement).offsetWidth
      if (contentWidth === 0) return
      if (animationRef.current) animationRef.current.kill()
      // Seamless loop: animate one copy width, then snap back (invisible due to duplicate copies)
      const runLoop = () => {
        if (!marqueeInnerRef.current) return
        animationRef.current = gsap.to(marqueeInnerRef.current, {
          x: -contentWidth,
          duration: contentWidth / speed,
          ease: 'none',
          onComplete: () => {
            // Instantly reset to start — seamless because next copy is already in position
            if (marqueeInnerRef.current) {
              gsap.set(marqueeInnerRef.current, { x: 0 })
              runLoop()
            }
          },
        })
      }
      runLoop()
    }
    const timer = setTimeout(setupMarquee, 50)
    return () => {
      clearTimeout(timer)
      if (animationRef.current) animationRef.current.kill()
    }
  }, [text, image, repetitions, speed])

  /* Pause scrolling only when hovering a specific icon */
  const handleIconEnter = () => {
    if (animationRef.current) animationRef.current.pause()
  }

  const handleIconLeave = () => {
    if (animationRef.current) animationRef.current.resume()
  }

  const handleMouseEnter = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const x = ev.clientX - rect.left
    const y = ev.clientY - rect.top
    const edge = findClosestEdge(x, y, rect.width, rect.height)

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0)
  }

  const handleMouseLeave = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const x = ev.clientX - rect.left
    const y = ev.clientY - rect.top
    const edge = findClosestEdge(x, y, rect.width, rect.height)

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
  }

  return (
    <div className="menu__item" ref={itemRef} style={{ borderColor }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        className="menu__item-link"
        href={link}
        style={{ color: textColor }}
        onClick={(e) => e.preventDefault()}
      >
        {text}
      </a>
      <div className="marquee" ref={marqueeRef} style={{ backgroundColor: marqueeBgColor }}>
        <div className="marquee__inner-wrap">
          <div className="marquee__inner" ref={marqueeInnerRef} aria-hidden="true">
            {[...Array(repetitions)].map((_, idx) => (
              <div className="marquee__part" key={idx} style={{ color: marqueeTextColor }}>
                {carouselItems && carouselItems.length > 0 ? (
                  carouselItems.map((item, itemIdx) => (
                    <div key={itemIdx} className="marquee__item-wrapper">
                      {item.node ? (
                        <div className="marquee__icon"
                          onMouseEnter={handleIconEnter}
                          onMouseLeave={handleIconLeave}
                        >{item.node}</div>
                      ) : (
                        <div className="marquee__img marquee__img-small" style={{ backgroundImage: `url(${item.image})` }} />
                      )}
                    </div>
                  ))
                ) : (
                  <>
                    <span>{text}</span>
                    <div className="marquee__img" style={{ backgroundImage: `url(${image})` }} />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface FlowingMenuProps {
  items?: { link: string; text: string; image: string; carouselItems?: CarouselItem[] }[]
  speed?: number
  textColor?: string
  bgColor?: string
  marqueeBgColor?: string
  marqueeTextColor?: string
  borderColor?: string
}

export default function FlowingMenu({
  items = [],
  speed = 15,
  textColor = '#fff',
  bgColor = '#120F17',
  marqueeBgColor = '#fff',
  marqueeTextColor = '#120F17',
  borderColor = '#fff',
}: FlowingMenuProps) {
  return (
    <div className="menu-wrap" style={{ backgroundColor: bgColor }}>
      <nav className="menu">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
          />
        ))}
      </nav>
    </div>
  )
}
