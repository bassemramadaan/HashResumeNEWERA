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
  const [toolsOpen, setToolsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toolsMenu = {
    label: lang === 'ar' ? 'الأدوات' : lang === 'fr' ? 'Outils' : 'Tools',
    items: lang === 'ar'
      ? [
          { label: 'فحص ATS', href: '/#ats-check', badge: 'مجاني', color: 'emerald' },
          { label: 'المقابلة الذكية', href: '/interview-prep', badge: 'جديد', color: 'brand' },
          { label: 'Hash Hunt', href: '/hash-hunt', badge: 'جديد', color: 'brand' },
        ]
      : lang === 'fr'
      ? [
          { label: 'Test ATS', href: '/#ats-check', badge: 'GRATUIT', color: 'emerald' },
          { label: 'Coach Entretien', href: '/interview-prep', badge: 'NEW', color: 'brand' },
          { label: 'Hash Hunt', href: '/hash-hunt', badge: 'NEW', color: 'brand' },
        ]
      : [
          { label: 'ATS Check', href: '/#ats-check', badge: 'FREE', color: 'emerald' },
          { label: 'Interview Prep', href: '/interview-prep', badge: 'NEW', color: 'brand' },
          { label: 'Hash Hunt', href: '/hash-hunt', badge: 'NEW', color: 'brand' },
        ]
  };

  const mainLinks = lang === 'ar'
    ? [
        { label: 'الميزات', href: '/#features' },
        { label: 'الأسعار', href: '/#pricing' },
        { label: 'كيف يعمل؟', href: '/how-ats-works' },
      ]
    : lang === 'fr'
    ? [
        { label: 'Fonctionnalités', href: '/#features' },
        { label: 'Tarifs', href: '/#pricing' },
        { label: 'Comment ça marche', href: '/how-ats-works' },
      ]
    : [
        { label: 'Features', href: '/#features' },
        { label: 'Pricing', href: '/#pricing' },
        { label: 'How it Works', href: '/how-ats-works' },
      ];

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
            {mainLinks.map((link, idx) => {
              const isInternal = link.href.startsWith('/') && !link.href.includes('#');
              const linkEl = isInternal ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/50 transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF4D2D] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300" />
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/50 transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF4D2D] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300" />
                </a>
              );

              // We render Tools Dropdown in the second position or third position
              if (idx === 1) {
                return (
                  <div key="tools-dropdown-wrapper" className="flex items-center gap-2">
                    {linkEl}
                    
                    {/* Tools Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setToolsOpen(!toolsOpen)}
                        onMouseEnter={() => setToolsOpen(true)}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/50 transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{toolsMenu.label}</span>
                        <svg className={cn('w-3 h-3 transition-transform', toolsOpen && 'rotate-180')} viewBox="0 0 12 12" fill="none">
                          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>

                      <AnimatePresence>
                        {toolsOpen && (
                          <>
                            {/* Backdrop to close on other clicks */}
                            <div className="fixed inset-0 z-30" onClick={() => setToolsOpen(false)} />
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              onMouseLeave={() => setToolsOpen(false)}
                              className="absolute start-0 mt-2 bg-white border border-slate-150 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden w-56 z-40 p-2 text-start"
                            >
                              {toolsMenu.items.map((item) => {
                                const isItemInternal = item.href.startsWith('/') && !item.href.includes('#');
                                const linkClass = "flex items-center justify-between gap-2 px-4 py-3 text-sm font-bold text-slate-700 hover:text-slate-950 rounded-xl hover:bg-slate-50 transition-all";
                                const badgeEl = item.badge && (
                                  <span className={cn(
                                    "text-[8.5px] uppercase font-black px-1.5 py-0.5 rounded-md leading-none shadow-xs border",
                                    item.color === 'emerald' 
                                      ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                                      : "bg-orange-50 border-orange-100 text-[#FF4D2D]"
                                  )}>
                                    {item.badge}
                                  </span>
                                );

                                return isItemInternal ? (
                                  <Link
                                    key={item.href}
                                    to={item.href}
                                    onClick={() => setToolsOpen(false)}
                                    className={linkClass}
                                  >
                                    <span>{item.label}</span>
                                    {badgeEl}
                                  </Link>
                                ) : (
                                  <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setToolsOpen(false)}
                                    className={linkClass}
                                  >
                                    <span>{item.label}</span>
                                    {badgeEl}
                                  </a>
                                );
                              })}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              }
              return linkEl;
            })}
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
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 77, 45, 0.05)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="border-2 border-[#FF4D2D] text-[#FF4D2D] px-5 py-2 rounded-full font-black text-sm hidden md:inline-flex items-center gap-2 transition-all duration-300 bg-transparent group"
            >
              <Sparkles className="w-4 h-4 text-[#FF4D2D]" />
              <span>{ctaLabel}</span>
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
              {mainLinks.map((link) => {
                const isInternal = link.href.startsWith('/') && !link.href.includes('#');
                const linkClass = "px-3 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-50 flex items-center justify-between gap-2";
                if (isInternal) {
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={linkClass}
                    >
                      <span>{link.label}</span>
                    </Link>
                  );
                } else {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={linkClass}
                    >
                      <span>{link.label}</span>
                    </a>
                  );
                }
              })}

              {/* Tools Group in Mobile Menu */}
              <div className="mt-3 pt-3 border-t border-neutral-150">
                <div className="px-3 text-[10px] font-black text-slate-400 tracking-wider uppercase mb-1">
                  {toolsMenu.label}
                </div>
                {toolsMenu.items.map((item) => {
                  const isItemInternal = item.href.startsWith('/') && !item.href.includes('#');
                  const linkClass = "px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50/70 flex items-center justify-between gap-2";
                  const badgeEl = item.badge && (
                    <span className={cn(
                      "text-[8px] uppercase font-bold px-1.5 py-0.5 rounded-md leading-none border",
                      item.color === 'emerald' 
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                        : "bg-orange-50 border-orange-100 text-[#FF4D2D]"
                    )}>
                      {item.badge}
                    </span>
                  );

                  return isItemInternal ? (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={linkClass}
                    >
                      <span>{item.label}</span>
                      {badgeEl}
                    </Link>
                  ) : (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={linkClass}
                    >
                      <span>{item.label}</span>
                      {badgeEl}
                    </a>
                  );
                })}
              </div>

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
                className="border-2 border-[#FF4D2D] text-[#FF4D2D] hover:bg-[#FF4D2D]/5 mt-2 w-full justify-center inline-flex items-center gap-2 py-2.5 rounded-xl font-bold transition-all bg-transparent"
              >
                <Sparkles className="w-4 h-4 text-[#FF4D2D]" />
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
