import { useI18n } from '@/lib/i18n'

interface LanguageSwitcherProps {
  show?: boolean
}

const STYLE_BASE = 'px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-300 bg-transparent text-[#7C3AED]/60 border border-transparent hover:text-[#7C3AED]'
const STYLE_ACTIVE = 'px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-300 bg-[#7C3AED] text-white shadow-md border border-[#7C3AED]'

export function LanguageSwitcher({ show = true }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n()

  if (!show) return null

  return (
    <div className="absolute top-16 right-6 z-[99999] flex items-center gap-1 px-1 py-0.5 rounded-full bg-white/80 backdrop-blur-lg border border-[#7C3AED]/30 shadow-xl">
      <button
        onClick={() => setLocale('en')}
        className={locale === 'en' ? STYLE_ACTIVE : STYLE_BASE}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('zh')}
        className={locale === 'zh' ? STYLE_ACTIVE : STYLE_BASE}
      >
        中文
      </button>
    </div>
  )
}
