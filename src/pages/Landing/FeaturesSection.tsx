import { motion } from 'motion/react'
import { Sparkles, Check, Bot, Target, FileText, Download } from 'lucide-react'
import type { AppLang } from '@/hooks/useDirection'

interface FeaturesSectionProps { lang: AppLang }

const HEADINGS = {
  ar: {
    label: 'طريقة العمل الذكية',
    title: 'كيف يعمل Hash Resume؟',
    subtitle: 'أربع خطوات ذكية وبسيطة تفصلك عن الحصول على سيرة ذاتية استثنائية جاهزة للتصدير والتوظيف.'
  },
  en: {
    label: 'How It Works',
    title: 'How Hash Resume Works',
    subtitle: 'Four simple and intelligent steps designed to get you noticed by top-tier hiring teams.'
  },
  fr: {
    label: 'Comment ça marche',
    title: 'Comment fonctionne Hash Resume',
    subtitle: 'Quatre étapes simples et intelligentes conçues pour vous faire remarquer par les meilleurs recruteurs.'
  }
}

const STEPS = {
  ar: [
    {
      num: '01',
      title: 'اختر القالب الاحترافي',
      desc: 'اختر من بين مجموعة من التنسيقات المعتمدة والمطابقة لمعايير الـ ATS العالمية والمصممة بدقة لتلائم مجالك.',
      actionLabel: 'اختر قالبك المفضل'
    },
    {
      num: '02',
      title: 'اكتب بياناتك بمساعدة الذكاء الاصطناعي',
      desc: 'اكتب خبراتك ومسؤولياتك بشكل طبيعي. سيتولى محركنا الذكي إعادة صياغتها واقتراح أقوى الكلمات المفتاحية والأفعال المهنية.',
      actionLabel: 'تحسين ذكي بنقرة واحدة'
    },
    {
      num: '03',
      title: 'افحص توافق الـ ATS مباشرة',
      desc: 'شاهد تحليلاً فورياً لمدى ملاءمة سيرتك مع أنظمة فرز السير الذاتية، مع توجيهات تفصيلية لإصلاح نقاط الضعف.',
      actionLabel: 'معدل القبول المتوقع: 98%'
    },
    {
      num: '04',
      title: 'تحميل فوري بنقرة واحدة',
      desc: 'احصل على سيرة ذاتية احترافية بصيغة PDF نقية بأبعاد متناسقة ومحاذاة مثالية وجاهزة للإرسال فوراً لجهات العمل.',
      actionLabel: 'تحميل ملف PDF جاهز'
    }
  ],
  en: [
    {
      num: '01',
      title: 'Select Premium Template',
      desc: 'Choose from executive, modern, and classic layouts meticulously built to bypass automated parsing filters and catch recruiters’ attention.',
      actionLabel: 'Select layout'
    },
    {
      num: '02',
      title: 'AI-Powered Resume Crafting',
      desc: 'Describe your achievements naturally. Our integrated Gemini engine instantly rewrites statements to feature professional action verbs.',
      actionLabel: '1-Click Intelligent Rewrite'
    },
    {
      num: '03',
      title: 'Real-Time ATS Alignment',
      desc: 'Get live scores and insights as you edit. Discover missing industry terms, keyword densities, and clear formatting guidelines instantly.',
      actionLabel: 'ATS Compatibility: 98%'
    },
    {
      num: '04',
      title: 'Instant Professional Download',
      desc: 'Export a flawless, vector-based PDF file in seconds. Pixel-perfect, ultra-light, and optimized to look stunning on screens or in print.',
      actionLabel: 'Download Clean PDF'
    }
  ],
  fr: [
    {
      num: '01',
      title: 'Sélectionnez un modèle',
      desc: 'Sélectionnez une mise en page exécutive, moderne ou classique spécialement conçue pour contourner les filtres automatiques ATS.',
      actionLabel: 'Choisir le modèle'
    },
    {
      num: '02',
      title: 'Rédaction intelligente par l’IA',
      desc: 'Saisissez vos réalisations naturellement. Notre moteur IA réécrit vos puces pour mettre en avant vos compétences clés.',
      actionLabel: 'Optimisation en 1 Clic'
    },
    {
      num: '03',
      title: 'Validation ATS en temps réel',
      desc: 'Visualisez votre score de compatibilité direct et repérez les mots-clés manquants au fur et à mesure de votre saisie.',
      actionLabel: 'Validation ATS : 98%'
    },
    {
      num: '04',
      title: 'Export PDF instantané',
      desc: 'Générez un fichier PDF vectoriel parfait en 1 seconde. Léger, propre et prêt à être envoyé directement aux employeurs.',
      actionLabel: 'Télécharger le PDF'
    }
  ]
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}

export function FeaturesSection({ lang }: FeaturesSectionProps) {
  const heading = HEADINGS[lang] || HEADINGS['en']
  const steps = STEPS[lang] || STEPS['en']
  const isAr = lang === 'ar'

  return (
    <section id="features" className="py-24 sm:py-32 px-4 md:px-6 w-full bg-slate-50 relative overflow-hidden select-none border-t border-b border-slate-200/60" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background radial soft light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-brand-50/20 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/70 shadow-3xs text-[11px] font-black text-brand-600 tracking-wider uppercase mb-5">
            <Sparkles size={11} className="animate-pulse" />
            <span>{heading.label}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-5 tracking-tight leading-tight">
            {heading.title}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-semibold">
            {heading.subtitle}
          </p>
        </div>

        {/* Dynamic Bento/Step Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
        >
          {steps.map((s, idx) => {
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 hover:border-brand-500/20 hover:shadow-2xl hover:shadow-brand-500/5 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-3 ltr:-right-3 rtl:-left-3 text-9xl font-black text-slate-50 opacity-[0.03] select-none pointer-events-none font-sans group-hover:opacity-[0.06] transition-opacity duration-300">
                  {s.num}
                </div>

                {/* Card Header Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-100 text-brand-600 font-black text-xs sm:text-sm flex items-center justify-center shadow-3xs">
                      {s.num}
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-[13px] sm:text-sm leading-relaxed font-semibold">
                    {s.desc}
                  </p>
                </div>

                {/* CUSTOM STEP-SPECIFIC VISUAL REPRESENTATIONS */}
                <div className="mt-8 border-t border-slate-100/80 pt-6 select-none shrink-0">
                  {idx === 0 && (
                    /* Step 1: Interactive Template Showcase Micro-UI */
                    <div className="flex items-center gap-3 justify-center py-2 bg-slate-50/50 rounded-2xl border border-slate-100 p-3">
                      <div className="flex -space-x-2.5 rtl:space-x-reverse">
                        <div className="w-11 h-14 bg-white border border-slate-200 rounded-md shadow-3xs flex flex-col gap-1.5 p-1">
                          <div className="w-1/2 h-1 bg-slate-200 rounded-xs" />
                          <div className="w-full h-0.5 bg-slate-100 rounded-xs" />
                          <div className="w-full h-0.5 bg-slate-100 rounded-xs" />
                          <div className="w-3/4 h-0.5 bg-slate-100 rounded-xs" />
                        </div>
                        <div className="w-11 h-14 bg-white border-2 border-brand-500 rounded-md shadow-md z-10 flex flex-col gap-1.5 p-1 relative scale-105">
                          <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-brand-500 flex items-center justify-center text-[5px] text-white font-black">
                            ✓
                          </div>
                          <div className="w-1/2 h-1 bg-brand-500 rounded-xs" />
                          <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
                          <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
                          <div className="w-3/4 h-0.5 bg-slate-100 rounded-xs" />
                        </div>
                        <div className="w-11 h-14 bg-white border border-slate-200 rounded-md shadow-3xs flex flex-col gap-1.5 p-1 opacity-85">
                          <div className="w-1/2 h-1 bg-slate-200 rounded-xs" />
                          <div className="w-full h-0.5 bg-slate-100 rounded-xs" />
                          <div className="w-3/4 h-0.5 bg-slate-100 rounded-xs" />
                        </div>
                      </div>
                      <div className="ltr:text-left rtl:text-right">
                        <div className="text-[10px] font-black text-slate-800 leading-tight">Modern Executive</div>
                        <div className="text-[8.5px] font-bold text-brand-600 mt-0.5 flex items-center gap-1">
                          <span className="w-1 h-1 bg-brand-500 rounded-full animate-pulse" />
                          <span>{s.actionLabel}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {idx === 1 && (
                    /* Step 2: Live AI Bullet Rewrite Micro-UI (Before vs After) */
                    <div className="space-y-2 py-1">
                      <div className="flex items-start gap-2 text-[10px] bg-slate-50 text-slate-400 p-2 rounded-xl border border-slate-100">
                        <span className="font-bold shrink-0 text-slate-400">Before:</span>
                        <span className="italic">"I did sales and led the team."</span>
                      </div>
                      <div className="flex items-start gap-2 text-[10px] bg-brand-50/40 text-brand-900 p-2 rounded-xl border border-brand-100/50 relative overflow-hidden">
                        <div className="absolute -right-1 -bottom-1 text-[20px] font-black text-brand-500/5 select-none pointer-events-none">
                          <Bot size={24} />
                        </div>
                        <span className="font-extrabold text-brand-600 shrink-0 flex items-center gap-0.5">
                          <Sparkles size={8} className="animate-spin text-brand-500" style={{ animationDuration: '6s' }} />
                          <span>AI:</span>
                        </span>
                        <span className="font-bold">
                          "Spearheaded enterprise sales campaigns, elevating customer growth metrics by 38%."
                        </span>
                      </div>
                    </div>
                  )}

                  {idx === 2 && (
                    /* Step 3: Interactive ATS Gauge Meter Mock-UI */
                    <div className="flex items-center justify-between gap-4 py-2 bg-slate-50/50 rounded-2xl border border-slate-100 p-3">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                          <span>ATS Scan Engine</span>
                          <span className="text-emerald-600 font-extrabold">98% Perfect</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden relative">
                          <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-brand-500 via-emerald-500 to-emerald-400 rounded-full w-[98%] animate-pulse" />
                        </div>
                        <div className="text-[8.5px] font-bold text-slate-400 flex items-center gap-1">
                          <Check size={8} className="text-emerald-500 shrink-0 stroke-[3]" />
                          <span>All high-priority key phrases fully optimized.</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-3xs shrink-0 font-sans">
                        <Target size={18} className="animate-pulse" />
                      </div>
                    </div>
                  )}

                  {idx === 3 && (
                    /* Step 4: Vector PDF Instant Compiler UI */
                    <div className="flex items-center justify-between py-2 bg-slate-50/50 rounded-2xl border border-slate-100 p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-brand-50 border border-brand-100 text-brand-600 rounded-xl">
                          <FileText size={18} />
                        </div>
                        <div className="ltr:text-left rtl:text-right">
                          <div className="text-[10px] font-black text-slate-800 leading-tight">resume_export.pdf</div>
                          <div className="text-[8.5px] font-bold text-slate-400 mt-0.5">Vector PDF • A4 standard size</div>
                        </div>
                      </div>
                      <div className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-[10.5px] font-black flex items-center gap-1 shadow-xs shadow-brand-500/20 select-none">
                        <Download size={11} className="stroke-[3]" />
                        <span>PDF</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
