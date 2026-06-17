import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { 
  Menu, 
  X, 
  Sparkles, 
  Layers, 
  Briefcase, 
  CreditCard, 
  ChevronDown, 
  Globe, 
  FileText, 
  MessageSquare, 
  Search,
  HelpCircle
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
  const handleStart = onStartClick || (() => navigate('/editor'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
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
    label: lang === 'ar' ? 'السير والقوالب' : lang === 'fr' ? 'Modèles & CV' : 'Resumes & Templates',
    items: [
      {
        label: lang === 'ar' ? 'قوالب السيرة الذاتية' : lang === 'fr' ? 'Modèles de CV' : 'Resume Templates',
        href: '/templates',
        icon: Layers,
        badge: lang === 'ar' ? 'مميز' : 'PRO',
        color: 'emerald',
        desc: lang === 'ar' ? 'قوالب مهنية مجهزة ومصممة لتجاوز فحص ATS' : 'ATS-friendly premium layouts and modern designs',
        isInternal: true
      },
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
        label: lang === 'ar' ? 'المقابلة الذكية' : lang === 'fr' ? 'Coach Entretien' : 'AI Interview Coach', 
        href: '/interview-prep', 
        badge: lang === 'ar' ? 'متقدم' : 'PRO', 
        color: 'brand',
        icon: MessageSquare,
        desc: lang === 'ar' ? 'مستشار تدريبي ذكي مالي وعملي' : 'Practice mock interviews with AI feedback' 
      },
      { 
        label: lang === 'ar' ? 'خطاب التغطية AI' : lang === 'fr' ? 'Lettre de Motivation' : 'AI Cover Letter', 
        href: '/cover-letter', 
        badge: lang === 'ar' ? 'هدية' : 'FREE', 
        color: 'brand',
        icon: Sparkles,
        desc: lang === 'ar' ? 'كتابة فورية للخطابات بالصياغة الرسمية' : 'Generate tailor-made cover letters'
      },
    ]
  };

  const hashHuntItem = {
    label: lang === 'ar' ? 'فرص العمل (هاش هانت)' : lang === 'fr' ? 'Hash Hunt' : 'Hash Hunt',
    href: '/hash-hunt',
    icon: Briefcase,
    badge: lang === 'ar' ? 'جديد' : 'NEW',
    badgeColor: 'orange'
  };

  const infoMenu = {
    label: lang === 'ar' ? 'الخدمات والأسعار' : lang === 'fr' ? 'Aide & Tarifs' : 'Pricing & Info',
    items: [
      {
        label: lang === 'ar' ? 'خطط الأسعار والاشتراك' : lang === 'fr' ? 'Tarifs' : 'Pricing Plans',
        href: '/pricing',
        icon: CreditCard,
        desc: lang === 'ar' ? 'اشترِك بأسعار مرنة وعادلة لجميع الباحثين عن عمل' : 'Fair and flexible plans for your transition success',
        isInternal: true
      },
      {
        label: lang === 'ar' ? 'كيف يعمل فحص ATS؟' : lang === 'fr' ? 'Comment ça marche' : 'How ATS works',
        href: '/how-ats-works',
        icon: HelpCircle,
        desc: lang === 'ar' ? 'فهم آلية قراءة ومعالجة السير الذاتية وتجاوز الفحص' : 'Demystify ATS algorithms and maximize interview odds',
        isInternal: true
      }
    ]
  };

  const ctaLabel = lang === 'ar' ? 'ابدأ المحرر الذكي ⚡' : lang === 'fr' ? 'Créer maintenant' : 'Start Builder ⚡'

  return (
    <nav className={cn(
      "sticky top-0 z-50 transition-all duration-300 border-b", 
      scrolled 
        ? "bg-white/70 backdrop-blur-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.03)] border-slate-200/40 py-2" 
        : "bg-white/95 border-slate-100 py-3"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between relative h-16">

          {/* Left: Logo */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center transform origin-left rtl:origin-right hover:scale-102 transition-all duration-300">
              <img
                src="https://i.ibb.co/p6bMBFQT/IN-LOGO-icon-with-tag-1.png"
                alt="Hash Resume"
                className="h-[75px] sm:h-[85px] w-auto object-contain"
              />
            </Link>
          </div>

          {/* Center: Interactive Nav Items with Premium Minimalist Icons */}
          <div className="hidden lg:flex items-center justify-center gap-1 flex-1 px-4">
            
            {/* 1. Resume & Templates Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => { setResumeOpen(true); setToolsOpen(false); setInfoOpen(false); }}
              onMouseLeave={() => setResumeOpen(false)}
            >
              <button
                onClick={() => setResumeOpen(!resumeOpen)}
                className={cn(
                  "px-3 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer",
                  resumeOpen && "bg-slate-50 text-slate-900"
                )}
              >
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>{resumeMenu.label}</span>
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-250 opacity-70', resumeOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {resumeOpen && (
                  <>
                    <div className="fixed inset-0 z-35" onClick={() => setResumeOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute start-0 mt-2 bg-white border border-slate-200/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden w-80 z-45 p-2.5 text-start"
                    >
                      {resumeMenu.items.map((item, idx) => {
                        const IconComponent = item.icon;
                        const linkClass = "flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50/80 transition-all group cursor-pointer";
                        
                        const badgeEl = item.badge && (
                          <span className={cn(
                            "text-[8px] uppercase font-black px-1.5 py-0.5 rounded-md leading-none shrink-0",
                            item.color === 'emerald' 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                              : "bg-[#FF4D2D]/5 text-[#FF4D2D] border border-[#FF4D2D]/10"
                          )}>
                            {item.badge}
                          </span>
                        );

                        const content = (
                          <>
                            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100/50 flex items-center justify-center text-slate-500 group-hover:text-[#FF4D2D] group-hover:bg-[#FF4D2D]/5 transition-colors shrink-0">
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex-1 space-y-0.5 min-w-0">
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="text-xs font-black text-slate-800 group-hover:text-[#FF4D2D] transition-colors">{item.label}</span>
                                {badgeEl}
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium leading-normal whitespace-normal">{item.desc}</p>
                            </div>
                          </>
                        );

                        return item.onClickAction ? (
                          <div
                            key={idx}
                            onClick={() => { handleStart(); setResumeOpen(false); }}
                            className={linkClass}
                          >
                            {content}
                          </div>
                        ) : (
                          <Link
                            key={item.href}
                            to={item.href || '/'}
                            onClick={() => setResumeOpen(false)}
                            className={linkClass}
                          >
                            {content}
                          </Link>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Custom Tools Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => { setToolsOpen(true); setResumeOpen(false); setInfoOpen(false); }}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className={cn(
                  "px-3 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer",
                  toolsOpen && "bg-slate-50 text-slate-900"
                )}
              >
                <Sparkles className="w-4 h-4 text-[#FF4D2D] animate-pulse" />
                <span>{toolsMenu.label}</span>
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-250 opacity-70', toolsOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {toolsOpen && (
                  <>
                    <div className="fixed inset-0 z-35" onClick={() => setToolsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute start-0 mt-2 bg-white border border-slate-200/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden w-72 z-45 p-2.5 text-start"
                    >
                      {toolsMenu.items.map((item) => {
                        const isItemInternal = item.href.startsWith('/') && !item.href.includes('#');
                        const IconComponent = item.icon;
                        const linkClass = "flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50/80 transition-all group cursor-pointer";
                        
                        const badgeEl = item.badge && (
                          <span className={cn(
                            "text-[8px] uppercase font-black px-1.5 py-0.5 rounded-md leading-none shrink-0",
                            item.color === 'emerald' 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                              : "bg-[#FF4D2D]/5 text-[#FF4D2D] border border-[#FF4D2D]/10"
                          )}>
                            {item.badge}
                          </span>
                        );

                        const content = (
                          <>
                            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100/50 flex items-center justify-center text-slate-500 group-hover:text-[#FF4D2D] group-hover:bg-[#FF4D2D]/5 transition-colors shrink-0">
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex-1 space-y-0.5 min-w-0">
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="text-xs font-black text-slate-800 group-hover:text-[#FF4D2D] transition-colors">{item.label}</span>
                                {badgeEl}
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium leading-normal whitespace-normal">{item.desc}</p>
                            </div>
                          </>
                        );

                        return isItemInternal ? (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setToolsOpen(false)}
                            className={linkClass}
                          >
                            {content}
                          </Link>
                        ) : (
                          <a
                            key={item.href}
                            href={item.href}
                            onClick={() => setToolsOpen(false)}
                            className={linkClass}
                          >
                            {content}
                          </a>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Hash Hunt Direct Link (Highly Visual with Pulsing badge) */}
            <Link
              to={hashHuntItem.href}
              className="px-3 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5 relative group whitespace-nowrap"
            >
              <Briefcase className="w-4 h-4 text-orange-500 group-hover:animate-bounce" />
              <span>{hashHuntItem.label}</span>
              <span className="bg-[#FF4D2D] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none transform scale-90 select-none animate-pulse">
                {hashHuntItem.badge}
              </span>
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#FF4D2D] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-250" />
            </Link>

            {/* 4. Help & Pricing Dropdown (infoMenu) */}
            <div 
              className="relative"
              onMouseEnter={() => { setInfoOpen(true); setResumeOpen(false); setToolsOpen(false); }}
              onMouseLeave={() => setInfoOpen(false)}
            >
              <button
                onClick={() => setInfoOpen(!infoOpen)}
                className={cn(
                  "px-3 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer",
                  infoOpen && "bg-slate-50 text-slate-900"
                )}
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>{infoMenu.label}</span>
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-250 opacity-70', infoOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {infoOpen && (
                  <>
                    <div className="fixed inset-0 z-35" onClick={() => setInfoOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute start-0 mt-2 bg-white border border-slate-200/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden w-80 z-45 p-2.5 text-start"
                    >
                      {infoMenu.items.map((item, idx) => {
                        const IconComponent = item.icon;
                        const linkClass = "flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50/80 transition-all group cursor-pointer";
                        
                        const content = (
                          <>
                            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100/50 flex items-center justify-center text-slate-500 group-hover:text-[#FF4D2D] group-hover:bg-[#FF4D2D]/5 transition-colors shrink-0">
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex-1 space-y-0.5 min-w-0">
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="text-xs font-black text-slate-800 group-hover:text-[#FF4D2D] transition-colors">{item.label}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium leading-normal whitespace-normal">{item.desc}</p>
                            </div>
                          </>
                        );

                        return (
                          <Link
                            key={idx}
                            to={item.href}
                            onClick={() => setInfoOpen(false)}
                            className={linkClass}
                          >
                            {content}
                          </Link>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Right actions: Language selection and CTA */}
          <div className="flex items-center justify-end gap-3 shrink-0">
            
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="hover:bg-slate-50 border border-slate-100/40 px-3 py-2 rounded-xl font-bold text-slate-500 hover:text-slate-800 transition-all flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer"
              >
                <Globe className="w-3.8 h-3.8 text-slate-400" />
                <span>{LANG_LABELS[lang]}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

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
                            lang === l ? 'text-[#FF4D2D] bg-[#FF4D2D]/5 font-black' : 'text-slate-600'
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

            {/* Start CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              className="bg-[#FF4D2D] hover:bg-[#E03C1C] text-white px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm hidden sm:inline-flex items-center gap-2 transition-all duration-200 shadow-md shadow-[#FF4D2D]/10 active:scale-98 cursor-pointer"
            >
              <span>{ctaLabel}</span>
            </motion.button>

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
                              : "bg-[#FF4D2D]/5 border-[#FF4D2D]/15 text-[#FF4D2D]"
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
                          : "bg-orange-50 border-orange-100 text-[#FF4D2D]"
                      )}>
                        {item.badge}
                      </span>
                    );

                    const content = (
                      <div className="flex items-center gap-2.5">
                        <IconComponent className="w-4.5 h-4.5 text-[#FF4D2D] shrink-0" />
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

              {/* 3. Hash Hunt Group */}
              <div className="pt-2 border-t border-slate-100">
                <div className="px-3 text-[10px] font-black text-slate-400 tracking-wider uppercase mb-1.5 font-bold">
                  {lang === 'ar' ? 'التوظيف' : 'Careers'}
                </div>
                <Link
                  to={hashHuntItem.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm font-semibold hover:text-slate-900 rounded-xl hover:bg-slate-50 flex items-center justify-between gap-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4.5 h-4.5 text-orange-500 shrink-0" />
                    <span className="text-slate-700 font-bold">{hashHuntItem.label}</span>
                  </div>
                  <span className="bg-[#FF4D2D] text-white text-[8px] font-black px-2 py-0.5 rounded-full leading-none animate-pulse">
                    {hashHuntItem.badge}
                  </span>
                </Link>
              </div>

              {/* 4. Info & Pricing Group */}
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
                        ? 'border-[#FF4D2D]/60 bg-[#FF4D2D]/5 text-[#FF4D2D] font-black' 
                        : 'border-slate-100 text-slate-500 hover:bg-slate-50'
                    )}
                  >
                    {LANG_LABELS[l]}
                  </button>
                ))}
              </div>

              <button
                onClick={() => { handleStart(); setMobileOpen(false) }}
                className="bg-[#FF4D2D] text-white hover:bg-[#E03C1C] mt-4 w-full justify-center inline-flex items-center gap-2 py-3 rounded-xl font-black text-sm shadow-md shadow-[#FF4D2D]/10"
              >
                <span>{ctaLabel}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
