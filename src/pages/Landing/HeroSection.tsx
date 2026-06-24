import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  FileCheck2, 
  Bot
} from 'lucide-react'
import type { AppLang } from '@/hooks/useDirection'
import { trackEvent } from '@/services/analytics'
import { useNavigate } from 'react-router-dom'

interface HeroSectionProps {
  lang: AppLang
  onStart: () => void
}

function CountUp({ end, decimals = 0, duration = 1800, suffix = "" }: { end: number; decimals?: number; duration?: number; suffix?: string }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let startTimestamp: number | null = null
    let animationFrameId: number

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      // Ease out quad
      const easedProgress = progress * (2 - progress)
      const currentValue = easedProgress * end
      setValue(currentValue)
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step)
      }
    }
    animationFrameId = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(animationFrameId)
  }, [end, duration])

  return <span>{value.toFixed(decimals)}{suffix}</span>
}

const COPY = {
  ar: {
    badge: 'ثورة في إنشاء السير الذاتية',
    titleMain: 'اكتب مستقبلك',
    titleAccent: 'المهني بثقة',
    subtitle: 'اصنع سيرة ذاتية استثنائية ومتوافقة تماماً مع أنظمة الفرز (ATS) خلال دقائق، مدعومة بإرشادات ذكاء اصطناعي ذكية تبرز مهاراتك وتسرّع توظيفك.',
    cta: 'ابـدأ الإنشـاء مجانـاً',
    ctaSec: 'استكشف الأمثلة',
    pills: ['خوارزميات AI متقدمة', 'تصاميم معتمدة للتوظيف', 'تصدير فوري بصيغة PDF']
  },
  en: {
    badge: 'Revolutionizing Resume Creation',
    titleMain: 'Write Your Professional',
    titleAccent: 'Future Today',
    subtitle: 'Create an outstanding, ATS-optimized resume in minutes with intelligent AI guidance that showcases your true potential and gets you hired faster.',
    cta: 'Start Building Free',
    ctaSec: 'Explore Examples',
    pills: ['Advanced AI Algorithms', 'Approved Clean Designs', 'Instant PDF Export']
  },
  fr: {
    badge: 'Révolution dans la création de CV',
    titleMain: 'Écrivez Votre Avenir',
    titleAccent: 'Professionnel',
    subtitle: 'Créez un CV exceptionnel et optimisé pour l\'ATS en quelques minutes grâce à des conseils d\'IA intelligents qui propulsent votre carrière.',
    cta: 'Créer Gratuitement',
    ctaSec: 'Explorer les exemples',
    pills: ['Algorithmes IA Avancés', 'Designs Approuvés', 'Export PDF Instantané']
  }
}

const ROTATING_WORDS = {
  ar: [
    'بثقة واحترافية',
    'بذكاء اصطناعي',
    'لتخطي الـ ATS',
    'لتأمين وظيفة أحلامك'
  ],
  en: [
    'with total confidence',
    'with smart AI power',
    'to beat the ATS filters',
    'for your dream job'
  ],
  fr: [
    'avec une confiance totale',
    'avec la puissance de l\'IA',
    'pour passer les filtres ATS',
    'pour le job de vos rêves'
  ]
}

function AtsScanSimulator({ lang, isAr }: { lang: AppLang; isAr: boolean }) {
  const [scanStep, setScanStep] = useState(0)
  const [atsScore, setAtsScore] = useState(35)
  const [isCelebrated, setIsCelebrated] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setScanStep(1)
      setAtsScore(58)
    }, 2000)

    const timer2 = setTimeout(() => {
      setScanStep(2)
      setAtsScore(79)
    }, 4000)

    const timer3 = setTimeout(() => {
      setScanStep(3)
      setAtsScore(96)
      setIsCelebrated(true)
    }, 6000)

    const resetTimer = setTimeout(() => {
      setScanStep(0)
      setAtsScore(35)
      setIsCelebrated(false)
    }, 10000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(resetTimer)
    }
  }, [scanStep])

  const steps = {
    ar: [
      { text: "🔍 تحليل الكلمات الدلالية وربطها...", done: scanStep >= 1 },
      { text: "🤖 قياس جودة المحتوى ومقروئية الخطوط...", done: scanStep >= 2 },
      { text: "⚡ فحص التوافق مع أنظمة الفرز الآلي (ATS)...", done: scanStep >= 3 }
    ],
    en: [
      { text: "🔍 Analyzing core role-specific keywords...", done: scanStep >= 1 },
      { text: "🤖 Evaluating professional formatting structures...", done: scanStep >= 2 },
      { text: "⚡ Running deep ATS compatibility parser...", done: scanStep >= 3 }
    ],
    fr: [
      { text: "🔍 Analyse des mots-clés spécifiques au rôle...", done: scanStep >= 1 },
      { text: "🤖 Évaluation des structures de mise en forme...", done: scanStep >= 2 },
      { text: "⚡ Exécution du parseur de compatibilité ATS...", done: scanStep >= 3 }
    ]
  }

  const currentSteps = steps[lang] || steps['en']

  return (
    <div className="w-full h-full p-6 pt-16 flex flex-col md:flex-row gap-8 items-center justify-center relative z-10">
      {/* Resume Scan Panel */}
      <div className="w-full max-w-sm bg-white border border-slate-100 rounded-2xl p-5 shadow-sm relative overflow-hidden">
        {/* Dynamic scan line laser */}
        <motion.div
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#FF4D2D] to-transparent shadow-[0_0_15px_rgba(255,77,45,0.9)] z-10"
        />

        <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center font-black text-slate-400">
            {isAr ? "سيرة" : "CV"}
          </div>
          <div className="space-y-1.5">
            <div className="h-4 bg-slate-200 rounded-md w-36" />
            <div className="h-2.5 bg-slate-100 rounded-md w-24" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-3 bg-slate-100 rounded-md w-full" />
          <div className="h-3 bg-slate-100 rounded-md w-11/12" />
          <div className="h-3 bg-slate-100/70 rounded-md w-10/12" />
          <div className="h-3 bg-slate-100/50 rounded-md w-4/5" />
        </div>

        <div className="border-t border-slate-100 pt-4 mt-4 space-y-3">
          <div className="h-3 bg-[#FF4D2D]/10 rounded-md w-3/5" />
          <div className="h-3 bg-slate-100 rounded-md w-full" />
          <div className="h-3 bg-slate-100 rounded-md w-11/12" />
        </div>
      </div>

      {/* Simulator Logging & Score Meter */}
      <div className="w-full max-w-sm flex flex-col justify-between gap-5 text-right ltr:text-left h-full">
        {/* Real-time scan logger */}
        <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl p-5 border border-slate-800 text-slate-100 space-y-3.5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
              {isAr ? "محلل السير الذاتية بالذكاء الاصطناعي" : "AI RESUME PARSER ACTIVE"}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {currentSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2.5 min-h-[22px]">
                {step.done ? (
                  <span className="text-emerald-400 font-extrabold shrink-0">✓</span>
                ) : scanStep === idx ? (
                  <span className="text-[#FF4D2D] font-extrabold shrink-0 animate-pulse">●</span>
                ) : (
                  <span className="text-slate-600 shrink-0">○</span>
                )}
                <span className={step.done ? "text-slate-300 font-semibold" : scanStep === idx ? "text-[#FF4D2D] font-black" : "text-slate-500 font-medium"}>
                  {step.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ATS score card */}
        <motion.div
          animate={isCelebrated ? { scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg p-5 rounded-2xl border border-slate-150 flex items-center justify-between gap-4 relative overflow-hidden"
        >
          {isCelebrated && (
            <div className="absolute inset-0 bg-emerald-500/[0.03] pointer-events-none" />
          )}

          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl shrink-0 ${isCelebrated ? "bg-emerald-50 text-emerald-500" : "bg-orange-50 text-[#FF4D2D]"}`}>
              <Bot size={24} className={isCelebrated ? "animate-bounce" : ""} />
            </div>
            <div>
              <div className="text-sm font-black text-slate-800 tracking-tight">
                {isCelebrated 
                  ? (isAr ? "متوافق ومحسن بالكامل! 🎉" : "ATS Approved! 🎉") 
                  : (isAr ? "فحص وتحسين الفرز..." : "Optimizing ATS Score...")}
              </div>
              <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                {isCelebrated
                  ? (isAr ? "جاهز للتنزيل بنسبة 100%!" : "Ready for download!")
                  : (isAr ? "تضمين الكلمات المفتاحية الذكية..." : "Matching premium keywords...")}
              </div>
            </div>
          </div>

          {/* Animated score circle */}
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full border-4 border-slate-100 shrink-0">
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke={isCelebrated ? "#10b981" : "#FF4D2D"}
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - atsScore / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <span className={`text-sm font-black tracking-tighter ${isCelebrated ? "text-emerald-600" : "text-[#FF4D2D]"}`}>
              {atsScore}%
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export function HeroSection({ lang, onStart }: HeroSectionProps) {
  const copy = COPY[lang] || COPY['en']
  const navigate = useNavigate()
  const isAr = lang === 'ar'

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  // Rotating words states
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
      className="relative pt-24 pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-slate-50" 
      dir={isAr ? 'rtl' : 'ltr'}
      onMouseMove={handleMouseMove}
    >
      {/* Background layer with fine geometric orange grid */}
      <div className="absolute inset-0 bg-slate-50/70" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,77,45,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,77,45,0.035)_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,#000_80%,transparent_100%)] opacity-85" />
      
      {/* Interactive Mesh Ambient Glow */}
      <div 
        className="absolute pointer-events-none rounded-full blur-[130px] transition-all duration-300 ease-out opacity-85"
        style={{
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          width: '520px',
          height: '520px',
          background: 'radial-gradient(circle, rgba(255,77,45,0.18) 0%, rgba(249,115,22,0.04) 50%, transparent 100%)',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}
      />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/[0.04] rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-20 right-1/4 w-[450px] h-[450px] bg-[#FF4D2D]/[0.03] rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex flex-col items-center text-center space-y-8">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/60 shadow-sm text-xs font-bold text-slate-700 uppercase tracking-widest relative z-10"
          >
            <Sparkles className="w-4 h-4 text-[#FF4D2D]" />
            <span>{copy.badge}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl relative z-10"
          >
            {copy.titleMain} <br className="hidden sm:block" />
            <span className="inline-block min-w-[280px] text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D2D] to-orange-500 relative transition-all duration-500">
              <motion.span
                key={wordIndex}
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -25, opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="inline-block"
              >
                {words[wordIndex]}
              </motion.span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed relative z-10"
          >
            {copy.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center gap-4 pt-4 w-full relative z-10"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => {
                  trackEvent('hero_started', { component: 'cta_primary' })
                  onStart()
                }}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all active:scale-95 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{copy.cta}</span>
                {isAr ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </button>
              <button
                onClick={() => navigate('/editor')}
                className="w-full sm:w-auto bg-white border border-slate-200 hover:border-slate-300 text-slate-800 px-8 py-4 rounded-2xl font-bold text-base transition-all active:scale-95 shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{copy.ctaSec}</span>
              </button>
            </div>
            {/* Elegant No-Login Frictionless Notice */}
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black shadow-3xs cursor-default">
              <span className="text-[#FF4D2D] text-sm leading-none animate-bounce">⚡</span>
              <span>
                {lang === 'ar' 
                  ? 'ابدأ فوراً: لا حاجة لتسجيل حساب أو إدخال أي بطاقة دفع ✨' 
                  : lang === 'fr'
                  ? 'Démarrez instantanément : sans inscription ni carte requise ✨'
                  : 'Start instantly: no account registration or credit card required ✨'}
              </span>
            </div>
          </motion.div>

          {/* Trust statistics row with interactive count-up */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 relative z-10"
          >
            {/* Stat 1 */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#FF4D2D]/30 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-400 to-[#FF4D2D] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-baseline gap-0.5">
                <span className="text-[#FF4D2D]">+</span>
                <CountUp end={98.4} decimals={1} suffix="%" />
              </div>
              <div className="text-xs sm:text-sm font-black text-slate-700 mt-2">
                {isAr ? "معدل تخطي أنظمة الفرز (ATS)" : lang === 'fr' ? "Taux de réussite ATS" : "ATS Pass Rate"}
              </div>
              <div className="text-[11px] font-semibold text-slate-400 mt-1">
                {isAr ? "معايير تصفية معتمدة عالمياً" : lang === 'fr' ? "Critères mondiaux certifiés" : "Globally certified screening standards"}
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#FF4D2D]/30 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-400 to-[#FF4D2D] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
                <CountUp end={3.5} decimals={1} />
                <span className="text-sm font-black text-slate-500">{isAr ? "دقائق" : "min"}</span>
              </div>
              <div className="text-xs sm:text-sm font-black text-slate-700 mt-2">
                {isAr ? "متوسط وقت بناء السيرة" : lang === 'fr' ? "Temps de création moyen" : "Average Creation Time"}
              </div>
              <div className="text-[11px] font-semibold text-slate-400 mt-1">
                {isAr ? "سرعة مضاعفة بفضل مساعد AI الذكي" : lang === 'fr' ? "Plus rapide grâce à l'assistant IA" : "Boosted by conversational AI copilot"}
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#FF4D2D]/30 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#FF4D2D] to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {isAr ? "0" : "Zero"}
              </div>
              <div className="text-xs sm:text-sm font-black text-slate-700 mt-2">
                {isAr ? "تسجيل أو بطاقة دفع مطلوبة" : lang === 'fr' ? "Compte ou carte requis" : "Registration or Card Required"}
              </div>
              <div className="text-[11px] font-semibold text-slate-400 mt-1">
                {isAr ? "ابدأ الكتابة فوراً وادفع فقط عند الرضا" : lang === 'fr' ? "Commencez et payez au téléchargement" : "Write instantly, pay only when fully satisfied"}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8 pt-4 w-full"
          >
            {copy.pills.map((pill, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px] sm:text-sm font-bold text-slate-500">
                <FileCheck2 size={16} className="text-emerald-500" />
                <span>{pill}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Abstract Floating UI Hero Graphic */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-16 sm:mt-24 mx-auto max-w-5xl relative"
        >
          {/* Main Mockup Container */}
          <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-4 sm:p-6 shadow-2xl ring-1 ring-slate-900/5 border border-white relative z-10 overflow-hidden">
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden relative shadow-sm min-h-[400px] flex items-center justify-center">
              
              <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              
              <div className="absolute inset-x-0 top-0 h-12 border-b border-slate-100 flex items-center px-6 gap-2 bg-white/80 backdrop-blur-sm z-20">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
              </div>
              
              <AtsScanSimulator lang={lang} isAr={isAr} />
              
            </div>
          </div>
          
          {/* Decorative shapes behind mockup */}
          <div className="absolute top-1/2 left-0 -translate-x-12 -translate-y-1/2 w-32 h-32 bg-[#FF4D2D] rounded-full blur-[80px] opacity-20 -z-10" />
          <div className="absolute top-1/2 right-0 translate-x-12 -translate-y-1/2 w-48 h-48 bg-slate-900 rounded-full blur-[100px] opacity-10 -z-10" />
        </motion.div>

      </div>
    </section>
  )
}