import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { Menu, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AppLang } from '@/hooks/useDirection'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useNavigate, Link } from 'react-router-dom'

const LANG_LABELS = { ar: 'العربية', en: 'English', fr: 'Français' }
const LANGS: AppLang[] = ['ar', 'en', 'fr']

interface NavbarProps {
  onStartClick?: () => void
}

export function Navbar({ onStartClick }: NavbarProps = {}) {
  const { language: lang, setLanguage: onLangChange } = useLanguageStore()
  const navigate = useNavigate()
  const handleStart = onStartClick || (() => navigate('/editor'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = lang === 'ar'
    ? [
        { label: 'الميزات', href: '#features' },
        { label: 'الأسعار', href: '#pricing' },
        { label: 'كيف يعمل؟', href: '/how-ats-works' },
        { label: 'محلل ATS', href: '/ats-scorer' },
        { label: 'Hash Hunt', href: '/hash-hunt' },
      ]
    : lang === 'fr'
    ? [
        { label: 'Fonctionnalités', href: '#features' },
        { label: 'Tarifs', href: '#pricing' },
        { label: 'Comment ça marche', href: '/how-ats-works' },
        { label: 'ATS Scorer', href: '/ats-scorer' },
        { label: 'Hash Hunt', href: '/hash-hunt' },
      ]
    : [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'How it Works', href: '/how-ats-works' },
        { label: 'ATS Scorer', href: '/ats-scorer' },
        { label: 'Hash Hunt', href: '/hash-hunt' },
      ]

  const ctaLabel = lang === 'ar' ? 'ابدأ مجانًا' : lang === 'fr' ? 'Commencer' : 'Start Free'

  return (
    <nav className={cn("sticky top-0 z-50 bg-white/90 backdrop-blur-md transition-all duration-200 border-b", scrolled ? "shadow-md border-neutral-200/50" : "shadow-none border-neutral-200")}>
      <div className="container-page">
        <div className="flex items-center justify-between min-h-[160px] py-2 relative">

          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center transform origin-left rtl:origin-right hover:scale-105 transition-transform">
              <img
                src="https://i.ibb.co/p6bMBFQT/IN-LOGO-icon-with-tag-1.png"
                alt="Hash Resume"
                className="h-[130px] md:h-[160px] w-auto object-contain"
              />
            </Link>
          </div>

          {/* Center: Nav Links */}
          <div className="hidden md:flex items-center justify-center gap-1 flex-1 px-8">
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors whitespace-nowrap flex items-center gap-1.5"
                >
                  {link.label}
                  {link.label.includes('Hash Hunt') && (
                    <span className="bg-brand-500 text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md leading-none shadow-sm shadow-brand-500/20">
                      {lang === 'ar' ? 'جديد' : 'NEW'}
                    </span>
                  )}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors whitespace-nowrap flex items-center gap-1.5"
                >
                  {link.label}
                  {link.label.includes('Hash Hunt') && (
                    <span className="bg-brand-500 text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md leading-none shadow-sm shadow-brand-500/20">
                      {lang === 'ar' ? 'جديد' : 'NEW'}
                    </span>
                  )}
                </a>
              )
            ))}
          </div>

          {/* Mobile: Hamburger Button (Left side -> move to Right side before CTA in mobile maybe? Actually let's keep it tight on right) */}
          <div className="flex items-center justify-end gap-2 flex-shrink-0">
            
            <div className="hidden md:block relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="btn-ghost btn-sm flex items-center gap-1.5"
              >
                <span className="text-sm">{LANG_LABELS[lang]}</span>
                <svg className={cn('w-3 h-3 transition-transform', langOpen && 'rotate-180')} viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute end-0 top-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden w-36 z-50"
                  >
                    {LANGS.map((l) => (
                      <button
                        key={l}
                        onClick={() => { onLangChange(l); setLangOpen(false) }}
                        className={cn(
                          'w-full text-start px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors',
                          lang === l ? 'font-medium' : 'text-neutral-700'
                        )}
                        style={lang === l ? { color: 'var(--color-brand-500)' } : {}}
                      >
                        {LANG_LABELS[l]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              className="btn-primary btn-sm hidden md:inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {ctaLabel}
            </motion.button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6 text-neutral-700" /> : <Menu className="w-6 h-6 text-neutral-700" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-neutral-100 bg-white"
          >
            <div className="container-page py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-50"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-2 mt-2 pt-3 border-t border-neutral-100">
                {LANGS.map((l) => (
                  <button
                    key={l}
                    onClick={() => { onLangChange(l); setMobileOpen(false) }}
                    className={cn('btn btn-sm flex-1', lang === l ? 'btn-primary' : 'btn-ghost')}
                  >
                    {LANG_LABELS[l]}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { handleStart(); setMobileOpen(false) }}
                className="btn-primary mt-2 w-full justify-center inline-flex gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {ctaLabel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {langOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
      )}
    </nav>
  )
}
