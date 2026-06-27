import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type Locale = 'en' | 'zh'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (en: string, zh: string) => string
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (en) => en,
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')

  const t = useCallback(
    (en: string, zh: string) => (locale === 'en' ? en : zh),
    [locale],
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
