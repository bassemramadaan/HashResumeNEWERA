import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { 
  Menu, 
  X, 
  Briefcase, 
  CreditCard, 
  ChevronDown, 
  Globe, 
  FileText, 
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AppLang } from '@/hooks/useDirection'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useNavigate, Link } from 'react-router-dom'
import { LogoImage } from '@/components/LogoImage';
import { LOGO_BLACK_URL, LOGO_WHITE_URL } from '@/constants';

const LANG_LABELS = { ar: 'العربية', en: 'English', fr: 'Français' }
const LANGS: AppLang[] = ['ar', 'en', 'fr']

interface NavbarProps {
  onStartClick?: () => void
}

export function Navbar({ onStartClick }: NavbarProps = {}) {
  const { language: lang, setLanguage: onLangChange } = useLanguageStore()
  const navigate = useNavigate()
  const handleStart = onStartClick || (() => navigate('/templates'))
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
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

  const resumeMenu = {
    label: lang === 'ar' ? 'السير الذاتية' : lang === 'fr' ? 'Mon CV' : 'Resumes',
    items: [
      {
        label: lang === 'ar' ? 'إنشاء سيرة جديدة ✨' : lang === 'fr' ? 'Créer un CV' : 'Create New Resume ✨',
        onClickAction: true,
        icon: FileText,
        badge: lang === 'ar' ? 'سريع' : 'FAST',
        color: 'brand',
      }
    ]
  };

  const toolsMenu = {
    label: lang === 'ar' ? 'الأدوات الذكية' : lang === 'fr' ? 'Outils IA' : 'AI Tools',
    items: [
      { 
        label: lang === 'ar' ? 'فحص سيرة ATS' : lang === 'fr' ? 'Test ATS' : 'ATS Check', 
        href: '/#ats-check', 
        badge: lang === 'ar' ? 'مجاني' : 'FREE', 
        color: 'emerald',
        icon: Search,
      },
      {
        label: lang === 'ar' ? 'لوحة التحكم والمكافآت' : lang === 'fr' ? 'Mon Tableau de Bord' : 'Rewards Dashboard',
        href: '/dashboard',
        badge: lang === 'ar' ? 'نشط' : 'LIVE',
        color: 'emerald',
        icon: CreditCard,
      },
      {
        label: lang === 'ar' ? 'وظائف هاش' : lang === 'fr' ? 'Hash Hunt' : 'Hash Hunt',
        href: '/hash-hunt',
        badge: lang === 'ar' ? 'جديد' : 'NEW',
        color: 'brand',
        icon: Briefcase,
      }
    ]
  };

  const infoMenu = {
    label: lang === 'ar' ? 'الخدمات والأسعار' : lang === 'fr' ? 'Aide & Tarifs' : 'Pricing & Info',
    items: [
      {
        label: lang === 'ar' ? 'خطط الأسعار والاشتراك' : lang === 'fr' ? 'Tarifs' : 'Pricing Plans',
        href: '/pricing',
        icon: CreditCard,
      }
    ]
  };

  return (
    <nav className={cn(
      "sticky top-0 z-[120] transition-all duration-300 border-b", 
      scrolled 
        ? "bg-white/70 backdrop-blur-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.03)] border-slate-200/40 py-1" 
        : "bg-white/95 border-slate-100 py-2"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between relative h-20 sm:h-24 lg:h-[115px] lg:[direction:ltr]">
          {/* Left: Hash Hunt + More */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
             {/* Hash Hunt Link (Desktop only) */}
             <Link 
               to="/hash-hunt" 
               className="hidden lg:flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-brand-600 transition-all shrink-0"
             >
               <span>{lang === 'ar' ? 'وظائف هاش 💼' : 'Hash Hunt 💼'}</span>
             </Link>

             <div className="hidden lg:flex relative group">
               <button className="text-sm font-bold text-slate-700 hover:text-brand-600 flex items-center gap-1">
                 {lang === 'ar' ? 'المزيد' : 'More'}
                 <ChevronDown className="w-4 h-4" />
               </button>
               {/* More Menu */}
               <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
                   <a href="/#ats-check" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                     {lang === 'ar' ? 'فحص ATS' : 'ATS Check'}
                   </a>
                   <Link to="/pricing" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                     {lang === 'ar' ? 'الأسعار' : 'Pricing'}
                   </Link>
                   <Link to="/templates" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                      {lang === 'ar' ? 'القوالب' : 'Templates'}
                    </Link>
                </div>
              </div>
           </div>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center shrink-0 relative z-20">
            <Link to="/" className="flex items-center">
              <LogoImage
                src={LOGO_BLACK_URL}
                alt="Hash Resume"
                className="block h-16 w-auto object-contain select-none"
              />
            </Link>
          </div>
          
          {/* Desktop Logo */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
             <Link to="/" className="flex items-center transform hover:scale-105 transition-all duration-300">
                <LogoImage
                  src={LOGO_BLACK_URL}
                  alt="Hash Resume"
                  className="block h-24 sm:h-28 lg:h-[110px] w-auto max-w-[420px] object-contain select-none"
                />
             </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-2 sm:gap-4 shrink-0 lg:w-auto">
            {/* Language Switcher (Desktop only) */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="hover:bg-slate-50 border border-slate-100/40 px-3 py-2 rounded-xl font-bold text-slate-500 hover:text-slate-800 transition-all flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{LANG_LABELS[lang]}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div
                    className="absolute end-0 mt-2 bg-white border border-slate-200/80 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] overflow-hidden w-36 z-50 p-1"
                  >
                    {LANGS.map((l) => (
                      <button
                        key={l}
                        onClick={() => { onLangChange(l); setLangOpen(false) }}
                        className={cn(
                          'w-full text-start px-3 py-2 text-xs rounded-xl hover:bg-slate-50 transition-all font-bold',
                          lang === l ? 'text-[#001639] bg-[#001639]/5 font-black' : 'text-slate-600'
                        )}
                      >
                        {LANG_LABELS[l]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative z-[100] flex h-12 w-12 items-center justify-center rounded-lg border bg-white text-slate-900 shadow-sm cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[105] bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: lang === 'ar' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: lang === 'ar' ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                "fixed inset-y-0 z-[110] w-[85%] max-w-sm bg-[#001639] text-white p-6 pt-10 overflow-y-auto",
                lang === 'ar' ? "right-0" : "left-0"
              )}
            >
                <div className="flex items-center justify-between mb-10">
                  <LogoImage src={LOGO_WHITE_URL} alt="Hash Resume" className="h-8 w-auto object-contain" />
                  <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-white/10">
                    <X className="w-8 h-8" />
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Resume & Templates */}
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{resumeMenu.label}</div>
                        {resumeMenu.items.map((item, idx) => (
                           <div key={idx} onClick={() => { handleStart(); setIsMobileMenuOpen(false); }} className="flex items-center justify-between py-3 cursor-pointer group">
                             <span className="text-xl font-semibold group-hover:text-emerald-400 transition-colors">{item.label}</span>
                             {item.badge && <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">{item.badge}</span>}
                           </div>
                        ))}
                    </div>

                    {/* Tools */}
                    <div className="border-t border-white/10 pt-6">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{toolsMenu.label}</div>
                        {toolsMenu.items.map((item) => (
                          <Link key={item.href} to={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-3 group">
                              <span className="text-xl font-semibold group-hover:text-brand-400 transition-colors">{item.label}</span>
                              {item.badge && <span className={cn("text-[10px] px-2 py-0.5 rounded-md font-bold", item.color === 'emerald' ? 'bg-emerald-500 text-white' : 'bg-brand-500 text-white')}>{item.badge}</span>}
                          </Link>
                        ))}
                    </div>

                    {/* Info & Pricing */}
                    <div className="border-t border-white/10 pt-6">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{infoMenu.label}</div>
                        {infoMenu.items.map((item, idx) => (
                          <Link key={idx} to={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-3 group">
                              <span className="text-xl font-semibold group-hover:text-brand-400 transition-colors">{item.label}</span>
                          </Link>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-6 start-6 end-6 flex flex-col gap-4">
                     <button onClick={() => { onLangChange(lang === 'ar' ? 'en' : 'ar'); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 text-sm font-bold text-slate-300">
                         <Globe className="w-4 h-4" />
                         {LANG_LABELS[lang === 'ar' ? 'en' : 'ar']}
                     </button>
                     <button onClick={handleStart} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl text-lg transition-all">
                        {lang === 'ar' ? 'ابدأ مجاناً' : 'Start for Free'}
                     </button>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}

