import { motion } from "motion/react"
import { Check, Sparkles, Gift } from 'lucide-react'
import { PageSection, SectionHeading } from '@/components/layout/PageSection'
import type { AppLang } from '@/hooks/useDirection'

interface PricingSectionProps {
  lang: AppLang
  onPaidClick: () => void
}

const COPY = {
  ar: {
    label: 'الأسعار المميزة',
    title: 'وفر أكثر بـ كود واحد أو باكدج توفير',
    subtitle: 'شامل كل الخدمات (ATS والذكاء الاصطناعي) ، وبدون أي اشتراكات إضافية',
    planSingle: {
      name: 'كود سيرة ذاتية واحد',
      price: '50 ج.م',
      period: '/ للتفعيل الفردي',
      popular: 'تنزيل فوري',
      cta: 'ابدأ بإنشاء سيرتك الآن',
      features: [
        'إنشاء وتعديل كامل للسيرة',
        'ذكاء اصطناعي لتوليد وتحسين المحتوى',
        'تقييم ATS شامل ومفصل',
        'كود تفعيل لمرة واحدة',
        'PDF بجودة عالية بدون watermark',
        'ملف Word قابل للتعديل (.docx)',
        'حفظ سحابي دائم للمستندات'
      ],
    },
    planBundle: {
      name: 'باكدج التوفير (3 أكواد)',
      price: '120 ج.م',
      period: '/ صالحة لمدة عام كامل',
      popular: 'العرض الأقوى 🔥',
      cta: 'احصل على الباكدج الآن',
      features: [
        'تحصل على 3 أكواد تفعيل مستقلة',
        'الأكواد صالحة للتفعيل لمدة سنة كاملة',
        'وفر 30 ج.م عن الشراء المنفرد',
        'إمكانية إهدائها أو مشاركتها مع أصدقائك',
        'ذكاء اصطناعي غير محدود للتعديل',
        'تحميل غير محدود PDF ووورد بدون watermark',
        'دعم فني أولوية على مدار الساعة'
      ],
    },
    note: 'لا حاجة لبطاقة ائتمان للبدء في كتابة البيانات والمراجعة مجاناً',
  },
  en: {
    label: 'Smart Pricing',
    title: 'Choose the Plan that Fits Your Needs',
    subtitle: 'Includes all services (ATS + AI) — no hidden fees or subscriptions',
    planSingle: {
      name: 'Single CV Code',
      price: '50 EGP',
      period: '/ per CV activation',
      popular: 'Instant Unlock',
      cta: 'Start Building Now',
      features: [
        'Create & fully edit resume',
        'AI content generation & optimization',
        'Comprehensive ATS Score',
        'Single-use activation code',
        'High-quality PDF, no watermark',
        'Editable Word file (.docx)',
        'Permanent cloud save included'
      ],
    },
    planBundle: {
      name: 'Saver Bundle (3 Codes)',
      price: '120 EGP',
      period: '/ valid for 1 full year',
      popular: 'Best Value 🔥',
      cta: 'Get Saver Bundle Now',
      features: [
        'Get 3 independent activation codes',
        'Codes stay active for 1 full year',
        'Save 30 EGP compared to single buys',
        'Share with friends, colleagues, or family',
        'Full AI suite & ATS analysis included',
        'High-fidelity PDF & Word formats',
        'Priority 24/7 premium support'
      ],
    },
    note: 'No credit card required to get started & build for free',
  },
  fr: {
    label: 'Tarifs',
    title: 'Payez par CV',
    subtitle: 'Inclut tous les services (ATS + IA) — sans abonnement',
    planSingle: {
      name: 'Code CV Unique',
      price: '50 EGP',
      period: '/ par activation',
      popular: 'Standard',
      cta: 'Commencer maintenant',
      features: [
        'Création et modification de CV',
        'Générateur de contenu par IA',
        'Score ATS complet',
        'Un seul code d\'activation',
        'PDF haute qualité sans filigrane',
        'Fichier Word modifiable (.docx)',
        'Sauvegarde cloud permanente'
      ],
    },
    planBundle: {
      name: 'Pack Économique (3 Codes)',
      price: '120 EGP',
      period: '/ valable 1 an entier',
      popular: 'Meilleure Offre 🔥',
      cta: 'Acheter le Pack',
      features: [
        'Obtenez 3 codes d\'activation indépendants',
        'Valable pour une année complète',
        'Économisez 30 EGP sur l\'achat individuel',
        'Partager avec vos proches ou amis',
        'Accès complet aux outils IA et ATS',
        'Formats PDF et Word haute qualité',
        'Support technique prioritaire'
      ],
    },
    note: 'Aucune carte bancaire requise pour commencer',
  },
}

export function PricingSection({ lang, onPaidClick }: PricingSectionProps) {
  const c = COPY[lang] || COPY['en']
  const isAr = lang === 'ar'

  return (
    <PageSection bg="white" id="pricing">
      <SectionHeading label={c.label} title={c.title} subtitle={c.subtitle} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto w-full px-4 items-stretch select-none">
        
        {/* Card 1: Single CV */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01, translateY: -4 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="relative rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between shadow-xl bg-slate-900 border-2 border-slate-800 hover:border-slate-700 transition-all transform-gpu"
        >
          <div className="absolute top-0 end-8 -translate-y-1/2">
            <span className="px-4 py-1.5 rounded-full text-xs font-black text-rose-400 border border-rose-500/30 tracking-wider uppercase bg-slate-950">
              {c.planSingle.popular}
            </span>
          </div>

          <div className="flex flex-col flex-1">
            <div className="mb-6 text-center md:text-start">
              <div className="text-xs font-black text-slate-400 mb-2 tracking-widest uppercase">{c.planSingle.name}</div>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">{c.planSingle.price}</span>
                <span className="text-xs font-semibold text-slate-400">{c.planSingle.period}</span>
              </div>
            </div>

            <ul className="space-y-3.5 text-start flex-1 border-t border-slate-850 pt-6">
              {c.planSingle.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-300 font-medium">
                  <Check className="w-4 h-4 flex-shrink-0 text-[#FF4D2D] mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onPaidClick}
            className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-full font-bold text-sm px-6 py-4 mt-8 w-full justify-center inline-flex items-center gap-2 border border-slate-700 transition-all cursor-pointer group"
          >
            {c.planSingle.cta}
            <span className="group-hover:translate-x-1 transition-transform">
              {isAr ? '←' : '→'}
            </span>
          </button>
        </motion.div>

        {/* Card 2: 3-Codes Saver Package */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02, translateY: -4 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="relative rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between shadow-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-[#FF4D2D] hover:border-[#FF4D2D] transition-all transform-gpu"
        >
          {/* Subtle gold glow behind the card */}
          <div className="absolute inset-0 pointer-events-none rounded-[2rem] opacity-25 transform-gpu" style={{ background: 'radial-gradient(circle at top right, #FF4D2D 0%, transparent 60%)' }} />

          <div className="absolute top-0 end-8 -translate-y-1/2 z-20">
            <div className="relative hover:-translate-y-1 transition-transform transform-gpu">
              <div className="absolute inset-0 blur-sm opacity-55 rounded-full bg-[#FF4D2D]" />
              <div className="relative px-5 py-2 rounded-full text-xs font-black text-white shadow-sm border border-white/20 flex items-center gap-2 uppercase tracking-wider bg-[#FF4D2D]">
                <Sparkles className="w-3.5 h-3.5 text-white hover:rotate-12 transition-transform" />
                {c.planBundle.popular}
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 relative z-10">
            <div className="mb-6 text-center md:text-start">
              <div className="text-xs font-black text-amber-400 mb-2 tracking-widest uppercase flex items-center justify-center md:justify-start gap-1">
                <Gift size={12} className="text-amber-400 animate-pulse" />
                {c.planBundle.name}
              </div>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">{c.planBundle.price}</span>
                <span className="text-xs font-semibold text-slate-400">{c.planBundle.period}</span>
              </div>
            </div>

            <ul className="space-y-3.5 text-start flex-1 border-t border-slate-800 pt-6">
              {c.planBundle.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-200 font-bold">
                  <Check className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onPaidClick}
            className="bg-[#FF4D2D] hover:bg-[#E64528] active:scale-95 text-white rounded-full font-black text-sm px-6 py-4 mt-8 w-full justify-center inline-flex items-center gap-2 shadow-xl shadow-orange-500/25 transition-transform cursor-pointer group"
          >
            {c.planBundle.cta}
            <span className="group-hover:translate-x-1 transition-transform">
              {isAr ? '←' : '→'}
            </span>
          </button>
        </motion.div>

      </div>

      <p className="text-center text-xs text-neutral-400 mt-8 max-w-sm mx-auto px-4 leading-normal">{c.note}</p>
    </PageSection>
  )
}
