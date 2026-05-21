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
        { label: 'Hash Hunt', href: '/hash-hunt' },
      ]
    : lang === 'fr'
    ? [
        { label: 'Fonctionnalités', href: '#features' },
        { label: 'Tarifs', href: '#pricing' },
        { label: 'Comment ça marche', href: '/how-ats-works' },
        { label: 'Hash Hunt', href: '/hash-hunt' },
      ]
    : [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'How it Works', href: '/how-ats-works' },
        { label: 'Hash Hunt', href: '/hash-hunt' },
      ]

  const ctaLabel = lang === 'ar' ? 'ابدأ الآن' : lang === 'fr' ? 'Créer maintenant' : 'Start Now'

  return (
    <nav className={cn("sticky top-0 z-50 bg-white/70 backdrop-blur-xl transition-all duration-300 border-b", scrolled ? "shadow-[0_4px_30px_rgba(0,0,0,0.05)] border-neutral-200/50" : "shadow-none border-transparent")}>
      <div className="container-page">
        <div className="flex items-center justify-between py-4 relative">

          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center transform origin-left rtl:origin-right hover:scale-105 transition-all duration-300">
              <img
                src="https://i.ibb.co/p6bMBFQT/IN-LOGO-icon-with-tag-1.png"
                alt="Hash Resume"
                className="h-[120px] md:h-[150px] w-auto object-contain"
              />
            </Link>
          </div>

          {/* Center: Nav Links */}
          <div className="hidden md:flex items-center justify-center gap-2 flex-1 px-8">
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/50 transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 relative group"
                >
                  {link.label}
                  {link.label.includes('Hash Hunt') && (
                    <motion.span 
                      animate={{ scale: [1, 1.1, 1] }} 
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-[#FF4D2D] text-white text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md leading-none shadow-sm shadow-[#FF4D2D]/20"
                    >
                      {lang === 'ar' ? 'جديد' : 'NEW'}
                    </motion.span>
                  )}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF4D2D] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300" />
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/50 transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 relative group"
                >
                  {link.label}
                  {link.label.includes('Hash Hunt') && (
                    <motion.span 
                      animate={{ scale: [1, 1.1, 1] }} 
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-[#FF4D2D] text-white text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md leading-none shadow-sm shadow-[#FF4D2D]/20"
                    >
                      {lang === 'ar' ? 'جديد' : 'NEW'}
                    </motion.span>
                  )}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF4D2D] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300" />
                </a>
              )
            ))}
          </div>

          {/* Mobile: Hamburger Button (Left side -> move to Right side before CTA in mobile maybe? Actually let's keep it tight on right) */}
          <div className="flex items-center justify-end gap-3 flex-shrink-0">
            
            <div className="hidden md:block relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="hover:bg-slate-100/50 px-3 py-2 rounded-lg font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5"
              >
                <span className="text-sm">{LANG_LABELS[lang]}</span>
                <svg className={cn('w-3 h-3 transition-transform', langOpen && 'rotate-180')} viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute end-0 top-full mt-2 bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden w-40 z-50 p-1"
                  >
                    {LANGS.map((l) => (
                      <button
                        key={l}
                        onClick={() => { onLangChange(l); setLangOpen(false) }}
                        className={cn(
                          'w-full text-start px-4 py-2.5 text-sm rounded-lg hover:bg-slate-50 transition-colors font-medium',
                          lang === l ? 'text-[#FF4D2D] bg-[#FF4D2D]/5' : 'text-slate-600'
                        )}
                      >
                        {LANG_LABELS[l]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="bg-[#FF4D2D] hover:bg-[#E64528] text-white shadow-lg shadow-orange-500/20 px-5 py-2.5 rounded-full font-bold text-sm hidden md:inline-flex items-center gap-2 transition-colors relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
              <Sparkles className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{ctaLabel}</span>
            </motion.button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
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
