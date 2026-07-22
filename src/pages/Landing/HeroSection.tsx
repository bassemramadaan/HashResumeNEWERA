import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
} from 'lucide-react'
import type { AppLang } from '@/hooks/useDirection'
import { trackEvent } from '@/services/analytics'
import { useNavigate } from 'react-router-dom'
import MiniCVPreview from '@/components/landing/MiniCVPreview'

interface HeroSectionProps {
  lang: AppLang
  onStart: () => void
}

const COPY = {
  ar: {
    badge: 'ثورة في إنشاء السير الذاتية',
    titleMain: 'سيرتك الاحترافية متوافقة مع الـ ATS في 5 دقائق',
    subtitle: 'العربية • الإنجليزية • الفرنسية. بدون تسجيل حساب.',
    cta: 'ابدأ الآن مجاناً',
    ctaSec: 'استكشف الأمثلة',
    noCreditCard: 'لا حاجة لبطاقة ائتمان للبدء',
  },
  en: {
    badge: 'Revolutionizing Resume Creation',
    titleMain: 'Build an ATS-ready CV in 5 minutes',
    subtitle: 'Arabic • English • French. No signup required.',
    cta: 'Build Your CV Free',
    ctaSec: 'Explore Templates',
    noCreditCard: 'No credit card required to start',
  },
  fr: {
    badge: 'Révolution dans la création de CV',
    titleMain: 'Votre CV optimisé ATS en 5 minutes',
    subtitle: 'Arabe • Anglais • Français. Sans inscription.',
    cta: 'Créer Gratuitement',
    ctaSec: 'Découvrir les modèles',
    noCreditCard: 'Pas de carte de crédit requise',
  }
}

const ROTATING_WORDS = {
  ar: ['بثقة واحترافية', 'بذكاء اصطناعي واعد', 'لتتخطى مرشحات الفرز', 'لتأمين وظيفة أحلامك'],
  en: ['with total confidence', 'with powerful AI tools', 'to clear ATS systems', 'for your dream job'],
  fr: ['avec assurance', 'grâce à l\'IA intelligente', 'pour passer l\'ATS', 'pour décrocher votre job']
}

export function HeroSection({ lang, onStart }: HeroSectionProps) {
  const copy = COPY[lang] || COPY['en']
  const navigate = useNavigate()
  const isAr = lang === 'ar'
  const words = ROTATING_WORDS[lang] || ROTATING_WORDS['en']
  const [wordIndex, setWordIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [words])

  // Motion reduction configuration
  const motionTransition = shouldReduceMotion 
    ? { duration: 0.1 } 
    : { duration: 0.4, ease: "easeOut" }

  const motionInitial = shouldReduceMotion 
    ? { opacity: 0 } 
    : { y: 25, opacity: 0 }

  const motionAnimate = shouldReduceMotion 
    ? { opacity: 1 } 
    : { y: 0, opacity: 1 }

  const motionExit = shouldReduceMotion 
    ? { opacity: 0 } 
    : { y: -25, opacity: 0 }

  return (
    <section 
      className="relative pt-4 pb-12 md:pt-24 md:pb-32 lg:pt-36 lg:pb-36 overflow-hidden bg-white" 
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-brand-200/20 to-brand-100/30 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-12 left-1/4 w-[300px] h-[300px] bg-brand-200/10 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute top-36 right-1/4 w-[250px] h-[250px] bg-brand-100/15 rounded-full blur-[70px] pointer-events-none -z-10" />

      <div className="container relative z-10 mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center text-center space-y-5 md:space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:inline-flex items-center gap-2 md:gap-3 px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 border border-brand-100/60 text-[10px] md:text-xs font-black uppercase tracking-[0.08em] whitespace-nowrap shadow-3xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{copy.badge}</span>
          </motion.div>

          <h1 
            className="hero-title text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-950 md:tracking-tight md:leading-[1.1] max-w-5xl"
          >
            <span className="block md:hidden">
              {lang === 'ar' ? 'سيرتك الاحترافية متوافقة مع الـ ATS في 5 دقائق' : lang === 'fr' ? 'Votre CV optimisé ATS en 5 minutes' : 'Build an ATS-ready CV in 5 minutes'}
            </span>
            <span className="hidden md:inline">
              {copy.titleMain}{" "}
              <span className={`hero-highlight-text text-brand-600 inline-flex min-h-[1.15em] items-center justify-center max-w-full text-center ${isAr ? 'mr-3' : 'ml-3'}`}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={motionInitial}
                    animate={motionAnimate}
                    exit={motionExit}
                    transition={motionTransition}
                    className="inline-block max-w-full break-words text-center px-1"
                  >
                    {words[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-xs sm:text-sm md:text-base font-bold text-slate-600 max-w-2xl leading-relaxed sm:px-5 sm:py-2.5 sm:rounded-full sm:bg-slate-50 sm:border sm:border-slate-150 sm:shadow-3xs inline-flex items-center gap-2"
          >
            <span className="text-brand-500 text-xs animate-pulse hidden md:inline">✦</span>
            <span>
              <span className="md:hidden">
                {lang === 'ar' ? 'العربية • الإنجليزية • الفرنسية • بدون تسجيل حساب' : lang === 'fr' ? 'Arabe • Anglais • Français • Sans inscription' : 'Arabic • English • French • No signup required'}
              </span>
              <span className="hidden md:inline">
                {copy.subtitle}
              </span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-brand-100/50 text-brand-700 text-[10px] font-black tracking-tight">
              {isAr ? "مجاني للمعاينة" : "Free Preview"}
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="flex flex-col items-center gap-3 w-full max-w-md mx-auto"
          >
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full justify-center px-4">
              <button
                onClick={() => {
                  trackEvent('hero_started', { component: 'cta_primary' })
                  onStart()
                }}
                className="group flex w-full md:w-auto bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 active:scale-[0.98] text-white px-8 py-3.5 rounded-xl font-black text-sm sm:text-base transition-all duration-300 shadow-xl shadow-brand-500/20 items-center justify-center gap-2 min-h-[48px] cursor-pointer border border-white/10"
              >
                <span>
                  <span className="md:hidden">
                    {lang === 'ar' ? 'أنشئ سيرتك مجاناً' : lang === 'fr' ? 'Créer votre CV gratuit' : 'Build Your CV Free'}
                  </span>
                  <span className="hidden md:inline">
                    {copy.cta}
                  </span>
                </span>
                {isAr ? <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1 stroke-[2.5]" /> : <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 stroke-[2.5]" />}
              </button>

              {/* No credit card required - Mobile only helper directly under Primary CTA */}
              <p className="md:hidden text-[11px] text-slate-400 font-bold -mt-1.5 mb-1 animate-fade-in">
                ✨ {lang === 'ar' ? 'لا حاجة لبطاقة ائتمان للبدء' : lang === 'fr' ? 'Pas de carte de crédit requise' : 'No credit card required to start'}
              </p>
              
              <button
                onClick={() => navigate('/templates')}
                className="w-full md:w-auto bg-transparent text-slate-500 hover:text-slate-800 font-bold text-sm transition-all duration-200 active:scale-95 flex items-center justify-center py-1 cursor-pointer md:border md:border-transparent md:hover:border-slate-200 md:bg-transparent md:hover:bg-slate-50 md:px-6 md:py-3.5 md:rounded-xl md:min-h-[48px] underline md:no-underline"
              >
                <span>
                  <span className="md:hidden">
                    {lang === 'ar' ? 'مشاهدة القوالب' : lang === 'fr' ? 'Voir les modèles' : 'See Templates'}
                  </span>
                  <span className="hidden md:inline">
                    {copy.ctaSec}
                  </span>
                </span>
              </button>
            </div>
            
            {/* No credit card required - Desktop only position */}
            <p className="hidden md:block text-xs text-slate-400 font-bold mt-1.5">
              ✨ {copy.noCreditCard}
            </p>
          </motion.div>

          {/* Mini CV Preview component hidden on mobile to provide space and speed */}
          <div className="hidden sm:block w-full">
            <MiniCVPreview lang={lang as any} />
          </div>
        </div>
      </div>
    </section>
  )
}
