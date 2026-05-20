import { motion } from "motion/react"
import { Sparkles, Check, ArrowLeft, LayoutTemplate, FileText, Upload } from 'lucide-react'
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
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export function HeroSection({ lang, onStart }: HeroSectionProps) {
  const copy = COPY[lang] || COPY['en']
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-20 md:pt-16 md:pb-28">

      {/* Decorative Grid Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        }}
      />

      {/* Top Abstract Glow */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-10%] sm:top-[-20%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[600px] rounded-full blur-[100px] sm:blur-[120px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,77,45,0.2) 0%, rgba(255,160,122,0.1) 50%, transparent 100%)',
        }}
      />

      <div className="relative container-page z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          <motion.div variants={item}>
            <div className="inline-flex items-center gap-2 bg-white border border-rose-100 rounded-full px-4 py-1.5 text-sm text-slate-600 mb-8 shadow-sm hover:shadow transition-shadow">
              <span className="w-2 h-2 rounded-full dot-pulse bg-emerald-500" />
              {copy.badge}
            </div>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[5rem] font-black text-slate-900 leading-[1.1] mb-6 tracking-tight drop-shadow-sm"
          >
            {copy.title1}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D2D] to-orange-400 inline-block">
              {copy.titleAccent}
            </span>
            <br />
            <span className="text-slate-500 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.2] mt-2 block">{copy.title2}</span>
          </motion.h1>

          <motion.div variants={item} className="mb-8">
            <LiveCounter />
          </motion.div>

          <motion.p
            variants={item}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed whitespace-pre-line font-medium"
          >
            {copy.subtitle}
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                trackEvent('resume_started', { source: 'hero_cta' });
                onStart();
              }}
              className="bg-[#FF4D2D] hover:bg-[#E64528] text-white shadow-xl shadow-orange-500/20 inline-flex items-center justify-center gap-2 sm:w-auto w-full px-8 py-4 rounded-full font-bold text-lg transition-all"
              aria-label={copy.cta}
            >
              <Sparkles className="w-5 h-5" />
              {copy.cta}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(241,245,249,1)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/templates')}
              className="bg-white border-2 border-slate-200 text-slate-700 hover:text-slate-900 inline-flex items-center justify-center gap-2 sm:w-auto w-full px-8 py-4 rounded-full font-bold text-lg transition-all"
            >
              <LayoutTemplate className="w-5 h-5" />
              {copy.ctaSec}
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </motion.button>
          </motion.div>

          <motion.div
            variants={item}
            className="flex flex-wrap justify-center gap-x-8 gap-y-4 mt-12"
          >
            {copy.trust.map((t) => (
              <span key={t} className="flex items-center gap-2 text-sm md:text-base font-semibold text-slate-500">
                <div className="bg-emerald-100 rounded-full p-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          className="mt-20 w-full max-w-6xl mx-auto relative perspective-1000"
        >
          {/* Decorative Floaters */}
          <motion.div 
            animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-8 md:-left-12 top-10 md:top-20 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden md:flex items-center gap-3"
          >
            <div className="bg-[#FF4D2D]/10 p-3 rounded-xl"><FileText className="w-6 h-6 text-[#FF4D2D]" /></div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">ATS Score</div>
              <div className="text-lg font-black text-slate-800">92/100</div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [10, -10, 10], rotate: [2, -2, 2] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-6 md:-right-10 bottom-20 md:bottom-32 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden md:flex items-center gap-3"
          >
             <div className="bg-blue-100 p-3 rounded-xl"><Upload className="w-6 h-6 text-blue-600" /></div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Exported</div>
              <div className="text-lg font-black text-slate-800">PDF & Word</div>
            </div>
          </motion.div>


          {/* Big App Mockup */}
          <div className="relative rounded-2xl md:rounded-[2rem] overflow-hidden border-2 border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] bg-white transform rotate-x-2 hover:rotate-x-0 transition-transform duration-700">
            {/* Window bar */}
            <div className="flex items-center gap-2 px-6 py-4 bg-slate-50 border-b border-slate-100">
              <span className="w-3 h-3 rounded-full bg-rose-400 shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm" />
              <div className="mx-6 flex-1 h-7 rounded-md bg-white border border-slate-200 shadow-inner px-3 text-xs font-medium flex items-center justify-center text-slate-400">
                app.hashresume.com/editor
              </div>
            </div>

            {/* App Layout: Sidebar + Preview */}
            <div className="flex flex-col md:flex-row h-auto md:h-[650px] bg-slate-100/50">
              {/* Sidebar Input Mock */}
              <div className="w-full md:w-[35%] bg-white p-6 md:p-8 border-e border-slate-200 overflow-hidden flex flex-col gap-8 shadow-[10px_0_15px_-3px_rgba(0,0,0,0.02)] z-10">
                <div className="space-y-4">
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="h-11 bg-slate-50 rounded-xl border border-slate-200" />
                    <div className="h-11 bg-slate-50 rounded-xl border border-slate-200" />
                    <div className="h-11 bg-slate-50 rounded-xl border border-slate-200 col-span-2" />
                    <div className="h-24 bg-slate-50 rounded-xl border border-slate-200 col-span-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                  <div className="h-32 bg-slate-50 rounded-xl border border-slate-200" />
                  <div className="flex gap-3">
                    <div className="h-8 w-24 bg-[#FF4D2D]/20 rounded-full" />
                    <div className="h-8 w-20 bg-slate-200 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Document Preview Mock */}
              <div className="flex-1 p-6 md:p-12 flex items-center justify-center overflow-hidden bg-slate-50 relative">
                 {/* Subtle grid pattern for preview background */}
                 <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                 
                <div className="w-full max-w-[480px] aspect-[1/1.414] bg-white shadow-2xl border border-slate-200 p-8 flex flex-col relative transform md:scale-95 transition-transform hover:scale-100 z-10 group cursor-default">
                   {/* Hover overlay hint */}
                   <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-sm">
                      <div className="bg-white/90 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">Live Preview</div>
                   </div>

                  {/* Fake Resume Content */}
                  <div className="text-center border-b-2 border-slate-800 pb-5 mb-5 mt-2">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-[0.2em] mb-1">Youssef Ahmed</h2>
                    <p className="text-[9px] text-slate-500 font-medium tracking-wider">Software Engineer  •  youssef@example.com  •  Cairo, Egypt</p>
                  </div>

                  <div className="flex gap-8 flex-1 text-[8px] leading-relaxed text-slate-700">
                    {/* Left Column */}
                    <div className="w-[65%] space-y-5">
                      <div>
                        <h3 className="text-[10px] font-bold text-slate-800 border-b border-slate-200 pb-1 mb-3 uppercase tracking-widest text-[#FF4D2D]">Experience</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between font-bold text-slate-800 mb-1">
                              <span className="text-[9px]">Senior Frontend Engineer — TechCorp</span>
                              <span>2021 - Present</span>
                            </div>
                            <ul className="list-disc ps-3 space-y-1 text-slate-600 marker:text-slate-300">
                              <li>Led the migration of a legacy dashboard to React, improving load time by 40%.</li>
                              <li>Mentored a team of 4 junior developers and established code review guidelines.</li>
                              <li>Implemented complex UI components using Tailwind CSS and Framer Motion.</li>
                            </ul>
                          </div>
                          <div>
                            <div className="flex justify-between font-bold text-slate-800 mb-1">
                              <span className="text-[9px]">Frontend Developer — StartupX</span>
                              <span>2018 - 2021</span>
                            </div>
                            <ul className="list-disc ps-3 space-y-1 text-slate-600 marker:text-slate-300">
                              <li>Developed responsive landing pages processing 10k+ daily visitors.</li>
                              <li>Integrated RESTful APIs and optimized state management with Redux.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-[10px] font-bold text-slate-800 border-b border-slate-200 pb-1 mb-3 uppercase tracking-widest text-[#FF4D2D]">Education</h3>
                        <div>
                          <div className="flex justify-between font-bold text-slate-800 mb-0.5">
                            <span className="text-[9px]">B.Sc. in Computer Science</span>
                            <span>2014 - 2018</span>
                          </div>
                          <div className="text-slate-500 italic">Cairo University — Graduated with Honors</div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="w-[35%] space-y-5">
                      <div>
                        <h3 className="text-[10px] font-bold text-slate-800 border-b border-slate-200 pb-1 mb-3 uppercase tracking-widest text-[#FF4D2D]">Skills</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {['React', 'TypeScript', 'Node.js', 'Tailwind', 'Next.js', 'GraphQL', 'Git'].map(skill => (
                            <span key={skill} className="bg-slate-100 text-slate-700 px-2 py-1 rounded-[4px] text-[7px] font-medium border border-slate-200/60 shadow-sm whitespace-nowrap">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-[10px] font-bold text-slate-800 border-b border-slate-200 pb-1 mb-3 uppercase tracking-widest text-[#FF4D2D]">Languages</h3>
                        <div className="space-y-2 text-slate-600">
                          <div className="flex justify-between border-b border-slate-100 pb-1"><span className="font-semibold text-slate-800">Arabic</span><span className="text-slate-400">Native</span></div>
                          <div className="flex justify-between"><span className="font-semibold text-slate-800">English</span><span className="text-slate-400">Fluent</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Bottom fade out gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-10" />
    </section>
  )
}
