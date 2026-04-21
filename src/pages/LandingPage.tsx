import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, useMotionValue, useTransform, animate } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Plus,
  Search,
  Sparkles,
  Layout,
  ArrowUp,
  PenTool,
  Download,
  ShieldCheck,
} from "lucide-react";
import Footer from "../components/Footer";
import SmallWallOfLove from "../components/SmallWallOfLove";
import SarIcon from "../components/payment/SarIcon";
import AedIcon from "../components/payment/AedIcon";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";
import { blogPosts } from "../data/blogPosts";
import { cn } from "../utils";

import Navbar from "../components/Navbar";
import FAQ from "../components/FAQ";
import VideoDemoModal from "../components/VideoDemoModal";
import Logo from "../components/Logo";

export default function LandingPage() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;

  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
    EGP: 1,
    SAR: 0.08,
    AED: 0.08,
    EUR: 0.02,
    USD: 0.02,
  });

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/EGP")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          setExchangeRates({
            EGP: 1,
            SAR: data.rates.SAR,
            AED: data.rates.AED,
            EUR: data.rates.EUR,
            USD: data.rates.USD,
          });
        }
      })
      .catch((err) => console.error("Failed to fetch exchange rates", err));
  }, []);

  const basePriceEGP = 25;

  const currencies = {
    EGP: { symbol: "EGP", price: basePriceEGP },
    SAR: {
      symbol: <SarIcon className="w-[1em] h-[1em] inline-block shrink-0" />,
      price: Math.ceil(basePriceEGP * exchangeRates.SAR),
    },
    AED: {
      symbol: <AedIcon className="w-[1em] h-[1em] inline-block shrink-0" />,
      price: Math.ceil(basePriceEGP * exchangeRates.AED),
    },
    EUR: { symbol: "€", price: Math.ceil(basePriceEGP * exchangeRates.EUR) },
    USD: { symbol: "$", price: Math.ceil(basePriceEGP * exchangeRates.USD) },
  };

  const [currency, setCurrency] = useState<keyof typeof currencies>("EGP");
  const selectedCurrency = currencies[currency];

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

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const countValue = useMotionValue(60);
  const roundedValue = useTransform(countValue, (latest) => Math.round(latest));
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900 transition-colors duration-300">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#ff4d2d] origin-left rtl:origin-right z-[60]"
        style={{ scaleX }}
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
      </Helmet>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-b from-orange-50 to-white">
        {/* Background Graphics */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute end-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500 opacity-10 blur-[120px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
            {/* Left Column: Text & CTA */}
            <div className="flex-1 text-center lg:text-start rtl:lg:text-end mt-12 lg:mt-0">
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

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={cn("font-display mb-8", language === "ar" ? "leading-relaxed" : "leading-[1.05]")}
              >
                <span className="text-slate-900 block text-5xl sm:text-7xl font-bold tracking-tight mb-4 hidden sm:block">
                  {t.heroTitle1}{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d2d] to-orange-600 inline-block mt-2">
                    {t.heroTitle2}
                  </span>
                </span>
                
                {/* Mobile specific slightly smaller title to fit better without wrapping weirdly */}
                <span className="text-slate-900 block text-4xl font-bold tracking-tight mb-4 sm:hidden leading-tight">
                  {t.heroTitle1}{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d2d] to-orange-600 block mt-2">
                    {t.heroTitle2}
                  </span>
                </span>
                
                <p className={cn("text-slate-500 text-xl font-medium tracking-tight max-w-xl mx-auto lg:mx-0", language === "ar" ? "leading-relaxed" : "")}>
                  {t.heroTitle3}
                </p>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col sm:flex-row flex-wrap items-center lg:justify-start justify-center gap-4 mb-8"
              >
                <Link
                  to="/editor"
                  className="w-full sm:w-auto bg-[#ff4d2d] hover:bg-[#e63e1d] text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg flex items-center justify-center gap-3 group active:scale-95"
                >
                  <Plus size={24} className="transition-transform duration-300" />
                  {language === "ar" ? "ابدأ كتابة سيرتك مجاناً" : language === "fr" ? "Commencez votre CV gratuit" : "Build Your Resume Free"}
                </Link>
              </motion.div>

              {/* Social Proof Counter */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center lg:justify-start gap-2 mb-8 text-sm font-medium text-slate-500"
              >
                <div className="flex -space-x-2 relative z-10">
                  <img
                    src={`https://i.pravatar.cc/100?img=61`}
                    alt="Professional User 1"
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  />
                  <img
                    src={`https://i.pravatar.cc/100?img=62`}
                    alt="Professional User 2"
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  />
                  <img
                    src={`https://i.pravatar.cc/100?img=63`}
                    alt="Professional User 3"
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  />
                  <img
                    src={`https://i.pravatar.cc/100?img=64`}
                    alt="Professional User 4"
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  />
                </div>
                <span className="ms-2">
                  {language === "ar" ? "يثق بنا آلاف المحترفين" : "Trusted by thousands of professionals"}
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

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#ff4d2d] text-sm font-bold border border-orange-100 mb-4"
            >
              <Sparkles size={16} />
              {t.howItWorks}
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-display tracking-tight">
              {t.howItWorksTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-orange-100 via-orange-200 to-orange-100 -z-10"></div>

            {[
              {
                step: "01",
                title: t.step1Title,
                desc: t.step1Desc,
                icon: PenTool,
                color: "bg-orange-50 text-orange-600 border-orange-100",
              },
              {
                step: "02",
                title: t.step2Title,
                desc: t.step2Desc,
                icon: Layout,
                color: "bg-slate-50 text-slate-600 border-slate-200",
              },
              {
                step: "03",
                title: t.step3Title,
                desc: t.step3Desc,
                icon: Download,
                color: "bg-emerald-50 text-emerald-600 border-emerald-100",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-20 h-20 rounded-3xl ${item.color} border-2 flex items-center justify-center mb-6 relative shadow-sm group-hover:-translate-y-1 transition-transform duration-300`}>
                  <item.icon size={32} />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-xs font-bold text-slate-900 shadow-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#ff4d2d] transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed max-w-xs">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ATS Audit Showcase */}
      <section className="py-16 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-indigo-500/10 rounded-[2rem] blur-3xl -z-10"></div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-2xl relative overflow-hidden">
                {/* Mockup of ATS Audit */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Target className="text-indigo-500" size={24} />
                    <span className="font-bold text-slate-900">
                      {t.atsAuditReport}
                    </span>
                  </div>
                  <motion.div className="flex px-4 py-2 bg-emerald-100 text-emerald-600 text-xs font-bold rounded-full">
                    <motion.span>{roundedValue}</motion.span>/100
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <CheckCircle2 className="text-emerald-500" size={24} />
                      <span className="text-sm font-bold text-slate-900">
                        {t.keywordsMatched}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["React", "Node.js", "TypeScript", "AWS", "Agile"].map(
                        (kw) => (
                          <span
                            key={kw}
                            className="px-2 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg border border-emerald-100"
                          >
                            {kw}
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <TrendingUp className="text-indigo-500" size={24} />
                      <span className="text-sm font-bold text-slate-900">
                        {t.improvementSuggestions}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                        <p className="text-xs text-slate-600">
                          {t.quantifiableMetrics}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        <p className="text-xs text-slate-600 text-emerald-600 font-medium line-through opacity-50">
                          {t.missingLinkedin}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Score Improvement */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  className="absolute bottom-6 end-6 bg-[#ff4d2d] text-white p-4 rounded-2xl shadow-xl flex flex-col items-center"
                >
                  <span className="text-xs font-bold uppercase tracking-widest mb-1">
                    {t.scoreBoost}
                  </span>
                  <span className="text-3xl font-black">+40%</span>
                </motion.div>
              </div>
            </div>

            <div className="flex-1 space-y-8 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#ff4d2d] text-sm font-bold border border-orange-100">
                <Target size={16} />
                {t.beatAts}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-display leading-tight">
                {t.resumesHumansLove}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t.atsDescription}
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Search size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">
                      {t.keywordAnalysis}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {t.keywordAnalysisDesc}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Layout size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">
                      {t.compliantStructure}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {t.compliantStructureDesc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/templates"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg hover:shadow-slate-200"
                >
                  {t.startBuildingNow}
                  <ArrowRight size={20} className="rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hash Hunt Integration Section */}
      <section className="py-24 bg-slate-50 text-slate-900 overflow-hidden relative">
        {/* Subtle Background Graphics */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-8">
                <Sparkles className="w-4 h-4" />
                {t.newHashHunt}
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight text-slate-900">
                {t.hashHuntTagline}
              </h2>
              <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                {t.hashHuntDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {[
                  {
                    title: t.oneClickApply,
                    desc: t.oneClickApplyDesc,
                    icon: Target,
                  },
                  {
                    title: t.unifiedProfile,
                    desc: t.unifiedProfileDesc,
                    icon: Layout,
                  },
                  {
                    title: t.smartAlerts,
                    desc: t.smartAlertsDesc,
                    icon: Zap,
                  },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className={`p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all duration-300 ${i === 2 ? 'sm:col-span-2' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
                      <item.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/hash-hunt"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:-translate-y-1 flex items-center justify-center gap-4"
                >
                  <Search size={20} />
                  {t.exploreHashHunt}
                </Link>
                <Link
                  to="/editor"
                  className="px-8 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl font-bold text-base transition-all hover:border-indigo-300 hover:-translate-y-1 flex items-center justify-center gap-4"
                >
                  <PenTool size={20} />
                  {t.createResumeFirst}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative lg:h-[600px] flex items-center justify-center p-8"
            >
              <div 
                className="relative w-full max-w-md aspect-[4/5] bg-white border border-slate-200 rounded-[2rem] p-6 shadow-2xl shadow-slate-200/50 flex flex-col"
              >
                {/* Mock UI Header */}
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                      <Target className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{t.hashHuntMatch}</div>
                      <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">98% {t.compatibility}</div>
                    </div>
                  </div>
                </div>

                {/* Mock UI Content */}
                <div className="space-y-3 flex-1 overflow-hidden">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-4 items-center group cursor-default"
                    >
                      <div className="w-12 h-12 rounded-lg bg-slate-200 flex-shrink-0 group-hover:bg-indigo-50 transition-colors" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 bg-slate-300 rounded-full group-hover:bg-indigo-200 transition-colors" />
                        <div className="h-1.5 w-1/2 bg-slate-200 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Floating Notification */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="absolute -bottom-6 -start-4 -end-4 bg-indigo-600 p-4 rounded-xl shadow-xl shadow-indigo-900/10 border border-indigo-500 flex items-center gap-3 z-20"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-xs mb-0.5">{t.interviewRequest}</div>
                    <div className="text-indigo-100 text-[10px]">{t.interviewRequestDesc}</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
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

          {/* Currency Switcher & Progress Indicator */}
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

            <div className="inline-flex p-2 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner backdrop-blur-sm mb-6">
              {Object.keys(currencies).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c as keyof typeof currencies)}
                  className={`px-6 py-2 rounded-2xl text-sm font-bold transition-all duration-300 ${currency === c ? "bg-slate-50 text-[#ff4d2d] shadow-md ring-1 ring-black/5 " : "text-slate-500 hover:text-slate-700"}`}
                >
                  {c}
                </button>
              ))}
            </div>
            
            {/* Stripe Trust Badge */}
            <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>{language === "ar" ? "مدفوعات آمنة وموثوقة بنسبة 100% عبر Stripe" : "100% Secure Payments via Stripe"}</span>
            </div>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory lg:overflow-visible lg:flex-row lg:justify-center items-stretch gap-6 pb-8 lg:pb-0 max-w-5xl mx-auto -mx-4 px-4 lg:mx-auto lg:px-0 scrollbar-hide">
            {/* Single Download Plan */}
            <div className="snap-center shrink-0 relative bg-white rounded-3xl p-8 shadow-2xl shadow-[#ff4d2d]/10 border-2 border-[#ff4d2d] overflow-hidden group hover:-translate-y-2 transition-transform duration-300 w-[85vw] sm:w-[400px] lg:w-full lg:max-w-md">
              <div className="absolute top-0 end-0 bg-[#ff4d2d] text-white text-xs font-bold px-4 py-2 rounded-es-2xl uppercase tracking-wider shadow-sm">
                {t.mostPopular}
              </div>

              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  {t.singleDownload}
                </h3>

                <div className="flex flex-col items-center justify-center gap-2 mb-2">
                  <span className="text-5xl font-bold text-slate-900 flex items-center gap-2 tracking-tight">
                    {currency === "EGP" ? (
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                          {selectedCurrency.price} {selectedCurrency.symbol}
                        </div>
                        <div className="text-sm font-medium text-slate-400 mt-1">
                          ≈ ${(selectedCurrency.price * exchangeRates.USD).toFixed(2)} USD
                        </div>
                      </div>
                    ) : (
                      <>
                        {selectedCurrency.symbol}
                        {selectedCurrency.price}
                      </>
                    )}
                  </span>
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider border border-emerald-100">
                    <CheckCircle2 size={16} />
                    {t.noSubscriptionPayOnce}
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
                to="/templates"
                className="block w-full bg-slate-900 hover:bg-slate-800 text-white text-center font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 text-lg"
              >
                {t.getStartedNow}
              </Link>
            </div>

            {/* Multi Download Plan */}
            <div className="snap-center shrink-0 w-[85vw] sm:w-[400px] lg:w-full lg:max-w-md bg-transparent rounded-3xl p-8 border border-slate-300 flex flex-col justify-between hover:bg-slate-50 transition-colors duration-300">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 text-slate-600 text-xs font-bold uppercase tracking-wider mb-6 border border-slate-200">
                  <Sparkles size={14} />
                  {t.bestValue || "Best Value"}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  {t.multiDownload || "Multi-Download Pack"}
                </h3>
                <div className="flex flex-col items-start justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-slate-900 flex items-center gap-2">
                    {currency === "EGP" ? (
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                          {Math.round(selectedCurrency.price * 2.4)} {selectedCurrency.symbol}
                        </div>
                        <div className="text-xs font-medium text-slate-400 mt-1">
                          ≈ ${(Math.round(selectedCurrency.price * 2.4) * exchangeRates.USD).toFixed(2)} USD
                        </div>
                      </div>
                    ) : (
                      <>
                        {selectedCurrency.symbol}
                        {(selectedCurrency.price * 2.4).toFixed(2)}
                      </>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-slate-500 font-medium">
                      {t.threeDownloads || "3 Downloads"} ({t.savePercentage || "Save 20%"})
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">
                      {t.saveAmount}
                    </span>
                  </div>
                </div>
              </div>
              
              <ul className="space-y-4 my-8">
                {[
                  t.payOncePerResume,
                  t.includesPdfWord,
                  t.unlimitedFreeEdits,
                  t.allPremiumTemplates,
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-4 text-slate-600">
                    <CheckCircle2
                      className="text-indigo-500 shrink-0 mt-0"
                      size={20}
                    />
                    <span className="text-sm leading-tight font-medium">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Link
                to="/templates"
                className="block w-full bg-slate-900 hover:bg-slate-800 text-slate-50 text-center font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 mt-auto"
              >
                {t.getStartedNow}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 font-display">
              {t.comparisonTitle}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t.comparisonSubtitle}
            </p>
          </div>

          <div className="overflow-x-auto pb-4">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-6 px-4 text-start text-slate-400 font-medium uppercase tracking-wider text-xs">Features</th>
                  <th className="py-6 px-4 text-center bg-orange-50/50 rounded-t-3xl">
                    <div className="flex items-center justify-center gap-2 text-[#ff4d2d] font-bold">
                      <Logo className="w-5 h-5" />
                      Hash Resume
                    </div>
                  </th>
                  <th className="py-6 px-4 text-center text-slate-400 font-bold">Zety / Canva</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { feature: "Privacy", hash: true, others: false, desc: "Data stays on your device" },
                  { feature: "ATS Optimization", hash: true, others: "Partial", desc: "Built-in audit & scoring" },
                  { feature: "Account Required?", hash: "None", others: "Mandatory", desc: "Use instantly, no sign-ups ever" },
                  { feature: "Pricing", hash: "Pay-once", others: "Subscription", desc: "No recurring fees" },
                  { feature: "AI Content", hash: true, others: true, desc: "Smart bullet points" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 px-4">
                      <div className="font-bold text-slate-900">{row.feature}</div>
                      <div className="text-xs text-slate-500 mt-1">{row.desc}</div>
                    </td>
                    <td className="py-6 px-4 text-center bg-orange-50/30">
                      {row.hash === true ? (
                        <CheckCircle2 className="mx-auto text-emerald-500" size={24} />
                      ) : (
                        <span className="font-bold text-slate-900">{row.hash}</span>
                      )}
                    </td>
                    <td className="py-6 px-4 text-center text-slate-400">
                      {row.others === false ? (
                        <div className="w-6 h-6 mx-auto border-2 border-slate-200 rounded-full flex items-center justify-center">
                          <Plus className="rotate-45 text-slate-400" size={16} />
                        </div>
                      ) : row.others === true ? (
                        <CheckCircle2 className="mx-auto text-slate-300" size={24} />
                      ) : (
                        <span className="font-medium">{row.others}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Latest Blog Posts */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-12 bg-slate-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">
                {t.latestBlog}
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl">
                {t.blogSubtitle}
              </p>
            </div>
            <Link
              to="/blog"
              className="hidden sm:flex items-center gap-2 text-[#ff4d2d] font-medium hover:gap-4 transition-all"
            >
              {t.viewAllArticles}
              <ArrowRight size={24} className="rtl:rotate-180" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="group cursor-pointer">
                <Link
                  to={`/blog/${post.id}`}
                  className="block overflow-hidden rounded-2xl mb-4 h-48 relative"
                >
                  <img
                    src={post.image}
                    alt={post.title[language]}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </Link>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    {new Date(post.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={16} />
                    {post.readTime[language]}
                  </span>
                </div>
                <Link to={`/blog/${post.id}`} className="block mb-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#ff4d2d] transition-colors line-clamp-2">
                    {post.title[language]}
                  </h3>
                </Link>
                <p className="text-slate-600 text-sm line-clamp-2">
                  {post.excerpt[language]}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[#ff4d2d] font-medium"
            >
              {t.viewAllArticles}
              <ArrowRight size={24} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Video Demo Modal */}
      <VideoDemoModal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)} />

      {/* Scroll to Top & Floating CTA */}
      <div className="fixed bottom-8 end-8 z-40 flex flex-col gap-4">
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={scrollToTop}
            className="w-12 h-12 bg-slate-50 text-slate-900 rounded-full shadow-2xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all active:scale-90"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}

        <Link
          to="/editor"
          className="md:hidden bg-[#ff4d2d] text-white p-4 rounded-full shadow-2xl shadow-orange-500/40 flex items-center justify-center active:scale-90 transition-all"
        >
          <Plus size={24} />
        </Link>
      </div>

      <Footer />
    </div>
  );
}
