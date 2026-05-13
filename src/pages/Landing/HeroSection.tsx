import { motion } from "motion/react"
import { Sparkles, Check, ArrowLeft, Play } from 'lucide-react'
import type { AppLang } from '@/hooks/useDirection'
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
    <section className="relative overflow-hidden bg-neutral-50 pt-10 pb-16 md:pt-16 md:pb-16">

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #d1d1ce 1px, transparent 1px), linear-gradient(to bottom, #d1d1ce 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, white 40%, transparent 100%)',
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
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          <motion.div variants={item}>
            <div className="inline-flex items-center gap-2 bg-white border border-neutral-200 rounded-full px-4 py-1.5 text-sm text-neutral-600 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full dot-pulse" style={{ backgroundColor: 'var(--color-success)' }} />
              {copy.badge}
            </div>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-4xl md:text-6xl lg:text-7xl font-semibold text-neutral-900 leading-[1.15] mb-6 tracking-tight"
          >
            {copy.title1}{' '}
            <span style={{ color: 'var(--color-brand-500)' }}>
              {copy.titleAccent}
            </span>
            <br />
            <span className="text-neutral-500 text-3xl md:text-5xl lg:text-6xl leading-[1.15]">{copy.title2}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-base md:text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed whitespace-pre-line"
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
              className="btn-primary inline-flex items-center justify-center gap-2 sm:w-auto w-full px-8 py-3 text-lg"
              aria-label={copy.cta}
            >
              <Sparkles className="w-5 h-5" />
              {copy.cta}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="btn-ghost inline-flex items-center justify-center gap-2 sm:w-auto w-full px-8 py-3 text-lg"
            >
              <Play className="w-5 h-5" />
              {copy.ctaSec}
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </motion.button>
          </motion.div>

          <motion.div
            variants={item}
            className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-8"
          >
            {copy.trust.map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-sm md:text-base text-neutral-500">
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
          className="mt-16 w-full max-w-6xl mx-auto"
        >
          {/* Big App Mockup */}
          <div className="relative rounded-2xl md:rounded-[32px] overflow-hidden border border-neutral-200/60 shadow-2xl bg-white" style={{boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)'}}>
            {/* Window bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-neutral-50/80 border-b border-neutral-200/50">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="mx-4 flex-1 h-5 rounded px-2 text-xs flex items-center justify-center text-neutral-400">
                app.hashresume.com/editor
              </div>
            </div>

            {/* App Layout: Sidebar + Preview */}
            <div className="flex flex-col md:flex-row h-auto md:h-[600px] bg-neutral-100/50">
              {/* Sidebar Input Mock */}
              <div className="w-full md:w-1/3 bg-white p-6 md:p-8 border-e border-neutral-200/50 overflow-hidden flex flex-col gap-6">
                <div className="space-y-4">
                  <div className="h-6 w-32 bg-neutral-200 rounded-md" />
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="h-10 bg-neutral-100 rounded-lg border border-neutral-200/50" />
                    <div className="h-10 bg-neutral-100 rounded-lg border border-neutral-200/50" />
                    <div className="h-10 bg-neutral-100 rounded-lg border border-neutral-200/50 col-span-2" />
                    <div className="h-10 bg-neutral-100 rounded-lg border border-neutral-200/50 col-span-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-6 w-24 bg-neutral-200 rounded-md" />
                  <div className="h-24 bg-neutral-100 rounded-lg border border-neutral-200/50" />
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-neutral-200 rounded-full" />
                    <div className="h-8 w-24 bg-neutral-200 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Document Preview Mock */}
              <div className="flex-1 p-6 md:p-10 flex items-center justify-center overflow-hidden">
                <div className="w-full max-w-[500px] aspect-[1/1.414] bg-white shadow-lg border border-neutral-200/30 p-8 flex flex-col relative transform md:scale-95 transition-transform hover:scale-100">
                  {/* Fake Resume Content */}
                  <div className="text-center border-b border-neutral-200 pb-6 mb-6">
                    <div className="h-8 w-48 bg-neutral-800 rounded-md mx-auto mb-3" />
                    <div className="h-3 w-64 bg-neutral-300 rounded mx-auto" />
                  </div>

                  <div className="flex gap-8">
                    {/* Left Column */}
                    <div className="w-2/3 space-y-6">
                      <div>
                        <div className="h-4 w-24 bg-neutral-800 rounded mb-4" />
                        <div className="space-y-3">
                          <div className="h-3 w-full bg-neutral-200 rounded" />
                          <div className="h-3 w-5/6 bg-neutral-200 rounded" />
                          <div className="h-3 w-4/6 bg-neutral-200 rounded" />
                        </div>
                      </div>
                      <div>
                        <div className="h-4 w-32 bg-neutral-800 rounded mb-4" />
                        <div className="space-y-4">
                          {[1,2].map(i => (
                            <div key={i} className="space-y-2">
                              <div className="h-3 w-3/4 bg-neutral-400 rounded" />
                              <div className="h-3 w-full bg-neutral-200 rounded" />
                              <div className="h-3 w-5/6 bg-neutral-200 rounded" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="w-1/3 space-y-6">
                      <div>
                        <div className="h-4 w-16 bg-neutral-800 rounded mb-4" />
                        <div className="space-y-2">
                          <div className="h-3 w-full bg-neutral-200 rounded" />
                          <div className="h-3 w-full bg-neutral-200 rounded" />
                          <div className="h-3 w-3/4 bg-neutral-200 rounded" />
                        </div>
                      </div>
                      <div>
                        <div className="h-4 w-20 bg-neutral-800 rounded mb-4" />
                        <div className="flex flex-wrap gap-2">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className="h-5 w-12 bg-neutral-100 rounded border border-neutral-200" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ATS Pill */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="absolute -bottom-6 -end-6 bg-white border border-neutral-200 rounded-2xl px-5 py-3 shadow-xl z-10"
                  >
                    <div className="text-xs text-neutral-500 mb-0.5">ATS Score</div>
                    <div className="font-bold text-xl" style={{ color: 'var(--color-success)' }}>92 / 100</div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
