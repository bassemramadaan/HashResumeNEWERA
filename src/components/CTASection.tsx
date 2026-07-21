import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import type { AppLang } from '@/hooks/useDirection'

export function CTASection({ lang }: { lang: AppLang }) {
  const isAr = lang === 'ar'

  const copy = {
    ar: {
      badge: "ابدأ مجاناً",
      title: "جاهز لتصميم سيرتك المهنية الجديدة؟",
      subtitle: "صمّم سيرتك الذاتية الاحترافية والذكية في أقل من 5 دقائق، لتجتاز أنظمة الفرز (ATS) وتلفت انتباه مدراء التوظيف.",
      cta: "ابدأ الآن مجاناً",
      noCreditCard: "بدون تسجيل • مجاني تماماً للبدء"
    },
    en: {
      badge: "Get Started Free",
      title: "Ready to Build Your New Career?",
      subtitle: "Design your professional, ATS-friendly resume in less than 5 minutes and stand out to hiring managers.",
      cta: "Create Your Resume Now",
      noCreditCard: "No registration required • Start completely free"
    },
    fr: {
      badge: "Démarrer Gratuitement",
      title: "Prêt à booster votre avenir professionnel ?",
      subtitle: "Créez votre CV professionnel et compatible ATS en moins de 5 minutes pour impressionner les recruteurs.",
      cta: "Créer mon CV maintenant",
      noCreditCard: "Sans inscription • Démarrage gratuit"
    }
  }

  const c = copy[lang] || copy['en']

  return (
    <section className="py-20 sm:py-28 bg-slate-50/50 relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background elegant grid pattern and blurs */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.25]" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-blue-100/40 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-[350px] h-[350px] bg-indigo-100/30 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-white rounded-[2.5rem] border border-slate-100/80 p-8 sm:p-14 md:p-16 lg:p-20 text-center relative overflow-hidden shadow-xl shadow-slate-100/40">
          {/* Internal gradients */}
          <div className="absolute -top-10 -right-10 w-[200px] h-[200px] bg-blue-50/40 rounded-full blur-[40px] pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-[200px] h-[200px] bg-slate-50/60 rounded-full blur-[40px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Social Proof Avatar Pile */}
            <div className="flex items-center gap-2 mb-6 bg-slate-50/90 hover:bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100/80 backdrop-blur-sm shadow-sm transition-all duration-300">
              <div className="flex -space-x-2 overflow-hidden select-none [direction:ltr]">
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100" alt="User 1" referrerpolicy="no-referrer" />
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100" alt="User 2" referrerpolicy="no-referrer" />
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100" alt="User 3" referrerpolicy="no-referrer" />
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100" alt="User 4" referrerpolicy="no-referrer" />
              </div>
              <span className="text-xs font-semibold text-slate-600">
                {isAr ? 'انضم إلى +١٥,٠٠٠ محترف' : lang === 'fr' ? 'Rejoignez plus de 15 000+ professionnels' : 'Join over 15,000+ professionals'}
              </span>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100/50 text-xs font-semibold uppercase tracking-wider mb-5">
              <Sparkles size={12} className="text-blue-500 animate-pulse" />
              <span>{c.badge}</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight leading-[1.25] max-w-3xl">
              {c.title}
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-2xl leading-relaxed">
              {c.subtitle}
            </p>

            {/* CTA Container */}
            <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
              <Link
                to="/templates"
                className="bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white inline-flex items-center justify-center gap-2.5 px-8 py-4 sm:py-4.5 rounded-xl font-bold text-base transition-all shadow-md shadow-slate-900/10 hover:shadow-lg hover:shadow-slate-900/15 w-full sm:w-auto group"
              >
                <span>{c.cta}</span>
                <ArrowRight size={18} className={`transition-transform duration-200 ${isAr ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
              </Link>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                {c.noCreditCard}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

