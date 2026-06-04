import { useState } from 'react'
import { motion } from "motion/react"
import { Sparkles, Check, ArrowLeft, LayoutTemplate, FileText, Wand2, RefreshCw, Star } from 'lucide-react'
import type { AppLang } from '@/hooks/useDirection'
import { trackEvent } from '@/services/analytics'
import { useNavigate } from 'react-router-dom'
import TiltCard from '@/components/landing/TiltCard'

interface HeroSectionProps {
  lang: AppLang
  onStart: () => void
}

const COPY = {
  ar: {
    title1:      'سيرتك الاحترافية',
    titleAccent: 'في 5 دقائق',
    title2:      'بالعربي أو الإنجليزي',
    subtitle:    'الذكاء الاصطناعي يكتب، أنت تراجع وتحمّل.\nبدون تسجيل. بدون اشتراك.',
    cta:         'ابدأ الآن',
    ctaSec:      'تصفح القوالب',
    trust: ['بدون بطاقة ائتمان', 'عربي وإنجليزي وفرنسي', 'متوافق مع أنظمة ATS'],
  },
  en: {
    title1:      'Your professional resume',
    titleAccent: 'in 5 minutes',
    title2:      'in Arabic or English',
    subtitle:    'AI writes it, you review and download.\nNo sign-up. No subscription.',
    cta:         'Start Now',
    ctaSec:      'View Templates',
    trust: ['No credit card', 'Arabic, English & French', 'ATS-optimized'],
  },
  fr: {
    title1:      'Votre CV professionnel',
    titleAccent: 'en 5 minutes',
    title2:      'en arabe ou en anglais',
    subtitle:    "L'IA rédige, vous révisez et téléchargez.\nSans inscription. Sans abonnement.",
    cta:         'Créer maintenant',
    ctaSec:      'Voir les modèles',
    trust: ['Sans carte bancaire', 'Arabe, anglais et français', 'Optimisé ATS'],
  },
}

const SANDBOX_COPY = {
  ar: {
    fullNameLabel: "الاسم الكامل",
    jobTitleLabel: "المسمى الوظيفي",
    summaryLabel: "النبذة التعريفية",
    skillsLabel: "المهارات المتوفرة (انقر للتنشيط)",
    aiButton: "تحسين مذهل بالذكاء الاصطناعي 🪄",
    aiWorking: "صياغة الجُمَل ودمج الكلمات القوية...",
    atsScoreLabel: "نقاط الـ ATS",
    atsStatusTitle: "تقرير توافق الروبوتات",
    atsCheck1: "الاسم والمسمى مُنسّقان جيداً",
    atsCheck2: "الكلمات الدلالية الموصى بها",
    atsCheck3: "تضمين أرقام وإحصائيات قوية",
    genericSummary: "أنا مبرمج عادي، أقوم ببناء مواقع الويب باستخدام لغة رياكت وبعض التصاميم البسيطة وأبحث عن فرصة جديدة.",
    optimizedSummary: "مهندس برمجيات واجهات وتطوير حلول رياديات بخبرة 5 سنوات في قيادة واجهات الويب فائقة الكفاءة، وابتكار نظم دفع سحابية آمنة خفضت وقت التحميل بنسبة %40 ومعدّل الارتداد بنسبة %15.",
    skillsPool: ["رياكت", "تايب سكريبت", "CSS", "Node.js", "Docker", "Git", "واجهات الAPI", "التسويق"],
    resumeLabel: "معاينة حية ومباشرة",
    liveSec: "الحد الأدنى لـ ATS",
    resetBtn: "إعادة تعيين 🔄"
  },
  en: {
    fullNameLabel: "Full Name",
    jobTitleLabel: "Job Title",
    summaryLabel: "Profile Summary",
    skillsLabel: "Available Skills (Click to toggle)",
    aiButton: "Optimize with AI Write Magic 🪄",
    aiWorking: "Injecting professional action verbs...",
    atsScoreLabel: "ATS Compatibility Score",
    atsStatusTitle: "ATS Bot Checker",
    atsCheck1: "Contact segments parsed",
    atsCheck2: "Job keywords matching",
    atsCheck3: "High-impact metric verbs included",
    genericSummary: "I coordinate simple front-end web apps with React. I am currently seeking an interface development job.",
    optimizedSummary: "Lead React Architect with 5+ years of production experience crafting type-safe web architectures and multi-tenant platforms, reducing bounce rates by 15% and system response times by 40%.",
    skillsPool: ["React", "TypeScript", "Tailwind", "Node.js", "Docker", "Git", "Next.js", "APIs"],
    resumeLabel: "Live Interactive Preview",
    liveSec: "ATS Friendly Standard",
    resetBtn: "Reset Sandbox 🔄"
  },
  fr: {
    fullNameLabel: "Nom Complet",
    jobTitleLabel: "Poste",
    summaryLabel: "Résumé Professionnel",
    skillsLabel: "Compétences (Cliquer pour basculer)",
    aiButton: "Optimiser par IA 🪄",
    aiWorking: "Optimisation des métriques en cours...",
    atsScoreLabel: "Score de conformité ATS",
    atsStatusTitle: "Analyse des bots ATS",
    atsCheck1: "Données de contact détectées",
    atsCheck2: "Mots-clés cibles indexés",
    atsCheck3: "Verbes d'action avec métriques",
    genericSummary: "Je fais des sites web simples avec React. Je cherche un emploi de développeur frontend.",
    optimizedSummary: "Developpeur React Senior fort de 5+ ans d'expérience dans la conception d'architectures web typées, réduisant le taux de rebond de 15% et le temps de charge global de 35%.",
    skillsPool: ["React", "TypeScript", "Tailwind", "Node.js", "Docker", "Git", "Next.js", "APIs"],
    resumeLabel: "Aperçu interactif direct",
    liveSec: "Standard optimisé ATS",
    resetBtn: "Réinitialiser 🔄"
  }
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
  const sCopy = SANDBOX_COPY[lang] || SANDBOX_COPY['en']
  const navigate = useNavigate()
  const [activeTheme, setActiveTheme] = useState(0)

  // Interactive Sandbox states
  const [fullName, setFullName] = useState(lang === "ar" ? "يوسف أحمد البستاني" : lang === "fr" ? "Youssef Ahmed" : "Youssef Ahmed");
  const [jobTitle, setJobTitle] = useState(lang === "ar" ? "مهندس برمجيات ريأكت" : lang === "fr" ? "Ingénieur Front-End" : "React Developer");
  const [summary, setSummary] = useState(sCopy.genericSummary);
  const [skills, setSkills] = useState(sCopy.skillsPool.slice(0, 5));
  const [isAIOptimizing, setIsAIOptimizing] = useState(false);
  const [hasOptimized, setHasOptimized] = useState(false);

  const handleToggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      if (skills.length < 8) {
        setSkills([...skills, skill]);
      }
    }
  };

  const handleAIOptimize = () => {
    if (isAIOptimizing) return;
    setIsAIOptimizing(true);
    let iteration = 0;
    const interval = setInterval(() => {
      iteration++;
      if (iteration === 12) {
        setSummary(sCopy.optimizedSummary);
        setHasOptimized(true);
        setIsAIOptimizing(false);
        clearInterval(interval);
      }
    }, 120);
  };

  const handleResetSandbox = () => {
    setFullName(lang === "ar" ? "يوسف أحمد البستاني" : lang === "fr" ? "Youssef Ahmed" : "Youssef Ahmed");
    setJobTitle(lang === "ar" ? "مهندس برمجيات ريأكت" : lang === "fr" ? "Ingénieur Front-End" : "React Developer");
    setSummary(sCopy.genericSummary);
    setSkills(sCopy.skillsPool.slice(0, 5));
    setHasOptimized(false);
    setIsAIOptimizing(false);
  };

  // Dynamic ATS Score computation
  const baseScore = hasOptimized ? 80 : 45;
  const computedScore = Math.min(99, baseScore + skills.length * 5);

  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-20 md:pt-16 md:pb-28">

      {/* Fine Blueprint Matrix Grid & Radial Ambient Lighting Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06] pointer-events-none select-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255, 77, 45, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 77, 45, 0.25) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          maskImage: 'radial-gradient(circle at 50% 30%, black 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 30%, black 60%, transparent 100%)',
        }}
      />

      {/* Smooth SaaS Radial Ambient Lighting Glow Behind Headlines */}
      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] md:w-[1200px] h-[600px] md:h-[700px] rounded-full pointer-events-none opacity-45 mix-blend-multiply filter blur-[120px] transform-gpu"
        style={{
          background: 'radial-gradient(circle, rgba(255,160,122,0.2) 0%, rgba(255,77,45,0.08) 40%, transparent 70%)',
        }}
      />

      <div className="relative container-page z-10-landing-hero">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-6xl mx-auto mb-16"
        >
          {/* Left Column (or Right in RTL): Text description and Action buttons */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-start rtl:lg:items-end rtl:lg:text-end">
            <motion.h1
              variants={item}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-black text-slate-800 leading-[1.1] mb-6 tracking-tight drop-shadow-sm font-sans"
            >
              {copy.title1}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D2D] to-orange-400 inline-block transform-gpu">
                {copy.titleAccent}
              </span>
              <br />
              <span className="text-slate-500 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.2] mt-2 block transform-gpu">
                {copy.title2}
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="text-base md:text-lg text-slate-500 max-w-2xl mb-10 leading-relaxed whitespace-pre-line font-medium transform-gpu"
            >
              {copy.subtitle}
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start transform-gpu">
              <button
                onClick={() => {
                  trackEvent('resume_started', { source: 'hero_cta' });
                  onStart();
                }}
                className="bg-[#FF4D2D] hover:bg-[#E64528] active:scale-95 text-white shadow-xl shadow-orange-500/20 inline-flex items-center justify-center gap-2 sm:w-auto w-full px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-[1.03] duration-300 cursor-pointer"
                aria-label={copy.cta}
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
                {copy.cta}
              </button>

              <button
                onClick={() => navigate('/templates')}
                className="bg-white border-2 border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 active:scale-95 inline-flex items-center justify-center gap-2 sm:w-auto w-full px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-[1.03] duration-300 cursor-pointer"
              >
                <LayoutTemplate className="w-5 h-5 text-slate-500" />
                {copy.ctaSec}
                <ArrowLeft className="w-5 h-5 text-slate-405 rtl:rotate-180" />
              </button>
            </motion.div>

            <motion.div
              variants={item}
              className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 mt-10 transform-gpu"
            >
              {copy.trust.map((t) => (
                <span key={t} className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-500">
                  <div className="bg-emerald-100 rounded-full p-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Premium AI Resume Illustration */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <motion.div
              variants={item}
              className="relative select-none w-full max-w-[360px]"
            >
              {/* Main Card Container styled modern and clean */}
              <div className="relative rounded-2xl border border-slate-150 bg-white p-3 shadow-md overflow-hidden group transition-all duration-300">
                {/* Simplified Image */}
                <img
                  src="/src/assets/images/simple_resume_hero_1780569346068.png"
                  alt="Minimal Resume Illustration"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain rounded-xl pointer-events-none"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          className="mt-20 w-full max-w-6xl mx-auto relative perspective-1000 transform-gpu animate-fade-in"
        >
          {/* Decorative Floaters */}
          <div 
            className="absolute -left-6 md:-left-12 top-6 md:top-20 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden md:flex items-center gap-3 transform hover:-translate-y-1 transition-transform"
          >
            <div className="bg-[#FF4D2D]/10 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-[#FF4D2D]" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-0.5">{sCopy.atsScoreLabel}</div>
              <div className="text-xl font-black text-slate-800 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-[#FF4D2D]">{computedScore}</span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
            </div>
          </div>

          <div 
            className="absolute -right-6 md:-right-10 bottom-20 md:bottom-32 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden md:flex items-center gap-3 transform hover:-translate-y-1 transition-transform"
          >
            <div className="bg-emerald-100 p-3 rounded-xl">
              <Star className="w-6 h-6 text-emerald-600 fill-emerald-500" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-0.5">ATS Assessment</div>
              <div className="text-sm font-black text-emerald-600">{computedScore >= 80 ? "Excellent Match!" : "Needs AI Keywords"}</div>
            </div>
          </div>

          {/* Render the TiltCard for the entire Sandbox container */}
          <TiltCard
            className="relative rounded-2xl md:rounded-[2rem] overflow-hidden border-2 border-slate-150/80 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] bg-white transition-all duration-300"
          >
            {/* Window bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm" />
              </div>
              <div className="mx-6 flex-1 h-7 rounded-md bg-white border border-slate-200 shadow-inner px-3 text-xs font-medium flex items-center justify-center text-slate-400 font-mono">
                app.hashresume.com/sandbox
              </div>
              <button 
                onClick={handleResetSandbox}
                className="text-[10px] font-bold text-slate-500 hover:text-[#FF4D2D] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{sCopy.resetBtn}</span>
              </button>
            </div>

            {/* App Layout: Sidebar Sandbox controls + Responsive Resume Output preview */}
            <div className="flex flex-col md:flex-row h-auto md:h-[720px] bg-slate-101/50" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              
              {/* Sidebar Input Sandbox */}
              <div className="w-full md:w-[40%] bg-white p-6 md:p-8 border-e border-slate-200 overflow-y-auto flex flex-col gap-6 shadow-[10px_0_15px_-3px_rgba(0,0,0,0.02)] z-10 text-start">
                
                {/* AI Magic Wand Section */}
                <div className="bg-gradient-to-r from-orange-50 to-rose-50 border border-orange-200/60 rounded-2xl p-4 space-y-3 relative overflow-hidden">
                  <div className="flex items-center gap-2 text-[#FF4D2D] font-bold text-xs">
                    <Sparkles className="w-4 h-4 animate-pulse shrink-0" />
                    <span>{lang === "ar" ? "تحسين فوري ذكي" : lang === "fr" ? "Amélioration IA" : "Instant AI Enhancement"}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                    {lang === "ar" 
                      ? "اضغط لتجربة كيف يقوم الذكاء الاصطناعي بتحسين صياغة النبذة المهنية وتعبئة الكلمات المفتاحية الذكية لرفع نسبة قبول السيرة أمام فحص الـ ATS بشكل فوري."
                      : "Click to simulate how the resume builder uses AI to target profile summary words, immediately boosting your indexing compatibility score."}
                  </p>
                  
                  <button
                    type="button"
                    disabled={isAIOptimizing}
                    onClick={handleAIOptimize}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border shadow-sm transition-all cursor-pointer ${
                      isAIOptimizing 
                        ? "bg-amber-100 text-amber-800 border-amber-200" 
                        : hasOptimized 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 pointer-events-none" 
                        : "bg-[#FF4D2D] text-white hover:bg-[#E64528] active:scale-95 border-orange-400"
                    }`}
                  >
                    {isAIOptimizing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{sCopy.aiWorking}</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{hasOptimized ? (lang === "ar" ? "تم التحسين بنجاح 🎉" : "AI Optimized Successfully! 🎉") : sCopy.aiButton}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Grid Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">{sCopy.fullNameLabel}</label>
                    <input 
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#FF4D2D] outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">{sCopy.jobTitleLabel}</label>
                    <input 
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#FF4D2D] outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">{sCopy.summaryLabel}</label>
                    <textarea 
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#FF4D2D] outline-none text-slate-700 leading-relaxed resize-none"
                    />
                  </div>
                </div>

                {/* Active and Available Skills section */}
                <div className="space-y-3">
                  <label className="block text-[11px] font-black text-slate-500 mb-1 uppercase tracking-wider">{sCopy.skillsLabel}</label>
                  <div className="flex flex-wrap gap-1.5">
                    {sCopy.skillsPool.map((skill) => {
                      const isActive = skills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleToggleSkill(skill)}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            isActive
                              ? "bg-[#FF4D2D]/10 text-[#FF4D2D] border-[#FF4D2D]/30 shadow-xs"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          <span className="text-[9px]">{isActive ? "✓" : "+"}</span>
                          <span>{skill}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Real-time ATS bot audit rules checklist preview */}
                <div className="border-t border-slate-100 pt-4 mt-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{sCopy.atsStatusTitle}</span>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                      </div>
                      <span>{sCopy.atsCheck1}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                        skills.length >= 4 
                          ? "bg-emerald-50 border-emerald-100" 
                          : "bg-rose-50 border-rose-100"
                      }`}>
                        {skills.length >= 4 ? (
                          <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                        ) : (
                          <span className="text-[8px] font-extrabold text-rose-600 font-mono">!</span>
                        )}
                      </div>
                      <span className={skills.length >= 4 ? "text-slate-700 font-bold" : "text-slate-450 line-through"}>{sCopy.atsCheck2} ({skills.length}/4)</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                        hasOptimized 
                          ? "bg-emerald-50 border-emerald-100" 
                          : "bg-rose-50 border-rose-100"
                      }`}>
                        {hasOptimized ? (
                          <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                        ) : (
                          <span className="text-[8px] font-extrabold text-rose-600 font-mono">!</span>
                        )}
                      </div>
                      <span className={hasOptimized ? "text-slate-700 font-extrabold" : "text-slate-450"}>{sCopy.atsCheck3}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Document Output Live Preview */}
              <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-start overflow-y-auto bg-slate-50 relative min-h-[520px] md:min-h-auto">
                {/* Subtle grid background pattern */}
                <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                {/* Layout theme color selection capsules */}
                <div className="relative z-30 flex justify-center mb-6">
                  <div className="bg-white/95 backdrop-blur-md p-1 rounded-full border border-slate-200 shadow-md flex items-center gap-1 select-none">
                    <button
                      type="button"
                      onClick={() => setActiveTheme(0)}
                      className={`px-3 py-1.5 rounded-full text-[10px] md:text-xs font-black transition-all cursor-pointer ${
                        activeTheme === 0 
                          ? "bg-[#FF4D2D] text-white shadow-sm" 
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {lang === "ar" ? "روبي" : "Ruby Modern"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTheme(1)}
                      className={`px-3 py-1.5 rounded-full text-[10px] md:text-xs font-black transition-all cursor-pointer ${
                        activeTheme === 1 
                          ? "bg-slate-900 text-white shadow-sm" 
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {lang === "ar" ? "الفحمي الكلاسيكي" : "Classic Slate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTheme(2)}
                      className={`px-3 py-1.5 rounded-full text-[10px] md:text-xs font-black transition-all cursor-pointer ${
                        activeTheme === 2 
                          ? "bg-[#059669] text-white shadow-sm" 
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {lang === "ar" ? "الزمردي" : "Creative Emerald"}
                    </button>
                  </div>
                </div>

                {/* Realistic Document Render Sheet */}
                <div className={`w-full max-w-[460px] aspect-[1/1.414] bg-white shadow-2xl border border-slate-200 p-6 md:p-8 flex flex-col relative transform transition-all duration-300 z-10 text-start overflow-hidden leading-normal ${
                  activeTheme === 1 ? "font-serif" : "font-sans"
                }`}>
                  
                  {/* Watermark/Interactive Ribbon */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-amber-200 bg-amber-50 text-neutral-500 font-mono text-[7px]" dir="ltr">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{sCopy.liveSec}</span>
                  </div>

                  {/* Header summary of current theme */}
                  <div className={`pb-4 mb-4 mt-2 transition-all duration-300 ${
                    activeTheme === 0 
                      ? "border-b-2 border-[#FF4D2D] text-center" 
                      : activeTheme === 1 
                      ? "border-b border-dashed border-slate-900 text-slate-900 text-start pb-3" 
                      : "border-b-2 border-[#059669] text-start"
                  }`}>
                    <h2 className={`text-base font-black uppercase tracking-[0.1em] mb-1 transition-all ${
                      activeTheme === 0 
                        ? "text-slate-800" 
                        : activeTheme === 1 
                        ? "text-slate-900 font-serif normal-case font-extrabold text-lg" 
                        : "text-[#059669]"
                    }`}>
                      {fullName || "Youssef Ahmed"}
                    </h2>
                    <p className="text-[8px] text-slate-500 font-bold tracking-wider">
                      {jobTitle || "Software Engineer"}  •  youssef@example.com  •  Cairo, Egypt
                    </p>
                  </div>

                  {/* Profile Summary statement details */}
                  <div className="mb-4">
                    <h3 className={`text-[9px] font-black border-b border-slate-100 pb-0.5 mb-2 uppercase tracking-widest transition-colors ${
                      activeTheme === 0 ? "text-[#FF4D2D]" : activeTheme === 1 ? "text-slate-900 font-black" : "text-[#059669]"
                    }`}>
                      {lang === "ar" ? "النبذة التعريفية" : "Professional Summary"}
                    </h3>
                    <motion.p 
                      key={summary}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-[8px] leading-relaxed text-slate-600 font-medium"
                    >
                      {summary}
                    </motion.p>
                  </div>

                  {/* Core Columns content */}
                  <div className="flex gap-6 flex-1 text-[8px] leading-relaxed text-slate-700">
                    
                    {/* Left Column (Main experience block) */}
                    <div className="w-[65%] space-y-4">
                      <div>
                        <h3 className={`text-[9px] font-black border-b border-slate-100 pb-0.5 mb-2.5 uppercase tracking-widest transition-colors ${
                          activeTheme === 0 ? "text-[#FF4D2D]" : activeTheme === 1 ? "text-slate-900 font-black" : "text-[#059669]"
                        }`}>
                          {lang === "ar" ? "الخبرات المتميزة" : "Experience"}
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between font-bold text-slate-900 mb-0.5">
                              <span className="text-[8.5px]">Senior Frontend Dev — GlobalTech</span>
                              <span>2022 - Present</span>
                            </div>
                            <ul className="list-disc ps-3 space-y-1 text-slate-500 marker:text-slate-300">
                              <li>Architected interfaces with React & TypeScript, boosting page throughput by 42%.</li>
                              <li>Engineered clean reusable components saving downstream development velocity.</li>
                            </ul>
                          </div>
                          <div>
                            <div className="flex justify-between font-bold text-slate-900 mb-0.5">
                              <span className="text-[8.5px]">Front-End Developer — StartupX</span>
                              <span>2020 - 2022</span>
                            </div>
                            <ul className="list-disc ps-3 space-y-1 text-slate-500 marker:text-slate-300">
                              <li>Accelerated responsive layouts targeting 5k+ regular daily visitors.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right column (Skills and education details) */}
                    <div className="w-[35%] space-y-4 border-s border-dotted border-slate-200 ps-4 text-start">
                      <div>
                        <h3 className={`text-[9px] font-black border-b border-slate-100 pb-0.5 mb-2.5 uppercase tracking-widest transition-colors ${
                          activeTheme === 0 ? "text-[#FF4D2D]" : activeTheme === 1 ? "text-slate-900 font-black" : "text-[#059669]"
                        }`}>
                          {lang === "ar" ? "المهارات والأدوات" : "Core Tech Skills"}
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {skills.length === 0 ? (
                            <span className="text-[8px] text-slate-350 italic">None selected</span>
                          ) : (
                            skills.map(skill => (
                              <span 
                                key={skill} 
                                className={`px-1.5 py-0.5 rounded-[3px] text-[7px] font-bold border whitespace-nowrap transition-all duration-300 ${
                                  activeTheme === 0
                                    ? "bg-slate-50 text-slate-700 border-slate-200/50"
                                    : activeTheme === 1
                                    ? "bg-slate-900 text-white border-slate-800"
                                    : "bg-emerald-50 text-emerald-800 border-emerald-100"
                                }`}
                              >
                                {skill}
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className={`text-[9px] font-black border-b border-slate-100 pb-0.5 mb-2 uppercase tracking-widest transition-colors ${
                          activeTheme === 0 ? "text-[#FF4D2D]" : activeTheme === 1 ? "text-slate-900 font-black" : "text-[#059669]"
                        }`}>
                          {lang === "ar" ? "التعليم الأكاديمي" : "Education"}
                        </h3>
                        <div>
                          <div className="font-bold text-slate-850">B.Sc. in Computer Science</div>
                          <div className="text-slate-400 font-semibold text-[7px]">Cairo University</div>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              </div>

            </div>
          </TiltCard>
        </motion.div>
      </div>
      
      {/* Bottom fade out gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-10" />
    </section>
  )
}
