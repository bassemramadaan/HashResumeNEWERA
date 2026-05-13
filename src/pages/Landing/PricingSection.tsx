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
      name: 'مجاني',
      price: '$0',
      cta: 'ابدأ الآن',
      features: ['إنشاء وتعديل السيرة', 'ذكاء اصطناعي لتوليد المحتوى', 'تقييم ATS', 'معاينة كاملة', 'عربي وإنجليزي وفرنسي'],
    },
    paid: {
      name: 'تحميل',
      price: '50 ج.م',
      period: '/ مرة واحدة فقط',
      popular: 'الأكثر طلبًا',
      cta: 'حمّل الآن',
      features: ['كل مميزات المجاني', 'PDF بجودة عالية بدون watermark', 'ملف Word قابل للتعديل (.docx)', 'حفظ سحابي دائم', 'دعم أولوية'],
    },
    note: 'لا حاجة لبطاقة ائتمان للبدء',
  },
  en: {
    label: 'Pricing',
    title: 'Simple & transparent',
    subtitle: 'Try for free, pay only when you download — no monthly subscription',
    free: {
      name: 'Free',
      price: '$0',
      cta: 'Start Now',
      features: ['Create & edit resume', 'AI content generation', 'ATS Score', 'Full preview', 'Arabic, English & French'],
    },
    paid: {
      name: 'Download',
      price: '50 EGP',
      period: '/ one-time',
      popular: 'Most popular',
      cta: 'Unlock Now',
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
      price: '0 $',
      cta: 'Commencer',
      features: ['Créer et modifier le CV', 'Génération IA', 'Score ATS', 'Aperçu complet', 'Arabe, anglais et français'],
    },
    paid: {
      name: 'Téléchargement',
      price: '50 EGP',
      period: '/ paiement unique',
      popular: 'Plus populaire',
      cta: 'Débloquer',
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
          className="card flex flex-col"
        >
          <div className="mb-6">
            <div className="text-sm font-medium text-neutral-500 mb-1">{c.free.name}</div>
            <div className="text-4xl font-semibold text-neutral-900">{c.free.price}</div>
          </div>
          <ul className="space-y-3 flex-1">
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
          className="relative rounded-xl overflow-hidden flex flex-col"
          style={{ backgroundColor: 'var(--color-neutral-900)' }}
        >
          <div className="absolute top-4 end-4">
            <span
              className="badge text-white"
              style={{ backgroundColor: 'var(--color-brand-500)' }}
            >
              {c.paid.popular}
            </span>
          </div>

          <div className="p-5 flex flex-col flex-1">
            <div className="mb-6">
              <div className="text-sm font-medium text-neutral-400 mb-1">{c.paid.name}</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold text-white">{c.paid.price}</span>
                <span className="text-sm text-neutral-400">{c.paid.period}</span>
              </div>
            </div>

            <ul className="space-y-3 flex-1">
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
