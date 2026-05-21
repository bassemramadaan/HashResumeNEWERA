import { motion } from "motion/react"
import { Check, Sparkles } from 'lucide-react'
import { PageSection, SectionHeading } from '@/components/layout/PageSection'
import type { AppLang } from '@/hooks/useDirection'

interface PricingSectionProps {
  lang: AppLang
  onPaidClick: () => void
}

const COPY = {
  ar: {
    label: 'الأسعار',
    title: 'ادفع مقابل السيرة الذاتية',
    subtitle: 'شامل كل الخدمات (ATS والذكاء الاصطناعي) ، وبدون أي اشتراكات إضافية',
    plan: {
      name: 'باقة السيرة الذاتية الاحترافية',
      price: '50 ج.م',
      period: '/ للسيرة الواحدة',
      popular: 'الأكثر طلبًا',
      cta: 'ابدأ بإنشاء سيرتك الآن',
      features: ['إنشاء وتعديل السيرة', 'ذكاء اصطناعي لتوليد وتحسين المحتوى', 'تقييم ATS شامل', 'PDF بجودة عالية بدون watermark', 'ملف Word قابل للتعديل (.docx)', 'حفظ سحابي دائم', 'دعم فني أولوية'],
    },
    note: 'لا حاجة لبطاقة ائتمان للبدء',
  },
  en: {
    label: 'Pricing',
    title: 'Pay per CV',
    subtitle: 'Includes all services (ATS + AI) — no hidden fees or subscriptions',
    plan: {
      name: 'Professional CV Package',
      price: '50 EGP',
      period: '/ per CV',
      popular: 'Most Popular',
      cta: 'Start Building Now',
      features: ['Create & edit resume', 'AI content generation & optimization', 'Comprehensive ATS Score', 'High-quality PDF, no watermark', 'Editable Word file (.docx)', 'Permanent cloud save', 'Priority support'],
    },
    note: 'No credit card required to get started',
  },
  fr: {
    label: 'Tarifs',
    title: 'Payez par CV',
    subtitle: 'Inclut tous les services (ATS + IA) — sans abonnement',
    plan: {
      name: 'Forfait CV Professionnel',
      price: '50 EGP',
      period: '/ par CV',
      popular: 'Le plus populaire',
      cta: 'Commencer maintenant',
      features: ['Création et modification de CV', 'Générateur de contenu par IA', 'Score ATS complet', 'PDF haute qualité sans filigrane', 'Fichier Word modifiable (.docx)', 'Sauvegarde cloud permanente', 'Support prioritaire'],
    },
    note: 'Aucune carte bancaire requise pour commencer',
  },
}

export function PricingSection({ lang, onPaidClick }: PricingSectionProps) {
  const c = COPY[lang] || COPY['en']

  return (
    <PageSection bg="white" id="pricing">
      <SectionHeading label={c.label} title={c.title} subtitle={c.subtitle} />

      <div className="flex justify-center flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02, translateY: -4 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="relative rounded-[2rem] p-8 md:p-10 flex flex-col shadow-2xl bg-slate-900 border-2 border-slate-800 hover:border-[#FF4D2D]/50 transition-all w-full max-w-lg transform-gpu"
        >
          {/* Subtle gradient glow behind the card */}
          <div className="absolute inset-0 pointer-events-none rounded-[2rem] opacity-20 transform-gpu" style={{ background: 'radial-gradient(circle at top right, #FF4D2D 0%, transparent 60%)' }} />

          <div className="absolute top-0 end-8 -translate-y-1/2">
            <div className="relative hover:-translate-y-1 transition-transform transform-gpu">
              <div className="absolute inset-0 blur-sm opacity-50 rounded-full bg-[#FF4D2D]" />
              <div className="relative px-5 py-2 rounded-full text-sm font-black text-white shadow-sm border border-white/20 flex items-center gap-2 uppercase tracking-widest bg-[#FF4D2D]">
                <Sparkles className="w-4 h-4 text-white hover:rotate-12 transition-transform" />
                {c.plan.popular}
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 relative z-10 w-full text-center">
            <div className="mb-10">
              <div className="text-sm font-bold tracking-wider text-slate-400 mb-4 uppercase">{c.plan.name}</div>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl md:text-7xl font-black text-white tracking-tight">{c.plan.price}</span>
                <span className="text-lg font-medium text-slate-400">{c.plan.period}</span>
              </div>
            </div>

            <ul className="space-y-5 text-start w-full">
              {c.plan.features.map((f) => (
                <li key={f} className="flex items-center gap-4 text-base md:text-lg text-slate-300 font-medium">
                  <Check className="w-6 h-6 flex-shrink-0 text-[#FF4D2D]" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={onPaidClick}
              className="bg-[#FF4D2D] hover:bg-[#E64528] active:scale-95 text-white rounded-full font-bold text-lg px-8 py-5 mt-10 w-full justify-center inline-flex items-center gap-3 shadow-xl shadow-orange-500/25 transition-transform group transform-gpu"
            >
              {c.plan.cta}
              <span className="group-hover:translate-x-1 transition-transform">
                {lang === 'ar' ? '←' : '→'}
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      <p className="text-center text-sm text-neutral-400 mt-8">{c.note}</p>
    </PageSection>
  )
}

