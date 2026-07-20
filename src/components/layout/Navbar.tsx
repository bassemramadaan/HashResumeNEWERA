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

const LANG_LABELS = { ar: 'العربية', en: 'English', fr: 'Français' }
const LANGS: AppLang[] = ['ar', 'en', 'fr']

interface NavbarProps {
  onStartClick?: () => void
}

export function Navbar({ onStartClick }: NavbarProps = {}) {
  const { language: lang, setLanguage: onLangChange } = useLanguageStore()
  const navigate = useNavigate()
  const handleStart = onStartClick || (() => navigate('/templates'))
  const [mobileOpen, setMobileOpen] = useState(false)
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
        desc: lang === 'ar' ? 'ابدأ كتابة سيرتك مهنيًا خطوة بخطوة بالذكاء الاصطناعي' : 'Build your resume step-by-step with AI support'
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
        desc: lang === 'ar' ? 'تحسين السيرة لمحركات الفحص' : 'Optimize your resume for ATS systems'
      },
      {
        label: lang === 'ar' ? 'لوحة التحكم والمكافآت' : lang === 'fr' ? 'Mon Tableau de Bord' : 'Rewards Dashboard',
        href: '/dashboard',
        badge: lang === 'ar' ? 'نشط' : 'LIVE',
        color: 'emerald',
        icon: CreditCard,
        desc: lang === 'ar' ? 'متابعة التقديمات، الإحالات، والأكواد المدفوعة' : 'Track resume slots, application stages & free reward exports'
      },
      {
        label: lang === 'ar' ? 'وظائف هاش' : lang === 'fr' ? 'Hash Hunt' : 'Hash Hunt',
        href: '/hash-hunt',
        badge: lang === 'ar' ? 'جديد' : 'NEW',
        color: 'brand',
        icon: Briefcase,
        desc: lang === 'ar' ? 'تصفح وقدم لفرص العمل المتوافقة' : 'Explore and apply to matched job opportunities'
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
        desc: lang === 'ar' ? 'اشترِك بأسعار مرنة وعادلة لجميع الباحثين عن عمل' : 'Fair and flexible plans for your transition'
      }
    ]
  };

  return (
    <nav className={cn(
      "sticky top-0 z-50 transition-all duration-300 border-b", 
      scrolled 
        ? "bg-white/70 backdrop-blur-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.03)] border-slate-200/40 py-1" 
        : "bg-white/95 border-slate-100 py-2"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between relative h-16 sm:h-20 lg:[direction:ltr]">
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

          {/* Logo (Centered absolutely in lg) */}
          <div className="flex items-center gap-2 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2 z-10">
            <Link to="/" className="flex items-center transform hover:scale-105 transition-all duration-300">
              <img
                src="/logo.png"
                alt="Hash Resume"
                className="h-[40px] sm:h-[50px] md:h-[60px] w-auto object-contain select-none"
              />
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-2 sm:gap-4 shrink-0 w-full lg:w-auto">
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
              {/* Lang Menu */}
              <AnimatePresence>
                {langOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
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
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5.5 h-5.5 text-slate-700" /> : <Menu className="w-5.5 h-5.5 text-slate-700" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-slate-100 bg-white"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
              
              {/* 1. Resume & Templates Group */}
              <div>
                <div className="px-3 text-[10px] font-black text-slate-400 tracking-wider uppercase mb-1.5">
                  {resumeMenu.label}
                </div>
                <div className="flex flex-col gap-1">
                  {resumeMenu.items.map((item, idx) => {
                    const IconComponent = item.icon;
                    const content = (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <IconComponent className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                          <span className="text-slate-700">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={cn(
                            "text-[8px] uppercase font-bold px-2 py-0.5 rounded-md leading-none border",
                            item.color === 'emerald' 
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                              : "bg-[#001639]/5 border-[#001639]/15 text-[#001639]"
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    );

                    return item.onClickAction ? (
                      <div
                        key={idx}
                        onClick={() => { handleStart(); setMobileOpen(false); }}
                        className="px-3 py-2.5 text-sm font-semibold hover:text-slate-900 rounded-xl hover:bg-slate-50 flex items-center justify-between gap-2.5 cursor-pointer"
                      >
                        {content}
                      </div>
                    ) : (
                      <Link
                        key={item.href || idx}
                        to={item.href || '/'}
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-2.5 text-sm font-semibold hover:text-slate-900 rounded-xl hover:bg-slate-50 flex items-center justify-between gap-2.5"
                      >
                        {content}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* 2. Tools Group in Mobile Menu */}
              <div className="pt-2 border-t border-slate-100">
                <div className="px-3 text-[10px] font-black text-slate-400 tracking-wider uppercase mb-1.5">
                  {toolsMenu.label}
                </div>
                <div className="flex flex-col gap-1">
                  {toolsMenu.items.map((item) => {
                    const isItemInternal = item.href.startsWith('/') && !item.href.includes('#');
                    const IconComponent = item.icon;
                    const linkClass = "px-3 py-2.5 text-sm font-semibold hover:text-slate-900 rounded-xl hover:bg-slate-50 flex items-center justify-between gap-2.5 cursor-pointer";
                    
                    const badgeEl = item.badge && (
                      <span className={cn(
                        "text-[8px] uppercase font-bold px-2 py-0.5 rounded-md leading-none border",
                        item.color === 'emerald' 
                          ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                          : "bg-orange-50 border-orange-100 text-[#001639]"
                      )}>
                        {item.badge}
                      </span>
                    );

                    const content = (
                      <div className="flex items-center gap-2.5">
                        <IconComponent className="w-4.5 h-4.5 text-[#001639] shrink-0" />
                        <span className="text-slate-700">{item.label}</span>
                      </div>
                    );

                    return isItemInternal ? (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={linkClass}
                      >
                        {content}
                        {badgeEl}
                      </Link>
                    ) : (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={linkClass}
                      >
                        {content}
                        {badgeEl}
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* 3. Info & Pricing Group */}
              <div className="pt-2 border-t border-slate-100">
                <div className="px-3 text-[10px] font-black text-slate-400 tracking-wider uppercase mb-1.5">
                  {infoMenu.label}
                </div>
                <div className="flex flex-col gap-1">
                  {infoMenu.items.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={idx}
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-2.5 text-sm font-semibold hover:text-slate-900 rounded-xl hover:bg-slate-50 flex items-center justify-between gap-2.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComponent className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                          <span className="text-slate-700">{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Language toggler for Mobile */}
              <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-100">
                {LANGS.map((l) => (
                  <button
                    key={l}
                    onClick={() => { onLangChange(l); setMobileOpen(false) }}
                    className={cn(
                      'text-xs font-bold py-2.5 rounded-xl border transition-all text-center uppercase', 
                      lang === l 
                        ? 'border-[#001639]/60 bg-[#001639]/5 text-[#001639] font-black' 
                        : 'border-slate-100 text-slate-500 hover:bg-slate-50'
                    )}
                  >
                    {LANG_LABELS[l]}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
