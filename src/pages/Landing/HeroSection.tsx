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

  return (
    <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-32 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background layer */}
      <div className="absolute inset-0 bg-slate-50" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.5]" />
      
      {/* Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-white rounded-full blur-[120px] opacity-100 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex flex-col items-center text-center space-y-8">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/60 shadow-sm text-xs font-bold text-slate-700 uppercase tracking-widest"
          >
            <Sparkles className="w-4 h-4 text-[#FF4D2D]" />
            <span>{copy.badge}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl"
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
            className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed"
          >
            {copy.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center gap-4 pt-4 w-full"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => {
                  trackEvent('hero_started', { component: 'cta_primary' })
                  onStart()
                }}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all active:scale-95 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
              >
                <span>{copy.cta}</span>
                {isAr ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </button>
              <button
                onClick={() => navigate('/editor')}
                className="w-full sm:w-auto bg-white border border-slate-200 hover:border-slate-300 text-slate-800 px-8 py-4 rounded-2xl font-bold text-base transition-all active:scale-95 shadow-sm hover:shadow flex items-center justify-center gap-2"
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