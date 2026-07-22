import { Check } from 'lucide-react'
import { PageSection, SectionHeading } from '@/components/layout/PageSection'
import type { AppLang } from '@/hooks/useDirection'
import TiltCard from '@/components/landing/TiltCard'

interface PricingSectionProps {
  lang: AppLang
  onPaidClick: () => void
}

const COPY = {
  ar: {
    label: 'الأسعار والمميزات',
    title: 'أنشئ واستعرض مجاناً — ادفع فقط عند التحميل',
    subtitle: 'شامل كل أدوات الذكاء الاصطناعي وفحص الـ ATS، وبدون أي اشتراكات تلقائية',
    planSingle: {
      name: 'كود سيرة ذاتية واحد',
      price: '50 ج.م',
      period: '/ تحميل فردي',
      popular: 'تنزيل فوري',
      cta: 'ابدأ سيرتك الذاتية الآن',
      features: [
        'إنشاء وتعديل سيرة ذاتية كاملة',
        'ذكاء اصطناعي ذكي للمحتوى والـ ATS',
        'كود تحميل لمرة واحدة بدون علامات مائية',
        'تصدير PDF و Word (.docx)',
        'حفظ سحابي دائم وآمن'
      ],
    },
    planBundle: {
      name: 'باقة توفير (3 أكواد تحميل)',
      price: '120 ج.م',
      period: '/ صالحة لمدة عام كامل',
      popular: 'العرض الأقوى 🔥',
      cta: 'احصل على الباقة الآن',
      features: [
        'تحصل على ٣ أكواد تحميل مستقلة',
        'صالحة للتحميل في أي وقت خلال سنة',
        'وفر ٣٠ ج.م مقارنة بالشراء المنفرد',
        'تصدير غير محدود PDF ووورد بدون علامات مائية',
        'دعم فني متميز على مدار الساعة'
      ],
    },
    note: 'أنشئ واستعرض مجاناً — ادفع فقط عند تحميل النسخة النهائية الخالية من العلامة المائية',
  },
  en: {
    label: 'Smart Pricing',
    title: 'Build & preview for free — pay only when you download',
    subtitle: 'Includes all AI tools & ATS check — no hidden subscriptions or fees',
    planSingle: {
      name: 'Single Resume Code',
      price: '50 EGP',
      period: '/ per resume download',
      popular: 'Instant Download',
      cta: 'Start Your Resume Now',
      features: [
        'Create & fully edit resume',
        'Full AI & ATS optimization tools',
        'Single-use download code (no watermarks)',
        'Export as high-quality PDF and Word (.docx)',
        'Permanent secure cloud save'
      ],
    },
    planBundle: {
      name: 'Saver Bundle (3 Codes)',
      price: '120 EGP',
      period: '/ valid for 1 full year',
      popular: 'Best Value 🔥',
      cta: 'Get Saver Bundle Now',
      features: [
        'Get 3 independent download codes',
        'Valid to use anytime for 1 full year',
        'Save 30 EGP compared to single buys',
        'Unlimited export edits for downloaded resumes',
        'Priority 24/7 premium support'
      ],
    },
    note: 'Build & preview for free — pay only when you download your final watermark-free file',
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
        <TiltCard
          className="relative rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] bg-white border border-slate-100 hover:border-orange-200 hover:shadow-[0_20px_40px_-10px_rgba(255,237,233,0.5)] transition-all transform-gpu"
        >
          <div className="flex flex-col flex-1">
            <div className="mb-8 text-center md:text-start">
              <div className="text-[11px] font-black text-slate-400 mb-2 tracking-[0.2em] uppercase">{c.planSingle.name}</div>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-5xl font-extrabold text-slate-950 tracking-tighter">{c.planSingle.price}</span>
                <span className="text-sm font-medium text-slate-500">{c.planSingle.period}</span>
              </div>
            </div>

            <ul className="space-y-4 text-start flex-1 border-t border-slate-50 pt-8">
              {c.planSingle.features.map((f) => (
                <li key={f} className="flex items-start gap-4 text-sm text-slate-700 font-medium">
                  <Check className="w-5 h-5 flex-shrink-0 text-orange-500 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onPaidClick}
            className="bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 active:scale-[0.98] text-slate-900 rounded-2xl font-bold text-sm px-8 py-5 mt-10 w-full justify-center inline-flex items-center gap-3 transition-all cursor-pointer group"
          >
            {c.planSingle.cta}
            <span className="group-hover:translate-x-1 transition-transform">
              {isAr ? '←' : '→'}
            </span>
          </button>
        </TiltCard>

        {/* Card 2: Bundle Package */}
        <TiltCard
          className="relative rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] bg-white border-2 border-brand-600 hover:border-blue-600 hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.15)] transition-all transform-gpu"
        >
          {/* Top Floating Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-600 to-[#000a1b] text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-md shadow-orange-500/20 uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
            <span>{c.planBundle.popular}</span>
          </div>

          <div className="flex flex-col flex-1 mt-2">
            <div className="mb-8 text-center md:text-start">
              <div className="text-[11px] font-black text-brand-600 mb-2 tracking-[0.2em] uppercase">{c.planBundle.name}</div>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-5xl font-extrabold text-slate-950 tracking-tighter">{c.planBundle.price}</span>
                <span className="text-sm font-medium text-slate-500">{c.planBundle.period}</span>
              </div>
            </div>

            <ul className="space-y-4 text-start flex-1 border-t border-blue-50 pt-8">
              {c.planBundle.features.map((f) => (
                <li key={f} className="flex items-start gap-4 text-sm text-slate-700 font-medium">
                  <Check className="w-5 h-5 flex-shrink-0 text-orange-500 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onPaidClick}
            className="bg-brand-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-2xl font-bold text-sm px-8 py-5 mt-10 w-full justify-center inline-flex items-center gap-3 shadow-[0_10px_20px_-5px_rgba(37,99,235,0.3)] transition-all cursor-pointer group"
          >
            {c.planBundle.cta}
            <span className="group-hover:translate-x-1 transition-transform">
              {isAr ? '←' : '→'}
            </span>
          </button>
        </TiltCard>

      </div>

      <p className="text-center text-xs text-neutral-400 mt-8 max-w-sm mx-auto px-4 leading-normal">{c.note}</p>
    </PageSection>
  )
}
