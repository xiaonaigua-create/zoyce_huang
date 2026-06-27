export type Locale = 'en' | 'zh'

export interface Translations {
  hero: {
    subtitle: string
    keywords: string[]
    leftKeywords1: string[]
    leftKeywords2: string[]
    leftKeywords3: string[]
    rightKeywords1: string[]
    rightKeywords2: string[]
    rightKeywords3: string[]
  }
  about: {
    title: string
    subtitle: string
    lifeJourney: string
    education: string
    workExperience: string
    fulltime: string
    internship: string
    journeyLabels: { born: string; bachelor: string; master: string; working: string; continued: string; cities: string[]; regions: string[] }
    eduItems: Array<{ school: string; degree: string; period: string; tags: string[]; tier: string[] }>
    expItems: Array<{ company: string; role: string; period: string; tags: string[]; type: string }>
  }
  services: {
    title: string
    subtitle: string
    menuItems: Array<{ text: string }>
  }
  dailyLife: {
    title: string
    subtitle: string
    items: Array<{ title: string; description: string }>
  }
  projects: {
    title: string
    subtitle: string
    liveProject: string
    items: Array<{ category: string; name: string }>
  }
  langSwitch: { en: string; zh: string }
}

export const translations: Record<Locale, Translations> = {
  en: {
    // Hero
    hero: {
      subtitle: '3-year-experienced Product Manager focused on data-driven growth & premium user experience',
      keywords: [
        'Growth Strategy',
        'User Operations',
        'Data-Driven',
        'AI Workflow',
        'Product Manager',
        'Recommendation',
        'PRD & Analysis',
        'Figma / Axure',
      ],
      leftKeywords1: ['Growth Strategy', 'User Operations', 'Product Manager'],
      leftKeywords2: ['INFJ', 'Divergent Thinking', 'Investigative Personality'],
      leftKeywords3: ['Data-Driven', 'Root-Cause Analytical', 'Evidence-Based'],
      rightKeywords1: ['Intermittent Humor', 'Keep Smiling', 'Enjoy Life'],
      rightKeywords2: ['Outdoor Sports', 'DIY Enthusiast', 'Gaming Addict'],
      rightKeywords3: ['PRD', 'Figma', 'AB Testing'],
    },
    // About
    about: {
      title: 'About me',
      subtitle: "00s INFJ PM ,keep evolving!",
      lifeJourney: 'Life Journey · Walk, Stop & Wander',
      education: 'Education',
      workExperience: 'Work Experience',
      fulltime: 'Full-time',
      internship: 'Internship',
      journeyLabels: {
        born: 'Born & Raised',
        bachelor: "Bachelor's",
        master: "Master's",
        working: 'Working',
        continued: 'To Be Continued',
        cities: ['Fuzhou', 'Suzhou', 'Guangzhou', 'Beijing', '?'],
        regions: ['Fujian', 'Jiangsu', 'Guangdong', '', ''],
      },
      eduItems: [
        {
          school: 'Sun Yat-sen University',
          degree: 'Master of Law',
          period: '2022.09 — 2025.06',
          tags: ['Top 10%', 'CET-6: 603', 'Second-Class Scholarship'],
          tier: ['985'],
        },
        {
          school: 'Soochow University',
          degree: 'Bachelor of Management',
          period: '2018.09 — 2022.06',
          tags: ['Top 5%', 'CET-4: 609', 'National English Competition 3rd Prize'],
          tier: ['211'],
        },
      ],
      expItems: [
        {
          company: 'Zhangyue',
          role: 'Growth Strategy PM',
          period: 'Jun 2025 — Present',
          tags: ['Incentive Systems', 'User Growth', 'AI Workflow', 'Data Analysis', 'Content Product', 'Overseas Growth'],
          type: 'fulltime',
        },
        {
          company: 'Baidu / YY Live',
          role: 'Recommendation Strategy PM',
          period: 'Jul 2024 — Mar 2025',
          tags: ['Recommendation Algorithm', 'AI Cover Tool', 'Content Distribution', 'A/B Testing'],
          type: 'internship',
        },
        {
          company: 'Futu',
          role: 'Product Manager',
          period: 'May 2024 — Jul 2024',
          tags: ['Competitive Analysis', 'Financial Products', 'Points System', 'Overseas User Ops'],
          type: 'internship',
        },
        {
          company: 'Vipshop',
          role: 'Product Operations',
          period: 'Feb 2024 — May 2024',
          tags: ['Competitive Analysis', 'Subscription Channel', 'Product Planning', 'AI Model'],
          type: 'internship',
        },
        {
          company: 'Kuaishou',
          role: 'Data Analysis',
          period: 'Nov 2023 — Feb 2024',
          tags: ['Data Analytics', 'Local Business Ops', 'Dashboard Building'],
          type: 'internship',
        },
      ],
    },
    // Services / Strength
    services: {
      title: 'Strength',
      subtitle: 'Core competencies that drive product growth and user success.',
      menuItems: [
        { text: 'Product Manager' },
        { text: 'Data-Driven Product' },
        { text: 'AI Workflow' },
        { text: 'UI Design & Motion' },
      ],
    },
    // Daily Life
    dailyLife: {
      title: 'Daily Life',
      subtitle: 'Beyond work — the moments that keep me inspired and grounded.',
      items: [
        { title: 'Photography', description: 'Capturing moments in city streets & nature' },
        { title: 'Doodling', description: 'Creative sketches and designs' },
        { title: 'Travel', description: 'Exploring new cities and cultures' },
        { title: 'Fitness', description: 'Running, yoga, keeping an active lifestyle' },
      ],
    },
    // Projects
    projects: {
      title: 'Project',
      subtitle: 'Embracing the AI era — small features built with pure vibe coding, continuously optimizing.',
      liveProject: 'Live Project',
      items: [
        { category: 'Baidu / YY Live', name: 'Cyber Feed — Spiritual Food for Workers' },
        { category: 'Baidu / YY Live', name: "Doodler's Diary" },
        { category: 'Qingyue Tech', name: 'Rain Addict Flow Moments' },
      ],
    },
    // Language switcher
    langSwitch: {
      en: 'EN',
      zh: '中文',
    },
  },
  zh: {
    // Hero
    hero: {
      subtitle: '3年经验产品经理，专注数据驱动增长与高端用户体验',
      keywords: [
        '增长策略',
        '用户运营',
        '数据驱动',
        'AI 工作流',
        '产品经理',
        '推荐系统',
        'PRD & 分析',
        'Figma / Axure',
      ],
      leftKeywords1: ['增长策略', '用户运营', '产品经理'],
      leftKeywords2: ['INFJ', '发散思维', '研究型人格'],
      leftKeywords3: ['数据驱动', '根因分析', '循证决策'],
      rightKeywords1: ['间歇性幽默', '保持微笑', '享受生活'],
      rightKeywords2: ['户外运动', 'DIY 爱好者', '游戏达人'],
      rightKeywords3: ['PRD', 'Figma', 'AB 测试'],
    },
    // About
    about: {
      title: '关于我',
      subtitle: '00后 INFJ 产品经理，持续进化中！',
      lifeJourney: '走走停停...',
      education: '教育背景',
      workExperience: '工作经历',
      fulltime: '全职',
      internship: '实习',
      journeyLabels: {
        born: '出生成长',
        bachelor: '本科',
        master: '硕士',
        working: '工作',
        continued: '未完待续',
        cities: ['福州', '苏州', '广州', '北京', '?'],
        regions: ['福建', '江苏', '广东', '', ''],
      },
      eduItems: [
        {
          school: '中山大学',
          degree: '法学硕士',
          period: '2022.09 — 2025.06',
          tags: ['前10%', 'CET-6: 603', '二等奖学金'],
          tier: ['985'],
        },
        {
          school: '苏州大学',
          degree: '管理学学士',
          period: '2018.09 — 2022.06',
          tags: ['前5%', 'CET-4: 609', '全国大学生英语竞赛三等奖'],
          tier: ['211'],
        },
      ],
      expItems: [
        {
          company: '掌阅',
          role: '增长策略产品经理',
          period: '2025.06 — 至今',
          tags: ['激励体系', '用户增长', 'AI 工作流', '数据分析', '内容产品', '海外增长'],
          type: 'fulltime',
        },
        {
          company: '百度 / YY直播',
          role: '推荐策略产品经理',
          period: '2024.07 — 2025.03',
          tags: ['推荐算法', 'AI 封面工具', '内容分发', 'A/B 测试'],
          type: 'internship',
        },
        {
          company: '富途',
          role: '产品经理',
          period: '2024.05 — 2024.07',
          tags: ['竞品分析', '金融产品', '积分体系', '海外用户运营'],
          type: 'internship',
        },
        {
          company: '唯品会',
          role: '产品运营',
          period: '2024.02 — 2024.05',
          tags: ['竞品分析', '订阅渠道', '产品规划', 'AI 模型'],
          type: 'internship',
        },
        {
          company: '快手',
          role: '数据分析',
          period: '2023.11 — 2024.02',
          tags: ['数据分析', '本地生活运营', '数据看板搭建'],
          type: 'internship',
        },
      ],
    },
    // Services / Strength
    services: {
      title: '核心能力',
      subtitle: '驱动产品增长与用户成功的核心竞争力。',
      menuItems: [
        { text: '产品经理' },
        { text: '数据驱动产品' },
        { text: 'AI 工作流' },
        { text: 'UI 设计与动效' },
      ],
    },
    // Daily Life
    dailyLife: {
      title: '日常生活',
      subtitle: '工作之外——那些让我保持灵感和脚踏实地的时刻。',
      items: [
        { title: '摄影', description: '记录城市街景与自然风光的瞬间' },
        { title: '涂鸦', description: '创意手绘与设计' },
        { title: '旅行', description: '探索新的城市与文化' },
        { title: '运动', description: '跑步、瑜伽，保持活力生活方式' },
      ],
    },
    // Projects
    projects: {
      title: '项目作品',
      subtitle: '拥抱 AI 时代——用纯 Vibe Coding 打造的小功能，持续优化中。',
      liveProject: '在线体验',
      items: [
        { category: '百度 / YY直播', name: '赛博打工人——打工人的精神食粮' },
        { category: '百度 / YY直播', name: '涂鸦日记' },
        { category: '青悦科技', name: '雨瘾·流动瞬间' },
      ],
    },
    // Language switcher
    langSwitch: {
      en: 'EN',
      zh: '中文',
    },
  },
}

export type TranslationKeys = Translations
