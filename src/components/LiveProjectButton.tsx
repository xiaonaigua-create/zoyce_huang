import { useLanguage } from '../i18n/LanguageContext'

export default function LiveProjectButton() {
  const { t } = useLanguage()

  return (
    <button
      className="
        rounded-full border-2 border-[#1a1a2e] px-8 py-3 sm:px-10 sm:py-3.5
        text-sm sm:text-base font-medium tracking-widest
        text-[#1a1a2e] cursor-pointer
        transition-colors duration-200
        hover:bg-[#1a1a2e]/10
      "
    >
      {t.projects.liveProject}
    </button>
  )
}
