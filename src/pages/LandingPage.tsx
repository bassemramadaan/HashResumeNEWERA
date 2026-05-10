import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Helmet } from "react-helmet-async";
import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion";
import { Sparkles, Target, CheckCircle2, Check, Plus, ArrowUp, X } from "lucide-react";
import Footer from "../components/Footer";
import SmallWallOfLove from "../components/SmallWallOfLove";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";
import { cn } from "@/lib/utils";
import { trackEvent, FUNNEL_EVENTS } from "../utils/analytics";
import { LOGO_URL } from "../constants";

import Navbar from "../components/Navbar";
import VideoDemoModal from "../components/VideoDemoModal";
import Logo from "../components/Logo";

export default function LandingPage() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;

  useEffect(() => {
    trackEvent(FUNNEL_EVENTS.LANDING_VISIT, { language });
  }, [language]);

  const [showVideoModal, setShowVideoModal] = useState(false);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const countValue = useMotionValue(60);
  useEffect(() => {
    const controls = animate(countValue, 95, {
      duration: 2,
      ease: "easeOut",
      delay: 0.5,
    });

    return () => {
      controls.stop();
    };
  }, [countValue]);

  return (
    <div className="bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900 transition-colors duration-300 overflow-x-hidden">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#ff4d2d] origin-left rtl:origin-right z-[60]"
      />
      <Helmet>
        <title>{language === "ar" ? "هاش ريزيومي — منشئ سير ذاتية مجاني ومحسن لأنظمة ATS" : language === "fr" ? "Hash Resume — Créateur de CV gratuit et optimisé ATS" : "Hash Resume — Free ATS-Optimized CV Builder"}</title>
        <meta name="description" content={language === "ar" ? "أنشئ سيرة ذاتية احترافية ومجانية ومتوافقة مع أنظمة تتبع المتقدمين (ATS) باللغة العربية. أفضل أداة لبناء السيرة الذاتية." : language === "fr" ? "Créez un CV gratuit, professionnel et optimisé ATS en arabe, anglais et français. Le meilleur créateur de CV." : "Create a free, professional, ATS-optimized resume in Arabic, English, and French. The best AI resume builder."} />
        <meta name="keywords" content={language === "ar" ? "ATS, سيرة ذاتية, مجاني, منشئ سيرة ذاتية, قوالب سيرة ذاتية, ذكاء اصطناعي, وظائف, مصر, السعودية" : "ATS, resume builder, free, Arabic, CV maker, templates, MENA, jobs"} />
        <meta property="og:title" content={language === "ar" ? "هاش ريزيومي — منشئ سير ذاتية مجاني ومحسن لأنظمة ATS" : language === "fr" ? "Hash Resume — Créateur de CV gratuit et optimisé ATS" : "Hash Resume — Free ATS-Optimized CV Builder"} />
        <meta property="og:description" content={language === "ar" ? "أنشئ سيرة ذاتية احترافية ومجانية ومتوافقة مع أنظمة تتبع المتقدمين (ATS) باللغة العربية. أفضل أداة لبناء السيرة الذاتية." : language === "fr" ? "Créez un CV gratuit, professionnel et optimisé ATS en arabe, anglais et français. Le meilleur créateur de CV." : "Create a free, professional, ATS-optimized resume in Arabic, English, and French. The best AI resume builder."} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?q=80&w=1200&h=630&auto=format&fit=crop" />
        <meta property="twitter:title" content={language === "ar" ? "هاش ريزيومي — منشئ سير ذاتية مجاني ومحسن لأنظمة ATS" : language === "fr" ? "Hash Resume — Créateur de CV gratuit et optimisé ATS" : "Hash Resume — Free ATS-Optimized CV Builder"} />
        <meta property="twitter:description" content={language === "ar" ? "أنشئ سيرة ذاتية احترافية ومجانية ومتوافقة مع أنظمة تتبع المتقدمين (ATS) باللغة العربية. أفضل أداة لبناء السيرة الذاتية." : language === "fr" ? "Créez un CV gratuit, professionnel et optimisé ATS en arabe, anglais et français. Le meilleur créateur de CV." : "Create a free, professional, ATS-optimized resume in Arabic, English, and French. The best AI resume builder."} />
        <meta property="twitter:image" content="https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?q=80&w=1200&h=630&auto=format&fit=crop" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Hash Resume",
              "operatingSystem": "Web",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "AI-powered resume builder for creating ATS-friendly resumes.",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "1024"
              }
            }
          `}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Is it really free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, completely free. Hash Resume runs entirely in your browser. We don't store your personal data on our servers."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How much does it cost to download?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can build and preview your resume for free. We charge a one-time fee of 49 EGP for a professional PDF download."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is an ATS-friendly resume?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ATS software is used by recruiters to filter resumes. Our templates are designed with clean formatting to ensure these systems can easily read your application."
                  }
                }
              ]
            }
          `}
        </script>
      </Helmet>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-0 md:pt-24 md:pb-0 overflow-hidden bg-gradient-to-b from-orange-50 to-white">
        {/* Background Graphics */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute end-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500 opacity-10 blur-[120px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center pt-8 md:pt-16">
            {/* Logo and Name at the middle of starting page */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring" }}
                className="mb-6"
            >
                <div className="flex justify-center">
                    <Logo height={200} width="auto" className="relative z-10" />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mb-8 px-4 py-1.5 rounded-2xl bg-orange-50 border border-orange-100 text-orange-600 text-xs font-black uppercase tracking-[0.2em] shadow-sm shadow-orange-100/50"
            >
                {language === "ar" ? "عهد جديد في كتابة السيرة الذاتية" : "A New Era in Resume Building"}
            </motion.div>

            {/* Left Column: Text & CTA */}
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-6"
              >
                <Sparkles size={12} className="text-slate-400" />
                <span>{language === "ar" ? "مدعوم بـ Gemini AI" : "Powered by Gemini AI"}</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center gap-4 my-8"
              >
                <img src={LOGO_URL} alt="Hash Resume" className="h-[120px] w-auto mx-auto" />
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                  Hash Resume
                </h2>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={cn("font-display mb-10", language === "ar" ? "leading-relaxed" : "leading-[1.05]")}
              >
                <span className="text-slate-900 block text-3xl sm:text-6xl lg:text-[5.5rem] font-black tracking-tight mb-4 sm:mb-6 leading-snug sm:leading-tight">
                  {language === "ar" ? "أول Resume Builder عربي حقيقي" : t.heroTitle1}{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d2d] to-orange-600 block sm:inline mt-1 sm:mt-0">
                    {language === "ar" ? "بدون اشتراكات" : t.heroTitle2}
                  </span>
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <p className="text-slate-600 text-base sm:text-2xl font-medium tracking-tight mb-2 max-w-3xl mx-auto leading-relaxed">
                  {language === "ar" 
                    ? "ابنِ سيرتك الذاتية مجاناً بالعربي والإنجليزي، وادفع مرة واحدة فقط عند التحميل. لا اشتراكات، لا رسوم خفية." 
                    : "Build your professional resume for free in Arabic & English. Pay once only when you love the result. No subscriptions."}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col items-center gap-4 mb-10"
              >
                <Link
                  to="/editor"
                  className="w-full sm:w-auto bg-gradient-to-b from-[#ff4d2d] to-orange-600 shadow-[0_8px_24px_-8px_rgba(255,77,45,0.5),inset_0_2px_0_rgba(255,255,255,0.2)] text-white px-12 py-6 rounded-3xl text-2xl font-black transition-all hover:shadow-2xl hover:shadow-orange-500/30 flex items-center justify-center gap-3 group hover:-translate-y-1 active:translate-y-0"
                >
                  <Plus size={28} className="transition-transform duration-300 group-hover:rotate-90 drop-shadow-sm" strokeWidth={3} />
                  {t.startBuildingNow}
                </Link>
                <div className="flex items-center gap-4 text-sm text-slate-500 font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>{language === "ar" ? "أنشئ سيرتك مجاناً" : "Build for free"}</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>{language === "ar" ? "بدون اشتراكات" : "No subscriptions"}</span>
                  </div>
                </div>
              </motion.div>

              {/* Social Proof Counter */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center gap-4 mb-16 text-sm font-bold text-slate-400"
              >
                <div className="flex -space-x-3 relative z-10 scale-110">
                  {[61, 62, 63, 64, 65].map((imgId) => (
                      <img
                        key={imgId}
                        src={`https://i.pravatar.cc/100?img=${imgId}`}
                        alt={`Professional User ${imgId}`}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-lg shadow-slate-200/50"
                      />
                  ))}
                </div>
                <span className="uppercase tracking-[0.2em] text-[10px]">
                  {language === "ar" ? "أكثر من 14,000 سيرة ذاتية تم إنشاؤها" : "14,000+ resumes created"}
                </span>
              </motion.div>
            </div>

            {/* Right Column: Dynamic Resume Graphic */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none flex justify-center lg:justify-center mt-12 lg:mt-0 perspective-1000">
              <motion.div
                initial={{ opacity: 0, rotateY: 20, rotateX: 10, scale: 0.9 }}
                whileInView={{ opacity: 1, rotateY: -10, rotateX: 5, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[500px] transform-style-3d"
              >
                {/* Glassmorphism Backdrop */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/20 to-purple-500/20 rounded-[2rem] blur-2xl -z-10 animate-pulse"></div>

                {/* Browser Window Wrapper */}
                <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transform transition-transform hover:scale-[1.02] duration-500 w-full aspect-[4/3]">
                  {/* Browser Header */}
                  <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    <div className="ms-auto flex items-center gap-2">
                       <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <Target size={12} className="text-indigo-600" />
                       </div>
                       <div className="w-16 h-4 bg-slate-200/50 rounded-full"></div>
                    </div>
                  </div>
                  {/* Editor Layout */}
                  <div className="flex-1 flex bg-slate-100/50">
                    {/* Sidebar Form */}
                    <div className="hidden sm:block w-1/3 bg-white border-r border-slate-200 p-4 space-y-4">
                      <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
                      <div className="space-y-2">
                        <div className="h-8 w-full bg-slate-50 border border-slate-200 rounded"></div>
                        <div className="h-8 w-full bg-slate-50 border border-slate-200 rounded"></div>
                      </div>
                      <div className="h-4 w-1/3 bg-slate-200 rounded mt-6"></div>
                      <div className="h-20 w-full bg-slate-50 border border-slate-200 rounded"></div>
                      <div className="mt-2 h-8 w-max px-3 bg-orange-50 text-[#ff4d2d] rounded flex items-center justify-center text-[10px] gap-1 font-bold">
                        <Sparkles size={10} /> AI Ready
                      </div>
                    </div>
                    {/* Preview Panel */}
                    <div className="flex-1 p-4 sm:p-6 flex justify-center items-start overflow-hidden relative">
                       <div className="w-full max-w-sm bg-white shadow-xl shadow-slate-200/50 border border-slate-100 p-4 sm:p-6 space-y-4 h-full relative" style={{boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)"}}>
                          <div className="text-center space-y-2 pb-4">
                             <div className="h-4 w-1/2 bg-slate-900 rounded mx-auto mb-3"></div>
                             <div className="flex justify-center gap-3">
                                <div className="h-1.5 w-16 bg-slate-400 rounded"></div>
                                <div className="h-1.5 w-16 bg-slate-400 rounded"></div>
                             </div>
                             <div className="h-px w-full bg-slate-200 mt-4"></div>
                          </div>
                          
                          <div className="space-y-3">
                             <div className="h-2.5 w-1/4 bg-slate-800 rounded font-bold"></div>
                             <div className="space-y-1.5">
                                <div className="h-1.5 w-full bg-slate-300 rounded"></div>
                                <div className="h-1.5 w-[90%] bg-slate-300 rounded"></div>
                                <div className="h-1.5 w-[95%] bg-slate-300 rounded"></div>
                             </div>
                          </div>
                          
                           <div className="space-y-3 mt-4">
                             <div className="h-2.5 w-1/4 bg-slate-800 rounded"></div>
                             <div className="flex justify-between items-end mb-2">
                                <div className="h-2 w-1/3 bg-slate-600 rounded"></div>
                                <div className="h-1.5 w-1/6 bg-slate-400 rounded"></div>
                             </div>
                             <div className="space-y-1.5 pl-3">
                                <div className="h-1.5 w-full bg-slate-300 rounded"></div>
                                <div className="h-1.5 w-[85%] bg-slate-300 rounded"></div>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* ATS Score Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5, type: "spring" }}
                  className="absolute -end-4 top-12 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-30"
                >
                  <div className="relative w-10 h-10">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="20" cy="20" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                      <motion.circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="4"
                        strokeDasharray="100.53"
                        initial={{ strokeDashoffset: 100.53 }}
                        animate={{ strokeDashoffset: 100.53 * (1 - 0.95) }}
                        transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                        className="drop-shadow-sm"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                      95%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.atsScore}</div>
                    <div className="text-xs font-bold text-slate-800">{t.excellent}</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      <SmallWallOfLove />

      {/* Editor & ATS Screenshot Showcase */}
      <section className="py-12 sm:py-24 bg-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 top-0 w-full h-full bg-grid-white/[0.02] bg-[length:32px_32px]"></div>
        <div className="absolute top-1/4 left-1/2 -px-1/2 w-3/4 max-w-4xl h-96 bg-[#ff4d2d]/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 text-orange-400 text-xs sm:text-sm font-bold border border-white/10 backdrop-blur-md mb-4 sm:mb-6">
            <Target size={16} />
            {t.beatAts}
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-display leading-[1.15] sm:leading-tight mb-3 sm:mb-6 tracking-tight">
            Designed for Humans. <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-[#ff4d2d]">Optimized for Robots.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto px-2">
            {t.atsDescription}
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 sm:mt-12 lg:mt-24">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-center justify-center">
            
            {/* Editor Screenshot */}
            <div className="w-full lg:w-1/2 relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2rem] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative rounded-[1.5rem] bg-slate-800 border border-slate-700 shadow-2xl overflow-hidden aspect-[4/3] flex flex-col group-hover:scale-[1.01] transition-transform duration-500">
                <div className="h-10 border-b border-slate-700 bg-slate-800/80 backdrop-blur-md flex items-center px-4 gap-2 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <div className="mx-auto bg-slate-700/50 rounded-md px-3 py-1 text-[10px] text-slate-400 font-mono hidden sm:block">editor.hashresume.com</div>
                </div>
                {/* Visual Editor Mockup */}
                <div className="flex-1 bg-slate-900 p-4 flex gap-4 overflow-hidden relative">
                   {/* Editor Sidebar */}
                   <div className="w-1/3 space-y-4 pt-4">
                      <div className="h-4 w-1/2 bg-slate-700 rounded-full"></div>
                      <div className="h-10 w-full bg-slate-800 border border-slate-700 rounded-xl"></div>
                      <div className="h-10 w-full bg-slate-800 border border-slate-700 rounded-xl"></div>
                      <div className="h-32 w-full bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center">
                         <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            <Sparkles size={20} className="text-indigo-400" />
                         </div>
                      </div>
                   </div>
                   {/* Editor Canvas */}
                   <div className="flex-1 bg-white rounded-t-xl p-6 shadow-2xl flex flex-col gap-6 scale-95 origin-top translate-y-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-4 w-2/3 bg-slate-900 rounded-full"></div>
                        <div className="h-2 w-1/2 bg-slate-300 rounded-full"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 w-1/4 bg-slate-800 rounded-full"></div>
                        <div className="h-2 w-full bg-slate-200 rounded-full"></div>
                        <div className="h-2 w-3/4 bg-slate-200 rounded-full"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 w-1/4 bg-slate-800 rounded-full"></div>
                        <div className="h-2 w-full bg-slate-200 rounded-full"></div>
                        <div className="h-2 w-5/6 bg-slate-200 rounded-full"></div>
                      </div>
                   </div>
                   
                   {/* Floating AI Tooltip */}
                   <motion.div 
                     initial={{ x: 20, opacity: 0 }}
                     whileInView={{ x: 0, opacity: 1 }}
                     className="absolute bottom-12 right-12 bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-900/40 flex items-center gap-3 border border-indigo-500"
                   >
                     <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Sparkles size={14} className="text-white" />
                     </div>
                     <div className="text-xs font-bold text-white pr-2 whitespace-nowrap">Improving Bullet Point...</div>
                   </motion.div>
                </div>
              </div>
              <div className="mt-6 text-center lg:text-start lg:pl-4">
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Real-time Visual Editor</h3>
                <p className="text-slate-400 text-sm">See exactly what you'll get. Edit your resume directly on the page without jumping through endless forms.</p>
              </div>
            </div>

            {/* ATS Audit Screenshot */}
            <div className="w-full lg:w-1/2 relative group lg:mt-24">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2rem] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative rounded-[1.5rem] bg-slate-800 border border-slate-700 shadow-2xl overflow-hidden aspect-[4/3] flex flex-col group-hover:scale-[1.01] transition-transform duration-500">
                <div className="h-10 border-b border-slate-700 bg-slate-800/80 backdrop-blur-md flex items-center px-4 gap-2 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <div className="mx-auto bg-slate-700/50 rounded-md px-3 py-1 text-[10px] text-slate-400 font-mono hidden sm:block">ats-audit.hashresume.com</div>
                </div>
                {/* ATS Audit Mockup */}
                <div className="flex-1 bg-[#1a2234] p-8 flex flex-col gap-8">
                   <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full border-[8px] border-emerald-500/30 flex items-center justify-center relative">
                         <div className="w-24 h-24 rounded-full border-[8px] border-emerald-500 border-t-transparent absolute animate-spin-slow"></div>
                         <span className="text-2xl font-black text-emerald-400">92</span>
                      </div>
                      <div className="space-y-2">
                         <div className="h-6 w-48 bg-white/10 rounded-full"></div>
                         <div className="h-4 w-32 bg-white/5 rounded-full"></div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      {[1,2,3,4].map(i => (
                         <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 items-center">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></div>
                            <div className="h-3 w-full bg-white/10 rounded-full"></div>
                         </div>
                      ))}
                   </div>

                   <div className="mt-auto space-y-4">
                      <div className="h-4 w-1/3 bg-slate-600 rounded-full"></div>
                      <div className="flex gap-2 flex-wrap">
                         {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'].map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">{tag}</span>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
              <div className="mt-6 text-center lg:text-end lg:pr-4">
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Built-in ATS Audit</h3>
                <p className="text-slate-400 text-sm">Every edit runs a real-time parse simulation. We show you exactly how Applicant Tracking Systems read your resume.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 font-display tracking-tight">
              {t.pricingTitle}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {t.pricingSubtitle}
            </p>
          </div>

          <div className="flex flex-col items-center mb-12">
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 sm:gap-4 mb-8 text-xs sm:text-sm font-bold text-slate-400">
              <div className="flex items-center gap-2 text-slate-900">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">1</div>
                <span>{language === "ar" ? "ابنِ مجاناً" : "Build Free"}</span>
              </div>
              <div className="w-8 sm:w-12 h-px bg-slate-300"></div>
              <div className="flex items-center gap-2 text-slate-900">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-slate-50 flex items-center justify-center text-xs">2</div>
                <span>{language === "ar" ? "عاين" : "Preview"}</span>
              </div>
              <div className="w-8 sm:w-12 h-px bg-slate-300"></div>
              <div className="flex items-center gap-2 text-[#ff4d2d]">
                <div className="w-6 h-6 rounded-full bg-[#ff4d2d] text-white flex items-center justify-center text-xs">3</div>
                <span>{language === "ar" ? "ادفع للتحميل" : "Pay to Download"}</span>
              </div>
            </div>

            <p className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {t.payOnDownload} — <span className="text-[#ff4d2d]">{t.zeroToStart}</span>
            </p>
          </div>

          <div className="flex justify-center w-full">
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl shadow-[#ff4d2d]/10 border-2 border-[#ff4d2d] overflow-hidden w-full max-w-md">
              <div className="absolute top-0 end-0 bg-[#ff4d2d] text-white text-xs font-bold px-4 py-2 rounded-es-2xl uppercase tracking-wider shadow-sm">
                {t.mostPopular || "Best Choice"}
              </div>

              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  {t.singleDownload}
                </h3>

                <div className="flex flex-col items-center justify-center gap-2 mb-2">
                  <div className="mt-4 px-6 py-3 rounded-xl bg-orange-100/50 text-orange-700 text-sm font-bold border border-orange-200/50 shadow-sm shadow-orange-100 flex flex-col items-center gap-1">
                    <span className="block uppercase tracking-wider text-[10px] opacity-80">{language === "ar" ? "نقطة تفوقنا" : "Our Differentiator"}</span>
                    <span className="flex items-center gap-2 text-base"><CheckCircle2 size={18} className="text-emerald-500" /> {t.noSubscriptionPayOnce}</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  t.payOncePerResume,
                  t.includesPdfWord,
                  t.unlimitedFreeEdits,
                  t.allPremiumTemplates,
                  t.noWatermark,
                  t.noHiddenFees,
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-4 text-slate-700">
                    <CheckCircle2
                      className="text-[#ff4d2d] shrink-0 mt-0"
                      size={24}
                    />
                    <span className="text-sm leading-tight font-medium">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/editor"
                className="block w-full bg-gradient-to-b from-[#ff4d2d] to-orange-600 shadow-[0_8px_16px_-6px_rgba(255,77,45,0.5),inset_0_2px_0_rgba(255,255,255,0.2)] text-white text-center font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-orange-500/30 transition-all active:scale-95 text-lg"
              >
                {t.startBuildingNow}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="absolute top-20 left-0 w-72 h-72 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-0 w-72 h-72 bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 font-display tracking-tight">
              {t.comparisonTitle}
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              {t.comparisonSubtitle}
            </p>
          </div>

          <div className="bg-slate-50 rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff4d2d]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            
            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-6 relative z-10 w-full overflow-hidden">
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-orange-100 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-[#ff4d2d]"></div>
                <div className="flex items-center mb-6">
                   <Logo className="w-32 h-auto" variant="gradient" />
                </div>
                <ul className="space-y-4">
                  {[
                    t.compFeature1,
                    t.compFeature2,
                    t.compFeature3,
                    t.compFeature4,
                    t.compFeature5,
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Check size={18} className="text-[#ff4d2d]" strokeWidth={3} />
                      </div>
                      <span className="text-slate-700 font-medium text-sm leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-100/50 p-6 rounded-3xl border border-slate-200/50">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-black">?</div>
                   <span className="text-slate-500 font-bold text-lg">Others</span>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5"><X size={18} className="text-slate-400" strokeWidth={3} /></div>
                    <span className="text-slate-500 font-medium text-sm leading-snug">{t.compOthers1}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5"><X size={18} className="text-slate-400" strokeWidth={3} /></div>
                    <span className="text-slate-500 font-medium text-sm leading-snug">{t.compOthers2}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5"><X size={18} className="text-slate-400" strokeWidth={3} /></div>
                    <span className="text-slate-500 font-medium text-sm leading-snug">{t.compOthers3}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5"><X size={18} className="text-slate-400" strokeWidth={3} /></div>
                    <span className="text-slate-500 font-medium text-sm leading-snug">{t.compOthers4}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5"><X size={18} className="text-slate-400" strokeWidth={3} /></div>
                    <span className="text-slate-500 font-medium text-sm leading-snug">{t.compOthers5}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto pb-4 hide-scrollbar relative z-10">
              <table className="w-full border-collapse min-w-full text-start">
                <thead>
                  <tr>
                    <th className="py-6 px-4 text-start w-1/3"></th>
                    <th className="py-6 px-4 text-center w-1/3 relative">
                      <div className="absolute inset-0 bg-white rounded-t-3xl border-t border-x border-orange-100 shadow-[0_-10px_30px_-15px_rgba(255,77,45,0.2)]"></div>
                      <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                        <Logo className="w-40 h-auto" variant="gradient" />
                      </div>
                    </th>
                    <th className="py-6 px-4 text-center w-1/3 relative">
                      <div className="relative z-10 font-bold text-slate-400 text-lg">Others (Zety / Canva)</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { 
                      feature: language === "ar" ? "الخصوصية" : "Privacy", 
                      hash: true, 
                      others: false, 
                      desc: language === "ar" ? "تبقى بياناتك على جهازك فقط" : "Data stays on your device" 
                    },
                    { 
                      feature: language === "ar" ? "توافق ATS" : "ATS Optimization", 
                      hash: true, 
                      others: language === "ar" ? "جزئي" : "Partial", 
                      desc: language === "ar" ? "فحص وتقييم مدمج" : "Built-in audit & scoring" 
                    },
                    { 
                      feature: language === "ar" ? "إنشاء حساب؟" : "Account Required?", 
                      hash: language === "ar" ? "لا يوجد" : "None", 
                      others: language === "ar" ? "إلزامي" : "Mandatory", 
                      desc: language === "ar" ? "ابدأ فوراً بدون تسجيل" : "Use instantly, no sign-ups ever" 
                    },
                    { 
                      feature: language === "ar" ? "التسعير" : "Pricing", 
                      hash: language === "ar" ? "دفع لمرة واحدة" : "Pay-once", 
                      others: language === "ar" ? "اشتراك شهري" : "Subscription", 
                      desc: language === "ar" ? "بدون رسوم خفية أو متكررة" : "No recurring fees" 
                    },
                    { 
                      feature: language === "ar" ? "المحتوى الذكي AI" : "AI Content", 
                      hash: true, 
                      others: true, 
                      desc: language === "ar" ? "نقاط احترافية بضغطة زر" : "Smart bullet points" 
                    },
                  ].map((row, i) => (
                    <tr key={i} className="group relative">
                      {/* Active Row Background */}
                      <td className="absolute inset-y-0 inset-x-4 bg-white opacity-0 group-hover:opacity-100 rounded-xl transition-opacity pointer-events-none z-0 shadow-sm border border-slate-100"></td>
                      
                      <td className="py-6 px-4 align-top relative z-10 border-b border-slate-200/50 group-last:border-0">
                        <div className="font-bold text-slate-900 text-base">{row.feature}</div>
                        <div className="text-sm text-slate-500 mt-1">{row.desc}</div>
                      </td>
                      <td className="py-6 px-4 text-center align-middle relative z-10 border-b border-orange-100/50 group-last:border-0">
                        <div className="absolute inset-y-0 inset-x-0 bg-white border-x border-orange-100 z-[-1] transition-colors"></div>
                        <div className="relative z-10 font-bold text-slate-900 flex justify-center items-center">
                          {row.hash === true ? (
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                              <CheckCircle2 className="text-emerald-500" size={20} strokeWidth={3} />
                            </div>
                          ) : (
                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs tracking-wider uppercase">{row.hash}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-6 px-4 text-center align-middle relative z-10 border-b border-slate-200/50 group-last:border-0">
                        <div className="flex justify-center items-center font-medium text-slate-500">
                          {row.others === false ? (
                            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                              <X className="text-red-400" size={18} strokeWidth={2.5} />
                            </div>
                          ) : row.others === true ? (
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                              <CheckCircle2 className="text-slate-400" size={18} strokeWidth={2.5} />
                            </div>
                          ) : (
                            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs tracking-wider uppercase">{row.others}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Bottom rounded cap for the highlighted column */}
                  <tr>
                    <td className="p-0 border-0"></td>
                    <td className="p-0 border-0 relative h-6">
                      <div className="absolute inset-0 bg-white rounded-b-3xl border-b border-x border-orange-100 shadow-[0_10px_30px_-15px_rgba(255,77,45,0.2)]"></div>
                    </td>
                    <td className="p-0 border-0"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Video Demo Modal */}
      <VideoDemoModal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)} />

      {/* Scroll to Top & Floating CTA */}
      <div className="fixed bottom-24 end-6 z-40">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="w-12 h-12 bg-slate-50 text-slate-900 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 flex items-center justify-center hover:bg-white transition-all active:scale-90"
            >
              <ArrowUp size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
