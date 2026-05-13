import { useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { Menu, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AppLang } from '@/hooks/useDirection'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useNavigate, Link } from 'react-router-dom'
import { LOGO_URL } from '@/constants'

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

  const navLinks = lang === 'ar'
    ? [
        { label: 'الميزات', href: '#features' },
        { label: 'الأسعار', href: '#pricing' },
        { label: 'Hash Hunt', href: '/hash-hunt' },
      ]
    : lang === 'fr'
    ? [
        { label: 'Fonctionnalités', href: '#features' },
        { label: 'Tarifs', href: '#pricing' },
        { label: 'Hash Hunt', href: '/hash-hunt' },
      ]
    : [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Hash Hunt', href: '/hash-hunt' },
      ]

  const ctaLabel = lang === 'ar' ? 'ابدأ مجانًا' : lang === 'fr' ? 'Commencer' : 'Start Free'

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200" dir="ltr">
      <div className="container-page">
        <div className="flex items-center justify-between min-h-[90px] py-2">

          <a href="/" className="flex-shrink-0">
            <img
              src="https://i.ibb.co/p6bMBFQT/IN-LOGO-icon-with-tag-1.png"
              alt="Hash Resume"
              style={{
                height: 70,
                width: 'auto',
                objectFit: 'contain',
                maxWidth: 220,
              }}
            />
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
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
              className="btn-primary btn-sm inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {ctaLabel}
            </motion.button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
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
