import { motion } from "motion/react"
import { Sparkles, Check, ArrowLeft, LayoutTemplate } from 'lucide-react'
import type { AppLang } from '@/hooks/useDirection'
import { trackEvent } from '@/services/analytics'
import { useNavigate } from 'react-router-dom'

import LiveCounter from '@/components/LiveCounter'

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
    ctaSec:      'تصفح القوالب',
    trust: ['بدون بطاقة ائتمان', 'عربي وإنجليزي وفرنسي', 'متوافق مع أنظمة ATS'],
  },
  en: {
    badge:       '+2,400 resumes created this month',
    title1:      'Your professional resume',
    titleAccent: 'in 5 minutes',
    title2:      'in Arabic or English',
    subtitle:    'AI writes it, you review and download.\nNo sign-up. No subscription.',
    cta:         'Start Free',
    ctaSec:      'View Templates',
    trust: ['No credit card', 'Arabic, English & French', 'ATS-optimized'],
  },
  fr: {
    badge:       '+2 400 CV créés ce mois-ci',
    title1:      'Votre CV professionnel',
    titleAccent: 'en 5 minutes',
    title2:      'en arabe ou en anglais',
    subtitle:    "L'IA rédige, vous révisez et téléchargez.\nSans inscription. Sans abonnement.",
    cta:         'Commencer',
    ctaSec:      'Voir les modèles',
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
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden bg-neutral-50 pt-10 pb-20 md:pt-16 md:pb-28">

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

          <motion.div variants={item} className="mb-6">
            <LiveCounter />
          </motion.div>

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
              onClick={() => navigate('/templates')}
              className="btn-ghost inline-flex items-center justify-center gap-2 sm:w-auto w-full px-8 py-3 text-lg"
            >
              <LayoutTemplate className="w-5 h-5" />
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
                  <div className="text-center border-b border-neutral-200 pb-4 mb-4">
                    <h2 className="text-lg font-bold text-neutral-800 uppercase tracking-widest mb-1">Youssef Ahmed</h2>
                    <p className="text-[10px] text-neutral-500">Software Engineer | youssef@example.com | Cairo, Egypt</p>
                  </div>

                  <div className="flex gap-6 flex-1 text-[8px] leading-relaxed text-neutral-700">
                    {/* Left Column */}
                    <div className="w-2/3 space-y-4">
                      <div>
                        <h3 className="text-[10px] font-bold text-neutral-800 border-b border-neutral-200 pb-1 mb-2 uppercase">Experience</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between font-bold text-neutral-800">
                              <span>Senior Frontend Engineer — TechCorp</span>
                              <span>2021 - Present</span>
                            </div>
                            <ul className="list-disc ps-3 mt-1 space-y-0.5 text-neutral-600">
                              <li>Led the migration of a legacy dashboard to React, improving load time by 40%.</li>
                              <li>Mentored a team of 4 junior developers and established code review guidelines.</li>
                              <li>Implemented complex UI components using Tailwind CSS and Framer Motion.</li>
                            </ul>
                          </div>
                          <div>
                            <div className="flex justify-between font-bold text-neutral-800">
                              <span>Frontend Developer — StartupX</span>
                              <span>2018 - 2021</span>
                            </div>
                            <ul className="list-disc ps-3 mt-1 space-y-0.5 text-neutral-600">
                              <li>Developed responsive landing pages processing 10k+ daily visitors.</li>
                              <li>Integrated RESTful APIs and optimized state management with Redux.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-[10px] font-bold text-neutral-800 border-b border-neutral-200 pb-1 mb-2 uppercase">Education</h3>
                        <div>
                          <div className="flex justify-between font-bold text-neutral-800">
                            <span>B.Sc. in Computer Science</span>
                            <span>2014 - 2018</span>
                          </div>
                          <div className="text-neutral-600">Cairo University — Graduated with Honors</div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="w-1/3 space-y-4">
                      <div>
                        <h3 className="text-[10px] font-bold text-neutral-800 border-b border-neutral-200 pb-1 mb-2 uppercase">Skills</h3>
                        <div className="flex flex-wrap gap-1">
                          {['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Next.js', 'GraphQL', 'Git'].map(skill => (
                            <span key={skill} className="bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded text-[7px] border border-neutral-200 whitespace-nowrap">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-[10px] font-bold text-neutral-800 border-b border-neutral-200 pb-1 mb-2 uppercase">Languages</h3>
                        <div className="space-y-1 text-neutral-600">
                          <div className="flex justify-between"><span>Arabic</span><span className="text-neutral-400">Native</span></div>
                          <div className="flex justify-between"><span>English</span><span className="text-neutral-400">Fluent</span></div>
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
