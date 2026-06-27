import { useMemo } from 'react'
import FadeIn from './FadeIn'
import { DynamicFrameLayout } from '@/components/ui/dynamic-frame-layout'
import { useI18n } from '@/lib/i18n'

const BASE = import.meta.env.BASE_URL

export default function LootSection() {
  const { t, locale } = useI18n()

  const LOOT_FRAMES = useMemo(() => [
    {
      id: 1,
      image: `${BASE}GIF_20260627202829406.GIF`,
      title: locale === 'en' ? 'Swipe through pages & explore book content' : '用手势翻页、查看书籍内容',
      defaultPos: { x: 0, y: 0, w: 4, h: 4 },
      objectPosition: 'right center',
    },
    {
      id: 2,
      image: `${BASE}GIF_20260627203048863.GIF`,
      title: locale === 'en' ? '"Flower Picker"' : '"沾花惹草"',
      defaultPos: { x: 4, y: 0, w: 4, h: 4 },
    },
    {
      id: 3,
      image: `${BASE}GIF_20260627203236220.GIF`,
      title: locale === 'en' ? 'The World Runs on Code' : '原来世界的底层真的是代码',
      defaultPos: { x: 8, y: 0, w: 4, h: 4 },
    },
    {
      id: 4,
      image: `${BASE}GIF_20260627203357310.GIF`,
      title: locale === 'en' ? 'Shake for a Fortune' : '摇一摇，求一签',
      defaultPos: { x: 0, y: 6, w: 4, h: 4 },
    },
    {
      id: 5,
      image: `${BASE}GIF_20260627203637092.GIF`,
      title: locale === 'en' ? 'Rice Scatter Simulator' : '饭撒模拟器',
      defaultPos: { x: 4, y: 6, w: 4, h: 4 },
    },
    {
      id: 6,
      title: locale === 'en' ? 'Fun Gesture Interactions' : '一些有趣的手势交互',
      defaultPos: { x: 8, y: 6, w: 4, h: 4 },
      bg: 'linear-gradient(135deg, #f3e8ff 0%, #ede9fe 40%, #e9d5ff 100%)',
      isTextOnly: true,
    },
  ], [locale])

  return (
    <section className="bg-white px-1 sm:px-2 pt-8 sm:pt-10 md:pt-12 pb-6 sm:pb-8 md:pb-10 relative z-10">
      <FadeIn y={30}>
        <DynamicFrameLayout
          frames={LOOT_FRAMES}
          className="w-full"
          style={{ height: '110vh', maxHeight: '1200px' }}
          hoverSize={6}
          gapSize={4}
          cols={3}
          rows={2}
        />
      </FadeIn>
    </section>
  )
}
