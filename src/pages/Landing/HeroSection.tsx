import { motion } from "motion/react"
import { Sparkles, Check, ArrowLeft, Play } from 'lucide-react'
import type { AppLang } from '@/hooks/useDirection'
import { LOGO_URL } from '@/constants'
import { trackEvent } from '@/services/analytics'

interface HeroSectionProps {
  lang: AppLang
  onStart: () => void
}

const COPY = {
  ar: {
    badge:       '+2,400 سيرة ذاتية هذا الشهر',
    title1:      'سيرتك الاحترافية',
    titleAccent: 'في 5 دقائق',
    title2:      'بالعربي أو الإنجليزي',
    subtitle:    'الذكاء الاصطناعي يكتب، أنت تراجع وتحمّل.\nبدون تسجيل. بدون اشتراك.',
    cta:         'ابدأ مجانًا',
    ctaSec:      'شاهد مثال',
    trust: ['بدون بطاقة ائتمان', 'عربي وإنجليزي وفرنسي', 'متوافق مع أنظمة ATS'],
  },
  en: {
    badge:       '+2,400 resumes created this month',
    title1:      'Your professional resume',
    titleAccent: 'in 5 minutes',
    title2:      'in Arabic or English',
    subtitle:    'AI writes it, you review and download.\nNo sign-up. No subscription.',
    cta:         'Start Free',
    ctaSec:      'See Example',
    trust: ['No credit card', 'Arabic, English & French', 'ATS-optimized'],
  },
  fr: {
    badge:       '+2 400 CV créés ce mois-ci',
    title1:      'Votre CV professionnel',
    titleAccent: 'en 5 minutes',
    title2:      'en arabe ou en anglais',
    subtitle:    "L'IA rédige, vous révisez et téléchargez.\nSans inscription. Sans abonnement.",
    cta:         'Commencer',
    ctaSec:      'Voir un exemple',
    trust: ['Sans carte bancaire', 'Arabe, anglais et français', 'Optimisé ATS'],
  },
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export function HeroSection({ lang, onStart }: HeroSectionProps) {
  const copy = COPY[lang] || COPY['en']

  return (
    <section className="relative overflow-hidden bg-neutral-50 pt-16 pb-16 md:pt-24 md:pb-24">

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, #d1d1ce 1px, transparent 1px), linear-gradient(to bottom, #d1d1ce 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, color-mix(in srgb, #FF4D2D 8%, transparent), transparent)',
        }}
      />

      <div className="relative container-page">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center max-w-3xl mx-auto"
        >
          <motion.div variants={item}>
            <div className="inline-flex items-center gap-2 bg-white border border-neutral-200 rounded-full px-4 py-1.5 text-sm text-neutral-600 mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full dot-pulse" style={{ backgroundColor: 'var(--color-success)' }} />
              {copy.badge}
            </div>
          </motion.div>

          <motion.div variants={item} className="flex flex-col items-center gap-4 my-10">
            <img src={LOGO_URL} alt="Hash Resume Logo" className="h-[120px] w-auto mx-auto" loading="lazy" />
            <h2 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight">
              Hash Resume
            </h2>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold text-neutral-900 leading-tight mb-4"
          >
            {copy.title1}{' '}
            <span style={{ color: 'var(--color-brand-500)' }}>
              {copy.titleAccent}
            </span>
            <br />
            <span className="text-neutral-500 text-3xl md:text-4xl">{copy.title2}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-base md:text-lg text-neutral-500 max-w-lg mx-auto mb-8 leading-relaxed whitespace-pre-line"
          >
            {copy.subtitle}
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                trackEvent('resume_started', { source: 'hero_cta' });
                onStart();
              }}
              className="btn-primary inline-flex items-center justify-center gap-2 sm:w-auto w-full"
              aria-label={copy.cta}
            >
              <Sparkles className="w-4 h-4" />
              {copy.cta}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="btn-ghost inline-flex items-center justify-center gap-2 sm:w-auto w-full"
            >
              <Play className="w-4 h-4" />
              {copy.ctaSec}
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            </motion.button>
          </motion.div>

          <motion.div
            variants={item}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-10"
          >
            {copy.trust.map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-sm text-neutral-400">
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-success)' }} />
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-2xl bg-white">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-neutral-100 border-b border-neutral-200">
              <span className="w-3 h-3 rounded-full bg-neutral-300" />
              <span className="w-3 h-3 rounded-full bg-neutral-300" />
              <span className="w-3 h-3 rounded-full bg-neutral-300" />
              <div className="flex-1 mx-4 h-5 bg-neutral-200 rounded-full" />
            </div>
            <div className="p-8 space-y-4 min-h-48">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-neutral-900 rounded-md" />
                  <div className="h-4 w-32 bg-neutral-300 rounded-md" />
                  <div className="h-3 w-40 bg-neutral-200 rounded-md" />
                </div>
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-semibold"
                  style={{ backgroundColor: 'var(--color-brand-500)' }}
                >
                  HR
                </div>
              </div>
              <div className="h-px bg-neutral-200" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-neutral-400 rounded-md" />
                <div className="h-3 w-full bg-neutral-100 rounded-md" />
                <div className="h-3 w-5/6 bg-neutral-100 rounded-md" />
                <div className="h-3 w-4/6 bg-neutral-100 rounded-md" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-neutral-400 rounded-md" />
                <div className="flex gap-2 flex-wrap">
                  {['React', 'TypeScript', 'Node.js', 'Tailwind'].map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: 'var(--color-brand-50)', color: 'var(--color-brand-700)' }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -bottom-4 -end-4 bg-white border border-neutral-200 rounded-2xl px-4 py-2.5 shadow-lg"
            >
              <div className="text-xs text-neutral-500 mb-0.5">ATS Score</div>
              <div className="font-semibold text-lg" style={{ color: 'var(--color-success)' }}>92 / 100</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
