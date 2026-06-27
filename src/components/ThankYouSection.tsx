import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import FadeIn from './FadeIn'
import TextType from './TextType'
import { SparklesText } from '@/components/ui/sparkles-text'
import ShinyText from './ShinyText'
import { Balloons } from '@/components/ui/balloons'
import { useI18n } from '@/lib/i18n'

export default function ThankYouSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const balloonsRef = useRef<{ launchAnimation: () => void } | null>(null)
  // 当联系方式区域进入视口时才触发气球
  const isContactInView = useInView(contactRef, { once: true, margin: '-50px' })
  const hasLaunched = useRef(false)
  const { t } = useI18n()

  // Launch balloons when contact area scrolls into view (once)
  useEffect(() => {
    if (isContactInView && !hasLaunched.current && balloonsRef.current) {
      hasLaunched.current = true
      const timer = setTimeout(() => {
        // Launch 2 batches for balanced coverage (~28 balloons total)
        balloonsRef.current?.launchAnimation()
        setTimeout(() => balloonsRef.current?.launchAnimation(), 300)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isContactInView])

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center min-h-[100vh] px-4 sm:px-6 md:px-8 py-28 sm:py-36 overflow-visible"
      style={{
        background: '#ffffff',
      }}
    >
      {/* ─── Balloons container (fixed by balloons-js internally) ─── */}
      <Balloons ref={balloonsRef} type="default" className="absolute inset-0 z-10" />

      {/* ─── Content ─── */}
      <div className="relative z-20 text-center max-w-3xl mx-auto flex flex-col items-center min-h-[60vh]">
        {/* Main heading */}
        <FadeIn delay={0} y={20}>
          <h2
            className="hero-heading font-bold tracking-tight leading-none text-center -mt-8"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 80px)' }}
          >
            <SparklesText colors={{ first: '#9E7AFF', second: '#FE8BBB' }}>
              <ShinyText
                text={t('Appreciate You', '感谢有你')}
                speed={4}
                delay={0}
                color="#7C3AED"
                shineColor="#ffffff"
                spread={120}
                direction="left"
                once
              />
            </SparklesText>
          </h2>
        </FadeIn>

        {/* Subtitle — typing effect */}
        <FadeIn delay={0.3} y={20}>
          <p
            className="text-[#4a1d96]/70 font-light leading-relaxed mt-6"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          >
            <TextType
              as="span"
              text={t('Thanks for getting to know me.', '感谢你来了解我。')}
              typingSpeed={40}
              startOnVisible
              showCursor
              cursorCharacter="|"
              loop={false}
              className="inline"
            />
          </p>
        </FadeIn>

        {/* 弹性占位 — 把联系方式推到底部 */}
        <div className="flex-1" />

        {/* CTA / Contact hint — 固定在页面最底部 */}
        <FadeIn delay={0.8} y={20} style={{ marginTop: 'calc(200px + 15vh)' }}>
          <motion.div
            ref={contactRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isContactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
            className="w-full"
          >
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {/* Phone */}
              <motion.a
                href="tel:15995849309"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 rounded-full border border-[#7C3AED]/30 bg-white text-[#7C3AED] text-sm font-medium hover:border-[#7C3AED]/60 hover:bg-[#7C3AED]/10 transition-all duration-300 shadow-lg"
              >
                📞 15995849309
              </motion.a>

              {/* Email */}
              <motion.a
                href="mailto:1351903351@qq.com"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 rounded-full border border-[#7C3AED]/30 bg-white text-[#7C3AED] text-sm font-medium hover:border-[#7C3AED]/60 hover:bg-[#7C3AED]/10 transition-all duration-300 shadow-lg"
              >
                ✉️ 1351903351@qq.com
              </motion.a>

              {/* WeChat */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 rounded-full border border-[#7C3AED]/30 bg-white text-[#7C3AED] text-sm font-medium hover:border-[#7C3AED]/60 hover:bg-[#7C3AED]/10 transition-all duration-300 cursor-default shadow-lg"
              >
                💬 ZoyceHuang
              </motion.div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  )
}
