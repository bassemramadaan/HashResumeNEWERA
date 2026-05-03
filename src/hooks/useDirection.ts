import { useEffect, useState } from 'react'

type Direction = 'rtl' | 'ltr'

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'ps', 'ku']

function detectDirection(): Direction {
  // 1. من الـ html tag مباشرة
  const htmlDir = document.documentElement.getAttribute('dir')
  if (htmlDir === 'rtl' || htmlDir === 'ltr') return htmlDir

  // 2. من الـ lang attribute
  const htmlLang = document.documentElement.getAttribute('lang')
  if (htmlLang) {
    const baseLang = htmlLang.split('-')[0].toLowerCase()
    if (RTL_LANGUAGES.includes(baseLang)) return 'rtl'
    return 'ltr'
  }

  // 3. من الـ browser language
  const browserLang = navigator.language?.split('-')[0].toLowerCase()
  if (RTL_LANGUAGES.includes(browserLang)) return 'rtl'

  return 'ltr'
}

export function useDirection() {
  const [direction, setDirection] = useState<Direction>(() => detectDirection())

  const isRTL = direction === 'rtl'

  const setDir = (dir: Direction) => {
    setDirection(dir)
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute(
      'lang',
      dir === 'rtl' ? 'ar' : 'en'
    )
  }

  useEffect(() => {
    // تأكد إن الـ html tag متزامن مع الـ state
    document.documentElement.setAttribute('dir', direction)

    // راقب أي تغيير في الـ dir attribute من برا
    const observer = new MutationObserver(() => {
      const newDir = detectDirection()
      setDirection(newDir)
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir', 'lang'],
    })

    return () => observer.disconnect()
  }, [direction])

  return { direction, isRTL, setDir }
}
