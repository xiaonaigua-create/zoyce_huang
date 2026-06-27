import FadeIn from './FadeIn'
import TextType from './TextType'
import ShinyText from './ShinyText'
import { SparklesText } from '@/components/ui/sparkles-text'
import { useI18n } from '@/lib/i18n'

const BASE = import.meta.env.BASE_URL

const PROJECTS = [
  {
    id: 1,
    title: 'Cyber Feed',
    titleZh: '赛博饲料',
    desc: 'A cyber feed for workers — salary displayed per second, making work more energizing!',
    descZh: '打工人的赛博饲料，秒级单位展示工资，让工作更加充满干劲！',
    by: 'Baidu / YY Live · Product Manager',
    byZh: '百度 / YY直播 · 产品经理',
    videoSrc: `${BASE}cyber-feed-demo.mp4`,
    imgSrc: `${BASE}cyber-feed-1.png`,
  },
  {
    id: 2,
    title: 'Rain Addict\'s Flow Moments',
    titleZh: '雨瘾者的心流时刻',
    desc: 'Simulate speed & passion in a storm — upload different sports scenes with AI dialogue for an immersive flow state experience.',
    descZh: '模拟狂风暴雨下的速度与激情，支持上传不同的运动场景和AI对话，沉浸式模拟运动状态下的心流时刻。',
    by: 'Qingyue Tech · PM',
    byZh: '清越科技 · 产品经理',
    videoSrc: `${BASE}rain-addict-demo.mp4`,
    imgSrc: `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=400&q=80`,
  },
  {
    id: 3,
    title: 'Focus Assistant',
    titleZh: '雨夜打字机',
    desc: 'Raindrop white noise to boost your focus — with a central input whiteboard to capture your thoughts anytime.',
    descZh: '在雨滴的白噪音下，可以让你更加专注，屏幕中间的输入白板也可以随时记录所思所想。',
    by: 'Personal Project · Full Stack',
    byZh: '个人项目 · 全栈开发',
    videoSrc: `${BASE}portfolio-demo.mp4`,
    imgSrc: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
  },
]

function ProjectCard({ project, index, locale }: { project: typeof PROJECTS[0]; index: number; locale: string }) {
  const isEven = index % 2 === 0 // 偶数：视频左文字右；奇数：视频右文字左

  return (
    <FadeIn delay={index * 0.15} y={30}>
      <div className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
        {/* 视频 */}
        <div className="w-full md:w-1/2">
          <video
            src={project.videoSrc}
            loop
            muted
            playsInline
            autoPlay
            className="w-full aspect-video object-cover rounded-2xl shadow-lg"
            style={index === 0 ? { objectPosition: 'center 25%' } : undefined}
          />
        </div>

        {/* 文字 */}
        <div className="w-full md:w-1/2 space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-[#1a1a2e] leading-tight">
            {locale === 'en' ? project.title : project.titleZh}
          </h3>
          <p className="text-sm sm:text-base text-[#1a1a2e]/60 leading-relaxed">
            {locale === 'en' ? project.desc : project.descZh}
          </p>
          <button className="mt-2 px-5 py-2 rounded-full text-sm font-medium bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors duration-300 shadow-md">
            {locale === 'en' ? 'Try it now →' : '立即体验 →'}
          </button>
        </div>
      </div>

      {/* 分隔线（最后一个不加） */}
      {index < PROJECTS.length - 1 && (
        <div className="my-10 md:my-14 h-px bg-gradient-to-r from-transparent via-[#7C3AED]/20 to-transparent" />
      )}
    </FadeIn>
  )
}

export default function ProjectsSection() {
  const { t, locale } = useI18n()

  return (
    <section className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] relative z-10 px-5 sm:px-8 md:px-10 pt-8 sm:pt-10 md:pt-14 pb-12 sm:pb-16 -mt-[20px]">
      {/* 标题 */}
      <div className="max-w-[1000px] mx-auto text-center mb-12 sm:mb-16">
        <FadeIn y={40}>
          <h2
            className="hero-heading font-black capitalize leading-[1] tracking-tight text-center px-4"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 80px)', paddingBottom: '0.15em' }}
          >
            <SparklesText colors={{ first: '#9E7AFF', second: '#FE8BBB' }}>
              <ShinyText text={t('AI Project', 'AI项目')} speed={3} delay={3} color="#7C3AED" shineColor="#ffffff" spread={90} direction="left" once />
            </SparklesText>
          </h2>
        </FadeIn>
      </div>

      {/* 三个项目卡片 */}
      <div className="max-w-[1000px] mx-auto">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} locale={locale} />
        ))}
      </div>
    </section>
  )
}
