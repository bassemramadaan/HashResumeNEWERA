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
    title: 'بسيط وشفاف',
    subtitle: 'جرّب مجانًا، ادفع فقط عند التحميل — بدون اشتراك شهري',
    free: {
      name: 'الخطة المجانية',
      price: '0 ج.م',
      cta: 'ابدأ الآن',
      features: ['إنشاء وتعديل السيرة', 'ذكاء اصطناعي لتوليد المحتوى', 'تقييم ATS', 'معاينة كاملة', 'عربي وإنجليزي وفرنسي'],
    },
    paid: {
      name: 'الخطة المدفوعة',
      price: '50 ج.م',
      period: '/ مرة واحدة فقط',
      popular: 'يُنصح بها',
      cta: 'التنزيل بجودة عالية',
      features: ['كل مميزات المجاني', 'PDF بجودة عالية بدون watermark', 'ملف Word قابل للتعديل (.docx)', 'حفظ سحابي دائم', 'دعم أولوية'],
    },
    note: 'لا حاجة لبطاقة ائتمان للبدء',
  },
  en: {
    label: 'Pricing',
    title: 'Simple & transparent',
    subtitle: 'Try for free, pay only when you download — no monthly subscription',
    free: {
      name: 'Free Plan',
      price: '0 EGP',
      cta: 'Start Now',
      features: ['Create & edit resume', 'AI content generation', 'ATS Score', 'Full preview', 'Arabic, English & French'],
    },
    paid: {
      name: 'Premium',
      price: '50 EGP',
      period: '/ one-time',
      popular: 'Recommended',
      cta: 'Download Premium PDF',
      features: ['Everything in Free', 'High-quality PDF, no watermark', 'Editable Word file (.docx)', 'Permanent cloud save', 'Priority support'],
    },
    note: 'No credit card required to get started',
  },
  fr: {
    label: 'Tarifs',
    title: 'Simple et transparent',
    subtitle: 'Essayez gratuitement, payez uniquement au téléchargement',
    free: {
      name: 'Gratuit',
      price: '0 EGP',
      cta: 'Commencer',
      features: ['Créer et modifier le CV', 'Génération IA', 'Score ATS', 'Aperçu complet', 'Arabe, anglais et français'],
    },
    paid: {
      name: 'Premium',
      price: '50 EGP',
      period: '/ paiement unique',
      popular: 'Recommandé',
      cta: 'Télécharger le PDF HD',
      features: ['Tout du gratuit', 'PDF haute qualité sans filigrane', 'Fichier Word modifiable (.docx)', 'Sauvegarde cloud permanente', 'Support prioritaire'],
    },
    note: 'Aucune carte bancaire requise pour commencer',
  },
}

export function PricingSection({ lang, onPaidClick }: PricingSectionProps) {
  const c = COPY[lang] || COPY['en']

  return (
    <PageSection bg="muted" id="pricing">
      <SectionHeading label={c.label} title={c.title} subtitle={c.subtitle} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="card flex flex-col p-6 md:p-8 border-neutral-200/60"
        >
          <div className="mb-8">
            <div className="text-sm font-semibold tracking-wider text-neutral-500 mb-2 uppercase">{c.free.name}</div>
            <div className="text-5xl font-bold text-neutral-900 tracking-tight">{c.free.price}</div>
          </div>
          <ul className="space-y-4 flex-1">
            {c.free.features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-neutral-600">
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-success)' }} />
                {f}
              </li>
            ))}
          </ul>
          <button onClick={onPaidClick} className="btn-ghost mt-6 w-full justify-center">
            {c.free.cta}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="relative rounded-2xl p-6 md:p-8 flex flex-col border shadow-2xl"
          style={{ backgroundColor: 'var(--color-neutral-900)', borderColor: 'color-mix(in srgb, var(--color-brand-500) 30%, transparent)' }}
        >
          {/* Subtle gradient glow behind the card */}
          <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-20" style={{ background: 'radial-gradient(circle at top right, var(--color-brand-500) 0%, transparent 60%)' }} />

          <div className="absolute top-0 end-6 -translate-y-1/2">
            <div className="relative">
              <div className="absolute inset-0 blur-md opacity-50 rounded-full" style={{ backgroundColor: 'var(--color-brand-500)' }} />
              <div className="relative px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm border border-white/20 flex items-center gap-1.5 uppercase tracking-wider" style={{ backgroundColor: 'var(--color-brand-500)' }}>
                <Sparkles className="w-3 h-3 text-white" />
                {c.paid.popular}
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 relative z-10">
            <div className="mb-8">
              <div className="text-sm font-semibold tracking-wider text-neutral-400 mb-2 uppercase">{c.paid.name}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white tracking-tight">{c.paid.price}</span>
                <span className="text-sm font-medium text-neutral-400">{c.paid.period}</span>
              </div>
            </div>

            <ul className="space-y-4 flex-1">
              {c.paid.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-neutral-300">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-brand-400)' }} />
                  {f}
                </li>
              ))}
            </ul>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onPaidClick}
              className="btn-primary mt-6 w-full justify-center inline-flex gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {c.paid.cta}
            </motion.button>
          </div>
        </motion.div>
      </div>

      <p className="text-center text-sm text-neutral-400 mt-6">{c.note}</p>
    </PageSection>
  )
}
