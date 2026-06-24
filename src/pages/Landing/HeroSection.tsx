import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  FileCheck2, 
  Bot,
  Target
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
    subtitle: 'أداة بسيطة وخارقة الذكاء لبناء سيرة ذاتية تلفت الأنظار، تتخطى الفرز الآلي، وتضعك في مقدمة المرشحين. صممها في 3 دقائق فقط.',
    cta: 'ابـدأ الإنشـاء مجانـاً',
    ctaSec: 'استكشف الأمثلة',
    pills: ['خوارزميات AI متقدمة', 'تصاميم معتمدة للتوظيف', 'تصدير فوري بصيغة PDF']
  },
  en: {
    badge: 'Revolutionizing Resume Creation',
    titleMain: 'Write Your Professional',
    titleAccent: 'Future Today',
    subtitle: 'A beautifully simple yet incredibly smart tool to build an eye-catching resume that beats ATS filters and puts you ahead of the competition. Done in 3 minutes.',
    cta: 'Start Building Free',
    ctaSec: 'Explore Examples',
    pills: ['Advanced AI Algorithms', 'Approved Clean Designs', 'Instant PDF Export']
  },
  fr: {
    badge: 'Révolution dans la création de CV',
    titleMain: 'Écrivez Votre Avenir',
    titleAccent: 'Professionnel',
    subtitle: 'Un outil simple et extrêmement intelligent pour construire un CV accrocheur qui déjoue les filtres ATS et vous met en tête. Fait en 3 minutes.',
    cta: 'Créer Gratuitement',
    ctaSec: 'Explorer les exemples',
    pills: ['Algorithmes IA Avancés', 'Designs Approuvés', 'Export PDF Instantané']
  }
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D2D] to-orange-500">
              {copy.titleAccent}
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
              
              <div className="w-full h-full p-8 pt-20 flex flex-col md:flex-row gap-12 items-center justify-center relative z-10">
                
                {/* Visual Representation of Resume Wireframe */}
                <div className="w-full max-w-sm space-y-6 opacity-80 mix-blend-multiply">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-full" />
                    <div className="space-y-2.5">
                      <div className="h-5 bg-slate-200 rounded-md w-40" />
                      <div className="h-3 bg-slate-100 rounded-md w-28" />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="h-4 bg-[#FF4D2D]/20 rounded-md w-24 mb-4" />
                    <div className="h-2.5 bg-slate-100 rounded-md w-full" />
                    <div className="h-2.5 bg-slate-100 rounded-md w-full" />
                    <div className="h-2.5 bg-slate-100 rounded-md w-4/5" />
                  </div>
                  <div className="space-y-2.5 pt-4">
                    <div className="h-4 bg-[#FF4D2D]/20 rounded-md w-32 mb-4" />
                    <div className="h-2.5 bg-slate-100 rounded-md w-full" />
                    <div className="h-2.5 bg-slate-100 rounded-md w-full" />
                    <div className="h-2.5 bg-slate-100 rounded-md w-2/3" />
                  </div>
                </div>

                {/* Floating Cards conveying intelligence/optimization */}
                <div className="w-full max-w-sm relative h-full flex flex-col justify-center gap-6">
                  <motion.div 
                    animate={{ y: [-5, 5, -5] }} 
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="bg-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] p-5 rounded-2xl border border-slate-100/80 flex items-center gap-4 self-end mr-4"
                  >
                    <div className="bg-orange-50 text-[#FF4D2D] p-3 rounded-xl"><Target size={24} /></div>
                    <div className="text-start">
                      <div className="text-sm font-black text-slate-800 tracking-tight">{isAr ? "متوافق مع ATS" : "ATS Optimized"}</div>
                      <div className="text-xs font-medium text-slate-500 mt-0.5">{isAr ? "تضمين 24 كلمة مفتاحية" : "24 Keywords matched"}</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    animate={{ y: [5, -5, 5] }} 
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    className="bg-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] p-5 rounded-2xl border border-slate-100/80 flex items-center gap-4 self-start ml-4"
                  >
                    <div className="bg-slate-900 text-white p-3 rounded-xl"><Bot size={24} /></div>
                    <div className="text-start">
                      <div className="text-sm font-black text-slate-800 tracking-tight">{isAr ? "صياغة فائقة الذكاء" : "AI Enhanced Impact"}</div>
                      <div className="text-xs font-medium text-slate-500 mt-0.5">{isAr ? "كتابة متطورة بنتائج رقمية" : "Data-driven statements"}</div>
                    </div>
                  </motion.div>
                </div>
                
              </div>
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