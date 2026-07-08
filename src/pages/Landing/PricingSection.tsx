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
        <TiltCard
          className="relative rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] bg-white border border-slate-100 hover:border-orange-200 hover:shadow-[0_20px_40px_-10px_rgba(255,237,233,0.5)] transition-all transform-gpu"
        >
          <div className="flex flex-col flex-1">
            <div className="mb-8 text-center md:text-start">
              <div className="text-[11px] font-black text-slate-400 mb-2 tracking-[0.2em] uppercase">{c.planSingle.name}</div>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-5xl font-extrabold text-slate-950 tracking-tighter" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.planSingle.price}</span>
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
          className="relative rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] bg-white border-2 border-orange-500 hover:border-orange-600 hover:shadow-[0_25px_50px_-12px_rgba(255,77,45,0.15)] transition-all transform-gpu"
        >
          {/* Top Floating Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-md shadow-orange-500/20 uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
            <span>{c.planBundle.popular}</span>
          </div>

          <div className="flex flex-col flex-1 mt-2">
            <div className="mb-8 text-center md:text-start">
              <div className="text-[11px] font-black text-orange-500 mb-2 tracking-[0.2em] uppercase">{c.planBundle.name}</div>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-5xl font-extrabold text-slate-950 tracking-tighter" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.planBundle.price}</span>
                <span className="text-sm font-medium text-slate-500">{c.planBundle.period}</span>
              </div>
            </div>

            <ul className="space-y-4 text-start flex-1 border-t border-orange-50 pt-8">
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
            className="bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white rounded-2xl font-bold text-sm px-8 py-5 mt-10 w-full justify-center inline-flex items-center gap-3 shadow-[0_10px_20px_-5px_rgba(249,115,22,0.3)] transition-all cursor-pointer group"
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
