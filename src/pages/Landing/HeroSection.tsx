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
    titleMain: 'اكتب مستقبلك',
    subtitle: 'اصنع سيرة ذاتية استثنائية ومتوافقة تماماً مع أنظمة الفرز (ATS) خلال دقائق، مدعومة بإرشادات ذكاء اصطناعي ذكية تبرز مهاراتك وتسرّع توظيفك.',
    cta: 'ابدأ سيرتك الذاتية مجاناً',
    ctaSec: 'استكشف الأمثلة',
    noCreditCard: 'لا حاجة لبطاقة ائتمان للبدء',
  },
  en: {
    badge: 'Revolutionizing Resume Creation',
    titleMain: 'Write Your Professional Resume',
    subtitle: 'Create an outstanding, ATS-optimized resume in minutes with intelligent AI guidance that showcases your true potential and gets you hired faster.',
    cta: 'Start Building Free',
    ctaSec: 'Explore Examples',
    noCreditCard: 'No credit card required to start',
  },
  fr: {
    badge: 'Révolution dans la création de CV',
    titleMain: 'Écrivez Votre Avenir',
    subtitle: 'Créez un CV exceptionnel et optimisé pour l\'ATS en quelques minutes grâce à des conseils d\'IA intelligents qui propulsent votre carrière.',
    cta: 'Créer Gratuitement',
    ctaSec: 'Explorer les exemples',
    noCreditCard: 'Pas de carte de crédit requise',
  }
}

const ROTATING_WORDS = {
  ar: ['بثقة واحترافية', 'بذكاء اصطناعي', 'لتخطي الـ ATS', 'لتأمين وظيفة أحلامك'],
  en: ['with total confidence', 'with smart AI power', 'to beat the ATS filters', 'for your dream job'],
  fr: ['avec une confiance totale', 'avec la puissance de l\'IA', 'pour passer les filtres ATS', 'pour le job de vos rêves']
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
      className="relative pt-6 pb-20 md:pt-24 md:pb-32 lg:pt-40 lg:pb-40 overflow-hidden bg-white" 
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-blue-200/30 to-blue-100/40 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-12 left-1/4 w-[300px] h-[300px] bg-blue-200/10 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute top-36 right-1/4 w-[250px] h-[250px] bg-amber-100/15 rounded-full blur-[70px] pointer-events-none -z-10" />

      <div className="container relative z-10 mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center text-center space-y-10">
          
          <div className="flex justify-center">
            <img
              src="/logo.png"
              alt="Hash Resume"
              className="h-[80px] sm:h-[100px] md:h-[120px] w-auto object-contain select-none"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 md:gap-3 px-3 py-1 md:px-6 md:py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] whitespace-nowrap"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            <span>{copy.badge}</span>
          </motion.div>

          <h1 
            className="hero-title text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-slate-950 md:tracking-tighter md:leading-[1] max-w-5xl"
          >
            {copy.titleMain}{" "}
            <span className={`hero-highlight-text text-blue-600 inline-flex min-h-[1.15em] items-center justify-center max-w-full text-center ${isAr ? 'mr-3' : 'ml-3'}`}>
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
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-[14px] mb-4 md:mb-0 md:text-xl md:text-2xl text-slate-600 font-medium max-w-3xl leading-relaxed px-2"
          >
            {copy.subtitle}
            <span className="block text-xs sm:text-sm text-slate-400 mt-2 font-semibold">
              {isAr ? "أنشئ واستعرض مجاناً — ادفع فقط عند التحميل" : "Build & preview for free — pay only when you download"}
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="flex flex-col items-center gap-3 w-full max-w-md mx-auto"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-5 pt-2 md:pt-6 w-full justify-center px-4">
              <button
                onClick={() => {
                  trackEvent('hero_started', { component: 'cta_primary' })
                  onStart()
                }}
                className="flex w-full sm:w-auto bg-gradient-to-br from-[#001639] via-[#001639] to-[#002f7a] hover:shadow-xl hover:shadow-blue-500/20 text-white px-10 py-5 sm:px-12 sm:py-6 rounded-2xl font-bold text-lg transition-all active:scale-95 hover:scale-105 items-center justify-center gap-3 min-h-[56px] cursor-pointer"
              >
                <span>{copy.cta}</span>
                {isAr ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </button>
              <button
                onClick={() => navigate('/editor')}
                className="w-full sm:w-auto bg-white border-2 border-slate-100 hover:border-blue-200 text-slate-900 px-8 py-4 sm:px-10 sm:py-6 rounded-2xl sm:rounded-3xl font-bold text-base sm:text-lg transition-all active:scale-95 shadow-sm flex items-center justify-center gap-3 min-h-[48px] cursor-pointer"
              >
                <span>{copy.ctaSec}</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
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
