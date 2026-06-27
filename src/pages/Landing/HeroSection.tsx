import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
} from 'lucide-react'
import type { AppLang } from '@/hooks/useDirection'
import { trackEvent } from '@/services/analytics'
import { useNavigate } from 'react-router-dom'

interface HeroSectionProps {
  lang: AppLang
  onStart: () => void
}

const COPY = {
  ar: {
    badge: 'ثورة في إنشاء السير الذاتية',
    titleMain: 'اكتب مستقبلك',
    subtitle: 'اصنع سيرة ذاتية استثنائية ومتوافقة تماماً مع أنظمة الفرز (ATS) خلال دقائق، مدعومة بإرشادات ذكاء اصطناعي ذكية تبرز مهاراتك وتسرّع توظيفك.',
    cta: 'ابـدأ الإنشـاء مجانـاً',
    ctaSec: 'استكشف الأمثلة',
  },
  en: {
    badge: 'Revolutionizing Resume Creation',
    titleMain: 'Write Your Professional',
    subtitle: 'Create an outstanding, ATS-optimized resume in minutes with intelligent AI guidance that showcases your true potential and gets you hired faster.',
    cta: 'Start Building Free',
    ctaSec: 'Explore Examples',
  },
  fr: {
    badge: 'Révolution dans la création de CV',
    titleMain: 'Écrivez Votre Avenir',
    subtitle: 'Créez un CV exceptionnel et optimisé pour l\'ATS en quelques minutes grâce à des conseils d\'IA intelligents qui propulsent votre carrière.',
    cta: 'Créer Gratuitement',
    ctaSec: 'Explorer les exemples',
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

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [words])

  return (
    <section 
      className="relative pt-24 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-white" 
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-100/50 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="container relative z-10 mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center text-center space-y-10">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-orange-50 text-orange-600 border border-orange-100 text-xs font-bold uppercase tracking-[0.1em]"
          >
            <Sparkles className="w-4 h-4" />
            <span>{copy.badge}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-slate-950 tracking-tighter leading-[1] max-w-5xl"
          >
            {copy.titleMain} <br />
            <span className="text-orange-500">
              <motion.span
                key={wordIndex}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="inline-block"
              >
                {words[wordIndex]}
              </motion.span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-xl md:text-2xl text-slate-600 font-medium max-w-3xl leading-relaxed"
          >
            {copy.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="flex flex-col sm:flex-row items-center gap-5 pt-6 w-full justify-center"
          >
            <button
              onClick={() => {
                trackEvent('hero_started', { component: 'cta_primary' })
                onStart()
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-6 rounded-3xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>{copy.cta}</span>
              {isAr ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
            </button>
            <button
              onClick={() => navigate('/editor')}
              className="w-full sm:w-auto bg-white border-2 border-slate-100 hover:border-orange-200 text-slate-900 px-10 py-6 rounded-3xl font-bold text-lg transition-all active:scale-95 shadow-sm flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>{copy.ctaSec}</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
