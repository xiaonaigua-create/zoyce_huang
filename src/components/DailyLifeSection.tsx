import { useState, useCallback } from 'react'
import FadeIn from './FadeIn'
import TextType from './TextType'
import ShinyText from './ShinyText'
import { SparklesText } from '@/components/ui/sparkles-text'
import { DamageMask } from '@/components/ui/damage-mask'
import { VerticalImageStack } from '@/components/ui/vertical-image-stack'
import { useI18n } from '@/lib/i18n'

const BASE = import.meta.env.BASE_URL

const DAILY_ITEMS_EN = [
  {
    title: 'Photography',
    subtitle: '用镜头记录人生',
    enSubtitle: 'Capture Life Through The Lens',
    icon: '📷',
    images: [
      `${BASE}摄影1.jpg`,
      `${BASE}摄影2.jpg`,
      `${BASE}摄影3.JPG`,
    ],
  },
  {
    title: 'Doodling',
    subtitle: '拥有更健康的前额叶',
    enSubtitle: 'Manual Labor For A Stronger Prefrontal Cortex',
    icon: '✏️',
    images: [
      `${BASE}爱好1.jpeg`,
      `${BASE}爱好2.jpg`,
    ],
  },
  {
    title: 'Travel',
    subtitle: '用脚步丈量世界',
    enSubtitle: 'Measure The World With Your Footsteps',
    icon: '✈️',
    images: [
      `${BASE}旅游1.jpeg`,
      `${BASE}旅游2.jpeg`,
      `${BASE}旅游3.jpeg`,
    ],
  },
  {
    title: 'Fitness',
    subtitle: '享受阳光、空气和内啡肽',
    enSubtitle: 'Enjoy Sunshine, Air And Endorphins',
    icon: '💪',
    images: [
      `${BASE}运动1.jpeg`,
      `${BASE}运动2.jpeg`,
      `${BASE}运动3.jpeg`,
      `${BASE}运动4.jpeg`,
      `${BASE}运动5.jpeg`,
      `${BASE}运动6.jpeg`,
      `${BASE}运动7.jpeg`,
      `${BASE}运动8.jpeg`,
    ],
  },
]

const DAILY_ITEMS_ZH = [
  { ...DAILY_ITEMS_EN[0], title: '摄影' },
  { ...DAILY_ITEMS_EN[1], title: '涂鸦' },
  { ...DAILY_ITEMS_EN[2], title: '旅行' },
  { ...DAILY_ITEMS_EN[3], title: '健身' },
]

/** Single category card — damage mask → vertical photo stack */
function CategoryCard({
  item,
  index,
  locale,
}: {
  item: typeof DAILY_ITEMS[0]
  index: number
  locale: 'en' | 'zh'
}) {
  const [revealed, setRevealed] = useState(false)

  const handleReveal = useCallback(() => {
    setRevealed(true)
  }, [])

  return (
    <FadeIn delay={Math.min(0.4, index * 0.08)} y={20}>
      <div className="relative w-full flex flex-col items-center" style={{ height: '420px' }}>
        {/* ── DamageMask (初始状态，打碎后消失) ── */}
        {!revealed && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div style={{ width: '180px', height: '380px' }}>
              <DamageMask
                onReveal={handleReveal}
                title={item.title}
                subtitle={locale === 'zh' ? item.subtitle : undefined}
                enSubtitle={locale === 'en' ? item.enSubtitle : undefined}
              />
            </div>
          </div>
        )}

        {/* ── VerticalImageStack (始终在下方，遮罩消失后直接展示) ── */}
        <div className="flex items-center justify-center" style={{ width: '180px', height: '380px', marginTop: revealed ? '0' : '20px' }}>
          <VerticalImageStack
            images={item.images.map((src, i) => ({
              id: i,
              src,
              alt: `${item.title}-${i}`,
            }))}
          />
        </div>
      </div>
    </FadeIn>
  )
}

export default function DailyLifeSection() {
  const { locale, t } = useI18n()
  const dailyItems = locale === 'en' ? DAILY_ITEMS_EN : DAILY_ITEMS_ZH
  return (
    <section className="bg-[#FAFBFC] px-5 sm:px-8 md:px-10 pt-10 sm:pt-12 md:pt-14 pb-8 sm:pb-10 md:pb-12 -mt-[30px]">
      <FadeIn delay={0} y={30}>
        <h2
          className="hero-heading font-bold tracking-tight leading-[1] text-center -mt-5 px-4"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 80px)', paddingBottom: '0.15em' }}
        >
          <SparklesText colors={{ first: '#9E7AFF', second: '#FE8BBB' }}>
            <ShinyText text={t('Daily Life', '日常生活')} speed={3} delay={3} color="#7C3AED" shineColor="#ffffff" spread={90} direction="left" once />
          </SparklesText>
        </h2>
      </FadeIn>
      <FadeIn delay={0.1} y={20}>
        <div className="mx-auto text-center" style={{ maxWidth: '1000px' }}>
          <TextType
            as="p"
            className="text-[#1a1a2e]/55 font-light text-center leading-relaxed mt-4 mb-8 sm:mb-10"
            style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)' }}
            text={t('Beyond work — the moments that keep me inspired and grounded.', '工作之外，那些不一样的我！')}
            typingSpeed={30}
            startOnVisible
            showCursor
            cursorCharacter="|"
            loop={false}
          />
        </div>
      </FadeIn>

      {/* 4 Damage Panels in one row → VerticalImageStack */}
      <div className="max-w-[1000px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4">
          {dailyItems.map((item, i) => (
            <CategoryCard key={item.title} item={item} index={i} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  )
}
