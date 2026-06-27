import FadeIn from './FadeIn'
import TextType from './TextType'
import RotatingText from './RotatingText'
import SlideIn from './SlideIn'
import { MessageCircle, Phone, Mail, Lightbulb } from 'lucide-react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Face3D } from "@/components/ui/face3d";
import { motion, useSpring, useTransform, useInView } from 'framer-motion'
import { cn } from '@/lib/utils';
import { SparklesText } from "@/components/ui/sparkles-text";
import { Confetti } from "@/components/ui/confetti";
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'

const BASE = import.meta.env.BASE_URL

const KEYWORDS_EN = [
  'Growth Strategy',
  'User Operations',
  'Data-Driven',
  'AI Workflow',
  'Product Manager',
  'Recommendation',
  'PRD & Analysis',
  'Figma / Axure',
]

const KEYWORDS_ZH = [
  '增长策略',
  '用户运营',
  '数据驱动',
  'AI 工作流',
  '产品经理',
  '推荐系统',
  'PRD & 分析',
  'Figma / Axure',
]

// ─── Spotlight — 鼠标跟随光圈（ibelick版本） ──────
function Spotlight({ size = 300 }: { size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null)

  const mouseX = useSpring(0, { bounce: 0 })
  const mouseY = useSpring(0, { bounce: 0 })

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`)
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`)

  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement
      if (parent) {
        parent.style.position = 'relative'
        parent.style.overflow = 'hidden'
        setParentElement(parent)
      }
    }
  }, [])

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return
      const { left, top } = parentElement.getBoundingClientRect()
      mouseX.set(event.clientX - left)
      mouseY.set(event.clientY - top)
    },
    [mouseX, mouseY, parentElement]
  )

  useEffect(() => {
    if (!parentElement) return

    parentElement.addEventListener('mousemove', handleMouseMove)
    parentElement.addEventListener('mouseenter', () => setIsHovered(true))
    parentElement.addEventListener('mouseleave', () => setIsHovered(false))

    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove)
      parentElement.removeEventListener('mouseenter', () => setIsHovered(true))
      parentElement.removeEventListener('mouseleave', () => setIsHovered(false))
    }
  }, [parentElement, handleMouseMove])

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_80%)] blur-xl transition-opacity duration-200',
        'from-white via-white to-white/50',
        isHovered ? 'opacity-100' : 'opacity-0',
      )}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
      }}
    />
  )
}

// ─── Pull Cord Switch — 拉绳开关 ──────
function PullCordSwitch({ lightsOn, onToggle }: { lightsOn: boolean; onToggle: () => void }) {
  const { t } = useI18n()
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsPulling(true)
  }

  const handleMouseUp = () => {
    if (isPulling) {
      if (pullDistance > 20) {
        onToggle()
      }
      setIsPulling(false)
      setPullDistance(0)
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPulling) {
      setPullDistance(prev => Math.min(prev + 3, 100))
    }
  }, [isPulling])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <div className="absolute top-0 z-[100] flex flex-col items-center select-none" style={{ right: '174px', left: 'auto' }}>
      {/* 绳子和拉环整体 — 随拉动一起下移，整体可点击 */}
      <motion.div
        className="flex flex-col items-center relative z-10 py-2 px-3"
        animate={{ y: pullDistance * 0.5 }}
        style={{ cursor: isPulling ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
      >
        {/* 绳子主体 — 更长 */}
        <motion.div
          className="w-0.5 bg-white/30 origin-top"
          animate={{
            height: 120 + pullDistance * 0.8,
          }}
        />

        {/* 拉环 + 白色光圈聚焦 — 覆盖在拉环附近 */}
        <div className="relative -mt-1">
          {!lightsOn && (
            <motion.div
              className="absolute inset-0 -m-4 rounded-full pointer-events-none"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.85, 1.25, 0.85],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0) 70%)',
                filter: 'blur(6px)',
              }}
            />
          )}
          <motion.div
            className="w-4 h-4 rounded-full bg-white/50 relative z-10"
          />
        </div>

        {/* 呼吸文案 — 固定高度占位防止开灯后塌陷 */}
        <div className="mt-2" style={{ width: '160px', textAlign: 'center', minHeight: '24px' }}>
          {!lightsOn && (
            <motion.div
              className="text-sm text-white/60 whitespace-nowrap"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
              }}
            >
              {t('Pull to turn on light', '拉下开灯')}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function HeroSection() {
  const [lightsOn, setLightsOn] = useState(false)
  const [confettiActive, setConfettiActive] = useState(false)
  const { locale, t } = useI18n()
  const keywords = locale === 'en' ? KEYWORDS_EN : KEYWORDS_ZH
  const sectionRef = useRef<HTMLElement>(null)
  const isHeroInView = useInView(sectionRef, { margin: '-10% 0px -80% 0px' })

  // 开灯时触发一次彩带
  const handleToggleLight = () => {
    const wasOff = !lightsOn
    setLightsOn(!lightsOn)
    if (wasOff) {
      setConfettiActive(true)
      setTimeout(() => setConfettiActive(false), 100)
    }
  }
  
  // 鼠标位置状态 — 初始在屏幕中心
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center px-4 sm:px-6 md:px-8 pt-16 sm:pt-20 md:pt-24 pb-0 -mt-3 sm:-mt-5 md:-mt-7 min-h-screen"
    >

      {/* ─── 语言切换按钮 — 开灯 + 首页可见时固定显示 ─── */}
      <LanguageSwitcher show={lightsOn && isHeroInView} />

      {/* ─── 彩带特效 — 仅开灯时触发一次 ─── */}
      <Confetti active={confettiActive} count={100} />

      {/* ─── 背景层 ─── */}
      <motion.div
        className="absolute inset-0"
        initial={{ background: '#000000' }}
        animate={{
          background: lightsOn 
            ? '#ffffff' 
            : '#000000'
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* ─── 拉绳开关 ─── */}
      <PullCordSwitch lightsOn={lightsOn} onToggle={handleToggleLight} />

      {/* ─── 3D头像 — 始终可见，不受遮罩影响，在关键词Grid中间 ─── */}
      <motion.div
        className="absolute z-[60] pointer-events-none left-1/2 top-[52%] -translate-x-1/2 -translate-y-[190px]"
        animate={{
          x: lightsOn ? '-50%' : `calc(-50% + ${(mousePos.x - window.innerWidth / 2) * 0.02}px)`,
          y: lightsOn ? -190 : -190 + (mousePos.y - window.innerHeight / 2) * 0.02,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        <div className="w-[340px] h-[460px] md:w-[400px] md:h-[520px] pointer-events-none">
          <Face3D className="w-full h-full" />
        </div>
      </motion.div>

      {/* ─── 内容层 — 灯光关闭时有遮罩效果 ─── */}
      <div 
        className="relative z-20 w-full"
        style={{
          maskImage: lightsOn 
            ? 'none' 
            : `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: lightsOn 
            ? 'none' 
            : `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
        }}
      >
        {/* Hero Heading */}
        <FadeIn delay={0.1} y={30}>
          <h1
            className="font-bold tracking-tight leading-[1.1] text-center w-full relative z-10"
            style={{
              fontSize: 'clamp(2rem, 10vw, 90px)',
            }}
          >
            <SparklesText
              text="Zoyce Huang"
              textColor={lightsOn ? '#7C3AED' : '#ffffff'}
              colors={{ first: '#9E7AFF', second: '#FE8BBB' }}
              sparklesCount={8}
            />
          </h1>
        </FadeIn>

        {/* Subtitle */}
        <FadeIn delay={0.25} y={20}>
          <div className="relative z-10 w-full">
            {/* 副标题容器 - 居中 */}
            <div className="text-center">
              <TextType
                as="p"
                className={`${lightsOn ? "text-[#1a1a2e]/70" : "text-white/70"} font-light leading-relaxed mt-4`}
                style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)' }}
                text={t('3-year-experienced Product Manager focused on data-driven growth & premium user experience', '3年经验产品经理，专注数据驱动增长与用户体验')}
                typingSpeed={30}
                startOnVisible
                showCursor
                cursorCharacter="|"
                loop={false}
              />
            </div>
            
            {/* Contact — 副标题下右侧 */}
            <FadeIn delay={1.8} y={15}>
              <div className="flex justify-end gap-3 mt-3 z-50" style={{ transform: 'translateX(-320px)' }}>
                {/* WeChat */}
                <div className="group relative flex items-center justify-center w-9 h-9 rounded-full border bg-white/10 backdrop-blur-sm text-[#7C3AED] hover:text-white hover:bg-[#7C3AED] transition-all duration-300 cursor-pointer" aria-label="WeChat">
                  <MessageCircle size={16} strokeWidth={1.8} />
                  <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium text-[#4a1d95] bg-white border border-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-auto z-[200] shadow-sm">
                    ZoyceHuang
                  </span>
                </div>
                {/* Phone */}
                <div className="group relative flex items-center justify-center w-9 h-9 rounded-full border bg-white/10 backdrop-blur-sm text-[#7C3AED] hover:text-white hover:bg-[#7C3AED] transition-all duration-300 cursor-pointer" aria-label="Phone">
                  <Phone size={16} strokeWidth={1.8} />
                  <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium text-[#4a1d95] bg-white border border-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-auto z-[200] shadow-sm">
                    15995849309
                  </span>
                </div>
                {/* Email */}
                <div className="group relative flex items-center justify-center w-9 h-9 rounded-full border bg-white/10 backdrop-blur-sm text-[#7C3AED] hover:text-white hover:bg-[#7C3AED] transition-all duration-300 cursor-pointer" aria-label="Email">
                  <Mail size={16} strokeWidth={1.8} />
                  <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium text-[#4a1d95] bg-white border border-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-auto z-[200] shadow-sm">
                    1351903351@qq.com
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </FadeIn>

        {/* Avatar + Keywords Row — Grid: left(1fr) | center(3D) | right(1fr) */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center w-full max-w-[1200px] -mt-[82px] relative z-20 mx-auto pointer-events-none">
          {/* Left Keywords — right-aligned */}
          <SlideIn direction="left" distance={200} delay={0.5} duration={2}>
            <div className="flex flex-col gap-6 justify-center items-end pr-8 min-h-[200px]">
              <RotatingText
                texts={locale === 'en' ? ['Growth Strategy', 'User Operations', 'Product Manager'] : ['增长策略', '用户运营', '产品经理']}
                mainClassName={`px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border ${lightsOn ? 'bg-white/40 text-[#7C3AED] border-[#7C3AED]/30' : 'bg-white/10 text-white/80 border-white/20'}`}
                splitLevelClassName="overflow-hidden pb-0.5"
                staggerFrom="first"
                rotationInterval={18000}
                initialDelay={4000}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />
              <RotatingText
                texts={locale === 'en' ? ['INFJ', 'Divergent Thinking', 'Investigative Personality'] : ['INFJ', '发散思维', '研究型人格']}
                mainClassName={`px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border ${lightsOn ? 'bg-white/40 text-[#7C3AED] border-[#7C3AED]/30' : 'bg-white/10 text-white/80 border-white/20'}`}
                splitLevelClassName="overflow-hidden pb-0.5"
                staggerFrom="first"
                rotationInterval={22000}
                initialDelay={7000}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />
              <RotatingText
                texts={locale === 'en' ? ['Data-Driven', 'Root-Cause Analytical', 'Evidence-Based'] : ['数据驱动', '根因分析', '实证导向']}
                mainClassName={`px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border ${lightsOn ? 'bg-white/40 text-[#7C3AED] border-[#7C3AED]/30' : 'bg-white/10 text-white/80 border-white/20'}`}
                splitLevelClassName="overflow-hidden pb-0.5"
                staggerFrom="first"
                rotationInterval={25000}
                initialDelay={10000}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />
            </div>
          </SlideIn>

          {/* Center — 空占位符（3D头像在遮罩层外） */}
          <div className="w-[340px] h-[460px] md:w-[400px] md:h-[520px] pointer-events-none" />

          {/* Right Keywords — left-aligned */}
          <SlideIn direction="right" distance={200} delay={0.5} duration={2}>
            <div className="flex flex-col gap-6 justify-center items-start pl-8 min-h-[200px]">
              <RotatingText
                texts={locale === 'en' ? ['Intermittent Humor', 'Keep Smiling', 'Enjoy Life'] : ['间歇性幽默', '保持微笑', '享受生活']}
                mainClassName={`px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border ${lightsOn ? 'bg-white/40 text-[#7C3AED] border-[#7C3AED]/30' : 'bg-white/10 text-white/80 border-white/20'}`}
                splitLevelClassName="overflow-hidden pb-0.5"
                staggerFrom="last"
                rotationInterval={23000}
                initialDelay={13000}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />
              <RotatingText
                texts={locale === 'en' ? ['Outdoor Sports', 'DIY Enthusiast', 'Gaming Addict'] : ['户外运动', 'DIY爱好者', '游戏达人']}
                mainClassName={`px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border ${lightsOn ? 'bg-white/40 text-[#7C3AED] border-[#7C3AED]/30' : 'bg-white/10 text-white/80 border-white/20'}`}
                splitLevelClassName="overflow-hidden pb-0.5"
                staggerFrom="last"
                rotationInterval={25000}
                initialDelay={15000}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />
              <RotatingText
                texts={locale === 'en' ? ['PRD', 'Figma', 'AB Testing'] : ['PRD', 'Figma', 'A/B测试']}
                mainClassName={`px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border ${lightsOn ? 'bg-white/40 text-[#7C3AED] border-[#7C3AED]/30' : 'bg-white/10 text-white/80 border-white/20'}`}
                splitLevelClassName="overflow-hidden pb-0.5"
                staggerFrom="last"
                rotationInterval={27000}
                initialDelay={17000}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />
            </div>
          </SlideIn>
        </div>

        {/* Mobile Keywords — single column */}
        <div className="md:hidden flex flex-col items-center gap-4 mt-24">
          <RotatingText
            texts={keywords}
            mainClassName={`px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm ${lightsOn ? 'bg-white/40 text-[#4a1d96]' : 'bg-white/10 text-white/80'}`}
            staggerFrom="first"
            rotationInterval={25000}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
          />
        </div>
      </div>

      {/* ─── 灯光关闭时的白色光圈 ─── */}
      {!lightsOn && (
        <div className="absolute inset-0 pointer-events-none z-[15]">
          <Spotlight size={350} />
        </div>
      )}
    </section>
  )
}
