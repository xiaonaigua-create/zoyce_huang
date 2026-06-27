import FadeIn from './FadeIn'
import TextType from './TextType'
import ShinyText from './ShinyText'
import { SparklesText } from '@/components/ui/sparkles-text'
import { CircularGallery } from '@/components/ui/circular-gallery'
import { useI18n } from '@/lib/i18n'

const BASE = import.meta.env.BASE_URL

// ─── Duration calculation helper ───
function calcDuration(startStr: string, endStr: string, locale?: string): string {
  const [startMon, startYear] = startStr.split(' ').map((s) => s.trim())
  const [endMon, endYear] = endStr.split(' ').map((s) => s.trim())

  const monMap: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  }

  let startY = parseInt(startYear, 10)
  let startM = monMap[startMon] ?? 0
  let endY = endStr === 'Present' ? new Date().getFullYear() : parseInt(endYear, 10)
  let endM = endStr === 'Present' ? new Date().getMonth() : (monMap[endMon] ?? 0)

  let totalMonths = (endY - startY) * 12 + (endM - startM)
  if (totalMonths < 0) totalMonths = 0

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (locale === 'en') {
    const y = years > 1 ? `${years} years` : years === 1 ? '1 year' : ''
    const m = months > 1 ? `${months} months` : months === 1 ? '1 month' : ''
    if (y && m) return `${y} ${m}`
    if (y) return y
    if (m) return m
    return '<1 month'
  }

  const y = years > 1 ? `${years}年` : years === 1 ? '1年' : ''
  const m = months > 1 ? `${months}个月` : months === 1 ? '1个月' : ''
  if (y && m) return `${y} ${m}`
  if (y) return y
  if (m) return m
  return '<1 month'
}

const GALLERY_ITEMS_EN = [
  {
    id: 2,
    title: 'Soochow University',
    cat: 'Education · Bachelor',
    subtitle: 'Bachelor of Management',
    period: '2018.09 — 2022.06',
    startDate: 'Sep 2018',
    endDate: 'Jun 2022',
    tags: ['Top 5%', 'CET-4: 609', 'National English Competition 3rd Prize'],
    badge: '211',
    img: `${BASE}苏州大学.JPG`,
    logo: `${BASE}苏州大学图标.webp`,
    type: 'edu',
  },
  {
    id: 1,
    title: 'Sun Yat-sen University',
    cat: 'Education · Master',
    subtitle: 'Master of Law',
    period: '2022.09 — 2025.06',
    startDate: 'Sep 2022',
    endDate: 'Jun 2025',
    tags: ['Top 10%', 'CET-6: 603', 'Second-Class Scholarship'],
    badge: '985',
    img: `${BASE}中山大学.JPG`,
    logo: `${BASE}中山大学图标.jpeg`,
    type: 'edu',
  },
  // ─── Full-time Work ───
  {
    id: 3,
    title: 'Zhangyue',
    cat: 'Full-time · Growth Strategy PM',
    period: 'Jun 2025 — Present',
    startDate: 'Jun 2025',
    endDate: 'Present',
    tags: ['Incentive Systems', 'User Growth', 'AI Workflow', 'Data Analysis'],
    img: `${BASE}掌阅 工卡.png`,
    logo: `${BASE}zhangyue-logo.png`,
    type: 'work-fulltime',
  },
  // ─── Internship ───
  {
    id: 4,
    title: 'Baidu / YY Live',
    cat: 'Internship · Recommendation PM',
    period: 'Jul 2024 — Mar 2025',
    startDate: 'Jul 2024',
    endDate: 'Mar 2025',
    tags: ['Recommendation Algorithm', 'AI Cover Tool', 'Content Distribution'],
    img: `${BASE}百度 工卡.jpg`,
    logo: `${BASE}baidu-logo.png`,
    type: 'work-internship',
  },
  {
    id: 5,
    title: 'Futu',
    cat: 'Internship · PM',
    period: 'May 2024 — Jul 2024',
    startDate: 'May 2024',
    endDate: 'Jul 2024',
    tags: ['Growth Operations', 'Financial Products', 'Points System'],
    img: `${BASE}富途 工卡.jpg`,
    logo: `${BASE}futu-logo.png`,
    type: 'work-internship',
  },
  {
    id: 6,
    title: 'Vipshop',
    cat: 'Internship · Product Ops',
    period: 'Feb 2024 — May 2024',
    startDate: 'Feb 2024',
    endDate: 'May 2024',
    tags: ['Competitive Analysis', 'Subscription Channel', 'Model Training'],
    img: `${BASE}唯品会 工卡.jpg`,
    logo: `${BASE}vipshop-logo.png`,
    type: 'work-internship',
  },
  {
    id: 7,
    title: 'Kuaishou',
    cat: 'Internship · Data Analysis',
    period: 'Nov 2023 — Feb 2024',
    startDate: 'Nov 2023',
    endDate: 'Feb 2024',
    tags: ['Data Analytics', 'Local Business Ops', 'Dashboard Building'],
    img: `${BASE}快手 工卡.JPG`,
    logo: `${BASE}kuaishou-logo.png`,
    type: 'work-internship',
  },
]

// ─── ZH Data ───
const GALLERY_ITEMS_ZH = [
  {
    ...GALLERY_ITEMS_EN[0],
    title: '苏州大学',
    cat: '教育 · 本科',
    subtitle: '管理学学士',
    tags: ['前5%', 'CET-4: 609', '全国大学生英语竞赛三等奖'],
  },
  {
    ...GALLERY_ITEMS_EN[1],
    title: '中山大学',
    cat: '教育 · 硕士',
    subtitle: '法学硕士',
    tags: ['前10%', 'CET-6: 603', '二等奖学金'],
  },
  {
    ...GALLERY_ITEMS_EN[2],
    title: '掌阅',
    cat: '全职 · 增长策略产品经理',
    tags: ['激励体系', '用户增长', 'AI工作流', '数据分析'],
  },
  {
    ...GALLERY_ITEMS_EN[3],
    title: '百度 / YY直播',
    cat: '实习 · 推荐产品经理',
    tags: ['推荐算法', 'AI封面工具', '内容分发'],
  },
  {
    ...GALLERY_ITEMS_EN[4],
    title: '富途',
    cat: '实习 · 产品经理',
    tags: ['增长运营', '金融产品', '积分体系'],
  },
  {
    ...GALLERY_ITEMS_EN[5],
    title: '唯品会',
    cat: '实习 · 产品运营',
    tags: ['竞品分析', '订阅频道', '模型训练'],
  },
  {
    ...GALLERY_ITEMS_EN[6],
    title: '快手',
    cat: '实习 · 数据分析',
    tags: ['数据分析', '本地生活运营', '看板搭建'],
  },
]

// Convert items → CircularGallery format (rich card data)
function toCircularItems(items: typeof GALLERY_ITEMS_EN, locale?: string) {
  return items.map((item) => {
    // Extract type badge: "Full-time" / "Internship" / "Education"
    const typeBadge = item.cat.split(' · ')[0]
    // Extract role/subtitle: "Growth PM" / "Master of Law" etc.
    const roleText = item.subtitle || item.cat.split(' · ')[1] || ''
    return {
      common: item.title,
      binomial: roleText,
      typeBadge,
      badge: item.badge || undefined,
      logo: item.logo,
      duration: item.type.startsWith('edu') ? undefined : calcDuration(item.startDate, item.endDate, locale),
      photo: {
        url: item.img,
        text: item.title,
        by: item.period,
      },
      tags: item.tags,
    }
  })
}

const LIFE_JOURNEY_EN = [
  { city: 'Fuzhou', region: 'Fujian', label: 'Born & Raised' },
  { city: 'Suzhou', region: 'Jiangsu', label: "Bachelor's" },
  { city: 'Guangzhou', region: 'Guangdong', label: "Master's" },
  { city: 'Beijing', region: '', label: 'Working' },
  { city: 'Unknown', region: '', label: 'To Be Continued' },
]

const LIFE_JOURNEY_ZH = [
  { city: '福州', region: '福建', label: '出生成长' },
  { city: '苏州', region: '江苏', label: '本科' },
  { city: '广州', region: '广东', label: '硕士' },
  { city: '北京', region: '', label: '工作' },
  { city: '未知', region: '', label: '待续' },
]

export default function AboutSection() {
  const { locale, t } = useI18n()
  const lifeJourney = locale === 'en' ? LIFE_JOURNEY_EN : LIFE_JOURNEY_ZH
  const galleryItems = toCircularItems(locale === 'en' ? GALLERY_ITEMS_EN : GALLERY_ITEMS_ZH, locale)
  return (
    <section className="relative px-5 sm:px-8 md:px-10 pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-18 md:pb-20 bg-[#FAFBFC]">
      {/* Heading */}
      <FadeIn delay={0} y={30}>
        <h2 className="hero-heading font-bold tracking-tight leading-none text-center -mt-[30px]" style={{ fontSize: 'clamp(2.5rem, 8vw, 80px)' }}>
          <SparklesText colors={{ first: '#9E7AFF', second: '#FE8BBB' }}>
            <ShinyText text={t('About me', '关于我')} speed={3} delay={3} color="#7C3AED" shineColor="#ffffff" spread={90} direction="left" once />
          </SparklesText>
        </h2>
      </FadeIn>

      <FadeIn delay={0.1} y={25}>
        <div className="mx-auto text-center" style={{ maxWidth: '1000px' }}>
          <TextType
            as="p"
            className="text-[#1a1a2e]/55 font-light text-center leading-relaxed mt-4 mb-8 sm:mb-10"
            style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)' }}
            text={t('00s INFJ PM, keep evolving!', '00后INFJ产品经理，持续精进中！')}
            typingSpeed={30}
            startOnVisible
            showCursor
            cursorCharacter="|"
            loop={false}
          />
        </div>
      </FadeIn>

      {/* Life Journey — 保持不变 */}
      <div className="max-w-[1000px] mx-auto">
        <FadeIn delay={0.15} y={25}>
          <h3 className="text-[#1a1a2e] font-semibold tracking-wider text-sm mb-6 capitalize">
            {t('Footprint', '足迹')}
          </h3>
        </FadeIn>
        <FadeIn delay={0.18} y={20}>
          <div className="relative mt-3 mb-0">
            <div className="absolute left-[7px] right-[7px] top-[7px] h-0.5 bg-gradient-to-r from-[#7C3AED]/60 via-[#7C3AED]/30 to-[#7C3AED]/10 rounded-full relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-80 animate-shine-full" />
            </div>
            <div className="flex items-start justify-between gap-2 sm:gap-4">
              {lifeJourney.map((place, i) => (
                <div key={place.city} className="flex flex-col items-center flex-1 relative z-10">
                  <div
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-md"
                    style={{ animation: `dot-glow-${i} 7s ease-in-out infinite` }}
                  />
                  <span className="font-semibold text-xs sm:text-sm text-[#1a1a2e] mt-2 text-center">{place.city}</span>
                  {place.region && (
                    <span className="text-[9px] sm:text-[10px] text-[#1a1a2e]/40 mt-0.5">{place.region}</span>
                  )}
                  <p className="text-[8px] sm:text-[9px] text-[#7C3AED]/70 mt-0.5 font-medium">{place.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ─── Circular 3D Gallery — 教育经历 + 工作经历 ─── */}
        <div className="relative w-full mt-0" style={{ height: '600px', minHeight: '500px' }}>
          <CircularGallery
            items={galleryItems}
            radius={480}
            autoRotateSpeed={0.025}
          />
        </div>
      </div>
    </section>
  )
}
