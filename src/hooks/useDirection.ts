import { useEffect } from 'react'

export type AppLang = 'ar' | 'en' | 'fr'

const STORAGE_KEY = 'hr_lang'

export function useDirection(lang: AppLang) {
  const isRTL = lang === 'ar'

  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
    html.setAttribute('lang', lang)
    try { localStorage.setItem(STORAGE_KEY, lang) } catch {}
  }, [lang, isRTL])

  return { isRTL }
}

export function getPersistedLang(): AppLang {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'ar' || v === 'en' || v === 'fr') return v
  } catch {}
  return 'ar'
}
