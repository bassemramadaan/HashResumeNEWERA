import { Link } from 'react-router-dom'
import { ArrowRight, Zap } from 'lucide-react'
import type { AppLang } from '@/hooks/useDirection'

export function CTASection({ lang }: { lang: AppLang }) {
  const isAr = lang === 'ar'

  const copy = {
    ar: {
      badge: "ابدأ الآن",
      title: "جاهز لانطلاقة مسيرتك المهنية؟",
      subtitle: "صمم سيرتك الذاتية في دقائق وانضم لآلاف المحترفين الذين حصلوا على وظائف أحلامهم.",
      cta: "ابدأ التصميم مجاناً",
      noCreditCard: "لا حاجة لبطاقة ائتمان للبدء"
    },
    en: {
      badge: "Start Now",
      title: "Ready to Accelerate Your Career?",
      subtitle: "Build your resume in minutes and join thousands of professionals landing their dream jobs.",
      cta: "Start Building for Free",
      noCreditCard: "No credit card required to start"
    },
    fr: {
      badge: "Commencer",
      title: "Prêt à propulser votre carrière ?",
      subtitle: "Créez votre CV en quelques minutes et rejoignez des milliers de professionnels.",
      cta: "Créer Gratuitement",
      noCreditCard: "Pas de carte de crédit requise"
    }
  }

  const c = copy[lang] || copy['en']

  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-slate-900 rounded-[3rem] p-6 xs:p-10 sm:p-16 lg:p-20 text-center relative overflow-hidden shadow-2xl">
          
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-[#FF4D2D] rounded-full blur-[100px] opacity-30 pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[400px] h-[400px] bg-indigo-500 rounded-full blur-[100px] opacity-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-xs font-bold text-white uppercase tracking-widest backdrop-blur-md mb-8">
              <Zap size={14} className="text-amber-400" fill="currentColor" />
              <span>{c.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
              {c.title}
            </h2>

            <p className="text-base sm:text-lg text-slate-300 mb-10 max-w-2xl leading-relaxed font-medium">
              {c.subtitle}
            </p>

            <div className="flex flex-col items-center gap-3">
              <Link
                to="/editor"
                className="bg-[#FF4D2D] hover:bg-[#E64528] active:scale-95 text-white inline-flex items-center justify-center gap-3 px-6 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg transition-all shadow-xl shadow-orange-500/25 w-full sm:w-auto"
              >
                <span>{c.cta}</span>
                <ArrowRight size={20} className={isAr ? "rotate-180" : ""} />
              </Link>
              <p className="text-xs text-slate-400 font-medium">
                ✨ {c.noCreditCard}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
